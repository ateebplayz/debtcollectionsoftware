import { getFormattedDate, serverUri } from '@/data'
import Client from '@/schemas/client'
import Company from '@/schemas/company'
import Contract from '@/schemas/contract'
import axios from 'axios'
import daisyui from 'daisyui'
import React from 'react'

function ReportsPage() {
  const [buttonsVisible, setButtonsVisible] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)
  const [localCompanyId, setlocalCompanyId] = React.useState('')
  const [dates, setDates] = React.useState({from: '00-00-0000', to: '00-00-0000'})
  const [localClientId, setlocalClientId] = React.useState('')
  const [SearchQuery1, setSearchQuery1] = React.useState('')
  const [SearchQuery2, setSearchQuery2] = React.useState('')
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
    attachment: [],
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
    attachment: [],
    clients: []
  })

  const [page, setPage] = React.useState<'client' | 'default' | 'company' | 'overall'>('default')

  const resetPage = () => {
    setOpen(false)
    setOpen2(false)
    setlocalCompanyId('')
    setDates({ from: '00-00-0000', to: '00-00-0000' })
    setlocalClientId('')
    setSearchQuery1('')
    setSearchQuery2('')
    setDisabled(false)
    setPage('default')
  }  
  const printContent = () => {
    const printableContent = document.getElementById('printable')
    if (printableContent) {
      setButtonsVisible(false)
      const originalContents = document.body.innerHTML
      const contentToPrint = printableContent.innerHTML
      document.body.innerHTML = contentToPrint
      window.print()
      window.onafterprint = () => {
        document.body.innerHTML = originalContents
        setButtonsVisible(true)
      }
      window.location.reload()
    }
  }
  
  
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
        const reportReq = await axios.get(`${serverUri}/api/reports/fetch?token=${localStorage.getItem('token')}&type=${type}&key=${localClientId}&dateto=${dates.to}&datefrom=${dates.from}`)
        if(clientReq.data.code == 200 && reportReq.data.code == 200) {
          setLocalClient(clientReq.data.data)
          setLocalContracts(reportReq.data.data)
          setPage('client')
          setDisabled(false)
        } else setDisabled(false)
        break
      case 'company':
        const companyReq = await axios.get(`${serverUri}/api/companies/fetch/specific?token=${localStorage.getItem('token')}&cr=${localCompanyId}`)
        const reportCReq = await axios.get(`${serverUri}/api/reports/fetch?token=${localStorage.getItem('token')}&type=${type}&key=${localCompanyId}&dateto=${dates.to}&datefrom=${dates.from}`)
        console.log(reportCReq, companyReq)
        if(companyReq.data.code == 200 && reportCReq.data.code == 200) {
          setLocalCompany(companyReq.data.data)
          setLocalContracts(reportCReq.data.data)
          setPage('company')
          setDisabled(false)
        } else setDisabled(false)
        break
      case 'overall':
        const reportOReq = await axios.get(`${serverUri}/api/reports/fetch?token=${localStorage.getItem('token')}&type=${type}&key=none&dateto=${dates.to}&datefrom=${dates.from}`)
        if(reportOReq.data.code == 200) {
          setLocalContracts(reportOReq.data.data)
          setPage('overall')
          setDisabled(false)
        } else setDisabled(false)
    }
  }
  const getTotalIncome = (type: 'unpaid' | 'paid' | 'income', contract: Contract) => {
    let totalIncome = 0
    switch (type) {
      case 'paid':
        contract.installments.map((installment) => {
          if(installment.paid) totalIncome += installment.amount
        })
        break
      case 'unpaid':
        contract.installments.map((installment) => {
          if(!installment.paid) totalIncome += installment.amount
        })
        break
      case 'income':
        contract.installments.map((installment) => {
          if(installment.paid) totalIncome += (installment.amount * contract.percentage)/100
        })
        break
    }
    return totalIncome.toFixed(3)
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
        totalIncome = parseFloat(totalIncome.toFixed(3))
    }
    return totalIncome.toFixed(3)
  }
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    document.getElementById('dateToInput')?.setAttribute('min', selectedDate)
    setDates({
      ...dates,
      from: selectedDate
    })
  }
  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDates({
      ...dates,
      to: selectedDate
    })
  }
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().startsWith(SearchQuery1.toLowerCase())
  )
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().startsWith(SearchQuery2.toLowerCase())
  )
  return (
    <div className='overflow-y-auto w-full'>
      {page == 'default' ? 
      <>
        <div className='bg-main w-full p-8 rounded-xl flex flex-row items-center justify-center'>
          <input placeholder={`Date From*`} value={dates.from} onChange={handleDateFromChange} className={`mr-4 bg-bg border-[1px] border-bg placeholder-black rounded-xl  text-black p-3 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100 ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} type="date" aria-label='Date From'></input>
          <h1 className='text-5xl text-black'>-</h1>
          <input placeholder={`Date To *`} value={dates.to} id="dateToInput" onChange={handleDateToChange} className={`ml-4 bg-bg border-[1px] border-bg placeholder-black rounded-xl  text-black p-3 w-full mt-3 border-none transition duration-300 hover:cursor-pointer hover:opacity-75 focus:cursor-text focus:outline-none focus:scale-105 focus:opacity-100 ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} type="date"></input>
        </div>
        <div className='bg-main w-full p-8 rounded-xl flex flex-row items-center justify-between mt-8'>
          <h1 className='font-bold text-3xl'>Client Wise Report</h1>
          <div className='w-72 flex justify-center items-center h-full flex-col'>
          <div className={`w-full col`} onClick={() => { setOpen2(!open2) }}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="p-3 border-b-2 border-main focus:outline-none focus:border-tertiary w-full bg-bg mt-2 placeholder-black text-black transition duration-500 hover:cursor-pointer hover:opacity-50 rounded-xl active:cursor-text active:opacity-100 focus:cursor-text focus:opacity-100 focus:outline-none" 
              onChange={(e)=>{setSearchQuery1(e.target.value)}}
              value={SearchQuery1}
            />
            <div className={`${open2 ? "flex mt-2 bg-bg shadow menu dropdown-content max-h-[150px] overflow-y-auto z-[1] rounded-box w-full border-2 border-main font-bold text-black flex-col" : 'hidden'}`}>
              <ul>
              {filteredClients.map((client, index) => (
                <li key={index} onClick={() => { setOpen2(false); setSearchQuery1(client.name); setlocalClientId(client.id) }} tabIndex={index} className="transition duration-500 rounded-xl hover:text-black hover:bg-tertiary"><a>{client.name} | {client.companyCr} (Company)</a></li>
              ))}
              </ul>
            </div>
          </div>
          <button onClick={() => { setDisabled(true); handleGeneration('client')}} className={`w-full bg-bg rounded-xl border-[1px] border-main p-2 mt-2 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${disabled || localClientId == '' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Generate</button>
          </div>
        </div>
        <div className='bg-main w-full p-8 rounded-xl flex flex-row items-center justify-between mt-8'>
          <h1 className='font-bold text-3xl'>Company Wise Report</h1>
          <div className='w-72 flex justify-center items-center h-full flex-col'>
          <div className={`w-full`} onClick={() => { setOpen(!open) }}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="p-3 border-b-2 border-main focus:outline-none focus:border-tertiary w-full bg-bg mt-2 placeholder-black text-black transition duration-500 hover:cursor-pointer hover:opacity-50 rounded-xl active:cursor-text active:opacity-100 focus:cursor-text focus:opacity-100 focus:outline-none" 
              onChange={(e)=>{setSearchQuery2(e.target.value)}}
              value={SearchQuery2}
            />
            <div className={`${open ? "flex mt-2 bg-bg shadow menu dropdown-content z-[1] rounded-box overflow-y-auto max-h-[200px] w-full border-2 border-main font-bold text-black" : 'hidden'}`}>
              <ul>
                {filteredCompanies.map((company, index) => (
                  <li key={index} onClick={() => { setOpen(false); setSearchQuery2(company.name); setlocalCompanyId(company.cr) }} tabIndex={index} className="transition w-full duration-500 rounded-xl hover:text-black hover:bg-tertiary"><a>{company.name}</a></li>
                ))}
              </ul>
            </div>
          </div>

            <button onClick={() => { setDisabled(true); handleGeneration('company')}} className={`w-full bg-bg rounded-xl border-[1px] border-main p-2 mt-2 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${disabled || localCompanyId == '' ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Generate</button>
          </div>
        </div>
        <div className='bg-main w-full p-8 rounded-xl flex flex-row items-center justify-between mt-8'>
          <h1 className='font-bold text-3xl'>Overall Report</h1>
          <div className='w-72 flex justify-center items-center h-full flex-col'>
            <button onClick={() => { setDisabled(true); handleGeneration('overall') } } className={`w-full bg-bg rounded-xl border-[1px] border-main p-2 mt-2 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>Generate</button>
          </div>
        </div>
      </>
      :
      page == 'client' ?
        <div>
          <div id='printable'>
            <div className='flex justify-between items-start'>
              <div>
                <h1 className='text-3xl font-bold'>Client {localClient.name} Report</h1>
                <h1 className='mt-2 text-md font-bold'>Date: <span className='font-normal'>{getFormattedDate()}</span></h1>
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
              <table className="table text-black" style={{ maxWidth: '100%' }}>
                {/* head */}
                <thead>
                  <tr className="text-black">
                    <th>SR No.</th>
                    <th>Date</th>
                    <th>Contract ID</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Balance</th>
                    <th>Commission</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-scroll overflow-x-visible w-full">
                  {localContracts.map((contract, index) => (
                    <tr tabIndex={index + 1} className="w-full" key={contract.id}>
                      <th className="whitespace-nowrap">{index+1}</th>
                      <td>{contract.date}</td>
                      <td>{contract.id}</td>
                      <td>{contract.amount.toFixed(3)}</td>
                      <td>{getTotalIncome('paid', contract)}</td>
                      <td>{getTotalIncome('unpaid', contract)}</td>
                      <td>{getTotalIncome('income', contract)}</td>
                    </tr>
                  ))}
                  <tr className="w-full">
                    <th className="whitespace-nowrap"></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{getTotalIncomes('paid')}</td>
                    <td>{getTotalIncomes('unpaid')}</td>
                    <td>{getTotalIncomes('income')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={`${buttonsVisible ? 'flex justify-center items-center flex-row w-full' : 'hidden'}`}>
            <button onClick={()=>{printContent()}} className={`w-1/2 bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent mr-4`}>Print</button>
            <button onClick={()=>{setPage('default'); resetPage()}} className={`w-1/2 rounded border-2 border-main p-2 mt-8 text-black transition duration-300 font-bold hover:bg-main ml-4`}>Return</button>
          </div>
        </div> 
      :
      page == 'company' ?
        <div>
          <div id='printable'>
            <div className='flex justify-between items-start'>
              <div>
                <h1 className='text-3xl font-bold'>Company {localCompany.name} Report</h1>
                <h1 className='mt-2 text-md font-bold'>Date: <span className='font-normal'>{getFormattedDate()}</span></h1>
                <h1><span className='font-bold'>Paid Debt: </span>{getTotalIncomes('paid')} OMR</h1>
                <h1><span className='font-bold'>Unpaid Debt: </span>{getTotalIncomes('unpaid')} OMR</h1>
                <h1><span className='font-bold'>Income: </span>{getTotalIncomes('income')} OMR</h1>
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
            <table className="table text-black" style={{ maxWidth: '100%' }}>
              {/* head */}
              <thead>
                <tr className="text-black">
                  <th>SR No.</th>
                  <th>Date</th>
                  <th>Contract ID</th>
                  <th>Client ID</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Balance</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody className="overflow-y-scroll overflow-x-visible w-full">
                {localContracts.map((contract, index) => (
                  <tr tabIndex={index + 1} className="w-full" key={contract.id}>
                    <th className="whitespace-nowrap">{index+1}</th>
                    <td>{contract.date}</td>
                    <td>{contract.id}</td>
                    <td>{contract.clientId}</td>
                    <td>{contract.amount.toFixed(3)}</td>
                    <td>{getTotalIncome('paid', contract)}</td>
                    <td>{getTotalIncome('unpaid', contract)}</td>
                    <td>{getTotalIncome('income', contract)}</td>
                  </tr>
                ))}
                <tr className="w-full">
                  <th className="whitespace-nowrap"></th>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{getTotalIncomes('paid')}</td>
                  <td>{getTotalIncomes('unpaid')}</td>
                  <td>{getTotalIncomes('income')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${buttonsVisible ? 'flex justify-center items-center flex-row w-full' : 'hidden'}`}>
            <button onClick={()=>{printContent()}} className={`w-1/2 bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent mr-4`}>Print</button>
            <button onClick={()=>{setPage('default'); resetPage()}} className={`w-1/2 rounded border-2 border-main p-2 mt-8 text-black transition duration-300 font-bold hover:bg-main ml-4`}>Return</button>
          </div>
        </div>
      :
      page == 'overall' ?
      <div>
        <div id="printable">
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-3xl font-bold'>Overall Report</h1>
              <h1 className='mt-2 text-md font-bold'>Date: <span className='font-normal'>{getFormattedDate()}</span></h1>
              <h1><span className='font-bold'>Paid Debt: </span>{getTotalIncomes('paid')} OMR</h1>
              <h1><span className='font-bold'>Unpaid Debt: </span>{getTotalIncomes('unpaid')} OMR</h1>
              <h1><span className='font-bold'>Income: </span>{getTotalIncomes('income')} OMR</h1>
            </div>
          </div>
          <table className="table text-black" style={{ maxWidth: '100%' }}>
            {/* head */}
            <thead>
              <tr className="text-black">
                <th>SR No.</th>
                <th>Date</th>
                <th>Company CR</th>
                <th>Client ID</th>
                <th>Contract ID</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Balance</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody className="overflow-y-scroll overflow-x-visible w-full">
              {localContracts.map((contract, index) => (
                <tr tabIndex={index + 1} className="w-full" key={contract.id}>
                  <th className="whitespace-nowrap">{index+1}</th>
                  <td>{contract.date}</td>
                  <td>{contract.companyCr}</td>
                  <td>{contract.clientId}</td>
                  <td>{contract.id}</td>
                  <td>{contract.amount.toFixed(3)}</td>
                  <td>{getTotalIncome('paid', contract)}</td>
                  <td>{getTotalIncome('unpaid', contract)}</td>
                  <td>{getTotalIncome('income', contract)}</td>
                </tr>
              ))}
              <tr className="w-full">
                <th className="whitespace-nowrap"></th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{getTotalIncomes('paid')}</td>
                <td>{getTotalIncomes('unpaid')}</td>
                <td>{getTotalIncomes('income')}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={`${buttonsVisible ? 'flex justify-center items-center flex-row w-full' : 'hidden'}`}>
          <button onClick={()=>{printContent()}} className={`w-1/2 bg-main rounded border-[1px] border-main p-2 mt-8 text-black transition duration-300 hover:bg-transparent font-bold hover:scale-110 hover:border-transparent mr-4`}>Print</button>
          <button onClick={()=>{setPage('default'); resetPage()}} className={`w-1/2 rounded border-2 border-main p-2 mt-8 text-black transition duration-300 font-bold hover:bg-main ml-4`}>Return</button>
        </div>
      </div>
      :
      <></>
      }
    </div>
  )
}

export default ReportsPage