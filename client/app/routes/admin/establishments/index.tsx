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
import { Building, Loader2 } from 'lucide-react'
import type { Route } from './+types/admin/index'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Taft Eats: Admin - Establishments' },
    { name: 'description', content: 'Manage Establishments' },
  ]
}

export default function EstablishmentsPage() {
  const [establishmentsData, setEstablishmentsData] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setIsLoading(true)
        const response = await EstablishmentService.getAll({ limit: 50 })
        setEstablishmentsData(response.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load establishments')
      } finally {
        setIsLoading(false)
      }
    }
    fetchEstablishments()
  }, [])

  const handleEdit = (item: any) => {
    setEditingId(item.restaurant_id)
    setEditData({ ...item })
  }

  const handleSave = async () => {
    try {
      // Call the admin update API
      await EstablishmentService.updateAsAdmin(editingId as number, {
        name: editData.name,
        description: editData.description,
        price_range: editData.price_range,
        location: editData.location,
      })

      // Update UI state
      setEstablishmentsData((prev) =>
        prev.map((item) =>
          item.restaurant_id === editingId ? editData : item,
        ),
      )
      setEditingId(null)
      setEditData(null)
    } catch (err: any) {
      alert(err.message || 'Failed to update establishment')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this establishment?',
      )
    ) {
      try {
        await EstablishmentService.deleteAsAdmin(id)
        setEstablishmentsData((prev) =>
          prev.filter((item) => item.restaurant_id !== id),
        )
        if (editingId === id) {
          setEditingId(null)
          setEditData(null)
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete establishment')
      }
    }
  }

  const handleChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }))
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
                <Building className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead className="w-[40px] font-bold text-black text-center">
                #
              </TableHead>
              <TableHead className="font-bold text-black">NAME</TableHead>
              <TableHead className="font-bold text-black max-w-[400px]">
                DESCRIPTION
              </TableHead>
              <TableHead className="font-bold text-black text-center whitespace-nowrap">
                PRICE
              </TableHead>
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
              <TableRow key={item.restaurant_id} className="align-top group">
                <TableCell className="text-center py-4">
                  <div className="flex justify-center items-center h-full">
                    <Avatar size="sm">
                      <AvatarImage
                        src={item.banner_picture_url || ''}
                        alt={item.name}
                      />
                      <AvatarFallback>
                        {item.name ? item.name.charAt(0).toUpperCase() : 'E'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TableCell>

                <TableCell className="text-center py-4 font-medium text-slate-900">
                  {item.restaurant_id}
                </TableCell>

                <TableCell className="py-4 min-w-[160px]">
                  {editingId === item.restaurant_id ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="font-bold text-slate-900 leading-tight border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="font-bold text-slate-900 leading-tight">
                      {item.name}
                    </span>
                  )}
                </TableCell>

                <TableCell className="py-4 text-slate-600 text-sm leading-relaxed max-w-[400px] whitespace-normal break-words">
                  {editingId === item.restaurant_id ? (
                    <textarea
                      value={editData.description || ''}
                      onChange={(e) =>
                        handleChange('description', e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                      rows={3}
                    />
                  ) : (
                    item.description || (
                      <span className="text-slate-400 italic">
                        No description
                      </span>
                    )
                  )}
                </TableCell>

                <TableCell className="py-4 text-center min-w-[100px]">
                  {editingId === item.restaurant_id ? (
                    <select
                      value={editData.price_range}
                      onChange={(e) =>
                        handleChange('price_range', e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="$">$</option>
                      <option value="$$">$$</option>
                      <option value="$$$">$$$</option>
                    </select>
                  ) : (
                    <span className="text-slate-700 font-medium text-sm">
                      {item.price_range}
                    </span>
                  )}
                </TableCell>

                <TableCell className="py-4 text-slate-600 text-sm min-w-[150px]">
                  {editingId === item.restaurant_id ? (
                    <input
                      type="text"
                      value={editData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    item.location || 'N/A'
                  )}
                </TableCell>

                <TableCell className="py-4 text-center font-medium text-slate-900">
                  {item.rating || '0.0'}
                </TableCell>

                <TableCell className="py-4 text-center">
                  {editingId === item.restaurant_id ? (
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
                        onClick={() => handleDelete(item.restaurant_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {establishmentsData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-slate-500"
                >
                  No establishments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
