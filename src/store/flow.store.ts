import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Define types for workflow data
export interface ApiQueryParam {
  [key: string]: {
    [key: string]: string;
  };
}

export interface ApiResponse {
  status: string;
  data?: {
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}

export interface ApiConfig {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  query_params?: ApiQueryParam | null;
  request_body?: unknown;
  response: ApiResponse;
}

export interface Intent {
  intent: string;
  step: number;
  description: string;
  api: ApiConfig;
}

export interface WorkflowData {
  id?: string;
  name: string;
  workflow_data: Intent[];
  createdAt?: number;
  updatedAt?: number;
}

export interface WorkflowSummary {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

// Define store interface
interface FlowState {
  currentWorkflow: WorkflowData;
  workflowSummaries: WorkflowSummary[];
  selectedIntentIndex: number | null;
  addIntent: (intent: Intent) => void;
  updateIntent: (index: number, intent: Intent) => void;
  removeIntent: (index: number) => void;
  setSelectedIntentIndex: (index: number | null) => void;
  getSelectedIntent: () => Intent | null;
  updateWorkflowName: (name: string) => void;
  saveWorkflow: () => string;
  loadWorkflow: (id: string) => boolean;
  loadAllWorkflowSummaries: () => WorkflowSummary[];
  createNewWorkflow: () => void;
  deleteWorkflow: (id: string) => boolean;
  getWorkflowDataById: (id: string) => WorkflowData | null;
  duplicateWorkflow: (id: string) => string | null;
  resetCurrentWorkflow: () => void;
}

// Default workflow data
const defaultWorkflowData: WorkflowData = {
  id: "",
  name: "",
  workflow_data: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// Create new empty intent template
export const createEmptyIntent = (): Intent => ({
  intent: "",
  step: 1,
  description: "",
  api: {
    method: "GET",
    url: "",
    query_params: {
      search: {
        keyword: "string",
      },
    },
    request_body: null,
    response: {
      status: "200",
      data: {},
    },
  },
});

// Storage keys
const WORKFLOW_SUMMARIES_KEY = "flow-storage-workflow-summaries";
const WORKFLOW_PREFIX = "flow-storage-workflow-";

// Generate a random ID
const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Create the Zustand store
export const useFlowStore = create<FlowState>()(
  devtools((set, get) => ({
    currentWorkflow: { ...defaultWorkflowData },
    workflowSummaries: [],
    selectedIntentIndex: null,

    addIntent: (intent) =>
      set((state) => ({
        currentWorkflow: {
          ...state.currentWorkflow,
          workflow_data: [...state.currentWorkflow.workflow_data, intent],
          updatedAt: Date.now(),
        },
      })),

    updateIntent: (index, intent) =>
      set((state) => {
        const updatedWorkflowData = [...state.currentWorkflow.workflow_data];
        updatedWorkflowData[index] = intent;

        return {
          currentWorkflow: {
            ...state.currentWorkflow,
            workflow_data: updatedWorkflowData,
            updatedAt: Date.now(),
          },
        };
      }),

    removeIntent: (index) =>
      set((state) => {
        const updatedWorkflowData = [...state.currentWorkflow.workflow_data];
        updatedWorkflowData.splice(index, 1);

        // Re-order steps if needed
        const reorderedWorkflowData = updatedWorkflowData.map(
          (intent, idx) => ({
            ...intent,
            step: idx + 1,
          })
        );

        return {
          currentWorkflow: {
            ...state.currentWorkflow,
            workflow_data: reorderedWorkflowData,
            updatedAt: Date.now(),
          },
          selectedIntentIndex: null,
        };
      }),

    setSelectedIntentIndex: (index) => set({ selectedIntentIndex: index }),

    getSelectedIntent: () => {
      const { selectedIntentIndex, currentWorkflow } = get();
      if (selectedIntentIndex === null) return null;
      return currentWorkflow.workflow_data[selectedIntentIndex] || null;
    },

    updateWorkflowName: (name) =>
      set((state) => ({
        currentWorkflow: {
          ...state.currentWorkflow,
          name,
          updatedAt: Date.now(),
        },
      })),

    // Reset current workflow to default
    resetCurrentWorkflow: () => {
      set({
        currentWorkflow: {
          ...defaultWorkflowData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        selectedIntentIndex: null,
      });
    },

    // Create a new workflow
    createNewWorkflow: () => {
      const newWorkflow = {
        ...defaultWorkflowData,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      set({ currentWorkflow: newWorkflow });
    },

    // Save workflow to localStorage with a unique ID
    saveWorkflow: () => {
      const { currentWorkflow, workflowSummaries } = get();
      const timestamp = Date.now();

      // If workflow doesn't have an ID yet, generate one
      const id = currentWorkflow.id || generateId();

      const updatedWorkflow = {
        ...currentWorkflow,
        id,
        updatedAt: timestamp,
        createdAt: currentWorkflow.createdAt || timestamp,
      };

      // Save the full workflow data
      localStorage.setItem(
        `${WORKFLOW_PREFIX}${id}`,
        JSON.stringify(updatedWorkflow)
      );

      // Update the list of workflow summaries
      const workflowSummary: WorkflowSummary = {
        id,
        name: updatedWorkflow.name,
        createdAt: updatedWorkflow.createdAt,
        updatedAt: updatedWorkflow.updatedAt,
      };

      const existingIndex = workflowSummaries.findIndex((w) => w.id === id);
      const updatedList = [...workflowSummaries];

      if (existingIndex >= 0) {
        updatedList[existingIndex] = workflowSummary;
      } else {
        updatedList.push(workflowSummary);
      }

      localStorage.setItem(WORKFLOW_SUMMARIES_KEY, JSON.stringify(updatedList));
      set({
        currentWorkflow: updatedWorkflow,
        workflowSummaries: updatedList,
      });

      return id;
    },

    // Load a specific workflow from localStorage by ID
    loadWorkflow: (id) => {
      const savedData = localStorage.getItem(`${WORKFLOW_PREFIX}${id}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData) as WorkflowData;
          set({ currentWorkflow: parsedData });
          return true;
        } catch (error) {
          console.error(
            `Failed to parse saved workflow data for ID ${id}:`,
            error
          );
          return false;
        }
      }
      return false;
    },

    // Get list of all workflow summaries
    loadAllWorkflowSummaries: () => {
      try {
        const savedList = localStorage.getItem(WORKFLOW_SUMMARIES_KEY);
        if (savedList) {
          const summaries = JSON.parse(savedList) as WorkflowSummary[];
          set({ workflowSummaries: summaries });
          return summaries;
        }

        // Initialize if doesn't exist
        localStorage.setItem(WORKFLOW_SUMMARIES_KEY, JSON.stringify([]));
        return [];
      } catch (error) {
        console.error("Failed to retrieve workflow summaries list:", error);
        return [];
      }
    },

    // Delete a workflow by ID
    deleteWorkflow: (id) => {
      try {
        // Remove the full workflow data
        localStorage.removeItem(`${WORKFLOW_PREFIX}${id}`);

        // Update the summaries list
        const { workflowSummaries } = get();
        const updatedSummaries = workflowSummaries.filter(
          (summary) => summary.id !== id
        );

        localStorage.setItem(
          WORKFLOW_SUMMARIES_KEY,
          JSON.stringify(updatedSummaries)
        );

        set({ workflowSummaries: updatedSummaries });
        return true;
      } catch (error) {
        console.error(`Failed to delete workflow with ID ${id}:`, error);
        return false;
      }
    },

    // Get workflow data by ID without setting it as the current workflow
    getWorkflowDataById: (id) => {
      try {
        const savedData = localStorage.getItem(`${WORKFLOW_PREFIX}${id}`);
        if (savedData) {
          return JSON.parse(savedData) as WorkflowData;
        }
        return null;
      } catch (error) {
        console.error(`Failed to get workflow data for ID ${id}:`, error);
        return null;
      }
    },

    // Duplicate a workflow
    duplicateWorkflow: (id) => {
      try {
        // Get the workflow to duplicate
        const workflowData = get().getWorkflowDataById(id);
        if (!workflowData) {
          console.error(`Workflow with ID ${id} not found`);
          return null;
        }

        // Create a new workflow based on the existing one
        const newId = generateId();
        const timestamp = Date.now();

        const duplicatedWorkflow: WorkflowData = {
          ...workflowData,
          id: newId,
          name: `${workflowData.name} (Copy)`,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        // Save the duplicated workflow
        localStorage.setItem(
          `${WORKFLOW_PREFIX}${newId}`,
          JSON.stringify(duplicatedWorkflow)
        );

        // Update the workflow summaries
        const { workflowSummaries } = get();
        const newSummary: WorkflowSummary = {
          id: newId,
          name: duplicatedWorkflow.name,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        const updatedSummaries = [...workflowSummaries, newSummary];
        localStorage.setItem(
          WORKFLOW_SUMMARIES_KEY,
          JSON.stringify(updatedSummaries)
        );

        // Update the store
        set({ workflowSummaries: updatedSummaries });

        return newId;
      } catch (error) {
        console.error(`Failed to duplicate workflow with ID ${id}:`, error);
        return null;
      }
    },
  }))
);
