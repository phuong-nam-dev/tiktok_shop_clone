"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";

const Header = () => {
  const { user } = useAuthContext();

  const pathname = usePathname();

  console.log("Current User in Header:", user);

  const isPageSignedIn = pathname.startsWith("/sign-in");

  const isPageSignedUp = pathname.startsWith("/sign-up");

  return (
    <div className="w-full h-14 shadow-md">
      <div className="max-w-7xl h-full mx-auto flex items-center justify-between px-10">
        <Link href={"/"}>
          <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance hover:text-blue-600 cursor-pointer">
            Nam E-Commerce
          </h1>
        </Link>
        {!isPageSignedIn && !isPageSignedUp && (
          <div className="flex items-center gap-2">
            <Button className="cursor-pointer" variant={"ghost"} asChild>
              <Link href={"/sign-in"}>Sign In</Link>
            </Button>
            <Button className="cursor-pointer">
              <Link href={"/sign-up"}>Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
