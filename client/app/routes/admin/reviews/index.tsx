import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { User } from "lucide-react";
import type { Route } from "./+types/admin/index";
import { reviews } from "~/features/admin/data/reviews";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Taft Eats: Admin - Reviews" },
    { name: "description", content: "Manage Reviews" },
  ];
}

export default function ReviewsPage() {
  const [reviewsData, setReviewsData] = useState(reviews);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleSave = () => {
    setReviewsData(prev =>
      prev.map(item => item.id === editingId ? editData : item)
    );
    setEditingId(null);
    setEditData(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

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
            {reviewsData.map((review) => (
              <TableRow key={review.id} className="align-top">
                <TableCell className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <Avatar size="sm">
                      <AvatarImage src="" alt={review.userId} />
                      <AvatarFallback>{review.userId.slice(-1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                </TableCell>

                <TableCell className="text-center py-4 font-medium">
                  {review.id}
                </TableCell>

                <TableCell className="py-4 text-slate-600 text-sm leading-relaxed max-w-[350px] whitespace-normal break-words">
                  {editingId === review.id ? (
                    <textarea
                      value={editData.body}
                      onChange={(e) => handleChange('body', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      rows={3}
                    />
                  ) : (
                    review.body
                  )}
                </TableCell>

                <TableCell className="py-4 text-center font-medium text-slate-900">
                  {editingId === review.id ? (
                    <input
                      type="number"
                      value={editData.rating}
                      onChange={(e) => handleChange('rating', e.target.value)}
                      className="w-16 border rounded px-2 py-1 text-center"
                    />
                  ) : (
                    review.rating
                  )}
                </TableCell>

                <TableCell className="py-4 text-slate-600 font-medium text-sm">
                  {editingId === review.id ? (
                    <input
                      type="number"
                      value={editData.userId}
                      onChange={(e) => handleChange('userId', e.target.value)}
                      className="w-16 border rounded px-2 py-1"
                    />
                  ) : (
                    review.userId
                  )}
                </TableCell>

                <TableCell className="py-4 min-w-[150px]">
                  {editingId === review.id ? (
                    <div className="flex flex-col whitespace-normal break-words">
                      <input
                        type="text"
                        value={editData.restaurant}
                        onChange={(e) => handleChange('restaurant', e.target.value)}
                        className="text-slate-900 font-medium text-sm border rounded px-2 py-1"
                      />
                      <input
                        type="number"
                        value={editData.restaurantId}
                        onChange={(e) => handleChange('restaurantId', e.target.value)}
                        className="text-xs text-slate-400 italic border rounded px-2 py-1 mt-1"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col whitespace-normal break-words">
                      <span className="text-slate-900 font-medium text-sm">
                        {review.restaurant}
                      </span>
                      <span className="text-xs text-slate-400 italic">
                        {review.restaurantId}
                      </span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-4 text-sm">
                  {editingId === review.id ? (
                    <input
                      type="number"
                      value={editData.ownerId || ''}
                      onChange={(e) => handleChange('ownerId', e.target.value)}
                      className="w-16 border rounded px-2 py-1"
                      placeholder="NULL"
                    />
                  ) : review.ownerId ? (
                    <span className="text-slate-900">{review.ownerId}</span>
                  ) : (
                    <span className="text-slate-400 font-mono text-xs">
                      NULL
                    </span>
                  )}
                </TableCell>

                <TableCell className="py-4 text-sm">
                  {editingId === review.id ? (
                    <textarea
                      value={editData.response || ''}
                      onChange={(e) => handleChange('response', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      rows={2}
                      placeholder="NULL"
                    />
                  ) : review.response ? (
                    <span className="text-slate-900">{review.response}</span>
                  ) : (
                    <span className="text-slate-400 font-mono text-xs">
                      NULL
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {editingId === review.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>Save</Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleEdit(review)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
