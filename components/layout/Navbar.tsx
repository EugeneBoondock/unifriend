"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Simplified routes to make navbar more compact
  const routes = [
    { name: "Home", path: "/" },
    { name: "Forum", path: "/forum" },
    { name: "Resources", path: "/resources", dropdown: true },
    { name: "Community", path: "/community", dropdown: true },
  ];

  // Items for Resources dropdown
  const resourcesItems = [
    { name: "NSFAS Help", path: "/nsfas", description: "Apply, track and manage your NSFAS applications and funding." },
    { name: "Applications", path: "/applications", description: "Guidance on applying to South African universities." },
    { name: "Study Materials", path: "/resources", description: "Access study materials and academic resources." },
    { name: "Mentorship", path: "/mentorship", description: "Connect with senior students for advice and guidance." },
  ];

  // Items for Community dropdown
  const communityItems = [
    { name: "UniCircle", path: "/unicircle", isNew: true, description: "Connect with students with similar interests." },
    { name: "Events", path: "/events", description: "Find and join campus events across South Africa." },
    { name: "UniShare", path: "/unishare", isNew: true, description: "Share resources with fellow students." },
    { name: "UniVendors", path: "/uni-vendors", isNew: true, isEmerald: true, description: "Student-owned businesses and services." },
  ];

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-purple-900/40">
      <div className="container flex h-16 items-center">
        {/* Mobile logo and hamburger */}
        <div className="flex items-center justify-between md:hidden w-full">
          <Link href="/" className="flex items-center space-x-2">
            {/* CSS-based logo */}
            <div className="w-10 h-10 bg-[#513c64] rounded-full flex items-center justify-center text-white font-bold text-xl">
              UF
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">Unifriend</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

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
                  {routes.map((route) => (
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
                      </div>
                    </Link>
                  ))}

                  {/* Resources Submenu in Mobile */}
                  <div className="border-t dark:border-purple-900/40 pt-4 mt-2">
                    <h3 className="text-lg font-medium mb-2">Resources</h3>
                    <div className="flex flex-col gap-3 ml-2">
                      {resourcesItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className="text-base hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Community Submenu in Mobile */}
                  <div className="border-t dark:border-purple-900/40 pt-4 mt-2">
                    <h3 className="text-lg font-medium mb-2">Community</h3>
                    <div className="flex flex-col gap-3 ml-2">
                      {communityItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className="text-base hover:text-primary"
                        >
                          <div className="flex items-center">
                            {item.name}
                            {item.isNew && (
                              <div className={cn(
                                "ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
                                item.isEmerald ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                              )}>
                                New
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-t dark:border-purple-900/40 pt-4 mt-2">
                    <div className="flex flex-col gap-2">
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
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            {/* CSS-based logo */}
            <div className="w-10 h-10 bg-[#513c64] rounded-full flex items-center justify-center text-white font-bold text-xl">
              UF
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">Unifriend</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <NavigationMenu className="mx-6 hidden md:flex">
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.path}>
                {route.dropdown ? (
                  <>
                    <NavigationMenuTrigger>{route.name}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {route.name === "Resources" ? (
                          resourcesItems.map((item, index) => (
                            <li key={item.path} className={index === 0 ? "row-span-3" : ""}>
                              {index === 0 ? (
                                <NavigationMenuLink asChild>
                                  <Link
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-purple to-[#3a2a49] p-6 no-underline outline-none focus:shadow-md"
                                    href={item.path}
                                  >
                                    <div className="mt-4 mb-2 text-lg font-medium text-white">
                                      {item.name}
                                    </div>
                                    <p className="text-sm leading-tight text-white/90">
                                      {item.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              ) : (
                                <Link href={item.path} legacyBehavior passHref>
                                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                    <div className="text-sm font-medium leading-none">{item.name}</div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {item.description}
                                    </p>
                                  </NavigationMenuLink>
                                </Link>
                              )}
                            </li>
                          ))
                        ) : (
                          communityItems.map((item, index) => (
                            <li key={item.path}>
                              <Link href={item.path} legacyBehavior passHref>
                                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                  <div className="flex items-center text-sm font-medium leading-none">
                                    {item.name}
                                    {item.isNew && (
                                      <div className={cn(
                                        "ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
                                        item.isEmerald ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                      )}>
                                        New
                                      </div>
                                    )}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </NavigationMenuLink>
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={route.path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === route.path && "font-bold text-primary"
                      )}
                    >
                      {route.name}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop sign in/up buttons and theme toggle */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
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
        </div>
      </div>
    </div>
  );
}
