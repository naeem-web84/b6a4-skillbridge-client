import * as React from "react"

import { SearchForm } from "@/components/layout/search-form"
import { VersionSwitcher } from "@/components/layout/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { adminRoutes } from "@/routes/adminRoutes"
import { studentRoutes } from "@/routes/studentRoutes"
import { Route } from "@/types"



export function AppSidebar({ user,...props }: {user: {role: string}} & React.ComponentProps<typeof Sidebar>) {

 // Debugging জন্য
  console.log("AppSidebar - User role received:", user?.role);
  
  // Role-কে lowercase করো stable comparison-এর জন্য
  const userRole = user?.role?.toLowerCase();
  
  let routes: Route[] = [];
  
  if (userRole === "admin") {
    routes = adminRoutes;
  } else if (userRole === "student") {
    routes = studentRoutes;
  } else if (userRole === "tutor") {
    // যদি তোমার tutorRoutes থাকে
    routes = tutorRoutes || [];
  } else {
    routes = [];
  }
  
  console.log("AppSidebar - Routes loaded:", routes.length);

  return (
    <Sidebar {...props}>
     
      <SidebarContent>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
