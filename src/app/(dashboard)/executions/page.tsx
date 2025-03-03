"use client";

import SearchBar from "@/components/dashboard/SearchBar";

const ExecutionsPage = () => {
  return (
    <div className="w-full flex flex-col">
      <SearchBar title="Executions" />

      <hr className="mt-5 bg-gray-200" />
      <div className="mt-10 min-h-[200px] cursor-pointer border border-transparent hover:border-secondary bg-white rounded flex items-center justify-center">
        <div className="flex flex-col gap-4">
          <p>There is no execution data points to show</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutionsPage;
