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
import { getBaseUrl } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  password: z.string().min(8, "Minimum length is 8"),
  email: z.string().email("Invalid email address"),
});

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: getBaseUrl(),
      });

      if (error) {
        toast.error(`Google login failed: ${error.message}`);
        return;
      }

      if (data) {
        toast.success("Google login successful!");
        setTimeout(async () => {
          await checkSessionAndRedirect();
        }, 1000);
      }
    } catch {
      toast.error("Google login failed. Please try again.");
    }
  };

  const checkSessionAndRedirect = async () => {
    try {
      const { data: session, error } = await authClient.getSession();
      
      if (error || !session?.user) {
        return;
      }

      redirectBasedOnRole(session.user);
    } catch {
      // Ignore errors
    }
  };

  const redirectBasedOnRole = (user: any) => {
    const userRole = user.role?.toUpperCase() || "STUDENT";
    
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
      
      try {
        const { data, error } = await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
        });
        
        if (error) {
          toast.error(`Registration failed: ${error.message}`, { id: toastId });
          setIsLoading(false);
          return;
        }

        if (data?.user) {
          if (!data.user.emailVerified) {
            toast.success("Account created! Please check your email to verify your account.", { 
              id: toastId,
              duration: 5000,
            });
            toast.info("You need to verify your email before accessing the dashboard.", {
              duration: 10000,
            });
          } else {
            toast.success("Account created successfully! Redirecting to dashboard...", { 
              id: toastId 
            });
            setTimeout(async () => {
              await checkSessionAndRedirect();
            }, 1500);
          }
        } else if (data?.token) {
          toast.success("Account created and logged in! Redirecting...", { id: toastId });
          setTimeout(() => {
            if (data.user) {
              redirectBasedOnRole(data.user);
            }
          }, 1000);
        } else {
          toast.success("Account created successfully!", { id: toastId });
          setTimeout(async () => {
            await checkSessionAndRedirect();
          }, 2000);
        }
      } catch {
        toast.error("Something went wrong. Please try again.", { id: toastId });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          redirectBasedOnRole(session.user);
        }
      } catch {
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
      </CardFooter>
    </Card>
  );
}