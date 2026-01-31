"use client";

import { Menu } from "lucide-react";

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
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

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
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "About",
      url: "/about",
    },
    {
      title: "Contact",
      url: "/contact",
    },
    {
      title: "Dashboard",
      url: "/dashboard",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: NavbarProps) => {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Menu */}
        <div className="hidden h-16 items-center justify-between lg:flex">
          {/* Logo and Navigation */}
          <div className="flex flex-1 items-center justify-start gap-8">
            {/* Logo */}
            <Link 
              href={logo.url} 
              className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <img
                src={logo.src}
                className="h-8 w-auto dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter whitespace-nowrap">
                {logo.title}
              </span>
            </Link>

            {/* Navigation Menu */}
            <div className="flex flex-1 justify-center">
              <NavigationMenu className="max-w-2xl">
                <NavigationMenuList className="gap-1">
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="flex items-center gap-3">
              <ModeToggle />
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
              
              {/* Mobile menu button for lg:hidden */}
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
                        <img
                          src={logo.src}
                          className="h-8 w-auto dark:invert"
                          alt={logo.alt}
                        />
                        <span className="text-lg font-semibold">{logo.title}</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </div>
                    <div className="flex flex-col gap-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Theme</span>
                        <ModeToggle />
                      </div>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={auth.login.url}>{auth.login.title}</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href={auth.signup.url}>{auth.signup.title}</Link>
                      </Button>
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
            <img
              src={logo.src}
              className="h-8 w-auto dark:invert"
              alt={logo.alt}
            />
            <span className="text-lg font-semibold tracking-tighter hidden sm:inline">
              {logo.title}
            </span>
          </Link>

          {/* Right Side Actions for Mobile */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <ModeToggle />
              <Button 
                asChild 
                variant="outline" 
                size="sm"
              >
                <Link href={auth.login.url}>{auth.login.title}</Link>
              </Button>
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
                      <img
                        src={logo.src}
                        className="h-8 w-auto dark:invert"
                        alt={logo.alt}
                      />
                      <span className="text-lg font-semibold">{logo.title}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </div>
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Theme</span>
                      <ModeToggle />
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={auth.login.url}>{auth.login.title}</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href={auth.signup.url}>{auth.signup.title}</Link>
                    </Button>
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
      className="py-3 text-base font-semibold hover:text-primary transition-colors"
    >
      {item.title}
    </Link>
  );
};

export { Navbar, type NavbarProps };