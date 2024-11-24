"use client";
import Logo from "@/components/Logo";
import { ThemeSwitcherBtn } from "@/components/ThemeSwitcherBtn";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

const items = [
  { label: "Home", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Settings", link: "/settings" },
];

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block bg-orange-50 dark:bg-gray-900 md:hidden">
      <nav className="flex items-center justify-between px-4 py-3">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} className="text-orange-500 dark:text-orange-300" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[260px] bg-white dark:bg-gray-900 p-4">
            <Logo />
            <div className="flex flex-col gap-4 mt-6">
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  clickCallback={() => setIsOpen(false)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  return (
    <div className="hidden bg-orange-300 dark:bg-gray-800 md:block">
      <nav className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
        <Logo />

        <div className="flex items-center justify-center space-x-4">
        <div className="flex items-left gap-3">
          {items.map((item) => (
            <NavbarItem key={item.label} link={item.link} label={item.label} />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
        </div>
       
      </nav>
    </div>
  );
}

function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string;
  label: string;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link
      href={link}
      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive
          ? "bg-orange-500 text-white dark:bg-orange-600"
          : "text-orange-600 dark:text-orange-400 hover:bg-orange-100 hover:text-orange-800 dark:hover:bg-gray-700"
      }`}
      onClick={clickCallback}
    >
      {label}
    </Link>
  );
}

export default Navbar;
