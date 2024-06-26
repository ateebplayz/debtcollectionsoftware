'use client'
import { FaPlus } from "react-icons/fa6"
import React from 'react'
import { useRouter } from "next/navigation"
import Company from "@/schemas/company"
import axios from "axios"
import Client from "@/schemas/client"
import { serverUri } from "@/data"
import Contract from "@/schemas/contract"
export function generateCustomString(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < 21; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function sleep (ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
function ClientsPage() {
  const [error, setError] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [SearchQuery2, setSearchQuery2] = React.useState('')
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
    attachment: [],
    contracts: []
  })
  const [attachments, setAttachments] = React.useState<Array<{name: string, value: string}>>([])
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
    attachment: [],
    contracts: []
  })
  const [attachmentClient, setAttachmentClient] = React.useState<Client>({
    cr: '',
    companyCr: '',
    name: '',
    id: '',
    address: '',
    contact: {
        number: '',
        person: ''
    },
    attachment: [],
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
    attachment: [],
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
        if (e.target.files && e.target.files.length > 0) {
          const formData = new FormData();
          
          // Loop through each selected file
          for (let i = 0; i < e.target.files.length; i++) {
            let selectedFile = e.target.files[i];
            
            // Generate a random string for the filename
            const randomString = `${client.cr}-${i+1}`
            // Create a new file object with the modified name
            const modifiedFile = new File([selectedFile], `${randomString}.pdf`, { type: selectedFile.type });
          
            // Append the modified file to the FormData
            formData.append("files", modifiedFile);
          } 
    
          try {
            const response = await axios.post(`${serverUri}/api/files/upload`, formData);
            console.log(response.data.data);
            tempClient.attachment = response.data.data
          } catch (error) {
            console.error("Error uploading files:", error);
            // Handle error
          }
        }
        break;
        
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
      let clientT = {...client}
      clientT.attachment = attachments
      const response = await axios.post(`${serverUri}/api/clients/create`, {client: clientT, token: localStorage.getItem('token')})
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
          attachment: [],
          contracts: []})
          setAttachments([])
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
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().startsWith(SearchQuery2.toLowerCase())
  )
  const areAttachmentsEmpty = () => {
    let flag = true
    attachments.map((a)=>{
      if(a.name == '') flag=false
      if(a.value == '') flag=false
    })
    return flag
  }
  const emptyAttachment = {
    name: '',
    value: ''
  }
  const incArray = () => {
    let oldAttachments = [...attachments]
    oldAttachments.push(emptyAttachment)
    setAttachments(oldAttachments)
  }
  const decArray = () => {
    let oldAttachments = [...attachments]
    oldAttachments.pop()
    setAttachments(oldAttachments)
  }
  const editArray = (index: number, type : 'Name' | 'Value', value: string) => {
    let oldAttachments = [...attachments]
    switch(type) {
      case 'Name':
        oldAttachments[index].name = value
        break;
      case 'Value':
        oldAttachments[index].value = value
        break;
    }
    setAttachments(oldAttachments)
  }
  const getFileLink = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      
      // Loop through each selected file
      for (let i = 0; i < e.target.files.length; i++) {
        let selectedFile = e.target.files[i];
        
        // Generate a random string for the filename
        const randomString = generateCustomString()
        // Create a new file object with the modified name
        const modifiedFile = new File([selectedFile], `${randomString}.pdf`, { type: selectedFile.type });
      
        // Append the modified file to the FormData with a unique key for each file
        formData.append(`files`, modifiedFile);
      }
    
      try {
        const response = await axios.post(`${serverUri}/api/files/upload`, formData);
        return response.data.data
      } catch (error) {
        console.error("Error uploading files:", error);
        // Handle error
      }
    }
  }
  const removeAttachmentWithIndex = (index: number) => {
    let array = [...attachmentClient.attachment]
    let filteredArray: Array<{name: string, value: string}> = []
    array.map((a, i) => {
      if(i !== index) filteredArray.push(a)
    })
    return filteredArray
  }
  const [localAttachment, sestLocalAttachment] = React.useState({name: '', value: ''})
  return (
    <div className='flex justify-start items-start w-full h-full flex-col overflow-y-scroll'>
    <dialog id="client_attachment_modal_add" className={`modal ${shake ? 'animate-shake' : ''}`}>
      <div className="modal-box px-8 bg-bg">
        <h3 className="font-bold text-lg">Attachments addition</h3>
        <p className="">Add an attachment</p>
        <div className='flex justify-start mt-0 items-start flex-row'>
          <div className='flex flex-col justify-center items-center w-full mt-4 '>
            <input value={localAttachment.name} placeholder={`Attachment Name *`} onChange={(e)=>{sestLocalAttachment({...localAttachment, name: e.target.value})}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <input placeholder="Attachment *"  formEncType="multipart/form-data" onChange={async (e)=>{let fileLink = await getFileLink(e); sestLocalAttachment({...localAttachment, value: fileLink}) }} type="file" className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
          </div>
        </div>
        <button onClick={async () => {
          let clientT = {...attachmentClient}
          clientT.attachment.push(localAttachment)
          setAttachmentClient(clientT);
          setLocalClient(clientT);
          await axios.post(`${serverUri}/api/clients/update`, {token: localStorage.getItem('token'), client: clientT})
          window.location.reload()
        }} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${localAttachment.name == '' || localAttachment.value == '' ? 'cursor-not-allowed pointer-events-none opacity-50' : ''}`}>Submit</button>
      </div>
    </dialog>
    <dialog id="client_attachment_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
      <div className="modal-box px-8 bg-bg">
        <h3 className="font-bold text-lg">Attachments</h3>
        <p className="">Add or Remove attachments with their respective buttons</p>
        <div className='flex justify-start mt-0 items-start flex-row'>
          <button onClick={()=>{incArray()}} className='bg-white p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent px-8 rounded-full'>Add</button>
          <button onClick={()=>{decArray()}} className='bg-white ml-4 p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent px-8 rounded-full'>Remove</button>
        </div>
        {attachments.map((a, i) => (
          <div key={i} className='flex flex-col justify-center items-center w-full mt-4 '>
            <input value={a.name} placeholder={`Attachment ${i + 1} Name *`} onChange={(e)=>{editArray(i, 'Name', e.target.value)}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <input placeholder="Attachment *"  formEncType="multipart/form-data" onChange={async (e)=>{let fileLink = await getFileLink(e); editArray(i, 'Value', fileLink); console.log(attachments)}} type="file" accept=".pdf" className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
          </div>
        ))}
        <button onClick={() => {(document.getElementById('client_attachment_modal') as HTMLDialogElement).close()}} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${areAttachmentsEmpty() ? '' : 'cursor-not-allowed pointer-events-none opacity-50'}`}>Submit</button>
      </div>
    </dialog>
    <dialog id="client_attachment_modal_view" className={`modal ${shake ? 'animate-shake' : ''}`}>
      <div className="modal-box px-8 bg-bg">
        <h3 className="font-bold text-lg">Attachments</h3>
        <p className="">View attachments below</p>
        {attachmentClient.attachment.map((a, i) => (
          <div key={i} className='flex flex-row justify-between items-center w-full mt-4 bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'>
            <h1>{a.name}</h1>
            <div className='h-full flex flex-row justify-center items-cennter'>
                <h1 className='bg-white p-2 rounded-full px-4 transition duration-500 hover:opacity-50' onClick={async ()=>{
                  let attachmentClientT = {...attachmentClient}
                  attachmentClientT.attachment = removeAttachmentWithIndex(i)
                  setAttachmentClient(attachmentClientT)
                  setLocalClient(attachmentClientT)
                  await axios.post(`${serverUri}/api/clients/update`, {token: localStorage.getItem('token'), client: attachmentClientT})
                }}>Delete</h1>
                <h1 className='p-2' onClick={()=>{window.open(a.value)}}>View</h1>
              </div>
          </div>
        ))}
        <button onClick={() => {(document.getElementById('client_attachment_modal_add') as HTMLDialogElement).showModal(); sestLocalAttachment({name: '', value: ''})}} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${areAttachmentsEmpty() ? '' : 'cursor-not-allowed pointer-events-none opacity-50'}`}>Add New</button>
        <button onClick={() => {(document.getElementById('client_attachment_modal_view') as HTMLDialogElement).close()}} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-2 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent`}>Close</button>
      </div>
    </dialog>
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
            <div className={`w-full`} onClick={() => { setOpen(!open) }}>
              <input 
                type="text" 
                value={SearchQuery2}
                placeholder="Company *"
                className="p-3 border-b-2 border-tertiary bg-tertiary focus:outline-none focus:border-bg w-full bg-bg mt-2 placeholder-black text-black transition duration-500 hover:cursor-pointer hover:opacity-50 rounded-xl active:cursor-text active:opacity-100 focus:cursor-text focus:opacity-100 focus:outline-none" 
                onChange={(e)=>{setSearchQuery2(e.target.value)}}
              />
              <div className={`${open ? "flex mt-2 bg-tertiary shadow menu dropdown-content z-[1] rounded-box overflow-y-auto max-h-[200px] w-full border-2 border-main font-bold text-black" : 'hidden'}`}>
                <ul>
                  {filteredCompanies.map((company, index) => (
                    <li key={index} onClick={() => { setOpen(false); setSearchQuery2(company.name); handleDropdownChange(company.cr, 'companyCr') }} tabIndex={index} className="transition w-full duration-500 rounded-xl hover:text-black hover:bg-bg"><a>{company.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <input value={client.address} placeholder="Address *" onChange={(e)=>{handleInputChange(e, 'address')}} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input value={client.contact.number} placeholder="Contact Number *" onChange={(e)=>{handleInputChange(e, 'contact number')}} required={true} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input value={client.contact.person} placeholder="Contact Name *" onChange={(e)=>{handleInputChange(e, 'contact person')}} className='bg-tertiary border-[1px] border-tertiary placeholder-black rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <button onClick={()=>{(document.getElementById('client_attachment_modal') as HTMLDialogElement).showModal()}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'>Attachments *</button>
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
                    <h1 className="text-black">{getContract(contract).amount} OMR [{getContract(contract).date}]</h1>
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
                  <td><p onClick={()=>{setAttachmentClient(client); (document.getElementById('client_attachment_modal_view') as HTMLDialogElement).showModal()}} className="underline cursor-pointer">View</p></td>
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