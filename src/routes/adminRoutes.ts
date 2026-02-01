import { Route } from "@/types";

export const adminRoutes : Route[] = [
    {
      title: "User Management", 
      items: [
        {
          title: "Update User",
          url: "/update-user",
        },
        {
          title: "make-tutor",
          url: "/make-tutor",
        },
      ],
    } 
  ];