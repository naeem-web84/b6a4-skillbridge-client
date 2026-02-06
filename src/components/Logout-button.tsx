// components/logout-button.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react"; // optional icon

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Logging out...");
    
    try {
      // Call better-auth signOut
      const { error } = await authClient.signOut();
      
      if (error) {
        toast.error(`Logout failed: ${error.message}`, { id: toastId });
        return;
      }
      
      toast.success("Logged out successfully", { id: toastId });
      
      // Force client-side cache clear and redirect
      router.push("/login");
      router.refresh(); // Refresh server components
      
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      disabled={isLoading}
      className="w-full justify-start"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
};