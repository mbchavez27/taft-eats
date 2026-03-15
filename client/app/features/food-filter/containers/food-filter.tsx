import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'
import FoodCard from '../components/food-card'
import { food_filters } from '../data/food'
import { useFilterStore } from '~/features/filter-menu/store/filter.store'

export default function FoodFilter() {
  const { selectedFoods, toggleFood } = useFilterStore()

  return (
    <>
      <main className="flex flex-col gap-3">
        <header>
          <h1 className="font-climate text-xl md:text-4xl text-black">FOODS</h1>
        </header>

        <section>
          <Carousel
            opts={{
              align: 'start',
            }}
          >
            <CarouselContent className="flex gap-4">
              {food_filters.map((food_filter) => {
                const isSelected = selectedFoods.includes(food_filter.name)
                return (
                  <CarouselItem
                    key={food_filter.id}
                    className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-fit basis-auto"
                    onClick={() => toggleFood(food_filter.name)}
                  >
                    <FoodCard
                      img={food_filter.img}
                      food={food_filter.name}
                      isSelected={isSelected}
                    />
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            <CarouselPrevious className="translate-x-8 bg-[#FFBF00] outline-none border-none drop-shadow-2xl" />
            <CarouselNext className="-translate-x-8 bg-[#FFBF00] outline-none border-none drop-shadow-2x" />
          </Carousel>
        </section>
      </main>
    </>
  )
}