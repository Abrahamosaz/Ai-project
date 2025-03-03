"use client";

import SearchInput from "../SearchInput";
import { IoIosAdd } from "react-icons/io";

type searchBarProps = {
  title: string;
  buttonText?: string;
  search?: string;
  show?: boolean;
  setSearch?: (value: string) => void;
  onAction?: () => void;
};

const SearchBar: React.FC<searchBarProps> = ({
  title,
  search,
  setSearch = () => {},
  show = false,
  buttonText,
  onAction,
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 md:flex-row items-center justify-between">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-3xl font-bold">{title}</h1>

          {show && (
            <div className="flex md:hidden rounded-full bg-secondary hover:bg-primary p-3">
              <IoIosAdd className="text-white w-6 h-6 cursor-pointer" />
            </div>
          )}
        </div>

        {show && (
          <div className="w-full flex items-center gap-4">
            <SearchInput
              search={search ?? ""}
              setSearch={setSearch}
              placeholder="Search"
              isSearch={true}
              className="min-w-[300px] p-3 flex self-end border border-black"
            />

            <button
              onClick={onAction}
              className="hidden md:block p-3 font-semibold text-lg bg-secondary rounded text-white whitespace-nowrap"
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
