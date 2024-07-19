import { create } from 'zustand';

type CustomDialogState = {
  isOpen: boolean;
  component: React.ReactNode;
  isLoading: boolean;
  open: () => void;
  close: () => void;
  startLoading: () => void;
  endLoading: () => void;
  setComponent: (component: React.ReactNode) => void;
};

export const useCustomDialog = create<CustomDialogState>((set) => ({
  isOpen: false,
  component: <></>,
  isLoading: false,
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
  setComponent: (component) => set({ component }),
  startLoading: () => set({ isLoading: true }),
  endLoading: () => set({ isLoading: false }),
}));
