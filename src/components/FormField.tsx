import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TextField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "tel" | "numeric";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}

export function SelectField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ colorScheme: "light" }}
          className={cn(
            "w-full appearance-none bg-transparent text-[15px] outline-none",
            value ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      </div>
    </label>
  );
}
