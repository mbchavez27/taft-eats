import { useState } from "react";
import type { SignUpFormTypes } from "../../types/auth.types";

interface Step1Props {
  onNext: () => void;
  formData: SignUpFormTypes;
  updateFormData: (field: keyof SignUpFormTypes, value: string) => void;
}

export function Step1({ onNext, formData, updateFormData }: Step1Props) {
  const [error, setError] = useState<string | null>(null);

  const handleNextClick = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill out all fields.");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&).",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    onNext();
  };

  const inputBorderClass = error
    ? "border-red-500 focus:border-red-600"
    : "border-black focus:border-[#326F33]";

  return (
    <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="text-[#326F33] font-bold flex flex-col justify-center items-center text-center mb-2">
        <h1 className="text-2xl md:text-3xl font-bold mt-2 leading-tight">
          Sign Up to unlock the <br className="hidden md:block" />
          best of Taft Eats!
        </h1>
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="name" className="text-black font-medium mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          placeholder="Enter your full name"
          className={`border-2 rounded-md w-full p-2 outline-none transition-colors ${inputBorderClass}`}
          required
        />
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="email" className="text-black font-medium mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          placeholder="Enter your email"
          className={`border-2 rounded-md w-full p-2 outline-none transition-colors ${inputBorderClass}`}
          required
        />
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="password" className="text-black font-medium mb-1">
          Password *
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => updateFormData("password", e.target.value)}
          placeholder="Create a password"
          className={`border-2 rounded-md w-full p-2 outline-none transition-colors ${inputBorderClass}`}
          required
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="confirm-password"
          className="text-black font-medium mb-1"
        >
          Confirm Password *
        </label>
        <input
          type="password"
          id="confirm-password"
          value={formData.confirmPassword}
          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
          placeholder="Confirm your password"
          className={`border-2 rounded-md w-full p-2 outline-none transition-colors ${inputBorderClass}`}
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm font-medium p-3 text-center">
          {error}
        </div>
      )}

      <div className="flex mt-2">
        <button
          type="button"
          onClick={handleNextClick}
          className="bg-[#326F33] text-white font-bold rounded-lg w-full py-2 px-6 cursor-pointer hover:bg-[#285a29] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
