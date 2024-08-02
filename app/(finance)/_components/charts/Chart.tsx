'use client';
import type { FinanceInfo } from '@/core/finance/models';
import { useState } from 'react';
import {
  Tooltip,
  XAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  BarChart,
  Bar,
  LineChart,
} from 'recharts';
import {
  CustomAlert,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components';
import { format } from 'date-fns';
import { BarChartIcon, TriangleAlert } from 'lucide-react';
import { CustomTooltip } from '..';

interface Props {
  data: FinanceInfo[];
}

const chartOptions = [
  { name: 'Area', value: 'area' },
  { name: 'Bar', value: 'bar' },
  { name: 'Line', value: 'line' },
];

function Chart({ data }: Props): JSX.Element {
  const [chartSelected, setChartSelected] = useState<string>('area');

  const onSelectChart = (value: string) => {
    setChartSelected(value);
  };

  if (data.length === 0)
    return (
      <CustomAlert
        variant='default'
        icon={<TriangleAlert className='size-4' />}
        title='Graphs'
        description='No information for this period'
      />
    );

  return (
    <>
      <Select defaultValue={chartSelected} onValueChange={onSelectChart}>
        <SelectTrigger className='max-w-[180px] mb-2 bg-transparent h-[35px]'>
          <SelectValue placeholder='Select a graph' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className='flex items-center'>
              Charts <BarChartIcon className='size-4 ml-4' />
            </SelectLabel>
            {chartOptions.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {charts[chartSelected](data)}
    </>
  );
}
export default Chart;

const charts: Record<string, (data?: FinanceInfo[]) => JSX.Element> = {
  area: (data) => (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <defs>
          <linearGradient id='income' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='2%' stopColor='#3d82f6' stopOpacity={0.8} />
            <stop offset='98%' stopColor='#3d82f6' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='expenses' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='2%' stopColor='#f43f5e' stopOpacity={0.8} />
            <stop offset='98%' stopColor='#f43f5e' stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={(value) => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          className='drop-shadow-sm'
          type='monotone'
          dataKey='income'
          strokeWidth={2}
          stroke='#3d82f6'
          fill='url(#income)'
        />
        <Area
          className='drop-shadow-sm'
          type='monotone'
          dataKey='expenses'
          strokeWidth={2}
          stroke='#f43f5e'
          fill='url(#expenses)'
        />
      </AreaChart>
    </ResponsiveContainer>
  ),
  bar: (data) => (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={(value) => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar className='drop-shadow-sm' dataKey='income' fill='#3d82f6' />
        <Bar className='drop-shadow-sm' dataKey='expenses' fill='#f43f5e' />
      </BarChart>
    </ResponsiveContainer>
  ),
  line: (data) => (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={(value) => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          className='drop-shadow-sm'
          dot={false}
          dataKey='income'
          strokeWidth={2}
          stroke='#3d82f6'
        />
        <Line
          className='drop-shadow-sm'
          dot={false}
          dataKey='expenses'
          strokeWidth={2}
          stroke='#f43f5e'
        />
      </LineChart>
    </ResponsiveContainer>
  ),
};
