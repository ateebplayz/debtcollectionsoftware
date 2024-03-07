'use client'
import { FaPlus } from "react-icons/fa6"
import React from 'react'
import { useRouter } from "next/navigation"
import Company from "@/schemas/company"
import axios from "axios"
import Client from "@/schemas/client"
import { serverUri } from "@/data"
import Contract from "@/schemas/contract"

function sleep (ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
function ClientsPage() {
  const [error, setError] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [dropdownText, setDropdownText] = React.useState('Company *')
  const [disabled, setDisabled] = React.useState(false)
  const [clients, setClients] = React.useState<Array<Client>>([])
  const [companies, setCompanies] = React.useState<Array<Company>>([])
  const [shake, setShake] = React.useState(false)
  const [contracts, setContracts] = React.useState<Array<Contract>>([])
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
  const [localClient, setLocalClient] = React.useState<Client>({
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
  const [updatedClient, setUpdatedClient] = React.useState<Client>({
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
  const handleDropdownChange = async (value: string, type: 'companyCr') => {
    let tempClient = client
    switch(type) {
      case 'companyCr':
        tempClient.companyCr = value
        break
    }
    setClient(tempClient)
    console.log(tempClient)
  }
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cr'  | 'name' | 'address' | 'contact number' | 'contact person' | 'attachment') => {
    let tempClient = {...client}
    switch(type) {
      case 'cr':
        tempClient.cr = e.target.value
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
        
          const response = await axios.post(`${serverUri}/api/files/upload`, formData)
          console.log(response.data.data)
          tempClient.attachment = response.data.data
        }
        break
    }
    setClient(tempClient)
    console.log(client)
  }
  const handleUpdateChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cr'  | 'name' | 'address' | 'contact number' | 'contact person') => {
    let tempClient = {...updatedClient}
    switch(type) {
      case 'cr':
        tempClient.cr = e.target.value
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
    }
    setUpdatedClient(tempClient)
    console.log(updatedClient)
  }
  
  const handleCreation = async () => {
    try {
      setDisabled(true)
      const response = await axios.post(`${serverUri}/api/clients/create`, {client: client, token: localStorage.getItem('token')})
      console.log(response.data)
      if(response.data.code == 200) {
        setError('')
        handleBtnClicks(1)
        setClient({
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
          contracts: []})
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the file input value
        }
      } else {
        setError(response.data.error)
        setShake(true)
        await sleep(500)
        setShake(false)
      }
    } catch {
      console.error
    }
    setDisabled(false)
  }
  const handleUpdate = async () => {
    try {
      console.log(updatedClient)
      setDisabled(true)
      const response = await axios.post(`${serverUri}/api/clients/update`, {client: updatedClient, token: localStorage.getItem('token')})
      console.log(response.data)
      if(response.data.code == 200) {
        handleBtnClicks(4)
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
  const fetchData = async () => {
    try {
      const companiesResponse = await axios.get(`${serverUri}/api/companies/fetch?token=${localStorage.getItem('token')}`);
      setCompanies(companiesResponse.data.data);
      
      const clientsResponse = await axios.get(`${serverUri}/api/clients/fetch?token=${localStorage.getItem('token')}`);
      setClients(clientsResponse.data.data);

      const contractsResponse = await axios.get(`${serverUri}/api/contracts/fetch?token=${localStorage.getItem('token')}`);
      setContracts(contractsResponse.data.data);
      console.log(clientsResponse)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  React.useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 1000)
    return () => clearInterval(interval)
  }, [])
  const handleBtnClicks = (btn: number) => {
    switch (btn) {
      case 0:
        break
      case 1:
        (document.getElementById('client_modal') as HTMLDialogElement)?.close()
        fetchData();
        break;
      case 2:
        (document.getElementById('client_address_modal') as HTMLDialogElement)?.close()
        fetchData();
        break;
      case 3:
        (document.getElementById('client_contracts_modal') as HTMLDialogElement)?.close()
        fetchData();
        break;
      case 4:
        (document.getElementById('client_update_modal') as HTMLDialogElement)?.close()
        fetchData()
        break
    }
    fetchData();
  }
  const toggleOpen = () => {
    console.log(open)
    setOpen(!open)
  }
  const getContract = (contractId: string) => {
    let contract: Contract = {
      companyCr: "",
      clientId: "",
      id: "",
      installments: [],
      date: "",
      amount: 0,
      description: "",
      percentage: 0
    }
    console.log(contracts)
    contracts.map((contractT) => {contractT.id == contractId ? contract = contractT : ''})
    console.log(contract)
    return contract
  }
  return (
    <div className='flex justify-start items-start w-full h-full flex-col overflow-y-scroll'>
      <div className='flex justify-between items-start  w-full'>
        <h1 className='text-3xl font-bold'>Clients</h1>
        <button className="flex justify-center items-center bg-tertiary rounded-xl text-black p-2 font-bold transition duration-500 hover:scale-125 hover:bg-transparent hover:text-black" onClick={()=>{(document.getElementById('client_modal') as HTMLDialogElement)?.showModal(); fetchData()}}><FaPlus size={18}/></button>
        <dialog id="client_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg">
            <h3 className="font-bold text-lg">Create a Client</h3>
            <p className="py-4">You must fill out all the fields.</p>
            {error !== '' ?
            <div className='w-full flex justify-center items-center p-2 bg-red-200 border-2 border-red-500 rounded-lg text-red-500'>
              <p className='text-center'>{error}</p>
            </div>
            : <></>}
            <div className="w-full justify-between items-center flex">
              <input value={client.name} placeholder="Client Name *" onChange={(e)=>{handleInputChange(e, 'name')}} required={true} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input value={client.cr} placeholder="Client CR No* " onChange={(e)=>{handleInputChange(e, 'cr')}} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <div className={`w-full`} onClick={toggleOpen}>
              <summary className="btn bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 text-start focus:opacity-100 hover:bg-tertiary" onClick={toggleOpen}>{dropdownText}</summary>
              <ul className={`${open ? " flex mt-2 bg-tertiary shadow menu dropdown-content z-[1] rounded-box w-full border-2 border-main font-bold text-black" : 'hidden' }`}>
                {
                  companies.map((company, index) => (
                    <li key={index} onClick={()=>{setOpen(false); setDropdownText(company.name); handleDropdownChange(company.cr, 'companyCr')}} tabIndex={index} className="transition duration-500 rounded-xl hover:text-black hover:bg-bg"><a>{company.name}</a></li>
                  ))
                }
              </ul>
            </div>
            <input value={client.address} placeholder="Address *" onChange={(e)=>{handleInputChange(e, 'address')}} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input value={client.contact.number} placeholder="Contact Number *" onChange={(e)=>{handleInputChange(e, 'contact number')}} required={true} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input value={client.contact.person} placeholder="Contact Name *" onChange={(e)=>{handleInputChange(e, 'contact person')}} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input ref={fileInputRef} placeholder="Attachment *"  formEncType="multipart/form-data" onChange={(e)=>{handleInputChange(e, 'attachment')}} type="file" accept=".pdf" className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <button onClick={handleCreation} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-black font-bold hover:scale-110 hover:border-transparent ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Add Client</button>
            <button className={`w-full bg-transparent rounded p-2 mt-4 text-black transition duration-300 hover:scale-105 font-bold border-[1px] border-black ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} onClick={()=>{handleBtnClicks(1)}}>Cancel</button>
          </div>
        </dialog>
        <dialog id="client_address_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg">
            <h3 className="font-bold text-lg">Client Address</h3>
            <p className="py-4">{localClient.address}</p>
            <button onClick={()=>{handleBtnClicks(2)}} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent'>Close</button>
          </div>
        </dialog>
        <dialog id="client_contracts_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg">
            <h3 className="font-bold text-lg">Client Contracts</h3>
            <p className="py-4">Below are the contracts this client is a part of</p>
            <div className="flex justify-center items-center flex-col">
                {localClient.contracts.map((contract, index) => (
                  <div key={index} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl text-black p-2 mt-3 border-none w-full'>
                    <h1 className="text-black">{getContract(contract).id} ({getContract(contract).amount} OMR) [{getContract(contract).date}]</h1>
                  </div>
                ))}
            </div>
            <button onClick={()=>{handleBtnClicks(3)}} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent'>Close</button>
          </div>
        </dialog>
        <dialog id="client_update_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg">
            <h3 className="font-bold text-lg">Update a Client</h3>
            <p className="py-4">You must fill out any of the fields.</p>
            <div className="w-full justify-between items-center flex">
              <input value={updatedClient.name} onChange={(e)=>{handleUpdateChange(e, 'name')}} required={true} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input value={updatedClient.cr} onChange={(e)=>{handleUpdateChange(e, 'cr')}} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input value={updatedClient.address} onChange={(e)=>{handleUpdateChange(e, 'address')}} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input value={updatedClient.contact.number} onChange={(e)=>{handleUpdateChange(e, 'contact number')}} required={true} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input value={updatedClient.contact.person} onChange={(e)=>{handleUpdateChange(e, 'contact person')}} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <button onClick={handleUpdate} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent'>Update Client</button>
            <button className='w-full bg-transparent rounded p-2 mt-4 text-black transition duration-300 hover:scale-105 font-bold border-[1px] border-black' onClick={()=>{handleBtnClicks(4)}}>Cancel</button>
            <button onClick={async () => {
              handleBtnClicks(4)
              const resp = await axios.post(`${serverUri}/api/clients/delete`, {id: updatedClient.id, token: localStorage.getItem('token')})
              console.log(resp.data)
            }} className='w-full text-black bg-red-500 rounded border-[1px] border-red-500 p-2 mt-4 text-black transition duration-300 hover:bg-transparent hover:text-red-500 font-bold hover:scale-110 hover:border-transparent'>Delete Client</button>
          </div>
        </dialog>
      </div>
      <div className="flex justify-center items-center mt-12 w-full mb-12 ">
        <div className="overflow-x-auto overflow-y-scroll w-full">
          <table className="table text-black overflow-y-scroll w-full">
            {/* head */}
            <thead>
              <tr className="text-black">
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
              {clients.length > 0 ? clients.map((client,index) => (
                <tr tabIndex={index} key={index}>
                  <th>{client.name}</th>
                  <td>{client.cr}</td>
                  <td>{client.companyCr}</td>
                  <td>{client.contact.number}</td>
                  <td><a onClick={()=>{(document.getElementById('client_address_modal') as HTMLDialogElement)?.showModal(); setLocalClient(client)}} className="underline cursor-pointer">View</a></td>
                  <td><a onClick={()=>{(document.getElementById('client_contracts_modal') as HTMLDialogElement)?.showModal(); setLocalClient(client)}} className="underline cursor-pointer">View</a></td>
                  <td><a href={client.attachment} className="underline cursor-pointer">View</a></td>
                  <td><a onClick={()=>{setUpdatedClient(client);(document.getElementById('client_update_modal') as HTMLDialogElement).showModal()}} className="underline cursor-pointer transition duration-500 hover:opacity-50">Edit</a></td>
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