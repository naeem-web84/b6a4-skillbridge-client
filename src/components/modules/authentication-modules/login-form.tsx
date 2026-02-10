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
  password: z.string().min(8, "Minimum length is 8"),
  email: z.email(),
});

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000",
      });

      if (error) {
        toast.error(`Google login failed: ${error.message}`);
        return;
      }

      if (data) {
        toast.success("Google login successful! Redirecting...");
        
        setTimeout(async () => {
          await checkSessionAndRedirect();
        }, 1000);
      }
    } catch (err: any) {
      toast.error("Google login failed. Please try again.");
    }
  };

  const checkSessionAndRedirect = async () => {
    try {
      const { data: session, error } = await authClient.getSession();
      
      if (error || !session?.user) {
        toast.error("Login failed. Please try again.");
        return;
      }

      redirectBasedOnRole(session.user);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const toastId = toast.loading("Logging in...");
      
      try {
        const { data, error } = await authClient.signIn.email(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          setIsLoading(false);
          return;
        }

        toast.success("Login successful! Redirecting...", { id: toastId });
        
        setTimeout(async () => {
          await checkSessionAndRedirect();
        }, 1000);
        
      } catch (err) {
        toast.error("Something went wrong, please try again.", { id: toastId });
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
      } catch (error) { 
      }
    };
    
    checkExistingSession();
  }, []);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email and password to login
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
      <CardFooter className="flex flex-col gap-5 justify-end">
        <Button 
          form="login-form" 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
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