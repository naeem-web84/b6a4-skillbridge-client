"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  password: z.string().min(8, "Minimum length is 8"),
  email: z.email(),
});

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      console.log("Starting Google login...");
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000",
      });

      console.log("Google login response:", { data, error });

      if (error) {
        toast.error(`Google login failed: ${error.message}`);
        return;
      }

      if (data) {
        toast.success("Google login successful!");
        
        // Wait a moment then check session and redirect
        setTimeout(async () => {
          await checkSessionAndRedirect();
        }, 1000);
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      toast.error("Google login failed. Please try again.");
    }
  };

  // Helper function to check session and redirect
  const checkSessionAndRedirect = async () => {
    try {
      console.log("Checking session for redirect...");
      const { data: session, error } = await authClient.getSession();
      
      console.log("Session check result:", { session, error });
      
      if (error || !session?.user) {
        console.log("No valid session, staying on page");
        return;
      }

      console.log("User logged in:", session.user);
      console.log("User role:", (session.user as any).role);
      
      // Redirect based on role or default
      redirectBasedOnRole(session.user);
      
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  // Function to redirect based on user role
  const redirectBasedOnRole = (user: any) => {
    const userRole = user.role?.toUpperCase() || "STUDENT";
    
    console.log("Redirecting user with role:", userRole);
    
    switch (userRole) {
      case "ADMIN":
        router.push("/admin-dashboard");
        break;
      case "TUTOR":
        router.push("/tutor-dashboard");
        break;
      case "STUDENT":
      default:
        router.push("/dashboard");
        break;
    }
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const toastId = toast.loading("Creating your account...");
      
      console.log("=== REGISTRATION START ===");
      console.log("Form values:", value);
      
      try {
        console.log("Calling authClient.signUp.email...");
        
        // Call the registration
        const { data, error } = await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
        });

        console.log("this is data",data);

        console.log("=== REGISTRATION RESPONSE ===");
        console.log("Full response:", JSON.stringify(data, null, 2));
        console.log("Error:", error);
        
        if (error) {
          console.log("Registration error:", error);
          toast.error(`Registration failed: ${error.message}`, { id: toastId });
          setIsLoading(false);
          return;
        }

        console.log("Registration successful!");
        
        if (data?.user) {
          console.log("User created:", data.user);
          console.log("Email verified:", data.user.emailVerified);
          
          // Check if email is verified
          if (!data.user.emailVerified) {
            toast.success("Account created! Please check your email to verify your account.", { 
              id: toastId,
              duration: 5000,
            });
            
            // Show email verification message
            toast.info("You need to verify your email before accessing the dashboard.", {
              duration: 10000,
            });
            
            // Optional: Redirect to verification info page
            // router.push("/verify-email-info");
            
          } else {
            // Email already verified (should not happen with requireEmailVerification: true)
            toast.success("Account created successfully! Redirecting to dashboard...", { 
              id: toastId 
            });
            
            // Wait a bit then check session
            setTimeout(async () => {
              await checkSessionAndRedirect();
            }, 1500);
          }
          
        } else if (data?.session) {
          // If session is returned directly (autoSignIn worked)
          console.log("Session returned directly:", data.session);
          toast.success("Account created and logged in! Redirecting...", { id: toastId });
          
          // Redirect immediately
          setTimeout(() => {
            redirectBasedOnRole(data.session.user);
          }, 1000);
          
        } else {
          // Generic success
          toast.success("Account created successfully!", { id: toastId });
          
          // Check session after delay
          setTimeout(async () => {
            await checkSessionAndRedirect();
          }, 2000);
        }

      } catch (err: any) {
        console.error("=== REGISTRATION EXCEPTION ===");
        console.error("Error:", err);
        
        toast.error("Something went wrong. Please try again.", { id: toastId });
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Optional: Add a session check on component mount
  useEffect(() => {
    // Check if user is already logged in
    const checkExistingSession = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          console.log("User already logged in, redirecting...");
          redirectBasedOnRole(session.user);
        }
      } catch (error) {
        // Ignore errors
      }
    };
    
    checkExistingSession();
  }, []);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 justify-end">
        <Button 
          form="login-form" 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Register"}
        </Button>
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          type="button"
          className="w-full"
          disabled={isLoading}
        >
          Continue with Google
        </Button>
        
        {/* Debug button - remove in production */}
        <Button
          onClick={checkSessionAndRedirect}
          variant="ghost"
          type="button"
          className="w-full text-xs"
          size="sm"
        >
          Debug: Check Session
        </Button>
      </CardFooter>
    </Card>
  );
}