import Image from "next/image";
import MarmaladeLogo from "@/app/assets/images/Marmalade_Logo.png";

export default function StatusPanel({
  variant,
  title,
  description,
  detail,
  children,
}: {
  variant: "loading" | "error";
  title: string;
  description?: string;
  detail?: string;
  children?: React.ReactNode;
}) {
  const isLoading = variant === "loading";

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center py-10"
      role={isLoading ? "status" : "alert"}
      aria-live={isLoading ? "polite" : "assertive"}
      aria-busy={isLoading}
    >
      <div className="grid w-full max-w-xl place-items-center gap-4 text-center md:px-20 md:py-10 md:bg-white md:border md:border-card-border md:rounded-card">
        {isLoading ? (
          <Image
            src={MarmaladeLogo}
            alt=""
            className="logo-pulse h-16 w-auto"
            aria-hidden
          />
        ) : (
          <div
            aria-hidden
            className="grid h-16 w-16 place-items-center rounded-full bg-full-fill"
          >
            <span className="text-2xl font-extrabold leading-none text-full-text">
              !
            </span>
          </div>
        )}

        <p className="text-lg font-semibold text-navy md:text-xl lg:text-2xl">
          {title}
        </p>

        {description ? (
          <p className="text-base text-mid-grey md:text-lg">{description}</p>
        ) : null}

        {detail ? (
          <p className="w-full rounded-input bg-full-fill px-4 py-3 text-left text-base text-full-text">
            {detail}
          </p>
        ) : null}

        {children}
      </div>
    </div>
  );
}
