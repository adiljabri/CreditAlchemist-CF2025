
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Debt } from '@/utils/debtUtils';

interface DebtVisualizationProps {
  debts: Debt[];
}

const DebtVisualization: React.FC<DebtVisualizationProps> = ({ debts }) => {
  const COLORS = ['#60A5FA', '#93C5FD', '#3B82F6', '#2563EB', '#1D4ED8'];
  
  const data = useMemo(() => {
    return debts.map((debt, index) => ({
      name: debt.creditor,
      value: debt.balance,
      color: COLORS[index % COLORS.length],
    }));
  }, [debts]);

  const totalDebt = useMemo(() => {
    return debts.reduce((sum, debt) => sum + debt.balance, 0);
  }, [debts]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalDebt) * 100).toFixed(1);
      
      return (
        <div className="glass p-4 rounded-lg shadow-soft">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-sm text-muted-foreground">${data.value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="#1e293b"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={800}
            animationBegin={200}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DebtVisualization;
