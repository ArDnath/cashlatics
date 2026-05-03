import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react"; // Assuming Lucide, but change to your icon library type

/**
 * Define the available button variants to ensure
 * autocomplete and type checking for the variant prop.
 */
type ButtonVariant = "primary" | "secondary" | "ghost" | "white";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  icon?: LucideIcon | React.ElementType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  onClick,
  href,
}) => {
  const baseStyle =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1",
    secondary:
      "bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700 hover:-translate-y-1",
    ghost:
      "text-slate-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400",
    white: "bg-white text-blue-600 hover:bg-blue-50 shadow-lg",
  };

  const combinedClasses = `${baseStyle} ${variants[variant]} ${className}`;

  // Shared Icon component to keep the code DRY
  const IconElement = Icon && (
    <Icon
      size={18}
      className="transition-transform group-hover:translate-x-1"
    />
  );

  // If href is provided, render as Next.js Link
  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
        {IconElement}
      </Link>
    );
  }

  // Otherwise, render as a standard HTML button
  return (
    <button onClick={onClick} className={combinedClasses} type="button">
      {children}
      {IconElement}
    </button>
  );
};

export default Button;
