import type { Route } from './+types/index'


export function meta({}: Route.MetaArgs) {
  return [{ title: 'Taft Eats' }, { name: 'description', content: 'Taft Eats' }]
}

export default function Login() {
  return (
    <main className='flex justify-center items-center min-h-screen'>
    <section className='bg-white font-lexend flex flex-col justify-center items-center gap-5 py-5 px-1 w-[500px] rounded-2xl'>
      <div className='text-[#326F33] font-bold flex flex-col justify-center items-center'>
        <img src="/logos/tafteats_logo.png" width="150" height="150"></img>
        
        <h1 className='text-3xl font-bold'>
          Log in to Taft Eats!
        </h1>
      </div>

      <div className='flex flex-col'>
      <label htmlFor="email" className='text-black'> Email *</label>
      <input type="email" className='border-2 border-black rounded-md'></input>
      </div>

      <div className='flex flex-col'>
      <label htmlFor="password" className='text-black'> Password *</label>
      <input type="password" className='border-2 border-black rounded-md'></input>
      </div>

      <div className='flex'>
      <input type="checkbox"></input>
      <label htmlFor="checkbox" className='text-[#9CB16F]'> Remember me</label>
      </div>

      <div className='flex'>
      <input type="submit" value="Log in" className='bg-[#326F33] text-white rounded-md px-4 py-2'></input>
      </div>
        
    </section> 

    </main>
  )
}