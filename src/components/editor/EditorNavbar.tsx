import { useFlowStore } from "@/store/flow.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

const EditorNavbar = () => {
  const router = useRouter();

  const { updateWorkflowName, saveWorkflow, currentWorkflow } = useFlowStore();

  return (
    <div className="w-full  fixed bg-white py-2 shadow-md z-50">
      <form className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IoIosArrowBack
            onClick={() => router.back()}
            className="h-6 w-6 cursor-pointer"
          />

          <div className="flex items-center gap-2 pb-1 hover:border-b  hover:border-dotted hover:border-black transition-all duration-200">
            <MdModeEditOutline className="h-6 w-6" />

            <input
              type="text"
              value={currentWorkflow.name}
              required
              placeholder="workflow name"
              onChange={(e) => {
                updateWorkflowName(e.target.value);
              }}
              className="outline-none border-none w-full bg-transparent"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (currentWorkflow.workflow_data.length < 1) {
              toast.error(
                "Please add at least one intent to save the workflow"
              );
              return;
            }
            if (currentWorkflow.name === "") {
              toast.error("Please provide a name for the workflow");
              return;
            }
            saveWorkflow();

            toast.success("Workflow saved successfully");
            router.replace("/flows");
          }}
          className="p-2 px-3 hover:bg-[#001F52] text-sm text-white bg-[#0059F7] rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditorNavbar;
