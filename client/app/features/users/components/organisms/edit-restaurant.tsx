import { useState, useEffect } from 'react' // Import useEffect
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useUpdateRestaurant } from '~/features/establishments/hook/useUpdateRestaurant'
import { useQueryClient } from '@tanstack/react-query'

export default function EditRestaurantDialog({
  restaurantId,
  currentName,
  currentBio,
}: {
  restaurantId: number
  currentName: string
  currentBio: string
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(currentName)
  const [description, setDescription] = useState(currentBio)
  const { updateRestaurant, isLoading } = useUpdateRestaurant()
  const queryClient = useQueryClient()

  // Sync state when props change (in case the parent refetches)
  useEffect(() => {
    setName(currentName)
    setDescription(currentBio)
  }, [currentName, currentBio])

  const handleSave = async () => {
    if (isNaN(restaurantId)) return

    const res = await updateRestaurant(restaurantId, { name, description })
    if (res.success) {
      window.location.reload()
      await queryClient.invalidateQueries({ queryKey: ['ownerRestaurant'] })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 text-black border border-black rounded-2xl hover:opacity-50 transition duration-100 font-inter font-semibold">
          Edit Restaurant Details
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-xl p-5 sm:py-8 sm:px-10 flex flex-col gap-6 font-lexend font-bold text-[#326F33] max-w-lg border-2 border-[#326F33]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Edit Details</DialogTitle>
        </DialogHeader>

        <section className="flex flex-col gap-5 flex-1">
          <label className="text-xl">Restaurant Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-black text-md border-2 border-black outline-none focus:outline-none rounded-lg p-3 w-full font-inter font-normal"
            placeholder="Restaurant Name..."
          />

          <label className="text-xl">Bio / Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-black text-md border-2 border-black outline-none focus:outline-none rounded-lg p-3 w-full h-32 resize-none font-inter font-normal"
            placeholder="Tell us about your restaurant..."
          />
        </section>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-[#326F33] text-white font-lexend font-bold text-xl py-3 rounded-xl hover:bg-[#2a5d2b] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </DialogContent>
    </Dialog>
  )
}
