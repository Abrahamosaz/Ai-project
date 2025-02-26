"use client";

import SearchBar from "@/components/dashboard/SearchBar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const FlowsPage = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col">
      <SearchBar
        title="Flows"
        search={search}
        setSearch={setSearch}
        buttonText="Create Flow"
        onAction={() => router.push("/editor/123")}
        show={true}
      />
      <hr className="mt-5 bg-gray-200" />

      <div className="mt-10 min-h-[200px] cursor-pointer border border-transparent hover:border-secondary bg-white rounded flex items-center justify-center">
        <div className="flex flex-col gap-4">
          <div className="w-fit flex self-center rounded-full bg-secondary p-1 ">
            <IoIosAdd
              onClick={() => router.push("/editor/123")}
              className="text-white w-6 h-6 cursor-pointer"
            />
          </div>

          <p>You don't have any flows yet</p>
        </div>
      </div>
    </div>
  );
};

export default FlowsPage;
