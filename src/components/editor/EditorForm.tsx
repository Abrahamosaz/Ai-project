"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineSave, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import EditorNavbar from "./EditorNavbar";
import MonacoEditor from "@monaco-editor/react";
import { createEmptyIntent, Intent, useFlowStore } from "@/store/flow.store";
import WorkflowIntentsSlider from "./WorkflowSlider";
import { useParams } from "next/navigation";

const EditorForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    currentWorkflow,
    selectedIntentIndex,
    setSelectedIntentIndex,
    updateIntent,
    addIntent,
    getWorkflowDataById,
    loadWorkflow,
    resetCurrentWorkflow,
  } = useFlowStore();

  const [currentIntent, setCurrentIntent] = useState<Intent>(
    createEmptyIntent()
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isNewIntent, setIsNewIntent] = useState(true);

  // Load template data if id is provided
  useEffect(() => {
    if (slug) {
      const workflow = getWorkflowDataById(slug);
      if (workflow) {
        loadWorkflow(slug);
      } else {
        resetCurrentWorkflow();
      }
    } else {
      resetCurrentWorkflow();
    }
  }, [slug, getWorkflowDataById, loadWorkflow, resetCurrentWorkflow]);

  // Update current intent when selection changes
  useEffect(() => {
    if (
      selectedIntentIndex !== null &&
      currentWorkflow.workflow_data[selectedIntentIndex]
    ) {
      setCurrentIntent(
        JSON.parse(
          JSON.stringify(currentWorkflow.workflow_data[selectedIntentIndex])
        )
      );
      setIsNewIntent(false);
    } else {
      setCurrentIntent(createEmptyIntent());
      setIsNewIntent(true);
    }
  }, [
    selectedIntentIndex,
    currentWorkflow.workflow_data,
    getWorkflowDataById,
    loadWorkflow,
    resetCurrentWorkflow,
  ]);

  const handleJsonChange = (value: string | undefined) => {
    if (!value) return;

    try {
      const parsedIntent = JSON.parse(value);
      setCurrentIntent(parsedIntent);
      setJsonError(null);
    } catch (error) {
      console.log(error);
      setJsonError("Invalid JSON format");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNewIntent) {
      // Set step to next available
      const nextStep = currentWorkflow.workflow_data.length + 1;
      const intentToAdd = {
        ...currentIntent,
        step: nextStep,
      };
      addIntent(intentToAdd);
      setSelectedIntentIndex(currentWorkflow.workflow_data.length);
    } else if (selectedIntentIndex !== null) {
      updateIntent(selectedIntentIndex, currentIntent);
    }

    console.log("Saved intent:", currentIntent);
  };

  const handleAddQueryParam = (section: string) => {
    const updatedQueryParams = currentIntent.api.query_params
      ? { ...currentIntent.api.query_params }
      : {};
    if (!updatedQueryParams[section]) {
      updatedQueryParams[section] = {};
    }
    updatedQueryParams[section] = {
      ...updatedQueryParams[section],
      newParam: "string",
    };

    setCurrentIntent({
      ...currentIntent,
      api: {
        ...currentIntent.api,
        query_params: updatedQueryParams,
      },
    });
  };

  const handleRemoveQueryParam = (section: string, param: string) => {
    if (!currentIntent.api.query_params) return;

    const updatedQueryParams = { ...currentIntent.api.query_params };
    if (updatedQueryParams[section]) {
      const sectionParams = { ...updatedQueryParams[section] };
      delete sectionParams[param];
      updatedQueryParams[section] = sectionParams;

      setCurrentIntent({
        ...currentIntent,
        api: {
          ...currentIntent.api,
          query_params: updatedQueryParams,
        },
      });
    }
  };

  const handleCreateNewIntent = () => {
    setSelectedIntentIndex(null);
    setCurrentIntent(createEmptyIntent());
    setIsNewIntent(true);
  };

  return (
    <div className="w-full">
      <EditorNavbar />
      <div className="py-20 bg-[#FAFAFA] min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2.5">
            <h1 className="text-2xl font-bold">
              {currentWorkflow.name
                ? currentWorkflow.name
                : "Untitled Workflow"}
            </h1>
            <button
              onClick={handleCreateNewIntent}
              className="w-fit px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
            >
              <AiOutlinePlus size={18} className="mr-2" />
              New Intent
            </button>
          </div>

          <WorkflowIntentsSlider />

          <div className="w-full flex flex-col md:flex-row justify-between gap-6">
            {/* Form section */}
            <div className="w-full md:w-1/2">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-bold mb-6">
                  {isNewIntent
                    ? "Add New Intent"
                    : `Edit Intent: ${currentIntent.intent}`}
                </h2>

                {/* Basic Intent Info */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Intent Name
                  </label>
                  <input
                    type="text"
                    value={currentIntent.intent}
                    onChange={(e) =>
                      setCurrentIntent({
                        ...currentIntent,
                        intent: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="search_product"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Step
                  </label>
                  <input
                    type="number"
                    value={
                      currentWorkflow.workflow_data.length > 0
                        ? isNewIntent
                          ? currentWorkflow.workflow_data[
                              currentWorkflow.workflow_data.length - 1
                            ]?.step + 1
                          : currentIntent.step
                        : 1
                    }
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                    disabled={true} // Auto-assigned for existing intents
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={currentIntent.description}
                    onChange={(e) =>
                      setCurrentIntent({
                        ...currentIntent,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the intent..."
                    rows={3}
                    required
                  />
                </div>

                {/* API Configuration */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">
                    API Configuration
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Method
                      </label>
                      <select
                        value={currentIntent.api.method}
                        onChange={(e) =>
                          setCurrentIntent({
                            ...currentIntent,
                            api: {
                              ...currentIntent.api,
                              method: e.target.value as
                                | "GET"
                                | "POST"
                                | "PUT"
                                | "DELETE",
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        URL
                      </label>
                      <input
                        type="text"
                        value={currentIntent.api.url}
                        onChange={(e) =>
                          setCurrentIntent({
                            ...currentIntent,
                            api: {
                              ...currentIntent.api,
                              url: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://api.example.com/products"
                        required
                      />
                    </div>
                  </div>

                  {/* Query Parameters */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium">Query Parameters</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedQueryParams = {
                            ...(currentIntent.api.query_params || {}),
                          };
                          updatedQueryParams["newSection"] = {
                            param: "string",
                          };
                          setCurrentIntent({
                            ...currentIntent,
                            api: {
                              ...currentIntent.api,
                              query_params: updatedQueryParams,
                            },
                          });
                        }}
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                      >
                        <AiOutlinePlus size={16} className="mr-1" />
                        Add Section
                      </button>
                    </div>

                    {currentIntent.api.query_params &&
                      Object.entries(currentIntent.api.query_params).map(
                        ([section, params]) => (
                          <div
                            key={section}
                            className="mb-4 border border-gray-200 rounded-md p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  value={section}
                                  onChange={(e) => {
                                    const updatedQueryParams = {
                                      ...(currentIntent.api.query_params || {}),
                                    };
                                    const sectionParams =
                                      updatedQueryParams[section];
                                    delete updatedQueryParams[section];
                                    updatedQueryParams[e.target.value] =
                                      sectionParams;

                                    setCurrentIntent({
                                      ...currentIntent,
                                      api: {
                                        ...currentIntent.api,
                                        query_params: updatedQueryParams,
                                      },
                                    });
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                />
                              </div>
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  onClick={() => handleAddQueryParam(section)}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <AiOutlinePlus size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedQueryParams = {
                                      ...(currentIntent.api.query_params || {}),
                                    };
                                    delete updatedQueryParams[section];

                                    setCurrentIntent({
                                      ...currentIntent,
                                      api: {
                                        ...currentIntent.api,
                                        query_params:
                                          Object.keys(updatedQueryParams)
                                            .length > 0
                                            ? updatedQueryParams
                                            : null,
                                      },
                                    });
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <AiOutlineDelete size={16} />
                                </button>
                              </div>
                            </div>

                            {Object.entries(params).map(
                              ([paramName, paramType]) => (
                                <div
                                  key={paramName}
                                  className="flex items-center mb-2 pl-2"
                                >
                                  <input
                                    type="text"
                                    value={paramName}
                                    onChange={(e) => {
                                      const updatedParams = {
                                        ...(currentIntent.api.query_params ||
                                          {}),
                                      };
                                      const paramValue =
                                        updatedParams[section][paramName];
                                      delete updatedParams[section][paramName];
                                      updatedParams[section][e.target.value] =
                                        paramValue;

                                      setCurrentIntent({
                                        ...currentIntent,
                                        api: {
                                          ...currentIntent.api,
                                          query_params: updatedParams,
                                        },
                                      });
                                    }}
                                    className="w-1/3 px-2 py-1 text-sm border border-gray-300 rounded-md mr-2"
                                  />
                                  <select
                                    value={paramType}
                                    onChange={(e) => {
                                      const updatedParams = {
                                        ...(currentIntent.api.query_params ||
                                          {}),
                                      };
                                      updatedParams[section][paramName] =
                                        e.target.value;

                                      setCurrentIntent({
                                        ...currentIntent,
                                        api: {
                                          ...currentIntent.api,
                                          query_params: updatedParams,
                                        },
                                      });
                                    }}
                                    className="w-1/3 px-2 py-1 text-sm border border-gray-300 rounded-md"
                                  >
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="boolean">boolean</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveQueryParam(section, paramName)
                                    }
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    <AiOutlineDelete size={16} />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )
                      )}
                  </div>

                  {/* Request Body (simplified) */}
                  <div className="mb-4">
                    <h4 className="text-md font-medium mb-2">Request Body</h4>
                    <textarea
                      value={
                        currentIntent.api.request_body
                          ? JSON.stringify(
                              currentIntent.api.request_body,
                              null,
                              2
                            )
                          : ""
                      }
                      onChange={(e) => {
                        try {
                          const parsedBody = e.target.value
                            ? JSON.parse(e.target.value)
                            : null;
                          setCurrentIntent({
                            ...currentIntent,
                            api: {
                              ...currentIntent.api,
                              request_body: parsedBody,
                            },
                          });
                          setJsonError(null);
                        } catch (error) {
                          console.log(error);
                          setJsonError("Invalid JSON in request body");
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="{ }"
                      rows={5}
                    />
                  </div>

                  {/* Response (simplified) */}
                  <div>
                    <h4 className="text-md font-medium mb-2">Response</h4>
                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm mb-1">
                        Status
                      </label>
                      <input
                        type="text"
                        value={currentIntent.api.response.status}
                        onChange={(e) =>
                          setCurrentIntent({
                            ...currentIntent,
                            api: {
                              ...currentIntent.api,
                              response: {
                                ...currentIntent.api.response,
                                status: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="200"
                      />
                    </div>
                    <textarea
                      value={JSON.stringify(
                        currentIntent.api.response,
                        null,
                        2
                      )}
                      onChange={(e) => {
                        try {
                          const parsedResponse = JSON.parse(e.target.value);
                          setCurrentIntent({
                            ...currentIntent,
                            api: {
                              ...currentIntent.api,
                              response: parsedResponse,
                            },
                          });
                          setJsonError(null);
                        } catch (error) {
                          console.log(error);
                          setJsonError("Invalid JSON in response");
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="{ }"
                      rows={5}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  >
                    <AiOutlineSave size={18} className="mr-2" />
                    {isNewIntent ? "Add Intent" : "Update Intent"}
                  </button>
                </div>
              </form>
            </div>

            {/* JSON Editor section */}
            <div className="w-full md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-bold mb-4">JSON Editor</h2>
                {jsonError && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                    {jsonError}
                  </div>
                )}
                <MonacoEditor
                  height="70vh"
                  language="json"
                  value={JSON.stringify(currentIntent, null, 2)}
                  onChange={handleJsonChange}
                  options={{
                    minimap: { enabled: false },
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorForm;
