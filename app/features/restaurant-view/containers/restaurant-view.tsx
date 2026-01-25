import FilterMenu from '~/features/filter-menu/containers/filter-menu'

export default function RestaurantView() {
  return (
    <>
      <main>
        <div className="py-12 px-16 hidden lg:flex">
          <FilterMenu />
        </div>
      </main>
    </>
  )
}
