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
          title: "Manage Availability",
          url: "/tutor-dashboard/availability-management"
        },
         {
          title: "Add Category",
          url: "/tutor-dashboard/add-category"
        },
         {
          title: "Bookings",
          url: "/tutor-dashboard/bookings"
        },
        {
          title: "Home",
          url: "/"
        } 
      ],
    } 
  ];