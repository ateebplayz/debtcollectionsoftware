'use client'
import { FaPlus } from "react-icons/fa6"
import React from 'react'
import { useRouter } from "next/navigation"
import Company from "../schemas/company"
import axios from "axios"
import Client from "../schemas/client"

function sleep (ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
function CompaniesPage() {
  const [disabled, setDisabled] = React.useState(false)
  const [localClients, setLocalClients] = React.useState<Array<Client>>([])
  const [companies, setCompanies] = React.useState<Array<Company>>([])
  const [shake, setShake] = React.useState(false)
  const [localCompanyCr, setLocalCompanyCr] = React.useState('')
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
      case 'attachment':
        if (e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0];
          const formData = new FormData();
          formData.append("files", selectedFile);
        
          const response = await axios.post('http://localhost:8080/api/files/upload', formData)
          console.log(response.data.data)
          companyTemp.attachment = response.data.data
        }
        console.log(company)
        break;
    }
    setCompany(companyTemp)
    console.log(company)
  }
  const handleCreation = async () => {
    try {
      setDisabled(true)
      const response = await axios.post('http://localhost:8080/api/companies/create', {company: company, token: localStorage.getItem('token')})
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
        (document.getElementById('company_modal') as HTMLDialogElement)?.close()
        break;
    }
  }
  const fetchLocalClients = async () => {
    const clients = (await axios.get(`http://localhost:8080/api/clients/fetch?token=${localStorage.getItem('token')}`)).data.data as Array<Client>
    let localClients: Array<Client> = []
    clients.map((client) => {
      if(client.companyCr == localCompanyCr) localClients.push(client)
    })
    setLocalClients(localClients)
  }
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await axios.get(`http://localhost:8080/api/companies/fetch?token=${localStorage.getItem('token')}`);
        setCompanies(companiesResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 10 seconds
    const interval = setInterval(fetchData, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <div className='flex justify-start items-start w-full h-full flex-col overflow-y-scroll'>
      <div className='flex justify-between items-start  w-full'>
        <h1 className='text-3xl font-bold text-white'>Companies</h1>
        <button className="flex justify-center items-center bg-white rounded-xl text-black p-2 font-bold transition duration-500 hover:scale-125 hover:bg-transparent hover:text-white" onClick={()=>(document.getElementById('company_modal') as HTMLDialogElement)?.showModal()}><FaPlus size={18}/></button>
        <dialog id="company_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
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
            <button onClick={handleCreation} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent'>Add Company</button>
            <button className='w-full bg-transparent rounded p-2 mt-4 text-white transition duration-300 hover:scale-105 font-bold border-[1px] border-white' onClick={()=>{handleBtnClicks(1)}}>Cancel</button>
          </div>
        </dialog>
        <dialog id="company_client_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8">
            <h3 className="font-bold text-lg">Clients</h3>
            <p className="py-4">Below is a list of all the clients part of company with CR {localCompanyCr}</p>
            <div>
              {
                localClients.map((client) => (
                  <div>{company.name}</div>
                ))
              }
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
              {companies.length > 0 ? companies.map((company,index) => (
                <tr tabIndex={index}>
                  <th>{company.name}</th>
                  <td>{company.cr}</td>
                  <td>{company.address}</td>
                  <td>{company.contact.number}</td>
                  <td><a onClick={()=>{setLocalCompanyCr(company.cr); fetchLocalClients(); (document.getElementById('company_client_modal') as HTMLDialogElement)?.showModal()}} className="underline">View</a></td>
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

export default CompaniesPage