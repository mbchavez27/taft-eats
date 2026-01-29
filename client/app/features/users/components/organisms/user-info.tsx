import { useState } from "react";
import { MdEdit } from "react-icons/md";

export default function UserInfo() {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <>
      <main className="bg-white rounded-xl w-full px-8 py-5 font-lexend text-black flex flex-col gap-4 justify-center items-center">
        <section className="flex flex-col gap-1">
          <label htmlFor="name" className="text-lg">
            Name
          </label>
          <div className="relative w-fit">
            <input
              type="text"
              name="name"
              id="name"
              value={"John Doe"}
              readOnly={!isEditing}
              className={`
          border-2 border-black rounded-lg
          px-2 py-1 pr-8
          focus:outline-none
          ${!isEditing && "bg-gray-100 cursor-default"}
        `}
            />

            <MdEdit
              onClick={() => setIsEditing(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
            />
          </div>
        </section>
        <section className="flex flex-col gap-1">
          <label htmlFor="email" className="text-lg">
            Email
          </label>
          <div className="relative w-fit">
            <input
              type="text"
              readOnly={true}
              value={"user123@gmail.com"}
              className={`
          border-2 border-black rounded-lg
          px-2 py-1 pr-8
          focus:outline-none
        `}
            />
          </div>
        </section>
        <section className="flex flex-col gap-1">
          <label htmlFor="username" className="text-lg">
            User Name
          </label>
          <div className="relative w-fit">
            <input
              type="text"
              id="username"
              name="username"
              value={"@User123"}
              readOnly={!isEditing}
              className={`
          border-2 border-black rounded-lg
          px-2 py-1 pr-8
          focus:outline-none
          ${!isEditing && "bg-gray-100 cursor-default"}
        `}
            />

            <MdEdit
              onClick={() => setIsEditing(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
            />
          </div>
        </section>
        <section className="flex flex-col gap-1">
          <label htmlFor="bio" className="text-lg">
            Bio
          </label>
          <div className="relative w-fit">
            <textarea
              id="bio"
              name="bio"
              value={"this is my bio"}
              readOnly={!isEditing}
              className={`
          border-2 border-black rounded-lg
          px-2 py-1 pr-8
          focus:outline-none
          ${!isEditing && "bg-gray-100 cursor-default"}
        `}
            />

            <MdEdit
              onClick={() => setIsEditing(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black"
            />
          </div>
        </section>
      </main>
    </>
  );
}
