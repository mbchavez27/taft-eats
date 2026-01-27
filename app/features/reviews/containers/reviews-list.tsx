import { ScrollArea } from '~/components/ui/scroll-area'
import SingleReview from '../components/organisms/single-review'

export default function ReviewsList() {
  return (
    <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          <SingleReview />
          <SingleReview />
          <SingleReview />
          <SingleReview />
          <SingleReview />
          <SingleReview />
          <SingleReview />
          <SingleReview />
        </div>
      </ScrollArea>
    </main>
  )
}
