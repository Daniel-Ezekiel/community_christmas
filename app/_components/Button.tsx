import { cn } from "../_utils/cn";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "default";
  className?: string;
  onClick?: () => void;
}

export default function Button({ children, type = "button", variant = "primary", className, onClick }: ButtonProps) {
  const variants = {
    "default": "cursor-pointer font-semibold bg-white text-navy border border-sage hover:bg-light-slate hover:border-sage focus:ring-2 focus:ring-sage/35 disabled:bg-light-grey disabled:text-mid-grey error:bg-full-fill error:border error:border-error error:text-full-text",
    "primary": "cursor-pointer font-semibold bg-navy text-white hover:bg-sage focus:ring-2 focus:ring-sage disabled:bg-light-grey disabled:text-mid-grey error:bg-error error:text-white",
    "secondary": "cursor-pointer font-semibold bg-off-white text-navy border border-sage hover:bg-light-slate hover:border-sage focus:ring-2 focus:ring-sage/35 disabled:bg-light-grey disabled:text-mid-grey error:bg-full-fill error:border error:border-error error:text-full-text",
    "ghost": "cursor-pointer font-semibold bg-white text-sage border-sage hover:bg-light-slate hover:border-sage hover:text-navy focus:ring-2 focus:ring-sage/35 disabled:text-mid-grey disabled:border disabled:border-light-grey error:bg-full-fill error:border error:border-error error:text-full-text",
  };

  return (
    <button type={type} onClick={onClick} className={cn(variants[variant], className)}>
      {children}
    </button>
  );
}
