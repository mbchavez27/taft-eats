import EstablishmentsCard from '../components/organisms/establishment-card'
import { ScrollArea } from '~/components/ui/scroll-area'

export default function Establishments() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="font-climate text-2xl md:text-4xl text-white">
            ESTABLISHMENTS
          </h1>
        </header>
        <ScrollArea className="h-175">
          <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-12 lg:gap-8 justify-items-start ">
            <EstablishmentsCard name="La Tocaaaaaaaaaaaaaaa" rating={3} />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
            <EstablishmentsCard name="La Toca" />
          </main>
        </ScrollArea>
      </div>
    </>
  )
}
