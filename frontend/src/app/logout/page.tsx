'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

function LogOutPage() {
  const router = useRouter()
  const handleBtnClick = (btn: number) => {
    switch (btn) {
      case 0:
        router.push('/')
        break;
      case 1:
        try {
          localStorage.removeItem('token')
          router.push('/')
        } catch {console.log}
        break;
    }
  }
  return (
    <div className='bg-black min-h-screen flex justify-center items-center w-full'>
        <div className={`flex bg-bg text-white text-center p-8 justify-center items-center rounded-lg flex-col`}>
            <h1 className={`text-4xl font-bold text-main w-full`}>Logged In</h1>
            <p className='text-text mt-4 w-full'>It seem's you're already logged in. Either log out or go to the main page</p>
            <button className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent' onClick={() => {handleBtnClick(0)}}>Take me Back</button>
            <button className='w-full bg-transparent rounded p-2 mt-4 text-white transition duration-300 hover:scale-105 font-bold border-[1px] border-white'>Logout</button>
        </div>
    </div>
  )
}

export default LogOutPage