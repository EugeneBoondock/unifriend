"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SimpleNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Main navigation routes - reduced and reorganized
  const mainRoutes = [
    { name: "Home", path: "/" },
    { name: "Forum", path: "/forum" },
    { name: "Events", path: "/events" },
    { name: "UniShare", path: "/unishare", isNew: true },
    { name: "UniVendors", path: "/uni-vendors", isNew: true, isEmerald: true },
    { name: "UniSports", path: "/unisports", isNew: true },
  ];

  // UniCircle dropdown items
  const uniCircleItems = [
    { name: "UniCircle Hub", path: "/unicircle", description: "Main community hub" },
    { name: "UniClubs", path: "/uniclubs", description: "University clubs and societies" },
    { name: "UniPolitics", path: "/unipolitics", description: "Student representative council" },
    { name: "UniNews", path: "/uninews", description: "Latest campus news" }
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile logo and hamburger */}
        <div className="flex items-center justify-between md:hidden w-full">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">Unifriend</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col gap-4 py-4">
                {/* Main routes in mobile menu */}
                {mainRoutes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === route.path && "text-primary font-bold"
                    )}
                  >
                    <div className="flex items-center">
                      {route.name}
                      {route.isNew && (
                        <div className={cn(
                          "ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
                          route.isEmerald ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        )}>
                          New
                        </div>
                      )}
                    </div>
                  </Link>
                ))}

                {/* UniCircle section in mobile menu */}
                <div className="border-t border-border pt-4 mt-2">
                  <h3 className="text-lg font-medium mb-2">UniCircle Network</h3>
                  <div className="flex flex-col gap-3 ml-2">
                    {uniCircleItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-base hover:text-primary",
                          pathname === item.path && "text-primary font-medium"
                        )}
                      >
                        <div className="flex items-center">
                          {item.name}
                          {item.name !== "UniCircle Hub" && (
                            <div className="ml-1 rounded-full bg-violet-100 dark:bg-violet-950 px-1.5 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                              New
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Study Resources Mobile Submenu */}
                <div className="border-t border-border pt-4 mt-2">
                  <h3 className="text-lg font-medium mb-2">Study Resources</h3>
                  <div className="flex flex-col gap-3 ml-2">
                    <Link
                      href="/applications"
                      onClick={() => setIsOpen(false)}
                      className="text-base hover:text-primary"
                    >
                      University Applications
                    </Link>
                    <Link
                      href="/nsfas"
                      onClick={() => setIsOpen(false)}
                      className="text-base hover:text-primary"
                    >
                      NSFAS Help
                    </Link>
                    <Link
                      href="/mentorship"
                      onClick={() => setIsOpen(false)}
                      className="text-base hover:text-primary"
                    >
                      Student Mentorship
                    </Link>
                    <Link
                      href="/resources"
                      onClick={() => setIsOpen(false)}
                      className="text-base hover:text-primary"
                    >
                      Study Resources
                    </Link>
                  </div>
                </div>

                {/* Auth buttons in mobile menu */}
                <div className="border-t border-border pt-4 mt-2">
                  <div className="flex flex-col gap-2">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center gap-2 py-2">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{session?.user?.name ? getInitials(session.user.name) : "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{session?.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full">
                            My Profile
                          </Button>
                        </Link>
                        <Button
                          className="w-full"
                          variant="destructive"
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/signin"
                          onClick={() => setIsOpen(false)}
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsOpen(false)}
                          className="w-full"
                        >
                          <Button className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">Unifriend</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <NavigationMenu className="mx-6 hidden md:flex">
          <NavigationMenuList>
            {/* Main routes */}
            {mainRoutes.map((route, index) => (
              <NavigationMenuItem key={route.path}>
                <Link href={route.path} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === route.path && "font-bold text-primary"
                    )}
                  >
                    {route.isNew ? (
                      <div className="flex items-center">
                        {route.name}
                        <div className={cn(
                          "ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
                          route.isEmerald ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        )}>
                          New
                        </div>
                      </div>
                    ) : (
                      route.name
                    )}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}

            {/* UniCircle dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <div className="flex items-center">
                  UniCircle
                  <div className="ml-1 rounded-full bg-violet-100 dark:bg-violet-950 px-1.5 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                    New
                  </div>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[250px] gap-3 p-4">
                  {uniCircleItems.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path} legacyBehavior passHref>
                        <NavigationMenuLink
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item.name}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Study Resources dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Study Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-violet-500 to-violet-900 p-6 no-underline outline-none focus:shadow-md"
                        href="/applications"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">
                          University Applications
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Guidance on applying to South African universities.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <Link href="/nsfas" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">NSFAS Help</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Apply, track and manage your NSFAS applications.
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/mentorship" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Student Mentorship</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Connect with senior students for advice and guidance.
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Study Resources</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Access study materials, guides and academic resources.
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop sign in/up buttons or user dropdown */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{session?.user?.name ? getInitials(session.user.name) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer focus:text-red-600"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="flex items-center space-x-2">
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
