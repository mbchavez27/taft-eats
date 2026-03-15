import FilterMenu from '~/features/filter-menu/containers/filter-menu'
import type { Route } from '../+types/bookmarks/index'
import EstablishmentsLists from '~/features/establishments/containers/establishments-lists'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Taft Eats' }, { name: 'description', content: 'Taft Eats' }]
}

export default function Home() {
  return (
    <main className="flex flex-col lg:flex-row py-12 px-10 gap-8">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <FilterMenu />
      </div>

      {/* Main content */}
      <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
        <EstablishmentsLists />
      </div>
    </main>
  )
}
