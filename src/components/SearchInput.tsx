"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

interface SearchInputProps {
  placeholder?: string;
  search: string;
  setSearch: (value: string) => void;
  className?: string;
  isSearch?: boolean;
}

const SearchInput = ({
  search,
  setSearch,
  placeholder = "Search...",
  className,
  isSearch = true,
}: SearchInputProps) => {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between gap-2",
        className
      )}
    >
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="w-full border-none outline-none bg-transparent"
      />

      {isSearch && (
        <IoSearchOutline className="text-primary cursor-pointer w-6 h-6" />
      )}
    </div>
  );
};

export default SearchInput;
