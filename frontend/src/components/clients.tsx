'use client'
import { FaPlus } from "react-icons/fa6"
import React from 'react'
import { useRouter } from "next/navigation"
import Company from "@/schemas/company"
import axios from "axios"
import Client from "@/schemas/client"

function sleep (ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
function ClientsPage() {
  const [disabled, setDisabled] = React.useState(false)
  const [clients, setClients] = React.useState<Array<Client>>([])
  const [companies, setCompanies] = React.useState<Array<Company>>([])
  const [shake, setShake] = React.useState(false)
  const [client, setClient] = React.useState<Client>({
    cr: '',
    companyCr: '',
    name: '',
    id: '',
    address: '',
    contact: {
        number: '',
        person: ''
    },
    attachment: '',
    contracts: []
  })
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cr' | 'companyCr' | 'name' | 'address' | 'contact number' | 'contact person' | 'attachment') => {
    let tempClient = client
    switch(type) {
      case 'cr':
        tempClient.cr = e.target.value
        break
      case 'companyCr':
        tempClient.companyCr = e.target.value
        break
      case 'name':
        tempClient.name = e.target.value
        break
      case 'address':
        tempClient.address = e.target.value
        break
      case 'contact number':
        tempClient.contact.number = e.target.value
        break
      case 'contact person':
        tempClient.contact.person = e.target.value
        break
      case 'attachment':
        if (e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0];
          const formData = new FormData();
          formData.append("files", selectedFile);
        
          const response = await axios.post('http://localhost:8080/api/files/upload', formData)
          console.log(response.data.data)
          tempClient.attachment = response.data.data
        }
        break
    }
  }
  const handleCreation = async () => {
    try {
      setDisabled(true)
      const response = await axios.post('http://localhost:8080/api/clients/create', {company: client, token: localStorage.getItem('token')})
      console.log(response.data)
      if(response.data.code == 200) {
        handleBtnClicks(1)
      } else {
        setShake(true)
        await sleep(500)
        setShake(false)
      }
    } catch {
      console.error
    }
    setDisabled(false)
  }
  const handleBtnClicks = (btn: number) => {
    switch (btn) {
      case 0:
        break
      case 1:
        (document.getElementById('client_modal') as HTMLDialogElement)?.close()
        break;
    }
  }
  const fetchCompanies = async () => {
    const response = await axios.get(`http://localhost:8080/api/companies/fetch?token=${localStorage.getItem('token')}`)
    console.log(response)
    setCompanies(response.data.data)
  }
  const fetchClients = async () => {
    const response = await axios.get(`http://localhost:8080/api/clients/fetch?token=${localStorage.getItem('token')}`)
    console.log(response)
    setClients(response.data.data)
  }
  
  fetchCompanies()
  fetchClients()
  React.useEffect(()=>{
    try {
      fetchClients()
    } catch {
      console.error
    }
  })
  return (
    <div className='flex justify-start items-start w-full h-full flex-col overflow-y-scroll'>
      <div className='flex justify-between items-start  w-full'>
        <h1 className='text-3xl font-bold text-white'>Clients</h1>
        <button className="flex justify-center items-center bg-white rounded-xl text-black p-2 font-bold transition duration-500 hover:scale-125 hover:bg-transparent hover:text-white" onClick={()=>(document.getElementById('client_modal') as HTMLDialogElement)?.showModal()}><FaPlus size={18}/></button>
        <dialog id="client_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8">
            <h3 className="font-bold text-lg">Create a Client</h3>
            <p className="py-4">You must fill out all the fields.</p>
            <div className="w-full justify-between items-center flex">
              <input placeholder="Company Name *" onChange={(e)=>{handleInputChange(e, 'name')}} required={true} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl text-white p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input placeholder="Company CR Number *" onChange={(e)=>{handleInputChange(e, 'cr')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl ml-1 text-white p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input placeholder="Company Address *" onChange={(e)=>{handleInputChange(e, 'address')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input placeholder="Contact Number *" onChange={(e)=>{handleInputChange(e, 'contact number')}} required={true} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl text-white p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input placeholder="Contact Name *" onChange={(e)=>{handleInputChange(e, 'contact person')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl ml-1 text-white p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input placeholder="Attachment *"  formEncType="multipart/form-data" onChange={(e)=>{handleInputChange(e, 'attachment')}} type="file" accept=".pdf" className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <button onClick={handleCreation} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent'>Add Company</button>
            <div className="w-full">
              <form method="bg-white w-full">
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
                <th>Company Cr</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Contracts</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody className="overflow-y-scroll">
              {clients.length > 0 ? clients.map((company,index) => (
                <tr tabIndex={index}>
                  <th>{company.name}</th>
                  <td>{company.cr}</td>
                  <td>{company.address}</td>
                  <td>{company.contact.number}</td>
                  <td><a href="" className="underline">View</a></td>
                  <td><a href={company.attachment} className="underline">View</a></td>
                  <td><a href="" className="underline">Edit</a></td>
                </tr>
              )) : ''}
            </tbody>
          </table>
        </div>
      </div>  
    </div>
  )
}

export default ClientsPage