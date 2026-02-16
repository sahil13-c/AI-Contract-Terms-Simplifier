import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const glowButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-glow hover:scale-105 active:scale-95",
                destructive:
                    "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-glow-red hover:scale-105 active:scale-95",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:scale-105 active:scale-95",
                secondary:
                    "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-glow-purple hover:scale-105 active:scale-95",
                ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
                link: "text-primary underline-offset-4 hover:underline",
                glow: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan hover:shadow-glow-cyan-intense hover:scale-105 active:scale-95",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-lg px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const GlowButton = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(glowButtonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
})
GlowButton.displayName = "GlowButton"

export { GlowButton, glowButtonVariants }
