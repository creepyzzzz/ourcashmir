import React from 'react';
import { ArrowRight, MoreVertical, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', uv: 20 },
  { name: 'Tue', uv: 40 },
  { name: 'Wed', uv: 30 },
  { name: 'Thu', uv: 50 },
  { name: 'Fri', uv: 40 },
  { name: 'Sat', uv: 60 },
  { name: 'Sun', uv: 55 },
];

const About: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-16 md:mb-24 flex flex-col lg:flex-row items-center gap-8 md:gap-16">

      {/* Left Text Content */}
      <div className="flex-1 space-y-8 order-2 lg:order-1">
        <div className="inline-block bg-brand-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-black">
          About
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-brand-white leading-tight">
          Grow with the digital marketing agency?
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
          Our digital marketing experts have put together thousands of successful digital marketing campaigns for businesses looking to increase leads.
        </p>

        <button className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand-white group">
          LEARN MORE
          <span className="bg-transparent border border-gray-500 rounded-full p-1 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-black transition-all">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {/* Right Dashboard Mockup */}
      <div className="flex-1 relative w-full order-1 lg:order-2">
        <div className="relative w-full max-w-[550px] mx-auto h-[300px] md:h-[400px]">

          {/* Card 1: Recent Activity (Back layer) */}
          <div className="absolute top-0 right-0 w-[90%] bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-lg z-10">
            <h4 className="text-sm font-bold text-brand-white mb-4">Recent activity</h4>
            <div className="space-y-4">
              {[
                { name: 'Zen Richarlison', time: '3 hours ago', item: '1x Gymnocalycium loeanum', price: '$12.50' },
                { name: 'Nikki Sukamuljo', time: '16 hours ago', item: '1x Gymnocalycium mihanovichii ..', price: '$26.75' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-900/50 flex items-center justify-center text-brand-primary text-xs">
                      🌱
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-white">{activity.name} <span className="text-[10px] text-gray-500 font-normal">{activity.time}</span></p>
                      <p className="text-[10px] text-gray-500">Purchased <span className="font-semibold">{activity.item}</span></p>
                    </div>
                  </div>
                  <span className="text-xs font-bold">{activity.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Total Sales (Bottom Left Overlay) */}
          <div className="absolute -bottom-2 left-0 md:bottom-12 w-[65%] md:w-[55%] bg-brand-surface rounded-xl md:rounded-3xl p-3 md:p-5 shadow-xl z-20 border border-brand-primary/20 transform scale-75 md:scale-100 origin-bottom-left">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xs font-semibold text-gray-400">Total Sales</h4>
              <MoreVertical size={14} className="text-gray-500" />
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-brand-white">258</span>
              <div className="inline-flex items-center gap-1 bg-brand-primary text-black px-1.5 py-0.5 rounded-full text-[8px] ml-2">
                11% <ArrowUpRight size={8} />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mb-2">Since previous 30 days</p>
            <div className="h-16 w-full opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="uv" stroke="#00C853" strokeWidth={1} fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-gray-400 text-right mt-1">500</div>
          </div>

          {/* Card 3: Today's Order (Bottom Right Overlay) */}
          <div className="absolute -bottom-6 -right-2 md:bottom-24 md:right-4 w-[60%] md:w-[50%] bg-gray-800 rounded-xl md:rounded-3xl p-3 md:p-5 shadow-xl z-30 border border-white/10 backdrop-blur-md transform scale-75 md:scale-100 origin-bottom-right">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-semibold text-gray-300">Today's order</h4>
              <MoreVertical size={14} className="text-gray-500" />
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-brand-white">$150</span>
              <p className="text-[10px] text-gray-400">10 products sold <span className="bg-brand-primary text-black px-1 py-0.5 rounded-full text-[8px] ml-1">+2% ↑</span></p>
            </div>
            <div className="flex gap-1 items-end h-8">
              {[40, 60, 30, 80, 50, 90, 40].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-sm ${i === 5 ? 'bg-brand-primary' : 'bg-gray-600'}`}></div>
              ))}
            </div>
            <div className="text-[10px] text-gray-500 text-right mt-1">20</div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;