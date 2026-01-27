import FilterMenu from '~/features/filter-menu/containers/filter-menu'
import type { Route } from './+types/restaurant-view'
import Establishments from '~/features/establishments/containers/establishments'
import FoodFilter from '~/features/food-filter/containers/food-filter'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Taft Eats' }, { name: 'description', content: 'Taft Eats' }]
}

export default function RestaurantView() {
  return (
    <main className="flex flex-col lg:flex-row py-12 px-10 gap-8">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <FilterMenu />
      </div>

      {/* Main content */}
      <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
        <FoodFilter />
        <Establishments />
      </div>
    </main>
  )
}
