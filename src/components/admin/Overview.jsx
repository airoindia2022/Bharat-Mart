import React from 'react';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

const Overview = ({ stats }) => {
  const statCards = [
    { 
      label: 'Total Platform Users', 
      value: stats?.totalUsers || 0, 
      icon: <Users size={24} />, 
      color: 'var(--primary)',
      bg: 'var(--primary-bg)',
      trend: '+12.5%'
    },
    { 
      label: 'Active Sellers', 
      value: stats?.totalSellers || 0, 
      icon: <IndianRupee size={24} />, 
      color: 'var(--success)',
      bg: 'var(--success-bg)',
      trend: '+5.2%'
    },
    { 
      label: 'Total Platform Revenue', 
      value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`, 
      icon: <ShoppingBag size={24} />, 
      color: 'var(--brand-blue)',
      bg: 'var(--accent)',
      trend: '+18.7%'
    },
    { 
      label: 'Admin Net Profit (10%)', 
      value: `₹${stats?.totalProfit?.toFixed(2) || '0.00'}`, 
      icon: <TrendingUp size={24} />, 
      color: 'var(--warning)',
      bg: 'var(--warning-bg)',
      trend: '+14.2%'
    },
  ];

  const chartData = stats?.salesByMonth?.map(item => ({
    name: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][item._id.month],
    sales: item.totalSales,
  })) || [];

  const pieData = stats?.categoryStats?.map(c => ({ name: c._id, value: c.count })) || [];

  return (
    <div className="fade-in">
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <h3>{card.label}</h3>
              <p>{card.value}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', marginTop: '-0.5rem' }}>
              <ArrowUpRight size={14} />
              <span>{card.trend}</span>
              <span style={{ color: 'var(--secondary)', fontWeight: 400 }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.25px', marginBottom: '0.25rem' }}>Platform Revenue Trend</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Real-time growth analysis from all seller orders</p>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--secondary)', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--secondary)', fontSize: 12}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 700 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.25px', marginBottom: '0.25rem' }}>Category Distribution</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Product popularity by market segment</p>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
