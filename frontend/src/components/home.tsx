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
    "#ff2424",
    "#ff4747",
    "#ff6b6b",
    "#ff8f8f",
    "#ffb3b3",
    "#ffd6d6",
  ],
  legend: {
      show: false,
  },
  series: [10, 20, 15, 5, 25, 10, 15],
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
    "#0277bd",
    "#00b0ff",
    "#40c4ff",
    "#0288d1",
    "#03a9f4",
    "#29b6f6",
    "#81d4fa",
    "#0091ea",
  ],
  legend: {
      show: false,
  },
  series: [12, 3, 26, 7, 7, 18, 21, 6],
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
    "#558b2f",
    "#689f38",
    "#7cb342",
    "#8bc34a",
    "#64dd17",
    "#9ccc65",
    "#aed581",
    "#b2ff59",
  ],
  legend: {
      show: false,
  },
  series: [7, 14, 27, 14, 9, 6, 18, 5],
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
                Companies With Unpaid Debt
              </h1>
          </div>
          <CardBody placeholder={'Card'} className="grid place-items-center px-2 mb-2">
            <Chart options={companyUnpaidChart} series={companyUnpaidChart.series} type={companyUnpaidChart.chart?.type} />
          </CardBody>
          <button className='bg-red-500 m-4 p-3 font-bold rounded-xl transition duration-500 hover:scale-110 hover:bg-transparent hover:text-red-500'>Manage Companies</button>
        </Card>
        <Card placeholder={'Card'} className='bg-black w-72 mx-2'>
          <div
            className="flex flex-col rounded-none p-4 py-6 w-full"
          >
              <h1 className='font-bold text-xl text-center' color="blue-gray">
                Clientelles With Unpaid Debt
              </h1>
          </div>
          <CardBody placeholder={'Card'} className="grid place-items-center px-2 mb-4">
            <Chart options={clientsUnpaidChart} series={clientsUnpaidChart.series} type={clientsUnpaidChart.chart?.type} />
          </CardBody>
          <button className='bg-blue-500 m-4 p-3 font-bold rounded-xl transition duration-500 hover:scale-110 hover:bg-transparent hover:text-blue-500'>Manage Clients</button>
        </Card>
        <Card placeholder={'Card'} className='bg-black w-72 ml-4'>
          <div
            className="flex flex-col rounded-none p-4 py-6 w-full"
          >
              <h1 className='font-bold text-xl text-center' color="blue-gray">
                Contracts With Unpaid Debt
              </h1>
          </div>
          <CardBody placeholder={'Card'} className="grid place-items-center px-2 mb-4">
            <Chart options={contractsUnpaidChart} series={contractsUnpaidChart.series} type={contractsUnpaidChart.chart?.type} />
          </CardBody>
          <button className='bg-green-500 m-4 p-3 font-bold rounded-xl transition duration-500 hover:scale-110 hover:bg-transparent hover:text-green-500'>Manage Companies</button>
        </Card>
      </div>
    </div>
  )
}

export default HomePage;
