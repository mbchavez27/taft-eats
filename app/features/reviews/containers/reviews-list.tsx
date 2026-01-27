import { ScrollArea } from '~/components/ui/scroll-area'
import SingleReview from '../components/organisms/single-review'

export default function ReviewsList() {
  return (
    <>
      <ScrollArea className="w-full ">
        <main className="bg-white rounded-lg h-full w-full p-6 flex flex-col gap-4">
          <SingleReview />
        </main>
      </ScrollArea>
    </>
  )
}
