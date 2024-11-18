// client/src/pages/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchTransactions } from '../../services/transactionService';
import { DashboardLayout } from '../../layouts/DashboardLayout';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('month');
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions
  });

  const getChartData = () => {
    if (!transactions) return [];
    
    const groupedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, amount: 0 };
      }
      acc[date].amount += Number(transaction.amount);
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${transactions?.reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">
                ${transactions?.filter(t => t.amount < 0)
                  .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
                  .toFixed(2)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">
                ${transactions?.filter(t => t.amount > 0)
                  .reduce((sum, t) => sum + Number(t.amount), 0)
                  .toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px]">
              <LineChart data={getChartData()} width={800} height={400}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

// client/src/pages/Dashboard/index.js
export { default as Dashboard } from './Dashboard';