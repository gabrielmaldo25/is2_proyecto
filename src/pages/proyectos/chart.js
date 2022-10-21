import React, { useState, useEffect } from 'react';
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

export default function Chart(props) {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    console.log('props: ', props);
    fetch(`/api/chart?id_proyecto=${props.idProyecto}`)
      .then((res) => res.json())
      .then((data) => {
        setDatos(data);
      });

    setLoading(false);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={datos}
        stackOffset="sign"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sprint" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="abierto" fill="#8884d8" stackId="stack" />
        <Bar dataKey="cerrado" fill="#82ca9d" stackId="stack" />
      </BarChart>
    </ResponsiveContainer>
  );
}
