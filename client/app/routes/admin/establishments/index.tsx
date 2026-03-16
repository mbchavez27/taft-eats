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
import { Building } from 'lucide-react'
import type { Route } from './+types/admin/index'
import { establishments } from '~/features/admin/data/establishments'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Taft Eats: Admin - Establishments' },
    { name: 'description', content: 'Manage Establishments' },
  ]
}

export default function EstablishmentsPage() {
  const [establishmentsData, setEstablishmentsData] = useState(establishments)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<any>(null)

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setEditData({ ...item })
  }

  const handleSave = () => {
    setEstablishmentsData((prev) =>
      prev.map((item) => (item.id === editingId ? editData : item)),
    )
    setEditingId(null)
    setEditData(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this establishment?')) {
      setEstablishmentsData((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setEditData(null)
      }
    }
  }

  const handleChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-8 w-full">
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Building className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead className="w-[40px] font-bold text-black text-center">
                #
              </TableHead>
              <TableHead className="font-bold text-black">NAME</TableHead>
              <TableHead className="font-bold text-black max-w-[400px]">
                DESCRIPTION
              </TableHead>
              <TableHead className="font-bold text-black text-right whitespace-nowrap">
                PRICE RANGE
              </TableHead>
              <TableHead className="font-bold text-black">TAGS</TableHead>
              <TableHead className="font-bold text-black">LOCATION</TableHead>
              <TableHead className="font-bold text-black text-center">
                RATING
              </TableHead>
              <TableHead className="font-bold text-black text-center">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {establishmentsData.map((item) => (
              <TableRow key={item.id} className="align-top group">
                <TableCell className="text-center py-4">
                  <div className="flex justify-center items-center h-full">
                    <Avatar size="sm">
                      <AvatarImage src="" alt={item.name} />
                      <AvatarFallback>
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TableCell>

                <TableCell className="text-center py-4 font-medium text-slate-900">
                  {item.id}
                </TableCell>

                <TableCell className="py-4 min-w-[160px]">
                  {editingId === item.id ? (
                    <div className="flex flex-col">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="font-bold text-slate-900 leading-tight border rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        value={editData.cuisine}
                        onChange={(e) =>
                          handleChange('cuisine', e.target.value)
                        }
                        className="text-xs text-slate-500 mt-0.5 border rounded px-2 py-1"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 leading-tight">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5">
                        {item.cuisine}
                      </span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-4 text-slate-600 text-sm leading-relaxed max-w-[400px] whitespace-normal break-words">
                  {editingId === item.id ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        handleChange('description', e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                      rows={3}
                    />
                  ) : (
                    item.description
                  )}
                </TableCell>

                <TableCell className="py-4 text-right min-w-[120px]">
                  {editingId === item.id ? (
                    <div className="flex flex-col items-end">
                      <input
                        type="text"
                        value={editData.priceRange}
                        onChange={(e) =>
                          handleChange('priceRange', e.target.value)
                        }
                        className="text-slate-700 font-medium text-sm border rounded px-2 py-1 text-right"
                      />
                      <input
                        type="text"
                        value={editData.priceSymbol}
                        onChange={(e) =>
                          handleChange('priceSymbol', e.target.value)
                        }
                        className="text-xs text-slate-400 font-bold tracking-widest mt-0.5 border rounded px-2 py-1 text-right"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-slate-700 font-medium text-sm">
                        {item.priceRange}
                      </span>
                      <span className="text-xs text-slate-400 font-bold tracking-widest mt-0.5">
                        {item.priceSymbol}
                      </span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-4 min-w-[140px]">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <span className="text-slate-600 text-sm">{item.tags}</span>
                  )}
                </TableCell>

                <TableCell className="py-4 text-slate-500 text-xs font-mono max-w-[150px] break-all">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    item.location
                  )}
                </TableCell>

                <TableCell className="py-4 text-center font-medium text-slate-900">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      value={editData.rating}
                      onChange={(e) => handleChange('rating', e.target.value)}
                      className="w-16 border rounded px-2 py-1 text-center"
                    />
                  ) : (
                    item.rating
                  )}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {editingId === item.id ? (
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" onClick={handleSave}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
