import FilterMenu from '~/features/filter-menu/containers/filter-menu'
import type { Route } from './+types/restaurant-view'
import Establishments from '~/features/establishments/containers/establishments'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Taft Eats' }, { name: 'description', content: 'Taft Eats' }]
}

export default function RestaurantView() {
  return (
    <>
      <main className="flex items-start">
        <div className="py-12 px-12 hidden lg:flex">
          <FilterMenu />
        </div>
        <div className="py-16 px-10">
          <Establishments />
        </div>
      </main>
    </>
  )
}
