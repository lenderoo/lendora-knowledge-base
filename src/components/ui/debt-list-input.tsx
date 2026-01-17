import * as React from "react"
import { cn } from "@/lib/utils"
import { CurrencyInput } from "./currency-input"
import { Button } from "./button"
import { Plus, X } from "lucide-react"

interface DebtItem {
  type: string
  amount: number | null
}

interface DebtListInputProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  value: string | null | undefined
  onChange: (value: string) => void
}

const DEBT_TYPES = [
  "车贷",
  "房贷",
  "信用卡",
  "个人贷款",
  "学生贷款",
  "其他",
]

function parseDebts(value: string | null | undefined): DebtItem[] {
  if (!value || value.trim() === "") return []

  const items: DebtItem[] = []
  const parts = value.split(/[,，]/).map((p) => p.trim()).filter(Boolean)

  for (const part of parts) {
    const match = part.match(/^(.+?)\s*\$?\s*([\d,]+)$/)
    if (match) {
      const type = match[1].trim()
      const amount = parseFloat(match[2].replace(/,/g, ""))
      items.push({ type, amount: isNaN(amount) ? null : amount })
    } else {
      items.push({ type: part, amount: null })
    }
  }

  return items
}

function formatDebts(items: DebtItem[]): string {
  return items
    .filter((item) => item.type || item.amount)
    .map((item) => {
      if (item.amount) {
        return `${item.type} $${item.amount.toLocaleString("en-AU")}`
      }
      return item.type
    })
    .join(", ")
}

function DebtListInput({ className, value, onChange, ...props }: DebtListInputProps) {
  const [items, setItems] = React.useState<DebtItem[]>(() => {
    return parseDebts(value)
  })

  const lastValueRef = React.useRef(value)

  React.useEffect(() => {
    if (value !== lastValueRef.current) {
      const formatted = formatDebts(items)
      if (value !== formatted) {
        setItems(parseDebts(value))
      }
      lastValueRef.current = value
    }
  }, [value, items])

  const updateItems = (newItems: DebtItem[]) => {
    setItems(newItems)
    const formatted = formatDebts(newItems)
    lastValueRef.current = formatted
    onChange(formatted)
  }

  const addItem = () => {
    updateItems([...items, { type: "", amount: null }])
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    updateItems(newItems)
  }

  const updateItem = (index: number, field: keyof DebtItem, fieldValue: string | number | null) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: fieldValue }
    updateItems(newItems)
  }

  const inputClassName = cn(
    "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
  )

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <select
            className={cn(inputClassName, "w-28")}
            value={item.type}
            onChange={(e) => updateItem(index, "type", e.target.value)}
          >
            <option value="">选择类型</option>
            {DEBT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="flex-1">
            <CurrencyInput
              value={item.amount}
              onChange={(val) => updateItem(index, "amount", val)}
              placeholder="金额"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => removeItem(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={addItem}
      >
        <Plus className="h-4 w-4 mr-1" />
        添加负债
      </Button>
    </div>
  )
}

export { DebtListInput }
