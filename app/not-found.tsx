import Link from "next/link";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-violet-600">404</h1>
      <div className="h-10 w-px bg-zinc-300 my-6"></div>
      <h2 className="text-2xl font-medium mb-4">This page could not be found.</h2>
      <p className="text-zinc-600 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Button asChild>
        <Link href="/">
          Return to Homepage
        </Link>
      </Button>
    </div>
  );
}
