import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Checkbox } from '~/components/ui/checkbox'
import { useDeleteRestaurant } from '~/features/establishments/hook/useDeleteRestaurant'

interface DeleteConsentProps {
  restaurantId?: number
}

export default function DeleteConsent({ restaurantId }: DeleteConsentProps) {
  const [isChecked, setIsChecked] = useState(false)

  // Bring in the mutation hook
  const { mutate: deleteRestaurant, isPending } = useDeleteRestaurant()

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="px-4 py-2 text-white bg-[#326F33] border-[#326F33] border rounded-2xl hover:opacity-50 duration-100 transition">
            Delete Establishment
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white rounded-xl text-[#326F33] font-lexend font-bold p-8 flex flex-col gap-8">
          <section className="flex flex-col gap-8 justify-center items-center">
            <img
              src="/logos/tafteats_logo.png"
              alt="Delete establishment warning"
              className="w-[180px] h-[180px] object-cover rounded-lg"
            />
            <div className="flex flex-col gap-6 font-lexend font-semibold text-xl text-center text-black">
              <p>
                Are you absolutely sure you want to delete your establishment?
              </p>
              <p>
                This action will permanently delete your establishment and all
                related data.
              </p>
              <p>This process cannot be undone.</p>
              <p>
                Taft Eats is not liable for any data loss resulting from this
                action.
              </p>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <Checkbox
                id="understand"
                name="understand"
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                className="
                  border-2 border-[#9CB16F]
                  data-[state=unchecked]:bg-white
                  data-[state=unchecked]:border-[#9CB16F]
                  data-[state=checked]:bg-[#9CB16F]
                  data-[state=checked]:border-[#9CB16F]
                "
              />
              <label htmlFor="understand" className="text-[#9CB16F]">
                Yes, I understand the consequences and confirm <br />
                that I want to permanently delete this establishment.
              </label>
            </div>
            <button
              onClick={() => {
                if (restaurantId) deleteRestaurant(restaurantId)
              }}
              // Safely disable if there is no ID, if not checked, or if currently deleting
              disabled={!isChecked || isPending || !restaurantId}
              className="px-4 py-2 text-white bg-[#326F33] border-[#326F33] border rounded-2xl hover:opacity-50 duration-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Deleting...' : 'Delete Establishment'}
            </button>
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}
