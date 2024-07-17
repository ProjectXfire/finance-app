import { create } from 'zustand';

type AccountSheetState = {
  isOpen: boolean;
  component: React.ReactNode;
  open: () => void;
  close: () => void;
  setComponent: (component: React.ReactNode) => void;
};

export const useAccountSheet = create<AccountSheetState>((set) => ({
  isOpen: false,
  component: <></>,
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
  setComponent: (component) => set({ component }),
}));
