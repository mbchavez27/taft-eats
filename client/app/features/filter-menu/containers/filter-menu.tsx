import { useQuery } from '@tanstack/react-query'
import PriceRange from '../components/organisms/price-range'
import SelectCuisines from '../components/organisms/select-cusines'
import SelectTags from '../components/organisms/select-tags'
import StarRating from '../components/organisms/star-rating'
import { FilterService } from '../services/filters.services'

export default function FilterMenu() {
  // Fetch cuisines
  const { data: cuisines = [], isLoading: isLoadingCuisines } = useQuery({
    queryKey: ['tags', 'cuisine'],
    queryFn: () => FilterService.getTagsByCategory('cuisine'),
    staleTime: 1000 * 60 * 5,
  })

  // Fetch tags
  const { data: tags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags', 'tag'],
    queryFn: () => FilterService.getTagsByCategory('tag'),
    staleTime: 1000 * 60 * 5,
  })

  const isLoading = isLoadingCuisines || isLoadingTags

  return (
    <main className="bg-[#FFFF] border-10 rounded-xl border-[#416CAE] w-xs font-lexend text-[#326F33] py-2 flex flex-col gap-3 relative">
      {/* Simple loading overlay - customize as needed */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-xl">
          <span className="text-[#416CAE] font-bold">Loading filters...</span>
        </div>
      )}

      <SelectCuisines cuisines={cuisines} />
      <hr className="border border-gray" />
      <StarRating />
      <hr className="border border-gray" />
      <PriceRange />
      <hr className="border border-gray" />
      <SelectTags tags={tags} />
    </main>
  )
}
