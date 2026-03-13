import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Route } from "./+types/admin/index";
import { users } from "~/features/admin/data/users";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Taft Eats: Admin" },
    { name: "description", content: "Taft Eats" },
  ];
}

export default function AdminPage() {
  const [usersData, setUsersData] = useState(users);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleSave = () => {
    setUsersData(prev =>
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
                
              </TableHead>
              <TableHead className="w-[40px] font-bold text-black text-center">
                #
              </TableHead>
              <TableHead className="font-bold text-black">NAME</TableHead>
              <TableHead className="font-bold text-black">EMAIL</TableHead>
              <TableHead className="font-bold text-black">BIO</TableHead>
              <TableHead className="font-bold text-black text-center">
                ROLE
              </TableHead>
              <TableHead className="font-bold text-black">BOOKMARKS</TableHead>
              <TableHead className="font-bold text-black text-center">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <Avatar size="sm">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                </TableCell>

                <TableCell className="text-center py-4 font-medium">
                  {user.id}
                </TableCell>

                <TableCell className="py-4 min-w-[150px]">
                  {editingId === user.id ? (
                    <div className="flex flex-col whitespace-normal break-words">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="font-bold text-slate-900 leading-tight border rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        value={editData.handle}
                        onChange={(e) => handleChange('handle', e.target.value)}
                        className="text-xs text-slate-500 border rounded px-2 py-1"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col whitespace-normal break-words">
                      <span className="font-bold text-slate-900 leading-tight">
                        {user.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {user.handle}
                      </span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-4 text-slate-600 break-all min-w-[180px]">
                  {editingId === user.id ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>

                <TableCell className="py-4 text-slate-600 text-sm leading-relaxed max-w-[300px] whitespace-normal break-words align-top">
                  {editingId === user.id ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      rows={3}
                    />
                  ) : (
                    user.bio
                  )}
                </TableCell>

                <TableCell className="py-4 text-center">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={editData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-20 border rounded px-2 py-1 text-center"
                    />
                  ) : (
                    <div className="flex justify-center items-center">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-none"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-4 text-sm min-w-[150px]">
                  {editingId === user.id ? (
                    <div className="flex flex-col whitespace-normal break-words">
                      <input
                        type="text"
                        value={editData.bookmarks || ''}
                        onChange={(e) => handleChange('bookmarks', e.target.value)}
                        className="text-slate-900 font-medium border rounded px-2 py-1"
                        placeholder="Bookmarks"
                      />
                      <input
                        type="text"
                        value={editData.bookmarkId || ''}
                        onChange={(e) => handleChange('bookmarkId', e.target.value)}
                        className="text-xs text-slate-400 italic border rounded px-2 py-1 mt-1"
                        placeholder="Bookmark ID"
                      />
                    </div>
                  ) : user.bookmarks ? (
                    <div className="flex flex-col whitespace-normal break-words">
                      <span className="text-slate-900 font-medium">
                        {user.bookmarks}
                      </span>
                      <span className="text-xs text-slate-400 italic">
                        {user.bookmarkId}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono text-xs">
                      NULL
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {editingId === user.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>Save</Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
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
