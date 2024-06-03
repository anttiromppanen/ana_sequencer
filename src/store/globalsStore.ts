import { create } from "zustand";
import { StepValuesType } from "../types/types";

type GlobalsStore = {
  stepAmount: StepValuesType;
  setStepAmount: (value: StepValuesType) => void;
};

const useGlobalsStore = create<GlobalsStore>((set) => ({
  stepAmount: 16,
  setStepAmount: (value) => set({ stepAmount: value }),
}));

export default useGlobalsStore;
