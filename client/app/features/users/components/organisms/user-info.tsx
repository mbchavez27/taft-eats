import { useState, useEffect } from 'react'
import { MdEdit } from 'react-icons/md'
import { useAuthStore } from '~/features/auth/context/auth.store'
import { useUpdateProfile } from '../../hooks/useUpdateProfile' // Adjust path as needed

export default function UserInfo() {
  const user = useAuthStore((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)

  const { updateProfile, isLoading, error, checkUsername, usernameStatus } =
    useUpdateProfile()

  // Local state for the form inputs
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  })

  // Keep local state in sync with global user state when not editing
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
      })
    }
  }, [user, isEditing])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Trigger the debounce check specifically for the username field
    if (name === 'username') {
      checkUsername(value, user?.username)
    }
  }

  const handleSave = async () => {
    const result = await updateProfile(formData)

    if (result.success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    // Revert form data and exit edit mode
    setFormData({
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    })
    setIsEditing(false)
    checkUsername('', '') // Reset the checking status
  }

  return (
    <main className="bg-white rounded-xl w-full px-8 py-5 font-lexend text-black flex flex-col gap-4 justify-center items-center">
      {/* Display API Error if there is one */}
      {error && (
        <p className="text-red-500 font-bold w-full max-w-sm text-center">
          {error}
        </p>
      )}

      {/* Name Input */}
      <section className="flex flex-col gap-1 w-full max-w-sm">
        <label htmlFor="name" className="text-lg">
          Name
        </label>
        <div className="relative w-full">
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full border-2 border-black rounded-lg px-2 py-1 pr-8 focus:outline-none ${!isEditing && 'bg-gray-100 cursor-default'}`}
          />
          {!isEditing && (
            <MdEdit
              onClick={() => setIsEditing(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
            />
          )}
        </div>
      </section>

      {/* Email Input (Always Read-Only) */}
      <section className="flex flex-col gap-1 w-full max-w-sm">
        <label htmlFor="email" className="text-lg">
          Email
        </label>
        <div className="relative w-full">
          <input
            type="text"
            readOnly={true}
            value={user?.email || ''}
            className="w-full border-2 border-black rounded-lg px-2 py-1 pr-8 focus:outline-none bg-gray-100 cursor-default text-gray-500"
          />
        </div>
      </section>

      {/* Username Input */}
      <section className="flex flex-col gap-1 w-full max-w-sm">
        <label htmlFor="username" className="text-lg">
          User Name
        </label>
        <div className="relative w-full">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`
              w-full border-2 border-black rounded-lg px-2 py-1 pr-8 focus:outline-none transition-colors
              ${!isEditing && 'bg-gray-100 cursor-default'}
              ${usernameStatus === 'taken' ? 'border-red-500 focus:ring-1 focus:ring-red-500' : ''}
              ${usernameStatus === 'available' ? 'border-green-500 focus:ring-1 focus:ring-green-500' : ''}
            `}
          />
          {!isEditing && (
            <MdEdit
              onClick={() => setIsEditing(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
            />
          )}
        </div>
        {/* Validation Messages */}
        {isEditing && usernameStatus === 'checking' && (
          <span className="text-sm text-gray-500">
            Checking availability...
          </span>
        )}
        {isEditing && usernameStatus === 'taken' && (
          <span className="text-sm text-red-500 font-bold">
            Username is already taken.
          </span>
        )}
        {isEditing && usernameStatus === 'available' && (
          <span className="text-sm text-green-600 font-bold">
            Username available!
          </span>
        )}
      </section>

      {/* Bio Input */}
      <section className="flex flex-col gap-1 w-full max-w-sm">
        <label htmlFor="bio" className="text-lg">
          Bio
        </label>
        <div className="relative w-full">
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full border-2 border-black rounded-lg px-2 py-1 pr-8 min-h-[80px] focus:outline-none ${!isEditing && 'bg-gray-100 cursor-default'}`}
          />
          {!isEditing && (
            <MdEdit
              onClick={() => setIsEditing(true)}
              className="absolute right-2 top-3 cursor-pointer text-gray-600 hover:text-black"
            />
          )}
        </div>
      </section>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-4 mt-4 w-full max-w-sm justify-end">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 border-2 border-black font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              isLoading ||
              usernameStatus === 'taken' ||
              usernameStatus === 'checking'
            }
            className="px-4 py-2 bg-[#416CAE] text-white border-2 border-black font-bold rounded-lg hover:bg-[#345a96] disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </main>
  )
}
