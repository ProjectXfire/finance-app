import { create } from 'zustand';

type FinanceSheetState = {
  isOpen: boolean;
  component: React.ReactNode;
  open: () => void;
  close: () => void;
  setComponent: (component: React.ReactNode) => void;
};

export const useFinanceSheet = create<FinanceSheetState>((set) => ({
  isOpen: false,
  component: <></>,
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
  setComponent: (component) => set({ component }),
}));
