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
    <div className="w-full bg-main min-h-screen flex flex-row items-center text-black">
      <div className="flex w-3/12 h-[calc(100vh-4rem)] items-center pt-8 mx-8 rounded-xl bg-bg flex-col">
        <h1 className="font-bold text-xl mx-8 mt-4 text-center">Your Company Logo</h1>
        <div className='flex justify-center items-center w-full'>
          <ul className='mt-8 flex justify-center items-center flex-col w-full'>
              <li className={`transition duration-500 w-full p-2 ${page == 'home' ? '' : 'hover:'}bg-tertiary text-black py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('home')}}>Home</li>
              <li className={`transition duration-500 w-full p-2 ${page == 'companies' ? '' : 'hover:'}bg-tertiary text-black py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('companies')}}>Companies</li>
              <li className={`transition duration-500 w-full p-2 ${page == 'clients' ? '' : 'hover:'}bg-tertiary text-black py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('clients')}}>Clients</li>
              <li className={`transition duration-500 w-full p-2 ${page == 'contracts' ? '' : 'hover:'}bg-tertiary text-black py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('contracts')}}>Contracts</li>
              <li className={`transition duration-500 w-full p-2 ${page == 'reports' ? '' : 'hover:'}bg-tertiary text-black py-4 rounded font-bold text-md text-center cursor-pointer`} onClick={()=>{configurePage('reports')}}>Reports</li>
          </ul>
        </div>
        <div className='flex mt-4 justify-center items-center bg-tertiary  p-2 rounded-xl cursor-pointer transition duration-300 hover:scale-110'>
          <MdLogout size={24}/>
        </div>
      </div>
      <div className="flex w-9/12 h-[calc(100vh-4rem)] rounded-l-xl mr-8 bg-bg p-12">
        {
          page == 'home' ? <HomePage/> :
          page == 'companies' ? <CompaniesPage/> :
          page == 'clients' ? <ClientsPage/> :
          page == 'contracts' ? <ContractsPage/> :
          page == 'reports' ? <ReportsPage/> : <></>
        }
      </div>
    </div>
  );
}
