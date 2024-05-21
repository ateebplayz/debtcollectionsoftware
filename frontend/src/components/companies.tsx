'use client'
import '../app/globals.css'
import { FaPlus } from "react-icons/fa6"
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation"
import Company from "../schemas/company"
import axios from "axios"
import Client from "../schemas/client"
import { serverUri } from "@/data"
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
function CompaniesPage() {
  const [error, setError] = React.useState('')
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
    attachment: [],
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
    attachment: [],
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
    attachment: [],
    clients: []
  })
  const [attachmentCompany, setAttachmentCompany] = React.useState<Company>({
    name: "",
    cr: "",
    address: "",
    contact: {
      number: "",
      person: "",
    },
    attachment: [],
    clients: []
  })
  const [attachments, setAttachments] = React.useState<Array<{name: string, value: string}>>([])
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
    }
    setCompany(companyTemp); // Set the state using the modified copy
  };
  const removeAttachmentWithIndex = (index: number) => {
    let array = [...attachmentCompany.attachment]
    let filteredArray: Array<{name: string, value: string}> = []
    array.map((a, i) => {
      if(i !== index) filteredArray.push(a)
    })
    return filteredArray
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
  const handleCreation = async () => {
    try {
      setDisabled(true)
      let companyT = {...company}
      companyT.attachment = attachments
      const response = await axios.post(`${serverUri}/api/companies/create`, {company: companyT, token: localStorage.getItem('token')})
      console.log(response.data)
      if(response.data.code == 200) {
        setError('')
        handleBtnClicks(1)
        setCompany({
          name: '',
          cr: "",
          address: "",
          contact: {
            number: "",
            person: "",
          },
          attachment: [],
          clients: []
        })
        setAttachments([])
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
  const handleBtnClicks = (btn: number) => {
    switch (btn) {
      case 0:
        break
      case 1:
        setAttachments([])
        setError('');
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
      cr: '',
      companyCr: "",
      name: "",
      id: "",
      address: "",
      contact: {
        number: "",
        person: ""
      },
      attachment: [],
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
    }
    console.log(companyTemp)
    setToUpdateCompany(companyTemp)
  }
  const areAttachmentsEmpty = () => {
    let flag = true
    attachments.map((a)=>{
      if(a.name == '') flag=false
      if(a.value == '') flag=false
    })
    return flag
  }
  const updateTheCompany = async () => {
    (document.getElementById('company_update_modal') as HTMLDialogElement)?.close()
    const resp = await axios.post(`${serverUri}/api/companies/update`, {token: localStorage.getItem('token'), company: toUpdateCompany});
    console.log(resp.data);
  }
  const [localAttachment, sestLocalAttachment] = React.useState({name: '', value: ''})
  return (
    <div className='flex justify-start items-start w-full h-full flex-col overflow-y-scroll'>
      <div className='flex justify-between items-start  w-full'>
        <h1 className='text-3xl font-bold'>Companies</h1>
        <button className="flex justify-center items-center bg-tertiary rounded-xl text-black p-2 font-bold transition duration-500 hover:scale-125 hover:bg-transparent hover:text-black" onClick={()=>(document.getElementById('company_modal') as HTMLDialogElement)?.showModal()}><FaPlus size={18}/></button>
        <dialog id="company_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg ">
            <h3 className="font-bold text-lg">Create a Company</h3>
            <p className="py-4">You must fill out all the fields.</p>
            {error !== '' ?
            <div className='w-full flex justify-center items-center p-2 bg-red-200 border-2 border-red-500 rounded-lg text-red-500'>
              <p className='text-center'>{error}</p>
            </div>
            : <></>}
            <div className="w-full justify-between items-center flex placeholder-tertiary">
              <input value={company.name} placeholder="Company Name *" onChange={(e)=>{handleInputChange(e, 'name')}} required={true} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100 placeholder-black'></input>
              <input value={company.cr} placeholder="Company CR Number *" onChange={(e)=>{handleInputChange(e, 'cr')}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input value={company.address} placeholder="Company Address *" onChange={(e)=>{handleInputChange(e, 'address')}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input value={company.contact.number} placeholder="Contact Number *" onChange={(e)=>{handleInputChange(e, 'number')}} required={true} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input value={company.contact.person} placeholder="Contact Name *" onChange={(e)=>{handleInputChange(e, 'person')}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl ml-1 text-black p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
              <button onClick={()=>{(document.getElementById('company_attachment_modal') as HTMLDialogElement).showModal()}} className='bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'>Attachments *</button>
            <button onClick={handleCreation} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Add Company</button>
            <button className={`w-full bg-transparent rounded p-2 mt-4 text-black transition duration-300 hover:scale-105 font-bold border-[1px] border-black ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} onClick={()=>{handleBtnClicks(1)}}>Cancel</button>
          </div>
        </dialog>
        <dialog id="company_client_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg">
            <h3 className="font-bold text-lg">Clients</h3>
            <p className="py-4">Below is a list of all the clients part of company with CR {localCompany.cr}</p>
            <div>
              {
                localCompany.clients.map((clientId, index) => (
                  <div key={index} className="bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-4 w-full mt-3 border-none text-black"><p className='text-black'>{getClient(clientId).name} ({getClient(clientId).cr})</p></div>
                ))
              }
            </div>
            <button onClick={() => {handleBtnClicks(2)}} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent'>Close</button>
          </div>
        </dialog>
        <dialog id="company_attachment_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
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
            <button onClick={() => {(document.getElementById('company_attachment_modal') as HTMLDialogElement).close()}} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${areAttachmentsEmpty() ? '' : 'cursor-not-allowed pointer-events-none opacity-50'}`}>Submit</button>
          </div>
        </dialog>
        <dialog id="company_attachment_modal_add" className={`modal ${shake ? 'animate-shake' : ''}`}>
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
              let companyT = {...attachmentCompany}
              companyT.attachment.push(localAttachment)
              setAttachmentCompany(companyT);
              setLocalCompany(companyT);
              await axios.post(`${serverUri}/api/companies/update`, {token: localStorage.getItem('token'), company: companyT})
              window.location.reload()
            }} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${localAttachment.name == '' || localAttachment.value == '' ? 'cursor-not-allowed pointer-events-none opacity-50' : ''}`}>Submit</button>
          </div>
        </dialog>
        <dialog id="company_attachment_modal_view" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8 bg-bg">
            <h3 className="font-bold text-lg">Attachments</h3>
            <p className="">View attachments below</p>
            {attachmentCompany.attachment.map((a, i) => (
              <div key={i} className='flex flex-row justify-between items-center w-full mt-4 bg-tertiary border-[1px] placeholder-black border-tertiary rounded-xl  text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'>
                <h1>{a.name}</h1>
                <div className='h-full flex flex-row justify-center items-cennter'>
                <h1 className='bg-white p-2 rounded-full px-4 transition duration-500 hover:opacity-50' onClick={async ()=>{
                  let attachmentCompanyT = {...attachmentCompany}
                  attachmentCompanyT.attachment = removeAttachmentWithIndex(i)
                  setAttachmentCompany(attachmentCompanyT)
                  setLocalCompany(attachmentCompanyT)
                  await axios.post(`${serverUri}/api/companies/update`, {token: localStorage.getItem('token'), company: attachmentCompanyT})
                }}>Delete</h1>
                <h1 className='p-2' onClick={()=>{window.open(a.value)}}>View</h1>
                </div>
              </div>
            ))}
            <button onClick={() => {(document.getElementById('company_attachment_modal_add') as HTMLDialogElement).showModal(); sestLocalAttachment({name: '', value: ''})}} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${areAttachmentsEmpty() ? '' : 'cursor-not-allowed pointer-events-none opacity-50'}`}>Add New</button>
            <button onClick={() => {(document.getElementById('company_attachment_modal_view') as HTMLDialogElement).close()}} className={`w-full bg-main rounded border-[1px] border-main p-2 mt-2 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent`}>Close</button>
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
                  <td><p onClick={()=>{setAttachmentCompany(company); (document.getElementById('company_attachment_modal_view') as HTMLDialogElement).showModal()}} className="underline cursor-pointer">View</p></td>
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