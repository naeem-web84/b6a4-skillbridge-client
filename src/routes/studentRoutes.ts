import { Route } from "@/types";

export const studentRoutes : Route[] =[
    {
      title: "Student Management", 
      items: [
       {
          title: "Student Profile",
          url: "/dashboard",
        },
          {
          title: "Find Tutors",
          url: "/find-tutor",
        },
        {
          title: "Be a Tutor",
          url: "/be-tutor"
        }, 
      ],
    } 
  ]