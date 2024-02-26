'use client'
import { FaPlus } from "react-icons/fa6"
import React from 'react'
import { useRouter } from "next/navigation"
import Company from "@/schemas/company"
import axios from "axios"

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
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'name' | 'cr' | 'address' | 'number' | 'person' | 'attachment') => {
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
      case 'attachment':if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        formData.append("files", selectedFile);
      
        fetch("http://localhost:8080/api/files/upload", {
          method: 'POST', 
          body: formData,
          // Don't set Content-Type explicitly, FormData handles it automatically
        })
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
      }
      
        console.log(FormData)
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
  const companies = [
    {
      name: 'Company 1',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 2',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 3',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 4',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 5',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 6',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 7',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 8',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 9',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 10',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 11',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 12',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 13',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
    {
      name: 'Company 14',
      cr: 'CR12345678',
      address: '123 Address Street X Muscat, Oman',
      contact: '+97182648238',
    },
  ]
  return (
    <div className='flex justify-start items-start w-full h-full flex-col overflow-y-scroll'>
      <div className='flex justify-between items-start  w-full'>
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
            <input placeholder="Attachment *"  formEncType="multipart/form-data" onChange={(e)=>{handleInputChange(e, 'attachment')}} type="file" accept=".pdf" className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full">
              <form method="bg-white w-full">
                <button className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent'>Add Company</button>
                <button className='w-full bg-transparent rounded p-2 mt-4 text-white transition duration-300 hover:scale-105 font-bold border-[1px] border-white' onClick={()=>{handleBtnClicks(1)}}>Cancel</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
      <div className="flex justify-center items-center mt-12 w-full mb-12 ">
        <div className="overflow-x-auto overflow-y-scroll w-full">
          <table className="table table-zebra overflow-y-scroll w-full">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>CR</th>
                <th>Address</th>
                <th>Contact No.</th>
                <th>Clients</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody className="overflow-y-scroll">
              {companies.map((company,index) => (
                <tr tabIndex={index}>
                  <th>{company.name}</th>
                  <td>{company.cr}</td>
                  <td>{company.address}</td>
                  <td>{company.contact}</td>
                  <td><a href="" className="underline">View</a></td>
                  <td><a href="" className="underline">View</a></td>
                  <td><a href="" className="underline">Edit</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>  
    </div>
  )
}

export default CompaniesPage