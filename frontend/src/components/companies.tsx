'use client'
import '../app/globals.css'
import { FaPlus } from "react-icons/fa6"
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation"
import Company from "../schemas/company"
import axios from "axios"
import Client from "../schemas/client"
import { serverUri } from "@/data"

function sleep (ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
function CompaniesPage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [disabled, setDisabled] = React.useState(false)
  const [clients, setClients] = React.useState<Array<Client>>([])
  const [companies, setCompanies] = React.useState<Array<Company>>([])
  const [shake, setShake] = React.useState(false)
  const [toUpdateCompany, setToUpdateCompany] = React.useState<Company>({
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
  const [localCompany, setLocalCompany] = React.useState<Company>({
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
    let companyTemp = { ...company }; // Create a copy of the state object
    
    switch(type) {
      case 'name':
        companyTemp.name = e.target.value;
        break;
      case 'cr':
        companyTemp.cr = e.target.value;
        break;
      case 'address':
        companyTemp.address = e.target.value;
        break;
      case 'number':
        companyTemp.contact.number = e.target.value;
        break;
      case 'person':
        companyTemp.contact.person = e.target.value;
        break;
      case 'attachment':
        if (e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0];
          const formData = new FormData();
          formData.append("files", selectedFile);
        
          const response = await axios.post(`${serverUri}/api/files/upload`, formData);
          console.log(response.data.data);
          companyTemp.attachment = response.data.data;
        }
        break;
    }
    setCompany(companyTemp); // Set the state using the modified copy
  };
  
  const handleCreation = async () => {
    try {
      setDisabled(true)
      const response = await axios.post(`${serverUri}/api/companies/create`, {company: company, token: localStorage.getItem('token')})
      console.log(response.data)
      if(response.data.code == 200) {
        handleBtnClicks(1)
        setCompany({
          name: '',
          cr: "",
          address: "",
          contact: {
            number: "",
            person: "",
          },
          attachment: "",
          clients: []
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the file input value
        }
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
        (document.getElementById('company_modal') as HTMLDialogElement)?.close()
        break;
      case 2:
        (document.getElementById('company_client_modal') as HTMLDialogElement)?.close()
        break
      case 3:
        (document.getElementById('company_update_modal') as HTMLDialogElement)?.close()
        break
    }
    fetchData()
  }
  const getClient = (clientId: string) => {
    let client: Client = {
      cr: "",
      companyCr: "",
      name: "",
      id: "",
      address: "",
      contact: {
        number: "",
        person: ""
      },
      attachment: "",
      contracts: []
    }
    clients.forEach((clientT) => {clientT.id == clientId ? client = clientT : ''})
    return client
  }
  const fetchData = async () => {
    try {
      const companiesResponse = await axios.get(`${serverUri}/api/companies/fetch`, {
        params: {
          token: localStorage.getItem('token')
        }
      });
      const clientsResponse = await axios.get(`${serverUri}/api/clients/fetch`, {
        params: {
          token: localStorage.getItem('token')
        }
      });
      setCompanies(companiesResponse.data.data);
      setClients(clientsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 1000)
    return () => clearInterval(interval)
  }, [])

  const updateCompany = async (e: React.ChangeEvent<HTMLInputElement>, type: 'name' | 'cr' | 'address' | 'number' | 'person' | 'attachment') => {
    let companyTemp = {...toUpdateCompany}
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
        if (e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0];
          const formData = new FormData();
          formData.append("files", selectedFile);
        
          const response = await axios.post(`${serverUri}/api/files/upload`, formData)
          console.log(response.data.data)
          companyTemp.attachment = response.data.data
        }
        console.log(company)
        break;
    }
    console.log(companyTemp)
    setToUpdateCompany(companyTemp)
  }
  const updateTheCompany = async () => {
    (document.getElementById('company_update_modal') as HTMLDialogElement)?.close()
    const resp = await axios.post(`${serverUri}/api/companies/update`, {token: localStorage.getItem('token'), company: toUpdateCompany});
    console.log(resp.data);
  }
  return (
    <div className='flex justify-start items-start w-full h-full flex-col overflow-y-scroll'>
      <div className='flex justify-between items-start  w-full'>
        <h1 className='text-3xl font-bold'>Companies</h1>
        <button className="flex justify-center items-center bg-tertiary rounded-xl text-black p-2 font-bold transition duration-500 hover:scale-125 hover:bg-transparent hover:text-black" onClick={()=>(document.getElementById('company_modal') as HTMLDialogElement)?.showModal()}><FaPlus size={18}/></button>
        <dialog id="company_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg ">
            <h3 className="font-bold text-lg">Create a Company</h3>
            <p className="py-4">You must fill out all the fields.</p>
            <div className="w-full justify-between items-center flex placeholder-tertiary">
              <input value={company.name} placeholder="Company Name *" onChange={(e)=>{handleInputChange(e, 'name')}} required={true} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100 placeholder-black'></input>
              <input value={company.cr} placeholder="Company CR Number *" onChange={(e)=>{handleInputChange(e, 'cr')}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input value={company.address} placeholder="Company Address *" onChange={(e)=>{handleInputChange(e, 'address')}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input value={company.contact.number} placeholder="Contact Number *" onChange={(e)=>{handleInputChange(e, 'number')}} required={true} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input value={company.contact.person} placeholder="Contact Name *" onChange={(e)=>{handleInputChange(e, 'person')}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
              <input ref={fileInputRef} id='company_file_input' placeholder="Attachment *"  formEncType="multipart/form-data" onChange={(e)=>{handleInputChange(e, 'attachment')}} type="file" accept=".pdf" className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <button onClick={handleCreation} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Add Company</button>
            <button className={`w-full bg-transparent rounded p-2 mt-4 text-black transition duration-300 hover:scale-105 font-bold border-[1px] border-black ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} onClick={()=>{handleBtnClicks(1)}}>Cancel</button>
          </div>
        </dialog>
        <dialog id="company_client_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg">
            <h3 className="font-bold text-lg">Clients</h3>
            <p className="py-4">Below is a list of all the clients part of company with CR {company.cr}</p>
            <div>
              {
                localCompany.clients.map((clientId, index) => (
                  <div key={index} className="bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-4 w-full mt-3 border-none text-black"><p className='text-black'>{getClient(clientId).name} ({getClient(clientId).cr}) [{getClient(clientId).id}]</p></div>
                ))
              }
            </div>
            <button onClick={() => {handleBtnClicks(2)}} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent'>Close</button>
          </div>
        </dialog>
        <dialog id="company_update_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg">
            <h3 className="font-bold text-lg">Update the Company</h3>
            <p className="py-4">You must fill out all the fields.</p>
            <div className="w-full justify-between items-center flex">
              <input placeholder="Company Name *" onChange={(e)=>{updateCompany(e, 'name')}} value={toUpdateCompany.name} required={true} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input placeholder="Company CR Number *" onChange={(e)=>{updateCompany(e, 'cr')}} value={toUpdateCompany.cr} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input placeholder="Company Address *" value={toUpdateCompany.address} onChange={(e)=>{updateCompany(e, 'address')}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input value={toUpdateCompany.contact.number} placeholder="Contact Number *" onChange={(e)=>{updateCompany(e, 'number')}} required={true} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input placeholder="Contact Name *" value={toUpdateCompany.contact.person} onChange={(e)=>{updateCompany(e, 'person')}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <button onClick={updateTheCompany} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent'>Update Company</button>
            <button className='w-full bg-transparent rounded p-2 mt-4 text-black transition duration-300 hover:scale-105 font-bold border-[1px] border-black' onClick={()=>{handleBtnClicks(3)}}>Cancel</button>
            <button onClick={async ()=>{
              handleBtnClicks(3)
              const response = await axios.post(`${serverUri}/api/companies/delete`, {token: localStorage.getItem('token'), cr: toUpdateCompany.cr})
              console.log(response)
            }} className='w-full bg-red-500 text-black rounded border-[1px] border-red-500 p-2 mt-4 text-black transition duration-300 hover:bg-transparent hover:text-red-500 font-bold hover:scale-110 hover:border-transparent'>Delete Company</button>
          </div>
        </dialog>
      </div>
      <div className="flex justify-center items-center mt-12 w-full mb-12 ">
        <div className="overflow-x-auto overflow-y-scroll w-full">
          <table className="table text-black overflow-y-scroll w-full">
            {/* head */}
            <thead>
              <tr className='text-black'>
                <th>Name</th>
                <th>CR</th>
                <th>Address</th>
                <th>Contact No.</th>
                <th>Clients</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody className="overflow-y-scroll">
              {companies.length > 0 ? companies.map((company,index) => (
                <tr key={index} tabIndex={index}>
                  <th>{company.name}</th>
                  <td>{company.cr}</td>
                  <td>{company.address}</td>
                  <td>{company.contact.number}</td>
                  <td><a onClick={()=>{(document.getElementById('company_client_modal') as HTMLDialogElement)?.showModal(); setLocalCompany(company)}} className="underline cursor-pointer">View</a></td>
                  <td><a href={company.attachment} className="underline cursor-pointer">View</a></td>
                  <td><a onClick={()=>{setToUpdateCompany(company); (document.getElementById('company_update_modal') as HTMLDialogElement)?.showModal()}} className="underline cursor-pointer">Edit</a></td>
                </tr>
              )) : ''}
            </tbody>
          </table>
        </div>
      </div>  
    </div>
  )
}

export default CompaniesPage