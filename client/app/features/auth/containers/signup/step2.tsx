import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Camera } from "lucide-react";
import type { SignUpFormTypes } from "../../types/auth.types";

interface Step2Props {
  onBack: () => void;
  formData: SignUpFormTypes;
  updateFormData: (field: keyof SignUpFormTypes, value: any) => void;
}

export function Step2({ onBack, formData, updateFormData }: Step2Props) {
  return (
    <div className="w-full flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-[#326F33] font-bold flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold mt-2 leading-tight">
          One Last Step!
        </h1>
        <p className="text-black font-normal mt-1">
          Tell us a bit about yourself.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <label
          htmlFor="avatar-upload"
          className="cursor-pointer group relative"
        >
          <Avatar className="w-24 h-24 border-2 border-[#326F33]">
            <AvatarImage
              src={formData.avatar ? URL.createObjectURL(formData.avatar) : ""}
              alt="Profile"
            />
            <AvatarFallback className="bg-[#f0fdf4] text-[#326F33]">
              <Camera size={32} />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-xs text-white font-bold">Edit</span>
          </div>
        </label>
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              updateFormData("avatar", e.target.files[0]);
            }
          }}
        />
        <span className="text-sm text-[#9CB16F]">Upload Profile Picture</span>
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="username" className="text-black font-medium mb-1">
          Username *
        </label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={(e) => updateFormData("username", e.target.value)}
          className="border-2 border-black rounded-md w-full p-2 outline-none focus:border-[#326F33]"
          placeholder="Choose a username"
          required
        />
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="bio" className="text-black font-medium mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => updateFormData("bio", e.target.value)}
          className="border-2 border-black rounded-md w-full p-2 outline-none focus:border-[#326F33] min-h-[100px] resize-none"
          placeholder="Tell us a little about yourself..."
        />
      </div>

      <p className="text-xs text-center text-[#326F33] leading-tight px-2">
        By continuing, you agree to Taft Eat’s{" "}
        <span className="font-bold underline cursor-pointer">
          Terms of Service
        </span>{" "}
        and acknowledge Taft Eat’s{" "}
        <span className="font-bold underline cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>

      <div className="flex w-full gap-3 mt-1">
        <button
          type="button"
          onClick={onBack}
          className="border-2 border-[#326F33] text-[#326F33] font-bold rounded-lg w-1/3 py-2 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-[#326F33] text-white font-bold rounded-lg w-2/3 py-2 px-6 cursor-pointer hover:bg-[#285a29] transition-colors"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
