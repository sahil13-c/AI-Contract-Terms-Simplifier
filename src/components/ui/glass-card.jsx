import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const glassCardVariants = cva(
    "rounded-xl border backdrop-blur-md transition-all duration-300",
    {
        variants: {
            variant: {
                default: "bg-white/70 dark:bg-slate-900/70 border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-glow",
                solid: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg",
                ghost: "bg-white/40 dark:bg-slate-900/40 border-white/10 dark:border-slate-700/30 shadow-md",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const GlassCard = React.forwardRef(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(glassCardVariants({ variant }), className)}
        {...props}
    />
))
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
GlassCardFooter.displayName = "GlassCardFooter"

export { GlassCard, GlassCardHeader, GlassCardFooter, GlassCardTitle, GlassCardDescription, GlassCardContent }
