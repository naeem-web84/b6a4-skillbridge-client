import { Route } from "@/types";

export const adminRoutes : Route[] = [
    {
      title: "User Management", 
      items: [
        {
          title: "Admin Dashboard",
          url: "/admin-dashboard",
        },
        {
          title: "Update User",
          url: "/admin-dashboard/update-user",
        },
        {
          title: "Update Tutor",
          url: "/admin-dashboard/update-tutor",
        },
      ],
    } 
  ];