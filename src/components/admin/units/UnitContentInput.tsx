"use client";

import { useState, useRef, useEffect } from "react";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type UnitContentInputProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  disabled?: boolean;
};

export const UnitContentInput = ({
  value,
  onChange,
  suggestions,
  disabled = false,
}: UnitContentInputProps) => {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && s !== value
  );

  const showDropdown = open && filteredSuggestions.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleSelect = (selected: string) => {
    onChange(selected);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <Popover open={showDropdown} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
              isFocused ? "text-gray-600" : "text-gray-400",
              disabled && "text-gray-300"
            )}
          >
            <Layers className="h-4 w-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Агуулга (заавал биш)"
            disabled={disabled}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1",
              "text-sm shadow-sm transition-all duration-200",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-gray-300",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] shadow-lg border-gray-200"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command className="bg-white">
          <CommandList className="max-h-[180px]">
            <CommandGroup>
              {filteredSuggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion}
                  value={suggestion}
                  onSelect={() => handleSelect(suggestion)}
                  className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 data-[selected=true]:bg-gray-100"
                >
                  <Layers className="h-3.5 w-3.5 mr-2 text-gray-400" />
                  <span className="font-medium">{suggestion}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
