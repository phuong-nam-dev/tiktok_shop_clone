import Link from "next/link";
import { Button } from "./ui/button";

const Header = async () => {
  "use cache";
  return (
    <div className="w-full h-14 shadow-md">
      <div className="max-w-7xl h-full mx-auto flex items-center justify-between px-10">
        <Link href={"/"}>
          <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance hover:text-blue-600 cursor-pointer">
            Nam E-Commerce
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button className="cursor-pointer" variant={"ghost"}>
            Sign In
          </Button>
          <Button className="cursor-pointer">Sign Up</Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
