import { cn } from "../_utils/cn";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "default" | "error";
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  type = "button",
  variant = "primary",
  isDisabled,
  className,
  onClick,
}: ButtonProps) {
  const variants = {
    default:
      "cursor-pointer font-semibold bg-white text-navy border border-sage hover:bg-light-slate hover:border-sage focus:ring-2 focus:ring-sage/35 disabled:bg-light-grey disabled:text-mid-grey",
    primary:
      "cursor-pointer font-semibold bg-navy text-white hover:bg-sage focus:ring-2 focus:ring-sage disabled:bg-light-grey disabled:text-mid-grey",
    secondary:
      "cursor-pointer font-semibold bg-off-white text-navy border border-sage hover:bg-light-slate hover:border-sage focus:ring-2 focus:ring-sage/35",
    ghost:
      "cursor-pointer font-semibold bg-white text-sage border-sage hover:bg-light-slate hover:border-sage hover:text-navy focus:ring-2 focus:ring-sage/35 disabled:border disabled:border-light-grey",
    error:
      "cursor-pointer font-semibold bg-error text-white border border-error hover:bg-red-700 focus:ring-2 focus:ring-error/35 disabled:bg-light-grey disabled:text-mid-grey",
  };

  const defaultClassName =
    "px-4 py-2 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage/35 disabled:bg-light-grey disabled:text-mid-grey disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(defaultClassName, variants[variant], className)}
    >
      {children}
    </button>
  );
}
