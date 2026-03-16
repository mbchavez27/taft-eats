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
import { User, Loader2, Shield, Store } from 'lucide-react'
import type { Route } from './+types/admin/index'
import { UserService } from '~/features/users/services/user.services'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Taft Eats: Admin - Users' },
    { name: 'description', content: 'Manage Users' },
  ]
}

export default function UsersPage() {
  const [usersData, setUsersData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await UserService.getAllUsers({ limit: 50 })
        setUsersData(response.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load users')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this user? This may delete their associated reviews and establishments.',
      )
    ) {
      try {
        await UserService.deleteUserAsAdmin(id)
        setUsersData((prev) => prev.filter((user) => user.user_id !== id))
      } catch (err: any) {
        alert(err.message || 'Failed to delete user')
      }
    }
  }

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <Shield className="h-4 w-4 text-purple-500" />
    if (role === 'owner') return <Store className="h-4 w-4 text-blue-500" />
    return <User className="h-4 w-4 text-slate-500" />
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
              <TableHead className="font-bold text-black">
                NAME & USERNAME
              </TableHead>
              <TableHead className="font-bold text-black">EMAIL</TableHead>
              <TableHead className="font-bold text-black text-center">
                ROLE
              </TableHead>
              <TableHead className="font-bold text-black text-center">
                JOINED
              </TableHead>
              <TableHead className="font-bold text-black text-center">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData.map((user) => (
              <TableRow key={user.user_id} className="align-middle">
                <TableCell className="text-center py-4">
                  <div className="flex justify-center items-center h-full">
                    <Avatar size="sm">
                      <AvatarImage
                        src={user.profile_picture_url || ''}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TableCell>

                <TableCell className="text-center py-4 font-medium text-slate-900">
                  {user.user_id}
                </TableCell>

                <TableCell className="py-4 min-w-[200px]">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      @{user.username || 'unknown'}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-slate-600 text-sm">
                  {user.email}
                </TableCell>

                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {getRoleIcon(user.role)}
                    <span className="capitalize text-sm font-medium text-slate-700">
                      {user.role}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-center text-slate-500 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell className="py-4 text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.user_id)}
                    disabled={user.role === 'admin'} // Prevent deleting other admins
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {usersData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-slate-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
