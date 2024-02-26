'use client'
import ClientsPage from "@/components/clients";
import CompaniesPage from "@/components/companies";
import ContractsPage from "@/components/contracts";
import HomePage from "@/components/home";
import ReportsPage from "@/components/reports";
import { logoUri } from "@/data";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MdLogout } from "react-icons/md";

export default function Home() {
  const [page, setPage] = React.useState<'home' | 'clients' | 'companies' | 'contracts' | 'reports'>('home')
  const router = useRouter()
  const configurePage = (page: 'home' | 'clients' | 'companies' | 'contracts' | 'reports') => {
    setPage(page)
  }
  const run = () => {
    try {
      const token = localStorage.getItem('token')
      if(!token) router.push('/login')
    } catch {console.log}
  }
  run()
  return (
    <div className="w-full min-h-screen flex flex-row items-center">
      <div className="flex w-3/12 h-[calc(100vh-4rem)] items-center pt-8 mx-8 rounded-r-xl ml-0 bg-bg flex-col">
        <h1 className="font-bold text-xl mx-8 mt-4 text-center">Your Company Logo</h1>
        <div className='flex justify-center items-center w-full'>
          <ul className='mt-8 flex justify-center items-center flex-col w-full'>
              <li className={`transition duration-500 w-full p-2 ${page == 'home' ? '' : 'hover:'}bg-black text-white py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('home')}}>Home</li>
              <li className={`transition duration-500 w-full p-2 ${page == 'clients' ? '' : 'hover:'}bg-black text-white py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('clients')}}>Clients</li>
              <li className={`transition duration-500 w-full p-2 ${page == 'companies' ? '' : 'hover:'}bg-black text-white py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('companies')}}>Companies</li>
              <li className={`transition duration-500 w-full p-2 ${page == 'contracts' ? '' : 'hover:'}bg-black text-white py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('contracts')}}>Contracts</li>
              <li className={`transition duration-500 w-full p-2 ${page == 'reports' ? '' : 'hover:'}bg-black text-white py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('reports')}}>Reports</li>
          </ul>
        </div>
        <div className='flex mt-4 justify-center items-center bg-black p-2 rounded-xl cursor-pointer transition duration-300 hover:scale-110'>
          <MdLogout size={24}/>
        </div>
      </div>
      <div className="flex w-full h-[calc(100vh-4rem)] ml-0 rounded-l-xl bg-bg p-12">
        {
          page == 'home' ? <HomePage/> :
          page == 'clients' ? <ClientsPage/> :
          page == 'companies' ? <CompaniesPage/> :
          page == 'contracts' ? <ContractsPage/> :
          page == 'reports' ? <ReportsPage/> : <></>
        }
      </div>
    </div>
  );
}
