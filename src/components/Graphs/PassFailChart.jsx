import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  pass: '#10B981', // Green
  fail: '#EF4444'  // Red
};

function PassFailChart({ passCount, failCount }) {
  const data = [
    { name: 'Pass', value: passCount, color: COLORS.pass },
    { name: 'Fail', value: failCount, color: COLORS.fail }
  ];

  const total = passCount + failCount;
  const passPercentage = total > 0 ? ((passCount / total) * 100).toFixed(1) : 0;
  const failPercentage = total > 0 ? ((failCount / total) * 100).toFixed(1) : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold" style={{ color: data.payload.color }}>
            {data.name}: {data.value}
          </p>
          <p className="text-sm text-gray-600">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show label for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">No project data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4 grid grid-cols-2 gap-4 text-center">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{passCount}</div>
          <div className="text-sm text-green-700">Passed ({passPercentage}%)</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{failCount}</div>
          <div className="text-sm text-red-700">Failed ({failPercentage}%)</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Total Projects: <span className="font-semibold">{total}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Success Rate: <span className="font-semibold text-green-600">{passPercentage}%</span>
        </p>
      </div>
    </div>
  );
}

export default PassFailChart;
