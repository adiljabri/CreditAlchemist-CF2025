
import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  ...props
}) => {
  const baseClasses = "relative rounded-full font-medium inline-flex items-center justify-center transition-all duration-300 ease-apple shadow-soft outline-none focus:ring-2 focus:ring-primary/20";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:shadow-medium hover:translate-y-[-2px] active:translate-y-0 active:shadow-soft",
    secondary: "bg-white border border-border text-foreground hover:shadow-medium hover:translate-y-[-2px] active:translate-y-0 active:shadow-soft",
    ghost: "bg-transparent hover:bg-secondary text-foreground",
  };
  
  const sizeClasses = {
    sm: "text-sm py-2 px-4",
    md: "text-base py-3 px-6",
    lg: "text-lg py-4 px-8",
  };

  const iconClasses = icon ? "inline-flex gap-2 items-center" : "";

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        iconClasses,
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
