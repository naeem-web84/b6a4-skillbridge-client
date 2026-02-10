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
        {
          title: "Categories",
          url: "/admin-dashboard/categories",
        },
        {
          title: "Bookings & Reviews",
          url: "/admin-dashboard/bookings-reviews",
        },
        {
          title: "Stats",
          url: "/admin-dashboard/stats",
        },
        {
          title: "Notifications",
          url: "/admin-dashboard/notification",
        },
        {
          title: "Homepage",
          url: "/",
        },
      ],
    } 
  ];