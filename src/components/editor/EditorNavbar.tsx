import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

const EditorNavbar = () => {
  const router = useRouter();

  const [flowName, setFlowName] = useState("Name your flow");

  return (
    <div className="w-full flex items-center justify-between fixed bg-white py-2 px-6 shadow-md">
      <div className="flex items-center gap-6">
        <IoIosArrowBack
          onClick={() => router.back()}
          className="h-6 w-6 cursor-pointer"
        />

        <div className="flex items-center gap-2 pb-1 hover:border-b min-w-[300px] hover:border-dotted hover:border-black transition-all duration-200">
          <MdModeEditOutline className="h-6 w-6" />

          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="outline-none border-none w-full bg-transparent"
          />
        </div>
      </div>
      <button className="p-2 px-3 hover:bg-[#001F52] text-white bg-[#0059F7] rounded">
        PUBLISH
      </button>
    </div>
  );
};

export default EditorNavbar;
