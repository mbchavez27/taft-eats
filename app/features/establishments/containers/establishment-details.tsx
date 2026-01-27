import ImageContainer from '~/features/shared/container/image-container'
import EstablishmentDesription from '../components/organisms/establishment-description'
import EstablishmentTags from '../components/organisms/establishment-tags'

export default function EstablishmentDetails() {
  return (
    <>
      <main className="w-xs font-lexend text-[#BFD392] py-2 px-4 flex flex-col gap-5">
        <ImageContainer />
        <EstablishmentDesription />
        <EstablishmentTags />
      </main>
    </>
  )
}
