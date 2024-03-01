import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';

const companyUnpaidChart: ApexOptions = {
  chart: {
      toolbar: {
          show: false,
      },
      type: 'pie',
  },
  title: {
      text: '',
      align: 'center',
      floating: true,
  },
  dataLabels: {
      enabled: false,
  },
  colors: [
    "#ff0000",
    "#D3D3D3"
  ],
  legend: {
      show: false,
  },
  series: [89,11],
}
const clientsUnpaidChart: ApexOptions = {
  chart: {
      toolbar: {
          show: false,
      },
      type: 'pie',
  },
  title: {
      text: '',
      align: 'center',
      floating: true,
  },
  dataLabels: {
      enabled: false,
  },
  colors: [
    "#01579b",
    "#D3D3D3"
  ],
  legend: {
      show: false,
  },
  series: [94,6],
}
const contractsUnpaidChart: ApexOptions = {
  chart: {
      toolbar: {
          show: false,
      },
      type: 'pie',
  },
  title: {
      text: '',
      align: 'center',
      floating: true,
  },
  dataLabels: {
      enabled: false,
  },
  colors: [
    "#33691e",
    "#D3D3D3"
  ],
  legend: {
      show: false,
  },
  series: [95, 5],
}

function HomePage() {
  return (
    <div className='flex flex-col justify-center items-center flex-col pt-0'>
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
    </div>
  )
}

export default HomePage;
