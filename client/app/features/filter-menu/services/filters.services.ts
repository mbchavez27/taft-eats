const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface BackendTag {
  tag_id: number
  name: string
  category: 'tag' | 'cuisine' | 'food'
}

export const FilterService = {
  getTagsByCategory: async (
    category: 'tag' | 'cuisine' | 'food',
  ): Promise<BackendTag[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/establishments/tags?category=${category}`,
      )

      if (!response.ok) {
        throw new Error(`Error fetching ${category} tags`)
      }

      const result = await response.json()
      return result.data // Assumes your backend returns { success: true, data: [...] }
    } catch (error) {
      console.error(`FilterService: Failed to fetch ${category}s`, error)
      return []
    }
  },
}
