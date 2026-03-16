import { useState, useEffect } from 'react'
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
import { User, Loader2 } from 'lucide-react'
import type { Route } from './+types/admin/index'

import { ReviewService } from '~/features/reviews/services/reviews.services'
import type { ReviewDto } from '~/features/reviews/types/reviews.types'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Taft Eats: Admin - Reviews' },
    { name: 'description', content: 'Manage Reviews' },
  ]
}

export default function ReviewsPage() {
  const [reviewsData, setReviewsData] = useState<ReviewDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real data when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        const response = await ReviewService.getAll({ limit: 50 })
        setReviewsData(response.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        // Delete from the database using your admin route
        await ReviewService.deleteAsAdmin(id)

        // Remove from UI state
        setReviewsData((prev) => prev.filter((item) => item.review_id !== id))
      } catch (err: any) {
        alert(err.message || 'Failed to delete review')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-red-500 font-medium">Error: {error}</div>
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
              return (
                <TableRow key={review.review_id} className="align-top">
                  <TableCell className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <Avatar size="sm">
                        <AvatarImage
                          src={review.profile_picture_url || ''}
                          alt={review.username}
                        />
                        <AvatarFallback>
                          {review.username
                            ? review.username.slice(0, 2).toUpperCase()
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-4 font-medium">
                    {review.review_id}
                  </TableCell>

                  <TableCell className="py-4 text-slate-600 text-sm leading-relaxed max-w-[350px] whitespace-normal break-words">
                    {review.body}
                  </TableCell>

                  <TableCell className="py-4 text-center font-medium text-slate-900">
                    {review.rating}
                  </TableCell>

                  <TableCell className="py-4 text-slate-600 font-medium text-sm">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{review.username}</span>
                      <span className="text-xs text-slate-400 italic">
                        ID: {review.user_id}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 min-w-[150px]">
                    <div className="flex flex-col whitespace-normal break-words">
                      <span className="text-slate-900 font-medium text-sm">
                        {review.restaurant_name || 'Unknown'}
                      </span>
                      <span className="text-xs text-slate-400 italic">
                        ID: {review.restaurant_id}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-sm">
                    {review.owner_id ? (
                      <span className="text-slate-900">{review.owner_id}</span>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">
                        NULL
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-sm max-w-[200px] truncate">
                    {review.reply_body ? (
                      <span
                        className="text-slate-900"
                        title={review.reply_body}
                      >
                        {review.reply_body}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">
                        NULL
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(review.review_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {reviewsData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-slate-500"
                >
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
