import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover, padding = "md", className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white border border-i23-gris-pale rounded-2xl ${paddingStyles[padding]} ${
        hover ? "hover:shadow-lg transition-shadow" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";
