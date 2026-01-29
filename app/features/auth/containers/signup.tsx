import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function Signup() {
  const [next, setNext] = useState(false);
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <button className="bg-[#326F33] text-white px-3 py-1 rounded-lg">
            Sign Up
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white rounded-xl text-[#326F33] font-lexend font-bold p-8 flex flex-col gap-8">
          <DialogHeader className="text-2xl flex flex-col justify-center items-center">
            <img
              src="/logos/tafteats_logo.png"
              alt="logo"
              width={80}
              height={80}
            />
            <h1 className="text-center">
              Sign up to unlock the best of Taft Eats!
            </h1>
          </DialogHeader>
          {next ? (
            <>
              <section className="flex flex-col justify-center items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-black">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  placeholder="Username"
                  className="border-2 border-black text-lg rounded-full px-3 py-2 text-black"
                  aria-required
                  required
                />
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Bio (Optional)"
                  className={`
          border-2 border-black rounded-xl
          px-2 py-1 pr-8
          focus:outline-none
          text-black
        `}
                />
              </section>
            </>
          ) : (
            <>
              <section className="flex flex-col justify-center items-center gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="border-2 border-black text-lg rounded-full px-3 py-2 text-black"
                  aria-required
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border-2 border-black text-lg rounded-full px-3 py-2 text-black"
                  aria-required
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="border-2 border-black text-lg rounded-full px-3 py-2 text-black"
                  aria-required
                  required
                />
              </section>
            </>
          )}
          <section className="text-md text-[#9CB16F] flex flex-col gap-5 justify-center items-center">
            {next ? (
              <>
                <div className="text-md text-center">
                  By continuing, you agree to Taft Eat’s Terms of Service and
                  acknowledge Taft Eat’s Privacy Policy.
                </div>
                <button
                  className="bg-[#326F33] text-white px-6 py-1 rounded-full"
                  onClick={() => setNext(true)}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-[#326F33] text-white px-6 py-1 rounded-full"
                  onClick={() => setNext(true)}
                >
                  Next
                </button>
              </>
            )}
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}
