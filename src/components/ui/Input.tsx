import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-i23-gris-fonce mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise ${
          error ? "border-red-400" : "border-i23-gris-pale"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
