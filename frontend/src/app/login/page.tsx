'use client'
import axios from 'axios'
import '../globals.css'
import React from 'react'
import { useRouter } from 'next/navigation'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function LoginPage() {
  const router = useRouter()
  React.useEffect(() => {
    const run = () => {
      const token = localStorage.getItem('token')
      if (token) router.push('/logout')
    }
    run()
  }, [])
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [shake, setShake] = React.useState(false)
  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handleBtnClick = async () => {
    try {
      const resp = await axios.get(`http://localhost:8080/api/user/authenticate?username=${username}&password=${password}`)
      console.log(resp.data)
      if(resp.data) {
        if(resp.data.code !== 200) {
          setShake(true)
          await sleep(500)
          setShake(false)
        } else {
          localStorage.setItem('token', resp.data.token)
          router.push('/')
        }
      }
    } catch {console.log}
  }
  return (
    <div className='bg-black min-h-screen flex justify-center items-center w-full'>
        <div className={`flex bg-bg ${shake ? 'animate-shake' : ''} text-white text-center p-8 justify-center items-center rounded-lg flex-col`}>
            <h1 className={`text-4xl font-bold text-main w-full`}>Login</h1>
            <p className='text-text mt-4 w-full'>Please enter your credentials below</p>
            <input onChange={usernameChange} placeholder='Username' className='bg-[rgba(0,0,0,0.7)] border-[1px] border-[rgba(0,0,0,0.7)]  rounded p-2 w-full mt-6 border-none transition duration-300 hover:cursor-pointer hover:scale-105 focus:cursor-text focus:outline-none focus:scale-110'></input>
            <input onChange={passwordChange} placeholder='Password' type='password' className='bg-[rgba(0,0,0,0.7)] border-[1px] border-[rgba(0,0,0,0.7)] rounded p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:scale-105 focus:cursor-text focus:outline-none focus:scale-110'></input>
            <button className='w-full bg-main rounded border-[1px] border-main p-2 mt-4 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent' onClick={() => {handleBtnClick()}}>Login</button>
        </div>
    </div>
  )
}

export default LoginPage