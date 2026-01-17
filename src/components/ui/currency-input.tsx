import * as React from "react"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "type"> {
  value: number | null | undefined
  onChange: (value: number | null) => void
  currency?: string
}

function CurrencyInput({
  className,
  value,
  onChange,
  currency = "$",
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState("")

  React.useEffect(() => {
    if (value === null || value === undefined || value === 0) {
      setDisplayValue("")
    } else {
      setDisplayValue(formatNumber(value))
    }
  }, [value])

  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-AU")
  }

  const parseNumber = (str: string): number | null => {
    const cleaned = str.replace(/[^0-9.-]/g, "")
    if (cleaned === "" || cleaned === "-") return null
    const num = parseFloat(cleaned)
    return isNaN(num) ? null : num
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const numValue = parseNumber(rawValue)

    if (rawValue === "") {
      setDisplayValue("")
      onChange(null)
    } else {
      setDisplayValue(rawValue.replace(/[^0-9,.-]/g, ""))
      onChange(numValue)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (value !== null && value !== undefined) {
      setDisplayValue(formatNumber(value))
    }
    props.onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (value !== null && value !== undefined) {
      setDisplayValue(value.toString())
    }
    props.onFocus?.(e)
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        {currency}
      </span>
      <input
        type="text"
        inputMode="numeric"
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "pl-7",
          className
        )}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        {...props}
      />
    </div>
  )
}

export { CurrencyInput }
