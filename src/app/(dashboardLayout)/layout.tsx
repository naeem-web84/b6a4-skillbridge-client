// app/dashboard/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export default function DashboardLayout({ 
  admin,
  student,
  tutor  
}: {
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor?: React.ReactNode;  
}) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        
        // Session থেকে user data নাও
        const { data: session, error } = await authClient.getSession();
        
        if (error || !session?.user) {
          // যদি user না থাকে, login page-এ redirect করো
          console.log("No session found, redirecting to login");
          router.push("/login");
          return;
        }
        
        // User data set করো
        const userData: UserInfo = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.name || "",
          role: session.user.role || "student", 
        };
        
        console.log("DashboardLayout - User loaded:", userData);
        setUserInfo(userData);
        
      } catch (error) {
        console.error("Error loading user:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
  }, [router]);

  // যদি data লোড হচ্ছে
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // যদি user না থাকে
  if (!userInfo) {
    return null; // বা loading screen
  }

  // Role-based content render করো
  const renderContent = () => {
    const role = userInfo.role.toLowerCase();
    
    switch (role) {
      case "admin":
        return admin;
      case "tutor":
        return tutor || <div>Tutor dashboard content here</div>;
      case "student":
      default:
        return student;
    }
  };

  // Role-based sidebar title
  const getBreadcrumbTitle = () => {
    const role = userInfo.role.toLowerCase();
    
    switch (role) {
      case "admin":
        return "Admin Dashboard";
      case "tutor":
        return "Tutor Dashboard";
      case "student":
      default:
        return "Student Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  {getBreadcrumbTitle()}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Welcome, {userInfo.name || "User"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}