"use client";

import SearchBar from "@/components/dashboard/SearchBar";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const AppsPages = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full flex flex-col">
      <SearchBar
        title="Apps"
        search={search}
        setSearch={setSearch}
        buttonText="Add connection"
        onAction={() => {}}
        show={true}
      />

      <hr className="mt-5 bg-gray-200" />

      <div className="mt-10 min-h-[200px] cursor-pointer border border-transparent hover:border-secondary bg-white rounded flex items-center justify-center">
        <div className="flex flex-col gap-4">
          <div className="w-fit flex self-center rounded-full bg-secondary p-1 ">
            <IoIosAdd className="text-white w-6 h-6 cursor-pointer" />
          </div>

          <p>You don&#39;t have any connections yet</p>
        </div>
      </div>
    </div>
  );
};

export default AppsPages;
