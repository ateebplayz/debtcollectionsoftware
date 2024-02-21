'use client'
import { FaPlus } from "react-icons/fa6"
import React from 'react'
import { useRouter } from "next/navigation"
import Company from "@/schemas/company"

function CompaniesPage() {
  const [file, setFile] = React.useState<File>()
  const [company, setCompany] = React.useState<Company>({
    name: "",
    cr: "",
    address: "",
    contact: {
      number: "",
      person: "",
    },
    attachment: "",
    clients: []
  })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'name' | 'cr' | 'address' | 'number' | 'person' | 'attachment') => {
    let companyTemp = company
    switch(type) {
      case 'name':
        companyTemp.name = e.target.value
        break;
      case 'cr':
        companyTemp.cr = e.target.value
        break;
      case 'address':
        companyTemp.address = e.target.value
        break;
      case 'number':
        companyTemp.contact.number = e.target.value
        break;
      case 'person':
        companyTemp.contact.person = e.target.value
        break;
      case 'attachment':
        if(e.target.files) {
          setFile(e.target.files[0])
        }
        break;
    }
    setCompany(companyTemp)
    console.log(company)
  }
  const router = useRouter()
  const handleBtnClicks = (btn: number) => {
    switch (btn) {
      case 0:
        break
      case 1:
        break;
    }
  }
  return (
    <div className='flex justify-center items-start w-full h-full'>
      <div className='flex justify-between items-start w-full'>
        <h1 className='text-3xl font-bold text-white'>Companies</h1>
        <button className="flex justify-center items-center bg-white rounded-xl text-black p-2 font-bold transition duration-500 hover:scale-125 hover:bg-transparent hover:text-white" onClick={()=>(document.getElementById('company_modal') as HTMLDialogElement)?.showModal()}><FaPlus size={18}/></button>
        <dialog id="company_modal" className="modal">
          <div className="modal-box px-8">
            <h3 className="font-bold text-lg">Create a Company</h3>
            <p className="py-4">You must fill out all the fields.</p>
            <div className="w-full justify-between items-center flex">
              <input placeholder="Company Name *" onChange={(e)=>{handleInputChange(e, 'name')}} required={true} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl text-white p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input placeholder="Company CR Number *" onChange={(e)=>{handleInputChange(e, 'cr')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl ml-1 text-white p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input placeholder="Company Address *" onChange={(e)=>{handleInputChange(e, 'address')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input placeholder="Contact Number *" onChange={(e)=>{handleInputChange(e, 'number')}} required={true} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl text-white p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input placeholder="Contact Name *" onChange={(e)=>{handleInputChange(e, 'person')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl ml-1 text-white p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input placeholder="Attachment *" onChange={(e)=>{handleInputChange(e, 'attachment')}} type="file" className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full">
              <form method="bg-white w-full">
                <button className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent'>Add Company</button>
                <button className='w-full bg-transparent rounded p-2 mt-4 text-white transition duration-300 hover:scale-105 font-bold border-[1px] border-white' onClick={()=>{handleBtnClicks(1)}}>Cancel</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}

export default CompaniesPage