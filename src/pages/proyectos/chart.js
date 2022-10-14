import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Sprint 1',
    completos: 4000,
    restantes: 2400,
    amt: 2400,
  },
  {
    name: 'Prueba',
    completos: 3000,
    restantes: 1398,
    amt: 2210,
  },
  {
    name: 'Sprint con fecha',
    completos: 2000,
    restantes: 9800,
    amt: 2290,
  },
  {
    name: 'Otro Sprint',
    completos: 2780,
    restantes: 3908,
    amt: 2000,
  },
  {
    name: 'Backlog',
    completos: 1890,
    restantes: 4800,
    amt: 2181,
  },
];

export default class Chart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/bar-chart-stacked-by-sign-cbct8';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          stackOffset="sign"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="restantes" fill="#8884d8" stackId="stack" />
          <Bar dataKey="completos" fill="#82ca9d" stackId="stack" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
