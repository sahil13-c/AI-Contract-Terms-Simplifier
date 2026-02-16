import * as React from "react"
import { cn } from "@/lib/utils"

const GradientText = React.forwardRef(({ className, children, variant = "default", animated = true, ...props }, ref) => {
    const gradientVariants = {
        default: "from-blue-600 via-indigo-600 to-purple-600",
        primary: "from-blue-500 to-cyan-500",
        secondary: "from-purple-500 to-pink-500",
        success: "from-green-500 to-emerald-500",
        warning: "from-orange-500 to-red-500",
        neon: "from-cyan-400 via-blue-500 to-purple-600",
    }

    return (
        <span
            ref={ref}
            className={cn(
                "bg-gradient-to-r bg-clip-text text-transparent font-bold",
                gradientVariants[variant],
                animated && "animate-gradient bg-[length:200%_auto]",
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
})
GradientText.displayName = "GradientText"

export { GradientText }
