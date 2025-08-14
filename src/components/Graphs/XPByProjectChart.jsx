import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function XPByProjectChart({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="no-data-container">
        <p className="no-data-text">No project data available</p>
      </div>
    );
  }

  // Transform data for the chart
  const chartData = projects
    .slice(0, 10) // Get latest 10 projects
    .reverse() // Show oldest to newest
    .map((project, index) => ({
      name: project.object?.name || `Project ${index + 1}`,
      xp: (project.amount / 1000).toFixed(2), // Convert to KB
      fullName: project.object?.name || `Project ${index + 1}`,
      date: new Date(project.createdAt).toLocaleDateString(),
      amount: project.amount
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">
            {data.fullName}
          </p>
          <p className="tooltip-subtitle">
            XP: {data.xp} KB
          </p>
          <p className="tooltip-subtitle">
            Completed: {data.date}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ x, y, width, height, value }) => {
    // Always show label, position it above the bar if too short
    const labelY = height < 25 ? y - 10 : y + height / 2;
    const labelColor = height < 25 ? "#3b82f6" : "white";
    
    return (
      <text 
        x={x + width / 2} 
        y={labelY} 
        fill={labelColor} 
        textAnchor="middle" 
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };

  // Truncate long project names for X-axis
  const truncateName = (name, maxLength = 19) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  const maxXP = Math.max(...chartData.map(item => parseFloat(item.xp)));
  const yAxisMax = Math.ceil(maxXP * 1.1); // Add 10% padding to top

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60
          }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name"
            tick={{ fontSize: 12, fill: '#666' }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tickFormatter={(value) => truncateName(value, 8)}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#666' }}
            label={{ 
              value: 'XP (KB)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#666' }
            }}
            domain={[0, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="xp" 
            fill="url(#colorGradient)"
            radius={[4, 4, 0, 0]}
            label={<CustomLabel />}
          >
          </Bar>
          
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#1e40af" stopOpacity={1}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="chart-info-section">
        <p className="chart-info-text">
          Showing latest {Math.min(projects.length, 10)} projects
        </p>
        <p className="chart-info-subtext">
          Total XP: <span className="chart-total-xp">
            {chartData.reduce((sum, item) => sum + parseFloat(item.xp), 0).toFixed(2)} KB
          </span>
        </p>
      </div>
    </div>
  );
}

export default XPByProjectChart;