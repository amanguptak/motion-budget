"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcherBtn() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative p-2 rounded-full border border-orange-300 bg-orange-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Sun
            className={`h-5 w-5 transition-all text-orange-500 ${
              theme === "light" ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
          <Moon
            className={`absolute h-5 w-5 transition-all ${
              theme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
          <Monitor
            className={`absolute h-5 w-5 transition-all ${
              theme === "system" ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Sun className="h-5 w-5 text-yellow-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Moon className="h-5 w-5 text-blue-500" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Monitor className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
