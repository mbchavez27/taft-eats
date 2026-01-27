import { useParams } from 'react-router'
import type { Route } from '../+types/restaurants/index'
import IndivEstablishment from '~/features/establishments/containers/establishment-details'
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
      <main>
        <section className="px-16 py-12">
          <EstablishmentDetails />
        </section>
      </main>
    </>
  )
}
