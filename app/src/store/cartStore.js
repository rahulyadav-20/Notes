import { create } from 'zustand'
// Phase 3 — course purchase cart
export const useCartStore = create((set) => ({
  items: [],
  addItem:    (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id)   => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
  clear:      ()     => set({ items: [] }),
}))
