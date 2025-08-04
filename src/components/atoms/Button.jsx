import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
primary: "bg-gradient-to-r from-primary via-primary to-secondary text-white hover:from-primary/95 hover:via-primary/95 hover:to-secondary/95 focus:ring-primary/50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-semibold",
    secondary: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-primary/50 shadow-md hover:shadow-lg transition-all duration-200",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary/50",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-error/90 hover:to-red-600/90 focus:ring-error/50 shadow-lg hover:shadow-xl transform hover:scale-105"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button