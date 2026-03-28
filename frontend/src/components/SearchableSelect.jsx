import React, { useEffect, useRef, useState } from "react";

const SearchableSelect = ({
  label,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  options,
  value,
  onChange,
  disabled = false,
  emptyMessage = "No options found.",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = options.filter((option) =>
    `${option.label} ${option.meta || ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative ${isOpen ? "z-40" : "z-10"}`}
    >
      {label && <label className="label-text">{label}</label>}

      <button
        type="button"
        className="input-field flex items-center justify-between text-left"
        onClick={() => !disabled && setIsOpen((open) => !open)}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className="min-w-0">
          <span className={selectedOption ? "block truncate text-slate-800" : "block truncate text-slate-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.meta && (
            <span className="mt-1 block truncate text-xs uppercase tracking-[0.16em] text-slate-400">
              {selectedOption.meta}
            </span>
          )}
        </span>
        <span className="ml-4 shrink-0 rounded-full border border-white/60 bg-white/35 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 backdrop-blur-xl">
          {isOpen ? "Close" : "Open"}
        </span>
      </button>

      {isOpen && !disabled && (
        <div className="panel absolute left-0 right-0 z-50 mt-3 rounded-3xl p-3">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="input-field"
          />

          <div className="mt-3 max-h-64 overflow-y-auto pr-1">
            {filteredOptions.length > 0 ? (
              <div className="space-y-2">
                {filteredOptions.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-slate-900/80 bg-slate-900/90 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.7)]"
                          : "border-white/50 bg-white/35 text-slate-700 backdrop-blur-xl hover:border-white/70 hover:bg-white/50"
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      {option.meta && (
                        <div
                          className={`mt-1 text-xs uppercase tracking-[0.16em] ${
                            isSelected ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {option.meta}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state py-8">{emptyMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
