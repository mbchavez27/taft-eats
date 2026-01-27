import EstablishmentsCard from '../components/organisms/establishment-card'
import { ScrollArea } from '~/components/ui/scroll-area'

export default function Establishments() {
  return (
    <>
      <main className="flex flex-col gap-5">
        <header>
          <h1 className="font-climate text-xl md:text-4xl text-white">
            ESTABLISHMENTS
          </h1>
        </header>
        <ScrollArea className="h-120">
          <section className="flex flex-wrap gap-6 md:gap-12 lg:gap-9 justify-start">
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
          </section>
        </ScrollArea>
      </main>
    </>
  )
}
