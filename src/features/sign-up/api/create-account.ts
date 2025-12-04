import { formSchema, FormSchemaType } from "@/app/(auth)/sign-up/page";

export const createAccount = async (data: FormSchemaType) => {
  if (formSchema.safeParse(data).success === false) {
    throw new Error("Invalid form data");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/register`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "Create account failed");
  }

  return response.json();
};
