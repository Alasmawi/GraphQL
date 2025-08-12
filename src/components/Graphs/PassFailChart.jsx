import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  pass: '#10B981', // Green
  fail: '#f70909ff'  // Red
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
        <div className="custom-tooltip">
          <p className="tooltip-title" style={{ color: data.payload.color }}>
            {data.name}: {data.value}
          </p>
          <p className="tooltip-subtitle">
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
      <div className="no-data-container">
        <p className="no-data-text">No project data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="stats-grid">
        <div className="stats-card stats-card-green">
          <div className="stats-number stats-number-green">{passCount}</div>
          <div className="stats-label stats-label-green">Passed ({passPercentage}%)</div>
        </div>
        <div className="stats-card stats-card-red">
          <div className="stats-number stats-number-red">{failCount}</div>
          <div className="stats-label stats-label-red">Failed ({failPercentage}%)</div>
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

      <div className="chart-summary">
        <p className="summary-text">
          Total Projects: <span className="summary-highlight">{total}</span>
        </p>
        <p className="summary-subtext">
          Success Rate: <span className="success-rate">{passPercentage}%</span>
        </p>
      </div>
    </div>
  );
}

export default PassFailChart;