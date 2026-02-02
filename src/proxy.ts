import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service"; 
import { Roles } from "./constants/role"; 
//33.11
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Get session from user service
    const { data: session, error } = await userService.getSession();
    
    // If no session or error, redirect to login
    if (!session || error || !session.user) {
        // Allow public routes without authentication
        const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/auth"];
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
        
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    const userRole = session.user?.role;
    const userId = session.user?.id;

    // Role-based access control (using your Roles constants)
    const isAdmin = userRole === Roles.admin;        // "ADMIN"
    const isTutor = userRole === Roles.tutor;        // "TUTOR"
    const isStudent = userRole === Roles.student;    // "STUDENT"

    // Define protected routes for each role
    const adminRoutes = ["/admin-dashboard", "/admin"];
    const tutorRoutes = ["/tutor-dashboard", "/tutor", "/my-sessions", "/availability"];
    const studentRoutes = ["/dashboard", "/student", "/find-tutors", "/my-bookings"];
    
    // Common routes accessible by all authenticated users
    const commonRoutes = ["/profile", "/settings", "/messages", "/notifications"];

    // Check if path matches any route pattern
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isTutorRoute = tutorRoutes.some(route => pathname.startsWith(route));
    const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route));
    const isCommonRoute = commonRoutes.some(route => pathname.startsWith(route));

    // Debug logs (remove in production)
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

    // ========== REDIRECTION LOGIC ==========

    // 1. Admin routes protection
    if (isAdminRoute && !isAdmin) {
        if (isTutor) {
            return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
        } else if (isStudent) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Default redirect for unknown roles
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Tutor routes protection
    if (isTutorRoute && !isTutor) {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (isStudent) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Student routes protection
    if (isStudentRoute && !isStudent) {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (isTutor) {
            return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 4. Common routes - accessible by all authenticated users
    if (isCommonRoute) {
        return NextResponse.next();
    }

    // 5. Root/home redirect based on role
    if (pathname === "/" || pathname === "/home") {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (isTutor) {
            return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
        } else if (isStudent) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // 6. If user tries to access undefined route, redirect to role-specific dashboard
    // This prevents 404s for authenticated users
    if (!isAdminRoute && !isTutorRoute && !isStudentRoute && !isCommonRoute) {
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (isTutor) {
            return NextResponse.redirect(new URL("/tutor-dashboard", request.url));
        } else if (isStudent) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // 7. Allow access if all checks pass
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Admin routes
        "/admin-dashboard/:path*",
        "/admin/:path*",
        
        // Tutor routes  
        "/tutor-dashboard/:path*",
        "/tutor/:path*",
        "/my-sessions/:path*",
        "/availability/:path*",
        "/earnings/:path*",
        
        // Student routes
        "/dashboard/:path*",
        "/student/:path*",
        "/find-tutors/:path*",
        "/my-bookings/:path*",
        "/bookings/:path*",
        
        // Common routes
        "/profile/:path*",
        "/settings/:path*",
        "/messages/:path*",
        "/notifications/:path*",
        
        // Root and home
        "/",
        "/home",
    ]
};