import { useState, type FormEvent } from "react";
import type { Route } from "./+types/index";
import { Step1 } from "~/features/auth/containers/signup/step1";
import { Step2 } from "~/features/auth/containers/signup/step2";
import { type SignUpFormTypes } from "~/features/auth/types/auth.types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sign Up" }, { name: "description", content: "Taft Eats" }];
}

export default function SignUp() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<SignUpFormTypes>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    bio: "",
    avatar: null,
  });

  const updateFormData = (field: keyof SignUpFormTypes, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting this data to the service:", formData);
  };

  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="
        bg-white 
        font-lexend 
        flex flex-col justify-center items-center 
        gap-5 
        py-8 px-6 
        w-full max-w-[500px] 
        rounded-2xl 
        shadow-sm"
      >
        <img
          src="/logos/tafteats_logo.png"
          alt="Taft Eats Logo"
          className="w-[150px] h-[150px] object-contain"
        />
        {step === 1 && (
          <Step1
            onNext={() => setStep(2)}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {step === 2 && (
          <Step2
            onBack={() => setStep(1)}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
      </form>
    </main>
  );
}
