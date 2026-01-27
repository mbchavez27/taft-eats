import { useParams } from 'react-router'
import type { Route } from '../+types/restaurants/index'
import FilterMenu from '~/features/filter-menu/containers/filter-menu'
import EstablishmentContent from '~/features/establishments/containers/establishment-content'
import EstablishmentDetails from '~/features/establishments/containers/establishment-details'

export function meta({ params }: Route.MetaArgs) {
  const restaurant_id = params.restaurant
  return [
    { title: 'Taft Eats - ' + restaurant_id },
    { name: 'description', content: 'Taft Eats' },
  ]
}

export default function Restaurant() {
  const { restaurant } = useParams()

  return (
    <>
      <main className="flex flex-col lg:flex-row py-12 px-10 gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-1/4">
          <EstablishmentDetails />
        </div>

        {/* Main content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
          <EstablishmentContent />
        </div>
      </main>
    </>
  )
}
