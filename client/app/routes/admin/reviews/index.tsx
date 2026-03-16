import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { User } from 'lucide-react'
import type { Route } from './+types/admin/index'
import { reviews } from '~/features/admin/data/reviews'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Taft Eats: Admin - Reviews' },
    { name: 'description', content: 'Manage Reviews' },
  ]
}

export default function ReviewsPage() {
  const [reviewsData, setReviewsData] = useState(reviews)
  const [hiddenIds, setHiddenIds] = useState<number[]>([])

  const handleHideToggle = (id: number) => {
    setHiddenIds((prev) =>
      prev.includes(id) ? prev.filter((hid) => hid !== id) : [...prev, id],
    )
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviewsData((prev) => prev.filter((item) => item.id !== id))
      setHiddenIds((prev) => prev.filter((hid) => hid !== id))
    }
  }

  return (
    <div className="p-8 w-full">
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <User className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead className="w-[40px] font-bold text-black text-center">
                #
              </TableHead>
              <TableHead className="font-bold text-black max-w-[300px]">
                BODY
              </TableHead>
              <TableHead className="font-bold text-black text-center">
                RATING
              </TableHead>
              <TableHead className="font-bold text-black">USER #</TableHead>
              <TableHead className="font-bold text-black">
                RESTAURANT #
              </TableHead>
              <TableHead className="font-bold text-black">OWNER #</TableHead>
              <TableHead className="font-bold text-black">RESPONSE</TableHead>
              <TableHead className="font-bold text-black text-center">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviewsData.map((review) => {
              const isHidden = hiddenIds.includes(review.id)

              return (
                <TableRow
                  key={review.id}
                  className={isHidden ? 'align-top opacity-50' : 'align-top'}
                >
                  <TableCell className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <Avatar size="sm">
                        <AvatarImage src="" alt={review.userId} />
                        <AvatarFallback>
                          {review.userId.slice(-1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-4 font-medium">
                    {review.id}
                  </TableCell>

                  <TableCell className="py-4 text-slate-600 text-sm leading-relaxed max-w-[350px] whitespace-normal break-words">
                    {review.body}
                  </TableCell>

                  <TableCell className="py-4 text-center font-medium text-slate-900">
                    {review.rating}
                  </TableCell>

                  <TableCell className="py-4 text-slate-600 font-medium text-sm">
                    {review.userId}
                  </TableCell>

                  <TableCell className="py-4 min-w-[150px]">
                    <div className="flex flex-col whitespace-normal break-words">
                      <span className="text-slate-900 font-medium text-sm">
                        {review.restaurant}
                      </span>
                      <span className="text-xs text-slate-400 italic">
                        {review.restaurantId}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-sm">
                    {review.ownerId ? (
                      <span className="text-slate-900">{review.ownerId}</span>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">
                        NULL
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-sm">
                    {review.response ? (
                      <span className="text-slate-900">{review.response}</span>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">
                        NULL
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleHideToggle(review.id)}
                      >
                        {isHidden ? 'Unhide' : 'Hide'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
