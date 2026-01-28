import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Checkbox } from '~/components/ui/checkbox'

export default function Login() {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <button className="bg-white text-black border border-black px-4 py-1 rounded-lg">
            Log In
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white rounded-xl text-[#326F33] font-lexend font-bold p-8 flex flex-col gap-8">
          <DialogHeader className="text-3xl flex flex-col justify-center items-center">
            <img
              src="/logos/tafteats_logo.png"
              alt="logo"
              width={80}
              height={80}
            />
            <h1>Log in to Taft Eats!</h1>
          </DialogHeader>
          <section className="flex flex-col justify-center items-center gap-4">
            <input
              type="email"
              placeholder="Email"
              className="border-2 border-black text-lg rounded-full px-3 py-2 text-black"
            />
            <input
              type="password"
              placeholder="Password"
              className="border-2 border-black text-lg rounded-full px-3 py-2 text-black"
            />
          </section>
          <section className="text-md text-[#9CB16F] flex flex-col gap-5 justify-center items-center">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <Checkbox
                  id="remember"
                  name="remember"
                  className="
    border-2 border-[#9CB16F]
    data-[state=unchecked]:bg-white
    data-[state=unchecked]:border-[#9CB16F]
    data-[state=checked]:bg-[#9CB16F]
    data-[state=checked]:border-[#9CB16F]
  "
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <p className="underline">Create Account</p>
            </div>
            <button className="bg-[#326F33] text-white px-6 py-1 rounded-full">
              Log In
            </button>
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}
