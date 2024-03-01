'use client'
import { FaPlus } from "react-icons/fa6"
import React from 'react'
import { useRouter } from "next/navigation"
import Company from "@/schemas/company"
import axios from "axios"
import Client from "@/schemas/client"
import Contract from "@/schemas/contract"
import Installment from "@/schemas/installment"
import { serverUri } from "@/data"

function sleep (ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
function ContractsPage() {
  const [totalInstallmentAmount, setTotalInstallmentAmount] = React.useState(0)
  const [installments, setInstallments] = React.useState<Array<Installment>>([]) 
  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)
  const [dropdownText, setDropdownText] = React.useState('Company *')
  const [dropdownText2, setDropdownText2] = React.useState('Client *')
  const [disabled2, setDisabled2] = React.useState(true)
  const [disabled, setDisabled] = React.useState(false)
  const [clients, setClients] = React.useState<Array<Client>>([])
  const [companies, setCompanies] = React.useState<Array<Company>>([])
  const [contracts, setContracts] = React.useState<Array<Contract>>([])
  const [shake, setShake] = React.useState(false)
  const [localContract, setLocalContract] = React.useState<Contract>({
    companyCr: '',
    clientId: '',
    id: '',
    installments: [],
    date: '',
    amount: 0,
    description: '',
    percentage: 0,
  }
  )
  const [contract, setContract] = React.useState<Contract>({
    companyCr: '',
    clientId: '',
    id: '',
    installments: [],
    date: '',
    amount: 0,
    description: '',
    percentage: 0,
  })
  const handleDropdownChange = async (value: string, type: 'companyCr' | 'clientId') => {
    let tempContract = contract
    switch(type) {
      case 'companyCr':
        tempContract.companyCr = value
        break
      case 'clientId':
        tempContract.clientId = value
        break
    }
    setContract(tempContract)
    console.log(tempContract)
  }
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'date' | 'amount' | 'description' | 'percentage') => {
    let tempContract = contract
    switch(type) {
      case 'date':
        tempContract.date = e.target.value
        break
      case 'amount':
        if(!isNaN(parseInt(e.target.value))) {
          if(parseInt(e.target.value) > 0) {
            setDisabled2(false)
          } else {
            setDisabled2(true)
          }
          tempContract.amount = parseInt(e.target.value)
        } else {
          setDisabled2(true)
        }
        break
      case 'description':
        tempContract.description = e.target.value
        break
      case 'percentage':
        if(!isNaN(parseInt(e.target.value))) {
          tempContract.percentage = parseInt(e.target.value)
        }
        break
    }
    setContract(tempContract)
    console.log(contract)
  }
  
  const handleCreation = async () => {
    try {
      setDisabled(true)
      const contractWithInstallment: Contract = {
        ...contract,
        installments: installments
      }
      console.log(1, installments)
      console.log(contractWithInstallment)
      const response = await axios.post(`${serverUri}/api/contracts/create`, {contract: contractWithInstallment, token: localStorage.getItem('token')})
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
        (document.getElementById('contract_modal') as HTMLDialogElement)?.close()
        break
      case 2:
        (document.getElementById('installment_modal') as HTMLDialogElement)?.close()
        break
      case 3:
        (document.getElementById('contract_installments_modal') as HTMLDialogElement)?.close()
        break
      case 4:
        (document.getElementById('contract_description_modal') as HTMLDialogElement)?.close()
        break
    }
  }
  const toggleOpen = () => {
    setOpen(!open)
  }
  const toggleOpen2 = () => {
    setOpen2(!open2)
  }
  const handleInstallmentChange = (index:number, value: string, type: 'amount' | 'date') => {
    let oldElement = installments[index]
    let exVal = parseInt(value)

    switch (type) {
      case 'amount':
        if(isNaN(exVal)) exVal = 0
        let installmentAmountTemp = totalInstallmentAmount - oldElement.amount + exVal
        setTotalInstallmentAmount(installmentAmountTemp)
        oldElement.amount = exVal
        break
      case 'date':
        oldElement.date = value
        break
    }

    let installmentsTemp = installments

    installmentsTemp.splice(index, 1, oldElement)

    setInstallments(installmentsTemp)
    console.log(installments)
  }
  const fetchLocalClients = (companyCr: string) => {
    let localClients: Array<Client> = []
    clients.map((client) => {
      if(client.companyCr == companyCr) localClients.push(client)
    })
    return localClients
  }
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await axios.get(`${serverUri}/api/companies/fetch?token=${localStorage.getItem('token')}`);
        setCompanies(companiesResponse.data.data);
        
        const clientsResponse = await axios.get(`${serverUri}/api/clients/fetch?token=${localStorage.getItem('token')}`);
        setClients(clientsResponse.data.data);
        
        const contractsResponse = await axios.get(`${serverUri}/api/contracts/fetch?token=${localStorage.getItem('token')}`);
        setContracts(contractsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 10 seconds
    const interval = setInterval(fetchData, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <div className='flex justify-start items-start max-w-full h-full flex-col overflow-y-scroll'>
      <div className='flex justify-between items-start  w-full'>
        <h1 className='text-3xl font-bold text-white'>Contracts</h1>
        <button className="flex justify-center items-center bg-white rounded-xl text-black p-2 font-bold transition duration-500 hover:scale-125 hover:bg-transparent hover:text-white" onClick={()=>(document.getElementById('contract_modal') as HTMLDialogElement)?.showModal()}><FaPlus size={18}/></button>
        <dialog id="contract_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8">
            <h3 className="font-bold text-lg">Create a Contract</h3>
            <p className="py-4">You must fill out all the fields.</p>
            <div className={`w-full`} onClick={()=>{toggleOpen(); setDropdownText2('Client *'); setContract({...contract, clientId: ''})}}>
              <summary className="btn bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 text-start focus:opacity-100" onClick={toggleOpen}>{dropdownText}</summary>
              <ul className={`${open ? " flex shadow menu dropdown-content z-[1] rounded-box w-full bg-[rgba(149,165,166,1)] border-2 border-base-100 font-bold text-black" : 'hidden' }`}>
                {
                  companies.map((company, index) => (
                    <li onClick={()=>{setOpen(false); setDropdownText(company.name); handleDropdownChange(company.cr, 'companyCr')}} tabIndex={index} className="transition duration-500 rounded-xl hover:bg-base-100 hover:text-white"><a>{company.name}</a></li>
                  ))
                }
              </ul>
            </div>
            <div className={`w-full ${contract.companyCr == '' ? 'pointer-events-none opacity-50' : ''}`} onClick={toggleOpen2}>
              <summary className="btn bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 text-start focus:opacity-100" onClick={toggleOpen2}>{dropdownText2}</summary>
              <ul className={`${open2 ? "flex shadow menu dropdown-content z-[1] rounded-box w-full bg-[rgba(149,165,166,1)] border-2 border-base-100 font-bold text-black" : 'hidden' }`}>
                {
                  fetchLocalClients(contract.companyCr).map((client, index) => (
                    <li onClick={()=>{setOpen(false); setDropdownText2(client.name); handleDropdownChange(client.id, 'clientId')}} tabIndex={index} className="transition duration-500 rounded-xl hover:bg-base-100 hover:text-white"><a>{client.name}</a></li>
                  ))
                }
              </ul>
            </div>
            <input placeholder="Description *" onChange={(e)=>{handleInputChange(e, 'description')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <div className="w-full justify-between items-center flex">
              <input placeholder="Amount *" type="number" onChange={(e)=>{handleInputChange(e, 'amount')}} required={true} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl text-white p-2 mr-1 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
              <input placeholder="Percentage *" type="number" onChange={(e)=>{handleInputChange(e, 'percentage')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl ml-1 text-white p-2 w-6/12 mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            </div>
            <input placeholder="Deadline *"  formEncType="multipart/form-data" onChange={(e)=>{handleInputChange(e, 'date')}} type="date" className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
            <button onClick={()=>(document.getElementById('installment_modal') as HTMLDialogElement)?.showModal()} className={`bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 ${!disabled2 ? 'hover:cursor-pointer hover:opacity-75 focus:outline-none focus:scale-105 focus:opacity-100' : ' pointer-events-none cursor-not-allowed hover:cursor-not-allowed opacity-90'}`}>{disabled2 ? 'Please insert an amount' : installments.length < 0 ? 'Configure Installments' : 'Total Installments Configured : ' + installments.length}</button>
            <button onClick={handleCreation} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent'>Add Contract</button>
            <button className='w-full bg-transparent rounded p-2 mt-4 text-white transition duration-300 hover:scale-105 font-bold border-[1px] border-white' onClick={()=>{handleBtnClicks(1)}}>Cancel</button>
          </div>
        </dialog>
        <dialog id="installment_modal" className={`modal`}>
          <div className="modal-box px-8">
            <h3 className="font-bold text-lg">Installments</h3>
            <p className="py-4">Create an Installment, or remove one by clicking on the buttons below! Make sure to not go over initial Amount</p>
            <button className="bg-white rounded-xl p-2 text-black font-bold mr-2 transition duration-500 hover:scale-105 cursor-pointer active:scale-90" onClick={() => {let oldIns = installments;oldIns.push({amount: 0, date: Date(), paid: false}); setInstallments(oldIns); console.log(installments)}}>New Installment</button>
            <button className="bg-white rounded-xl p-2 text-black font-bold ml-2 transition duration-500 hover:scale-105 cursor-pointer active:scale-90" onClick={() => {let oldIns = installments;oldIns.pop(); setInstallments(oldIns); setTotalInstallmentAmount(totalInstallmentAmount - oldIns[oldIns.length - 1].amount)}}>Remove Installment</button>
            {
              installments.map((installment, index) => (
                <div key={index} className="flex justify-center items-center w-full mt-4 flex-col">
                  <input type="number" placeholder={`Installment #${index + 1} Amount *`}onChange={(e)=>{handleInstallmentChange(index, e.target.value, 'amount')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100'></input>
                  <input placeholder={`Installment #${index + 1} Deadline *`} onChange={(e)=>{handleInstallmentChange(index, e.target.value, 'date')}} className='bg-[rgba(149,165,166,0.7)] border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl  text-white p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100' type="date"></input>
                </div>
              ))
            }
            <h1 className="mt-6 text-sm">Total Contract Amount : {contract.amount}</h1>
            <h1 className="">Total Installment Amount : <span className={`${totalInstallmentAmount > contract.amount || totalInstallmentAmount < contract.amount ? 'text-red-500' : ''}`}>{totalInstallmentAmount} OMR</span></h1>
            <button onClick={()=>{handleBtnClicks(2)}} className={`${totalInstallmentAmount > contract.amount || totalInstallmentAmount < contract.amount? 'pointer-events-none opacity-50' : ''} w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent`}>Submit</button>
          </div>
        </dialog>
        <dialog id="contract_installments_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8">
            <h3 className="font-bold text-lg">Contract Installments</h3>
            <p className="py-4">Below are the installments this contract has. Green Ones have been paid. You can mark one paid by clicking the button.</p>
            <div className="flex justify-center items-center flex-col">
                {localContract.installments.map((installment, index) => (
                  <div className={`${!installment.paid ? 'bg-[rgba(149,165,166,0.7)]' : 'bg-emerald-400'} border-[1px] border-[rgba(1,1,1,0.7)] rounded-xl text-white p-2 mt-3 border-none w-full flex justify-between`}>
                    <h1>{installment.amount} OMR [{installment.date}]</h1>
                    {!installment.paid ? 
                    <h1 onClick={async () => {
                      const resp = await axios.post(`${serverUri}/api/installments/pay`, {token: localStorage.getItem('token'), contract: localContract, installmentIndex: index});
                      console.log(resp.data);
                      ((document.getElementById('contract_installments_modal') as HTMLDialogElement)?.close())
                    }} className="underline cursor-pointer">Mark As Paid</h1> : <></>}
                  </div>
                ))}
            </div>
            <button onClick={()=>{handleBtnClicks(3)}} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent'>Close</button>
          </div>
        </dialog>
        <dialog id="contract_description_modal" className={`modal ${shake ? 'animate-shake' : ''}`}>
          <div className="modal-box px-8">
            <h3 className="font-bold text-lg">Contract Description</h3>
            <p className="py-4">{localContract.description}</p>
            <button onClick={()=>{handleBtnClicks(4)}} className='w-full bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent hover:text-main font-bold hover:scale-110 hover:border-transparent'>Close</button>
          </div>
        </dialog>
      </div>
      <div className="flex justify-center items-center mt-12 max-w-full mb-12">
        <div className="overflow-x-visible overflow-y-scroll w-full">
          <table className="table table-zebra" style={{ maxWidth: '100%' }}>
            {/* head */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Company Cr</th>
                <th>Client Name</th>
                <th>Installments</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody className="overflow-y-scroll overflow-x-visible w-full">
              {contracts.length > 0 ? contracts.map((contract, index) => (
                <tr tabIndex={index} className="w-full" key={contract.id}>
                  <th className="whitespace-nowrap">{contract.id}</th>
                  <td onClick={()=>{(document.getElementById('contract_description_modal') as HTMLDialogElement)?.showModal();setLocalContract(contract)}} className="underline cursor-pointer">View</td>
                  <td>{contract.companyCr}</td>
                  <td>{clients.find(client => client.id === contract.clientId)?.name || 'None Found'}</td>
                  <td><a onClick={() => {setLocalContract(contract); (document.getElementById('contract_installments_modal') as HTMLDialogElement)?.showModal(); console.log(contract)}} className="underline cursor-pointer">View</a></td>
                  <td>{contract.date}</td>
                  <td>{contract.amount}</td>
                  <td>{contract.percentage}</td>
                  <td onClick={async () => {
                    const resp = await axios.post(`${serverUri}/api/contracts/delete`, {contract: contract, token: localStorage.getItem('token')})
                    console.log(resp.data)
                  }} className="underline cursor_pointer cursor-pointer transition duration-500 hover:opacity-50">Delete</td>
                </tr>
              )) : ''}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default ContractsPage