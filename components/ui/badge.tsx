import * as React from "react"
import { cn } from "@/lib/utils/cn"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
      {
        'bg-blue-100 text-blue-700': variant === 'default',
        'bg-gray-100 text-gray-700': variant === 'secondary',
        'bg-red-100 text-red-700': variant === 'destructive',
        'border border-gray-300 text-gray-700': variant === 'outline',
      },
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge }
