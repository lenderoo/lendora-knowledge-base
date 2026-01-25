"use client";

import { useState, useRef, useEffect } from "react";
import { LENDERS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LenderMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function LenderMultiSelect({
  value,
  onChange,
  placeholder = "选择银行...",
}: LenderMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLender = (lender: string) => {
    if (value.includes(lender)) {
      onChange(value.filter((v) => v !== lender));
    } else {
      onChange([...value, lender]);
    }
  };

  const removeLender = (lender: string) => {
    onChange(value.filter((v) => v !== lender));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="w-full justify-between"
        >
          {value.length > 0 ? `已选择 ${value.length} 个银行` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 shadow-md">
            <div className="grid grid-cols-2 gap-1 max-h-60 overflow-y-auto">
              {LENDERS.map((lender) => (
                <button
                  key={lender}
                  type="button"
                  onClick={() => toggleLender(lender)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent text-left",
                    value.includes(lender) && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value.includes(lender) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {lender}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((lender) => (
            <Badge key={lender} variant="secondary" className="gap-1">
              {lender}
              <button
                type="button"
                onClick={() => removeLender(lender)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
