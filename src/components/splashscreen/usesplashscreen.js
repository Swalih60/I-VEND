// hooks/useSplashScreen.js
import { create } from 'zustand';

const useSplashScreen = create((set) => ({
  isVisible: false,
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
  toggle: () => set((state) => ({ isVisible: !state.isVisible })),
}));


export default useSplashScreen;