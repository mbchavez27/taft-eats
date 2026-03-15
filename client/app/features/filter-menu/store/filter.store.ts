import { create } from 'zustand'

interface FilterState {
  selectedCuisines: string[]
  selectedTags: string[]
  selectedPriceRanges: string[]
  selectedFoods: string[]
  rating: number

  toggleCuisine: (cuisine: string) => void
  toggleTag: (tag: string) => void
  togglePriceRange: (priceRange: string) => void
  toggleFood: (food: string) => void
  setRating: (rating: number) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedCuisines: [],
  selectedTags: [],
  selectedPriceRanges: [],
  selectedFoods: [],
  rating: 0,

  toggleCuisine: (cuisine) =>
    set((state) => ({
      selectedCuisines: state.selectedCuisines.includes(cuisine)
        ? state.selectedCuisines.filter((c) => c !== cuisine)
        : [...state.selectedCuisines, cuisine],
    })),

  toggleTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),

  togglePriceRange: (priceRange) =>
    set((state) => ({
      selectedPriceRanges: state.selectedPriceRanges.includes(priceRange)
        ? state.selectedPriceRanges.filter((p) => p !== priceRange)
        : [...state.selectedPriceRanges, priceRange],
    })),

    toggleFood: (food) =>
      set((state) => ({
        selectedFoods: state.selectedFoods.includes(food) ? [] : [food],
      })),

  setRating: (rating) => set({ rating }),

  clearFilters: () =>
    set({
      selectedCuisines: [],
      selectedTags: [],
      selectedPriceRanges: [],
      selectedFoods: [],
      rating: 0,
    }),
}))