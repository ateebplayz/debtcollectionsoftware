import { serverUri } from '@/data'
import Client from '@/schemas/client'
import Company from '@/schemas/company'
import Contract from '@/schemas/contract'
import axios from 'axios'
import daisyui from 'daisyui'
import React from 'react'

function ReportsPage() {
  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)
  const [localCompanyId, setlocalCompanyId] = React.useState('')
  const [localClientId, setlocalClientId] = React.useState('')
  const [dropdownText, setDropdownText] = React.useState('Company *')
  const [dropdownText2, setDropdownText2] = React.useState('Client *')
  const [clients, setClients] = React.useState<Array<Client>>([])
  const [companies, setCompanies] = React.useState<Array<Company>>([])
  const [localContracts, setLocalContracts] = React.useState<Array<Contract>>([])
  const [disabled, setDisabled] = React.useState(false)
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

  const [page, setPage] = React.useState<'client' | 'default' | 'company' | 'overall'>('default')

  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await axios.get(`${serverUri}/api/companies/fetch?token=${localStorage.getItem('token')}`);
        setCompanies(companiesResponse.data.data);
        
        const clientsResponse = await axios.get(`${serverUri}/api/clients/fetch?token=${localStorage.getItem('token')}`);
        setClients(clientsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const interval = setInterval(fetchData, 1000)
    return () => clearInterval(interval)
  }, [])
  const handleGeneration = async (type: 'overall' | 'client' | 'company') => {
    switch(type) {
      case 'client':
        const clientReq = await axios.get(`${serverUri}/api/clients/fetch/specific?token=${localStorage.getItem('token')}&id=${localClientId}`)
        const reportReq = await axios.get(`${serverUri}/api/reports/fetch?token=${localStorage.getItem('token')}&type=${type}&key=${localClientId}`)
        if(clientReq.data.code == 200 && reportReq.data.code == 200) {
          setLocalClient(clientReq.data.data)
          setLocalContracts(reportReq.data.data)
          setPage('client')
          setDisabled(false)
        } else setDisabled(false)
        break
      case 'company':
        const companyReq = await axios.get(`${serverUri}/api/companies/fetch/specific?token=${localStorage.getItem('token')}&cr=${localCompanyId}`)
        const reportCReq = await axios.get(`${serverUri}/api/reports/fetch?token=${localStorage.getItem('token')}&type=${type}&key=${localCompanyId}`)
        if(companyReq.data.code == 200 && reportCReq.data.code == 200) {
          setLocalCompany(companyReq.data.data)
          setLocalContracts(reportCReq.data.data)
          setPage('company')
          setDisabled(false)
        } else setDisabled(false)
        break
      case 'overall':
        const reportOReq = await axios.get(`${serverUri}/api/reports/fetch?token=${localStorage.getItem('token')}&type=${type}&key=none`)
        if(reportOReq.data.code == 200) {
          setLocalContracts(reportOReq.data.data)
          setPage('overall')
          setDisabled(false)
        } else setDisabled(false)
    }
  }
  const getTotalIncomes = (type: 'unpaid' | 'paid' | 'income') => {
    let totalIncome = 0
    switch (type) {
      case 'paid':
        localContracts.map((contract) => {
          contract.installments.map((installment) => {
            if(installment.paid) totalIncome += installment.amount
          })
        })
        break
      case 'unpaid':
        localContracts.map((contract) => {
          contract.installments.map((installment) => {
            if(!installment.paid) totalIncome += installment.amount
          })
        })
        break
      case 'income':
        localContracts.map((contract) => {
          contract.installments.map((installment) => {
            if(installment.paid) totalIncome += (installment.amount * contract.percentage)/100
          })
        })
        totalIncome = parseInt(totalIncome.toFixed(3))
    }
    return totalIncome
  }
  return (
    <div className='overflow-y-auto w-full'>
      {page == 'default' ? 
      <><div className='bg-main w-full p-8 rounded-xl flex flex-row items-center justify-between'>
          <h1 className='font-bold text-3xl'>Client Based Report</h1>
          <div className='w-72 flex justify-center items-center h-full flex-col'>
            <div className={`w-full`} onClick={() => { setOpen2(!open2) } }>
              <summary className={`btn bg-bg border-[1px] border-bg placeholder-black rounded-xl text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 text-start focus:opacity-100 hover:bg-bg  ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} onClick={() => { setOpen2(!open2) } }>{dropdownText2}</summary>
              <ul className={`${open2 ? " flex mt-2 bg-bg shadow menu dropdown-content z-[1] rounded-box w-full border-2 border-main font-bold text-black" : 'hidden'}`}>
                {clients.map((client, index) => (
                  <li key={index} onClick={() => { setOpen2(false); setDropdownText2(client.name); setlocalClientId(client.id) } } tabIndex={index} className="transition duration-500 rounded-xl hover:text-black hover:bg-tertiary"><a>{client.name} | {client.companyCr} (Company)</a></li>
                ))}
              </ul>
            </div>
            <button onClick={() => { setDisabled(true); handleGeneration('client')}} className={`w-full bg-bg rounded-xl border-[1px] border-main p-2 mt-2 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${disabled || localClientId == '' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Generate</button>
          </div>
        </div>
          <div className='bg-main w-full p-8 rounded-xl flex flex-row items-center justify-between mt-8'>
            <h1 className='font-bold text-3xl'>Company Based Report</h1>
            <div className='w-72 flex justify-center items-center h-full flex-col'>
              <div className={`w-full`} onClick={() => { setOpen(!open) } }>
                <summary className={`btn bg-bg border-[1px] border-bg placeholder-black rounded-xl text-black p-2 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 text-start focus:opacity-100 hover:bg-bg  ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} onClick={() => { setOpen(!open) } }>{dropdownText}</summary>
                <ul className={`${open ? " flex mt-2 bg-bg shadow menu dropdown-content z-[1] rounded-box w-full border-2 border-main font-bold text-black" : 'hidden'}`}>
                  {companies.map((company, index) => (
                    <li key={index} onClick={() => { setOpen(false); setDropdownText(company.name); setlocalCompanyId(company.cr) } } tabIndex={index} className="transition duration-500 rounded-xl hover:text-black hover:bg-tertiary"><a>{company.name}</a></li>
                  ))}
                </ul>
              </div>
              <button onClick={() => { setDisabled(true); handleGeneration('company')}} className={`w-full bg-bg rounded-xl border-[1px] border-main p-2 mt-2 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${disabled || localCompanyId == '' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Generate</button>
            </div>
          </div><div className='bg-main w-full p-8 rounded-xl flex flex-row items-center justify-between mt-8'>
            <h1 className='font-bold text-3xl'>Overall Report</h1>
            <div className='w-72 flex justify-center items-center h-full flex-col'>
              <button onClick={() => { setDisabled(true); handleGeneration('overall') } } className={`w-full bg-bg rounded-xl border-[1px] border-main p-2 mt-2 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Generate</button>
            </div>
          </div></>
      :
      page == 'client' ?
        <div>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-3xl font-bold'>Client #{localClientId} Report</h1>
              <h1 className='mt-2 text-md font-bold'>Date: <span className='font-normal'>{Date()}</span></h1>
              <h1><span className='font-bold'>Paid Debt: </span>{getTotalIncomes('paid')} OMR</h1>
              <h1><span className='font-bold'>Unpaid Debt: </span>{getTotalIncomes('unpaid')} OMR</h1>
            </div>
            <div>
              <h1 className='font-bold'>Client Details</h1>
              <h1><span className='font-bold'>Name </span>: {localClient.name}</h1>
              <h1><span className='font-bold'>ID </span>: {localClient.id}</h1>
              <h1><span className='font-bold'>CR </span>: {localClient.cr}</h1>
              <h1><span className='font-bold'>Company </span>: {localClient.companyCr}</h1>
              <h1><span className='font-bold'>Address </span>: {localClient.address}</h1>
              <h1><span className='font-bold'>Contact Name </span>: {localClient.contact.person}</h1>
              <h1><span className='font-bold'>Contact Number </span>: {localClient.contact.number}</h1>
            </div>
          </div>
          <div>
            {localContracts.map((contract, index) => (
              <div key={index} className='flex flex-row border-4 border-main rounded-xl w-full mt-4 p-8 flex-row'>
                <div className='w-3/12'>
                  <h1 className='font-bold mb-2'>{contract.id}</h1>
                  <h1 className=''><span className='font-bold'>Description : </span>{contract.description}</h1>
                  <h1 className=''><span className='font-bold'>Commission : </span>{contract.percentage}</h1>
                  <h1 className=''><span className='font-bold'>Deadline : </span>{contract.date}</h1>
                  <h1 className=''><span className='font-bold'>Amount : </span>{contract.amount} OMR</h1>
                </div>
                <div className='flex-col flex justify-center items-center w-9/12'>
                  <h1 className='text-3xl font-bold'>Installments</h1>
                  <table className="table text-black w-full">
                    <thead>
                      <tr className="text-black">
                        <th>Index</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="overflow-y-scroll overflow-x-visible w-full">
                      {contract.installments.length > 0 ? contract.installments.map((installment, index) => (
                        <tr tabIndex={index} className={`w-full ${installment.paid ? 'bg-green-300 rounded' : 'bg-red-300 rounded'}`} key={index}>
                          <th className="whitespace-nowrap">{index}</th>
                          <td>{installment.amount} OMR</td>
                          <td>{installment.date}</td>
                          <td>{installment.paid ? 'Paid' : 'Unpaid'}</td>
                        </tr>
                      )) : ''}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div> 
      :
      page == 'company' ?
        <div>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-3xl font-bold'>Company #{localCompanyId} Report</h1>
              <h1 className='mt-2 text-md font-bold'>Date: <span className='font-normal'>{Date()}</span></h1>
              <h1><span className='font-bold'>Paid Debt: </span>{getTotalIncomes('paid')} OMR</h1>
              <h1><span className='font-bold'>Unpaid Debt: </span>{getTotalIncomes('unpaid')} OMR</h1>
            </div>
            <div>
              <h1 className='font-bold'>Company Details</h1>
              <h1><span className='font-bold'>Name </span>: {localCompany.name}</h1>
              <h1><span className='font-bold'>CR </span>: {localCompany.cr}</h1>
              <h1><span className='font-bold'>Address </span>: {localCompany.address}</h1>
              <h1><span className='font-bold'>Contact Name </span>: {localCompany.contact.person}</h1>
              <h1><span className='font-bold'>Contact Number </span>: {localCompany.contact.number}</h1>
            </div>
          </div>
          <div>
            {localContracts.map((contract, index) => (
              <div key={index} className='flex flex-row border-4 border-main rounded-xl w-full mt-4 p-8 flex-row'>
                <div className='w-3/12'>
                  <h1 className='font-bold mb-2'>{contract.id}</h1>
                  <h1 className=''><span className='font-bold'>Description : </span>{contract.description}</h1>
                  <h1 className=''><span className='font-bold'>Commission : </span>{contract.percentage}</h1>
                  <h1 className=''><span className='font-bold'>Deadline : </span>{contract.date}</h1>
                  <h1 className=''><span className='font-bold'>Amount : </span>{contract.amount} OMR</h1>
                </div>
                <div className='flex-col flex justify-center items-center w-9/12'>
                  <h1 className='text-3xl font-bold'>Installments</h1>
                  <table className="table text-black w-full">
                    <thead>
                      <tr className="text-black">
                        <th>Index</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="overflow-y-scroll overflow-x-visible w-full">
                      {contract.installments.length > 0 ? contract.installments.map((installment, index) => (
                        <tr tabIndex={index} className={`w-full ${installment.paid ? 'bg-green-300 rounded' : 'bg-red-300 rounded'}`} key={index}>
                          <th className="whitespace-nowrap">{index}</th>
                          <td>{installment.amount} OMR</td>
                          <td>{installment.date}</td>
                          <td>{installment.paid ? 'Paid' : 'Unpaid'}</td>
                        </tr>
                      )) : ''}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      :
      page == 'overall' ?
      <div>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-3xl font-bold'>Overall Report</h1>
            <h1 className='mt-2 text-md font-bold'>Date: <span className='font-normal'>{Date()}</span></h1>
            <h1><span className='font-bold'>Paid Debt: </span>{getTotalIncomes('paid')} OMR</h1>
            <h1><span className='font-bold'>Unpaid Debt: </span>{getTotalIncomes('unpaid')} OMR</h1>
            <h1><span className='font-bold'>Income: </span>{getTotalIncomes('income')} OMR</h1>
          </div>
        </div>
        <div>
          {localContracts.map((contract, index) => (
            <div key={index} className='flex flex-row border-4 border-main rounded-xl w-full mt-4 p-8 flex-row'>
              <div className='w-3/12'>
                <h1 className='font-bold mb-2'>{contract.id}</h1>
                <h1 className=''><span className='font-bold'>Description : </span>{contract.description}</h1>
                <h1 className=''><span className='font-bold'>Commission : </span>{contract.percentage}</h1>
                <h1 className=''><span className='font-bold'>Deadline : </span>{contract.date}</h1>
                <h1 className=''><span className='font-bold'>Amount : </span>{contract.amount} OMR</h1>
              </div>
              <div className='flex-col flex justify-center items-center w-9/12'>
                <h1 className='text-3xl font-bold'>Installments</h1>
                <table className="table text-black w-full">
                  <thead>
                    <tr className="text-black">
                      <th>Index</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-scroll overflow-x-visible w-full">
                    {contract.installments.length > 0 ? contract.installments.map((installment, index) => (
                      <tr tabIndex={index} className={`w-full ${installment.paid ? 'bg-green-300 rounded' : 'bg-red-300 rounded'}`} key={index}>
                        <th className="whitespace-nowrap">{index}</th>
                        <td>{installment.amount} OMR</td>
                        <td>{installment.date}</td>
                        <td>{installment.paid ? 'Paid' : 'Unpaid'}</td>
                      </tr>
                    )) : ''}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      :
      <></>
      }
    </div>
  )
}

export default ReportsPage