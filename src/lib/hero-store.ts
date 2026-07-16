import { create } from 'zustand';

interface HeroState {
  hoveringShopNow: boolean;
  hoveringCatalogue: boolean;
  clickBurstTrigger: number;
  setHoveringShopNow: (hovering: boolean) => void;
  setHoveringCatalogue: (hovering: boolean) => void;
  triggerClickBurst: () => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  hoveringShopNow: false,
  hoveringCatalogue: false,
  clickBurstTrigger: 0,
  setHoveringShopNow: (hovering) => set({ hoveringShopNow: hovering }),
  setHoveringCatalogue: (hovering) => set({ hoveringCatalogue: hovering }),
  triggerClickBurst: () => set((state) => ({ clickBurstTrigger: state.clickBurstTrigger + 1 })),
}));
