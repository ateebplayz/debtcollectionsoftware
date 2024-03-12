'use client'
import axios from 'axios'
import '../globals.css'
import React from 'react'
import { useRouter } from 'next/navigation'
import { serverUri } from '@/data'

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
  const [shake2, setShake2] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [error, setError] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [forgetObj, setForgetObj] = React.useState({password: '', backupCode: ''})
  const [shake, setShake] = React.useState(false)
  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handleForgetChange = (value: string, type: 'password' | 'backup-code') => {
    switch(type) {
      case 'password':
        setForgetObj({...forgetObj, password: value})
        break
      case 'backup-code':
        setForgetObj({...forgetObj, backupCode: value})
        break
    }
  }
  const handleBtnClick = async () => {
    try {
      const resp = await axios.get(`${serverUri}/api/user/authenticate?username=${username}&password=${password}`)
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
  const handleReset = async () => {
    setDisabled(true)
    const req = await axios.post(`${serverUri}/api/user/reset`, {password: forgetObj.password, backupCode: forgetObj.backupCode})
    if(req.data.code == 200) {
      setDisabled(false);
      (document.getElementById('forget_password_modal') as HTMLDialogElement).close()
    } else {
      setError(req.data.error)
      setShake2(true)
      await sleep(500)
      setShake2(false)
      setDisabled(false)
    }
  }
  return (
    <div className='bg-main min-h-screen flex justify-center items-center w-full'>
      <div className={`flex bg-bg ${shake ? 'animate-shake' : ''} text-black text-center p-8 justify-center items-center rounded-lg flex-col`}>
        <h1 className={`text-4xl font-bold text-black w-full`}>Login</h1>
        <p className='mt-4 w-full text-black'>Please enter your credentials below</p>
        <input onChange={usernameChange} placeholder='Username' className='bg-tertiary border-[1px] border-[rgba(0,0,0,0.7)]  rounded p-2 w-full mt-6 border-none transition duration-300 hover:cursor-pointer hover:scale-105 focus:cursor-text focus:outline-none focus:scale-110 placeholder-black text-black'></input>
        <input onChange={passwordChange} placeholder='Password' type='password' className='bg-tertiary border-[1px] border-[rgba(0,0,0,0.7)] rounded p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:scale-105 focus:cursor-text focus:outline-none focus:scale-110 placeholder-black'></input>
        <button className='w-full bg-main rounded border-[1px] border-main p-2 mt-4 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent text-black' onClick={() => {handleBtnClick()}}>Login</button>
        <h1 className='mt-4 font-bold text-black text-sm transition duration-500 hover:opacity-50 cursor-pointer active:scale-90' onClick={()=>{(document.getElementById('forget_password_modal') as HTMLDialogElement).showModal()}}>Forgot Password?</h1>
      </div>
      <dialog id="forget_password_modal" className={`modal ${shake2 ? 'animate-shake' : ''}`}>
        <div className="modal-box px-8 bg-bg text-black">
          <h3 className="font-bold text-lg">Reset Password</h3>
          <p className="py-4">Reset your password by entering your details below</p>
          {error !== '' ?
          <div className='w-full flex justify-center items-center p-2 bg-red-200 border-2 border-red-500 rounded-lg text-red-500'>
            <p className='text-center'>{error}</p>
          </div>
          : <></>}
          <input placeholder='Username' className='bg-tertiary border-[1px] border-[rgba(0,0,0,0.7)]  rounded p-2 w-full mt-2 border-none transition duration-300 hover:cursor-pointer hover:scale-105 focus:cursor-text focus:outline-none focus:scale-110 placeholder-black text-black'></input>
          <input onChange={(e)=>{handleForgetChange(e.target.value, 'password')}} type='password' placeholder='New Password' className='bg-tertiary border-[1px] border-[rgba(0,0,0,0.7)]  rounded p-2 w-full mt-2 border-none transition duration-300 hover:cursor-pointer hover:scale-105 focus:cursor-text focus:outline-none focus:scale-110 placeholder-black text-black'></input>
          <input minLength={40} maxLength={140} onChange={(e)=>{handleForgetChange(e.target.value, 'backup-code')}} placeholder='12 Digit Backup Code' type='password' className='bg-tertiary border-[1px] border-[rgba(0,0,0,0.7)] rounded p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:scale-105 focus:cursor-text focus:outline-none focus:scale-110 placeholder-black'></input>
          <button className={`w-full bg-main rounded border-[1px] border-main p-2 mt-4 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent text-black ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed hover:opacity-50' : ''}`} onClick={handleReset}>Confirm</button> 
          <button className={`w-full bg-transparent rounded border-2 border-main p-2 mt-4 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 text-black ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} onClick={()=>{(document.getElementById('forget_password_modal') as HTMLDialogElement).close()}}>Cancel</button>
        </div>
      </dialog>
    </div>
  )
}

export default LoginPage