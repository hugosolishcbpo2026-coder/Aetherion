'use client';

import { motion } from 'framer-motion';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 142000, bookings: 84 },
  { month: 'Feb', revenue: 168000, bookings: 92 },
  { month: 'Mar', revenue: 156000, bookings: 88 },
  { month: 'Apr', revenue: 195000, bookings: 104 },
  { month: 'May', revenue: 224000, bookings: 118 },
  { month: 'Jun', revenue: 218000, bookings: 122 },
  { month: 'Jul', revenue: 248000, bookings: 136 },
  { month: 'Aug', revenue: 268000, bookings: 142 },
  { month: 'Sep', revenue: 285000, bookings: 156 },
  { month: 'Oct', revenue: 312000, bookings: 168 },
  { month: 'Nov', revenue: 298000, bookings: 162 },
  { month: 'Dec', revenue: 348000, bookings: 184 },
];

export function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-card/40 p-6 backdrop-blur-xl"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-medium">Revenue</h3>
          <p className="text-xs text-muted-foreground">Trailing 12 months · MXN</p>
        </div>
        <div className="flex gap-1.5">
          {['1M', '3M', '1Y', 'All'].map((p, i) => (
            <button
              key={p}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                i === 2
                  ? 'bg-gold-400/10 text-gold-200 ring-1 ring-gold-300/30'
                  : 'text-muted-foreground hover:bg-white/[0.04]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8A96B" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#C8A96B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#101010',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#F5F1E8' }}
              formatter={(value: number) => [`$${(value / 1000).toFixed(0)}k MXN`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#C8A96B"
              strokeWidth={2}
              fill="url(#revGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
