"use client";

import { Menu, LogOut, User, BookOpen, Contact, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu, 
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList, 
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/logo.svg",
    alt: "logo",
    title: "SkillBridge",
  },
  menu = [
    { title: "Home", url: "/" }, 
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
  ], // REMOVED "Browse Tutors" from default menu
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: NavbarProps) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const toastId = toast.loading("Logging out...");
      
      const { error } = await authClient.signOut();
      
      if (error) {
        toast.error(`Logout failed: ${error.message}`, { id: toastId });
        setIsLoggingOut(false);
        return;
      }
      
      toast.success("Logged out successfully", { id: toastId });
      
      setUser(null);
      
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 500);
      
    } catch (error) {
      toast.error("Something went wrong while logging out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserMenu = () => {
    if (!user) return menu;
    
    const roleSpecificMenu = [];
    
    // Dashboard based on role
    if (user.role === "ADMIN") {
      roleSpecificMenu.push({ 
        title: "Dashboard", 
        url: "/admin-dashboard", 
        icon: <User className="h-4 w-4" /> 
      });
    } else if (user.role === "TUTOR") {
      roleSpecificMenu.push({ 
        title: "Dashboard", 
        url: "/tutor/dashboard", 
        icon: <User className="h-4 w-4" /> 
      });
    } else if (user.role === "STUDENT") {
      roleSpecificMenu.push({ 
        title: "Dashboard", 
        url: "/dashboard", 
        icon: <User className="h-4 w-4" /> 
      });
    }
    
    // Common links for ALL authenticated users - NO "Browse Tutors"
    roleSpecificMenu.push(
      { title: "About", url: "/about", icon: <BookOpen className="h-4 w-4" /> },
      { title: "Contact", url: "/contact", icon: <Contact className="h-4 w-4" /> }
    );
    
    return roleSpecificMenu;
  };

  const userMenu = getUserMenu();
  const isAuthenticated = !!user;

  const renderMenuItem = (item: MenuItem) => {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuLink asChild>
          <Link
            href={item.url}
            className={cn(
              "group inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground focus:outline-none",
              "data-[active]:bg-accent/50 data-[active]:font-medium"
            )}
          >
            {item.title}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
      return (
        <AccordionItem key={item.title} value={item.title} className="border-b-0">
          <AccordionTrigger className="py-3 text-base font-semibold hover:no-underline">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="mt-2 pl-4">
            <div className="flex flex-col gap-2">
              {item.items.map((subItem) => (
                <Link
                  key={subItem.title}
                  href={subItem.url}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {subItem.title}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.url}
        className="flex items-center gap-2 py-3 text-base font-semibold hover:text-primary transition-colors"
      >
        {item.icon && <span className="opacity-70">{item.icon}</span>}
        {item.title}
      </Link>
    );
  };

  const UserProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium">
              {user?.name?.[0] || user?.email?.[0] || <User className="h-3 w-3" />}
            </span>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-xs font-medium leading-none">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user?.role?.toLowerCase() || "user"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userMenu.map((item) => (
          <DropdownMenuItem key={item.title} asChild>
            <Link href={item.url} className="cursor-pointer flex items-center gap-2">
              {item.icon || <div className="h-4 w-4" />}
              {item.title}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Don't render anything until component is mounted on client
  if (!isMounted) {
    return (
      <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="h-6 w-32 bg-muted rounded"></div>
            </div>
            <div className="h-9 w-20 bg-muted rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Menu */}
        <div className="hidden h-16 items-center justify-between lg:flex">
          {/* Logo and Navigation */}
          <div className="flex flex-1 items-center justify-start gap-8">
            {/* Logo with S icon */}
            <Link 
              href={logo.url} 
              className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity group"
            >
              <div className="relative">
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="relative">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                    <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-lg">
                      S
                    </span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-ping opacity-75"></div>
              </div>
              <span className="text-lg font-semibold tracking-tighter whitespace-nowrap">
                {logo.title}
              </span>
            </Link>

            {/* Navigation Menu */}
            <div className="flex flex-1 justify-center">
              <NavigationMenu className="max-w-2xl">
                <NavigationMenuList className="gap-1">
                  {/* Show different menus based on authentication and role */}
                  {isAuthenticated ? (
                    // For authenticated users, show role-specific menu
                    userMenu.map((item) => renderMenuItem(item))
                  ) : (
                    // For non-authenticated users, show default menu (NO Browse Tutors)
                    menu.map((item) => renderMenuItem(item))
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="flex items-center gap-3">
              <ModeToggle />
              
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-9 w-20 rounded-md bg-muted animate-pulse"></div>
                  <div className="h-9 w-20 rounded-md bg-muted animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  <UserProfileDropdown />
                </>
              ) : (
                <>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Link href={auth.login.url}>{auth.login.title}</Link>
                  </Button>
                  <Button 
                    asChild 
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Link href={auth.signup.url}>{auth.signup.title}</Link>
                  </Button>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left">
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                          <div className="relative">
                            <Sparkles className="h-5 w-5 text-primary-foreground" />
                            <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-lg">
                              S
                            </span>
                          </div>
                        </div>
                        <span className="text-lg font-semibold">{logo.title}</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      {isAuthenticated 
                        ? userMenu.map((item) => renderMobileMenuItem(item))
                        : menu.map((item) => renderMobileMenuItem(item))}
                    </div>
                    <div className="flex flex-col gap-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Theme</span>
                        <ModeToggle />
                      </div>
                      
                      {isAuthenticated ? (
                        <>
                          <div className="flex items-center gap-3 py-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {user?.name?.[0] || user?.email?.[0] || "U"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{user?.name || "User"}</span>
                              <span className="text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                          </div>
                          <Button 
                            onClick={handleLogout}
                            variant="destructive"
                            className="w-full"
                            disabled={isLoggingOut}
                          >
                            {isLoggingOut ? "Logging out..." : "Logout"}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button asChild variant="outline" className="w-full">
                            <Link href={auth.login.url}>{auth.login.title}</Link>
                          </Button>
                          <Button asChild className="w-full">
                            <Link href={auth.signup.url}>{auth.signup.title}</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Mobile Menu (for tablets and below) */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          {/* Logo */}
          <Link 
            href={logo.url} 
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
                <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-lg">
                  S
                </span>
              </div>
            </div>
            <span className="text-lg font-semibold tracking-tighter hidden sm:inline">
              {logo.title}
            </span>
          </Link>

          {/* Right Side Actions for Mobile */}
          <div className="flex items-center gap-2">
            {!isLoading && isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {user?.name?.[0] || user?.email?.[0] || "U"}
                  </span>
                </div>
              </div>
            )}
            
            <div className="hidden sm:flex items-center gap-2">
              <ModeToggle />
              {!isLoading && !isAuthenticated && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm"
                >
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left">
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                        <div className="relative">
                          <Sparkles className="h-5 w-5 text-primary-foreground" />
                          <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-lg">
                            S
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-semibold">{logo.title}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    {isAuthenticated 
                      ? userMenu.map((item) => renderMobileMenuItem(item))
                      : menu.map((item) => renderMobileMenuItem(item))}
                  </div>
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Theme</span>
                      <ModeToggle />
                    </div>
                    
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center gap-3 py-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {user?.name?.[0] || user?.email?.[0] || "U"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{user?.name || "User"}</span>
                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                          </div>
                        </div>
                        <Button 
                          onClick={handleLogout}
                          variant="destructive"
                          className="w-full"
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar, type NavbarProps };