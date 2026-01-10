"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function AnimatedThemeToggler({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()

    return (
        <button
            className={cn("relative", className)}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
