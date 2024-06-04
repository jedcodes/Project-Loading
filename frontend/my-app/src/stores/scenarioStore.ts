import { fetchScenarios } from "@/services/api";
import { Scenario } from "@/types";
import { create } from "zustand";

interface ScenarioStore {
  scenarios: Scenario[];
  fetchScenarios: () => Promise<void>;
}

export const useScenarioStore = create<ScenarioStore>((set) => ({
  scenarios: [],

  fetchScenarios: async () => {
    try {
      const results = await fetchScenarios();
      set({ scenarios: results || [] });
    } catch (error) {
      console.error(error);
    }
  },
}));
