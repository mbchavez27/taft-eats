import { create } from 'zustand'

interface MapState {
  selectedLocation: [number, number] | null
  selectedLandmarkName: string | null
  setSelectedLocation: (
    coords: [number, number] | null,
    name: string | null,
  ) => void
  clearLocation: () => void
}

export const useMapStore = create<MapState>((set) => ({
  selectedLocation: null,
  selectedLandmarkName: null,
  setSelectedLocation: (coords, name) =>
    set({ selectedLocation: coords, selectedLandmarkName: name }),
  clearLocation: () =>
    set({ selectedLocation: null, selectedLandmarkName: null }),
}))
