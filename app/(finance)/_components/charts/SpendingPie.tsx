'use client';

import type { CategoryInfo } from '@/core/finance/models';
import { useState } from 'react';
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
import { PieChartIcon, TriangleAlert } from 'lucide-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatCurrency, formatPercentage, generateHexRandomColor } from '@/shared/utils';
import { CategoryTooltip } from '..';

const chartOptions = [
  { name: 'Pie', value: 'pie' },
  { name: 'Radar', value: 'radar' },
  { name: 'Radial', value: 'radial' },
];

interface Props {
  data: CategoryInfo[];
}

function SpendingPie({ data }: Props): JSX.Element {
  const [chartSelected, setChartSelected] = useState<string>('pie');

  const onSelectChart = (value: string) => {
    setChartSelected(value);
  };

  if (data.length === 0)
    return (
      <CustomAlert
        variant='default'
        icon={<TriangleAlert className='size-4' />}
        title='Graphs'
        description='No information'
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
              Charts <PieChartIcon className='size-4 ml-4' />
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
export default SpendingPie;

const charts: Record<string, (data: CategoryInfo[]) => JSX.Element> = {
  pie: (data) => (
    <ResponsiveContainer width='100%' height={300}>
      <PieChart width={400} height={400}>
        <Tooltip content={<CategoryTooltip />} />
        <Legend
          layout='horizontal'
          verticalAlign='bottom'
          align='right'
          iconType='circle'
          content={({ payload }) => (
            <ul className='flex flex-col space-y-2'>
              {payload?.map((item: any, index) => (
                <li className='flex items-center space-x-2' key={`item-${index}`}>
                  <div className='size-2 rounded-full' style={{ backgroundColor: item.color }} />
                  <div className='space-x-1'>
                    <span className='text-sm text-muted-foreground'>{item.value}</span>
                    <span className='text-sm font-bold'>
                      {formatPercentage(item.payload.percent * 100)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        />
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          labelLine={false}
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          dataKey='value'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={generateHexRandomColor()} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  ),
  radar: (data) => (
    <ResponsiveContainer width='100%' height={300}>
      <RadarChart cx='50%' cy='50%' outerRadius='60%' data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey='name' style={{ fontSize: 12 }} />
        <PolarRadiusAxis style={{ fontSize: 12 }} />
        <Radar dataKey='value' stroke='#3d82f6' fill='#3d82f6' fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  ),
  radial: (data) => (
    <ResponsiveContainer width='100%' height={300}>
      <RadialBarChart
        cx='50%'
        cy='50%'
        innerRadius='60%'
        outerRadius='30%'
        barSize={15}
        data={data.map((item) => ({ ...item, fill: generateHexRandomColor() }))}
      >
        <Legend
          layout='horizontal'
          verticalAlign='bottom'
          align='right'
          iconType='circle'
          content={({ payload }) => (
            <ul className='flex flex-col space-y-2'>
              {payload?.map((item: any, index) => (
                <li className='flex items-center space-x-2' key={`item-${index}`}>
                  <div className='size-2 rounded-full' style={{ backgroundColor: item.color }} />
                  <div className='space-x-1'>
                    <span className='text-sm text-muted-foreground'>{item.value}</span>
                    <span className='text-sm font-bold'>{formatCurrency(item.payload.value)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        />
        <RadialBar
          label={{ position: 'insideStart', fill: '#fff', fontSize: '12px' }}
          background
          dataKey='value'
        />
        <Legend
          iconSize={10}
          layout='vertical'
          verticalAlign='middle'
          wrapperStyle={{
            fontSize: '12px',
            top: '50%',
            right: 0,
            transform: 'translate(0, -50%)',
            lineHeight: '24px',
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  ),
};
