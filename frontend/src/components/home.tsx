import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import Contract from '@/schemas/contract';
import axios from 'axios';
import { serverUri } from '@/data';

function HomePage() {
  const [overdue, setOverdue] = React.useState<Array<{contract: Contract,time: number}>>([])
  const [today, setToday] = React.useState<Array<{contract: Contract,time: number}>>([])
  const [ten, setTen] = React.useState<Array<{contract: Contract,time: number}>>([])

  const fetchContracts = async () => {
    const overDueResp = await axios.get(`${serverUri}/api/contracts/fetch/specific?token=${localStorage.getItem('token')}&requirement=overdue`)
    setOverdue(overDueResp.data.data)
    
    const todayResp = await axios.get(`${serverUri}/api/contracts/fetch/specific?token=${localStorage.getItem('token')}&requirement=today`)
    setToday(todayResp.data.data)
    
    const tenResp = await axios.get(`${serverUri}/api/contracts/fetch/specific?token=${localStorage.getItem('token')}&requirement=10d`)
    console.log(tenResp.data)
    setTen(tenResp.data.data)
  }
  React.useEffect(()=> {
    fetchContracts()
  }, [])
  return (
    <div className='flex flex-col justify-start items-center flex-col pt-0 overflow-y-auto w-full pr-8'>
      <div className='flex justify-start items-center flex-col w-full'>
        <div className='p-0 flex justify-start items-center flex-col w-full'>
          <h1 className='font-roboto-bold text-3xl w-full text-start'>Overdue</h1>
          <div className='bg-red-200 mt-6 p-12 border-4 border-red-500 rounded-xl w-full'>
            {overdue.length > 0 ? 
              <table className="table table-large" style={{ maxWidth: '100%' }}>
                <thead>
                  <tr className='text-red-500 text-lg'>
                    <th>ID</th>
                    <th>Days Left</th>
                    <th>Contract Amount</th>
                    <th>Company Cr</th>
                    <th>Client ID</th>
                    <th>Commission %</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-scroll overflow-x-visible w-full">
                  {
                  overdue.map((contract, index) => (
                    <tr tabIndex={index} className="w-full text-red-500" key={index}>
                      <th className="whitespace-nowrap">{contract.contract.id}</th>
                      <th className="whitespace-nowrap">{contract.time}</th>
                      <th className="whitespace-nowrap">{contract.contract.amount} OMR</th>
                      <th className="whitespace-nowrap">{contract.contract.companyCr}</th>
                      <th className="whitespace-nowrap">{contract.contract.clientId}</th>
                      <th className="whitespace-nowrap">{contract.contract.percentage}</th>
                    </tr>
                    ))
                  }
                </tbody>
              </table> : <p className='text-red-500 w-full text-center font-bold'>No Contracts Overdue</p>
            }
          </div>
        </div>
        <div className='p-0 flex justify-start items-center flex-col w-full mt-8'>
          <h1 className='font-roboto-bold text-3xl w-full text-start'>Today&lsquo;s Contracts</h1>
          <div className='bg-amber-100 mt-6 p-12 border-4 border-amber-500 rounded-xl w-full'>
            {today.length > 0 ? 
              <table className="table table-large" style={{ maxWidth: '100%' }}>
                <thead>
                  <tr className='text-amber-500 text-lg'>
                    <th>ID</th>
                    <th>Days Left</th>
                    <th>Contract Amount</th>
                    <th>Company Cr</th>
                    <th>Client ID</th>
                    <th>Commission %</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-scroll overflow-x-visible w-full">
                  {
                  today.map((contract, index) => (
                    <tr tabIndex={index} className="w-full text-amber-500" key={index}>
                      <th className="whitespace-nowrap">{contract.contract.id}</th>
                      <th className="whitespace-nowrap">{contract.time}</th>
                      <th className="whitespace-nowrap">{contract.contract.amount} OMR</th>
                      <th className="whitespace-nowrap">{contract.contract.companyCr}</th>
                      <th className="whitespace-nowrap">{contract.contract.clientId}</th>
                      <th className="whitespace-nowrap">{contract.contract.percentage}</th>
                    </tr>
                    ))
                  }
                </tbody>
              </table> : <p className='text-amber-500 w-full text-center font-bold'>No Contracts due Today</p>
            }
          </div>
        </div>
        <div className='p-0 flex justify-start items-center flex-col w-full mt-8'>
          <h1 className='font-roboto-bold text-3xl w-full text-start'>Near due date Contracts</h1>
          <div className='bg-green-100 mt-6 p-12 border-4 border-green-500 rounded-xl w-full'>
            {ten.length > 0 ? 
              <table className="table table-large" style={{ maxWidth: '100%' }}>
                <thead>
                  <tr className='text-green-500 text-lg'>
                    <th>ID</th>
                    <th>Days Left</th>
                    <th>Contract Amount</th>
                    <th>Company Cr</th>
                    <th>Client ID</th>
                    <th>Commission %</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-scroll overflow-x-visible w-full">
                  {
                  ten.map((contract, index) => (
                    <tr tabIndex={index} className="w-full text-green-500" key={index}>
                      <th className="whitespace-nowrap">{contract.contract.id}</th>
                      <th className="whitespace-nowrap">{contract.time}</th>
                      <th className="whitespace-nowrap">{contract.contract.amount} OMR</th>
                      <th className="whitespace-nowrap">{contract.contract.companyCr}</th>
                      <th className="whitespace-nowrap">{contract.contract.clientId}</th>
                      <th className="whitespace-nowrap">{contract.contract.percentage}</th>
                    </tr>
                    ))
                  }
                </tbody>
              </table> : <p className='text-green-500 font-bold w-full text-center'>No Contracts due within 10 days</p>
            }
          </div>
        </div>
      </div>{/*
      <div>
        <h1 className='font-bold text-2xl mb-8'>Mini Statistics</h1>
        <div className='p-0 flex justify-center items-center flex-row'>
          <Card placeholder={'Card'} className='bg-black w-72 mr-4'>
            <div
              className="flex flex-col rounded-none p-4 py-6 w-full"
            >
                <h1 className='font-bold text-xl text-center' color="blue-gray">
                  Website Progress
                </h1>
            </div>
            <CardBody placeholder={'Card'} className="grid place-items-center px-2 mb-2">
              <Chart options={companyUnpaidChart} series={companyUnpaidChart.series} type={companyUnpaidChart.chart?.type} />
            </CardBody>
            <button className='bg-red-500 m-4 p-3 font-bold rounded-xl transition duration-500 hover:scale-110 hover:bg-transparent hover:text-red-500'>Manage Progress</button>
          </Card>
          <Card placeholder={'Card'} className='bg-black w-72 mx-2'>
            <div
              className="flex flex-col rounded-none p-4 py-6 w-full"
            >
                <h1 className='font-bold text-xl text-center' color="blue-gray">
                  Frontend
                </h1>
            </div>
            <CardBody placeholder={'Card'} className="grid place-items-center px-2 mb-4">
              <Chart options={clientsUnpaidChart} series={clientsUnpaidChart.series} type={clientsUnpaidChart.chart?.type} />
            </CardBody>
            <button className='bg-blue-500 m-4 p-3 font-bold rounded-xl transition duration-500 hover:scale-110 hover:bg-transparent hover:text-blue-500'>Manage Progress</button>
          </Card>
          <Card placeholder={'Card'} className='bg-black w-72 ml-4'>
            <div
              className="flex flex-col rounded-none p-4 py-6 w-full"
            >
                <h1 className='font-bold text-xl text-center' color="blue-gray">
                  Backend
                </h1>
            </div>
            <CardBody placeholder={'Card'} className="grid place-items-center px-2 mb-4">
              <Chart options={contractsUnpaidChart} series={contractsUnpaidChart.series} type={contractsUnpaidChart.chart?.type} />
            </CardBody>
            <button className='bg-green-500 m-4 p-3 font-bold rounded-xl transition duration-500 hover:scale-110 hover:bg-transparent hover:text-green-500'>Manage Progress</button>
          </Card>
        </div>
      </div>*/}
    </div>
  )
}

export default HomePage;
