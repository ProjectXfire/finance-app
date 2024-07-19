import { create } from 'zustand';

type CustomDialogState = {
  isOpen: boolean;
  component: React.ReactNode;
  open: () => void;
  close: () => void;
  setComponent: (component: React.ReactNode) => void;
};

export const useCustomDialog = create<CustomDialogState>((set) => ({
  isOpen: false,
  component: <></>,
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
  setComponent: (component) => set({ component }),
}));
