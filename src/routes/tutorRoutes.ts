import { Route } from "@/types";

export const tutorRoutes : Route[] = [
    {
      title: "Tutor Management", 
      items: [
        {
          title: "Tutor",
          url: "/tutor-dashboard",
        },
        {
          title: "Update Profile",
          url: "/tutor-dashboard/update-profile",
        },
        {
          title: "Home",
          url: "/"
        } 
      ],
    } 
  ];