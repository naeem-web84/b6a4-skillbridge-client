import { NextRequest, NextResponse } from "next/server"; 
import { userService } from "@/services/user.service";
import { Roles } from "@/constants/role"; 
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
 
    const { data: session, error } = await userService.getSession();
     
    if (!session || error || !session.user) { 
        const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/auth"];
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
        
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    const userRole = session.user?.role;
    const userId = session.user?.id;
 
    const isAdmin = userRole === Roles.admin;       
    const isTutor = userRole === Roles.tutor;        
    const isStudent = userRole === Roles.student;    
 
    const adminRoutes = ["/admin-dashboard", "/admin"];
    const tutorRoutes = ["/tutor-dashboard", "/tutor", "/my-sessions", "/availability"];
    const studentRoutes = ["/dashboard", "/student", "/find-tutors", "/my-bookings"];
     
    const commonRoutes = ["/profile", "/settings", "/messages", "/notifications"];
 
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isTutorRoute = tutorRoutes.some(route => pathname.startsWith(route));
    const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route));
    const isCommonRoute = commonRoutes.some(route => pathname.startsWith(route));
 
    console.log({
        userRole,
        isAdmin,
        isTutor,
        isStudent,
        pathname,
        isAdminRoute,
        isTutorRoute,
        isStudentRoute
    });

    
    if (isAdminRoute && !isAdmin) {
        if (isTutor) {
            return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
        } else if (isStudent) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        
        return NextResponse.redirect(new URL("/login", request.url));
    }
 
    if (isTutorRoute && !isTutor) {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (isStudent) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }
 
    if (isStudentRoute && !isStudent) {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (isTutor) {
            return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }
 
    if (isCommonRoute) {
        return NextResponse.next();
    }
 
    if (pathname === "/" || pathname === "/home") {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (isTutor) {
            return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
        } else if (isStudent) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    
    if (!isAdminRoute && !isTutorRoute && !isStudentRoute && !isCommonRoute) {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (isTutor) {
            return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
        } else if (isStudent) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

     
    return NextResponse.next();
}

export const config = {
    matcher: [ 
        "/admin-dashboard/:path*",
        "/admin/:path*",
          
        "/tutor-dashboard/:path*",
        "/tutor/:path*",
        "/my-sessions/:path*",
        "/availability/:path*",
        "/earnings/:path*",
         
        "/dashboard/:path*",
        "/student/:path*",
        "/find-tutors/:path*",
        "/my-bookings/:path*",
        "/bookings/:path*",
         
        "/profile/:path*",
        "/settings/:path*",
        "/messages/:path*",
        "/notifications/:path*",
    ]
};