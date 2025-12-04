"use client";

import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createAccount } from "@/features/sign-up/api/create-account";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useRouter } from "next/navigation";
import { navigationPath } from "@/constants/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/auth-context";

export const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(6, "Username must be at most 6 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and privacy policy",
  }),
});

export type FormSchemaType = z.infer<typeof formSchema>;

export function SignUpPage() {
  const router = useRouter();

  const { setUser } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);

  const [startTransition, setStartTransition] = useTransition();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      agree: false,
    },
  });

  function onSubmit(data: FormSchemaType) {
    setStartTransition(async () => {
      try {
        const res: {
          message: string;
          user: {
            id: string;
            username: string;
            email: string;
          };
        } = await createAccount(data);

        if (res?.user?.id) {
          setUser(res.user);

          toast.success("Account created successfully!");

          router.push(navigationPath.HOME);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    });
  }

  return (
    <Container className="flex items-center justify-center w-full h-[calc(100vh-56px)]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full min-w-[384px]">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your details to create a new account
              </CardDescription>
              <CardAction>
                <Button variant="link" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your username..."
                          disabled={startTransition}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email..."
                          disabled={startTransition}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password..."
                            disabled={startTransition}
                          />
                          <button
                            type="button"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-2">
                      <div className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(!!v)}
                            id="agree"
                            disabled={startTransition}
                          />
                        </FormControl>
                        <div className="text-sm">
                          <label htmlFor="agree" className="select-none">
                            Tôi đồng ý với{" "}
                            <Link href="#" className="underline">
                              Terms
                            </Link>{" "}
                            và{" "}
                            <Link href="#" className="underline">
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={startTransition}
              >
                <LoadingSwap isLoading={startTransition}>Sign Up</LoadingSwap>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={startTransition}
              >
                <LoadingSwap isLoading={startTransition}>
                  Sign up with Google
                </LoadingSwap>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </Container>
  );
}

export default SignUpPage;
