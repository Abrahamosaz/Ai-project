"use client";

import SearchBar from "@/components/dashboard/SearchBar";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useFlowStore, WorkflowSummary } from "@/store/flow.store";
import { format } from "date-fns";

const FlowsPage = () => {
  const [search, setSearch] = useState<string>("");
  const [filteredWorkflows, setFilteredWorkflows] = useState<WorkflowSummary[]>(
    []
  );
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null
  );
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [actionButtonRef, setActionButtonRef] =
    useState<HTMLButtonElement | null>(null);

  const {
    workflowSummaries,
    deleteWorkflow,
    loadAllWorkflowSummaries,
    duplicateWorkflow,
  } = useFlowStore();
  const router = useRouter();

  // Load workflow summaries on component mount
  useEffect(() => {
    loadAllWorkflowSummaries();
  }, [loadAllWorkflowSummaries]);

  // Filter workflows based on search term
  useEffect(() => {
    if (workflowSummaries && workflowSummaries.length > 0) {
      if (search.trim() === "") {
        setFilteredWorkflows(workflowSummaries);
      } else {
        const filtered = workflowSummaries.filter((workflow) =>
          workflow.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredWorkflows(filtered);
      }
    } else {
      setFilteredWorkflows([]);
    }
  }, [search, workflowSummaries]);

  // Handle workflow selection
  const handleWorkflowClick = (id: string): void => {
    router.push(`/editor/${id}`);
  };

  // Handle opening the action modal
  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ): void => {
    e.stopPropagation(); // Prevent triggering workflow click
    setActionButtonRef(e.currentTarget);
    setSelectedWorkflowId(id);
    setShowActionModal(true);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent): void => {
      if (
        actionButtonRef &&
        showActionModal &&
        !actionButtonRef.contains(e.target as Node)
      ) {
        setShowActionModal(false);
      }
    };

    if (showActionModal) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showActionModal, actionButtonRef]);

  return (
    <>
      <div className="container">
        <SearchBar
          title="Flows"
          search={search}
          setSearch={setSearch}
          buttonText="Create Flow"
          onAction={() => router.push("/editor")}
          show={true}
        />

        <hr className="mt-5 bg-gray-200" />

        {filteredWorkflows.length > 0 ? (
          <div className="relative flex flex-col gap-4 mt-8 ">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                onClick={() => handleWorkflowClick(workflow.id)}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
              >
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => handleActionClick(e, workflow.id)}
                    className="relative p-1 hover:bg-gray-100 rounded-full"
                  >
                    <BsThreeDotsVertical className="text-gray-600" />
                    {showActionModal && selectedWorkflowId === workflow.id && (
                      <div
                        className="absolute right-0 top-10 bg-white shadow-lg rounded-md z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="py-2 min-w-40">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionModal(false);
                              handleWorkflowClick(workflow.id);
                            }}
                          >
                            <span>View</span>
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionModal(false);
                            }}
                          >
                            <span>Publish</span>
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionModal(false);
                              duplicateWorkflow(workflow.id);
                            }}
                          >
                            <span>Duplicate</span>
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionModal(false);
                              deleteWorkflow(workflow.id);
                            }}
                          >
                            <span>Delete</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold mb-1">
                    {workflow.name || "Untitled Workflow"}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {workflow.updatedAt
                      ? format(workflow.updatedAt, "MMM d, yyyy")
                      : "No date"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Last updated:{" "}
                  {workflow.updatedAt
                    ? format(workflow.updatedAt, "MMM d, yyyy h:mm a")
                    : "Never"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="bg-blue-600 p-3 rounded-full mb-4">
              <IoIosAdd
                onClick={() => router.push("/editor")}
                className="text-white w-6 h-6 cursor-pointer"
              />
            </div>
            <p className="text-gray-500 text-lg">
              You don&#39;t have any flows yet
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FlowsPage;
