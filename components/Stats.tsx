import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { value: '₹10L+', label: 'Sales Generated' },
    { value: '10M+', label: 'Views Generated' },
    { value: '20M+', label: 'Accounts Reached' },
  ];

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-12 md:mb-24">
      <div className="w-full bg-brand-surface rounded-2xl md:rounded-[30px] border border-white/10 py-6 md:py-12 px-4 md:px-6 grid grid-cols-1 sm:grid-cols-3 md:flex justify-between items-center gap-y-6 gap-x-4 md:gap-4 text-center md:divide-x divide-white/10">
        {stats.map((stat, index) => (
          <div key={index} className="w-full md:w-auto flex-1">
            <h3 className="text-3xl md:text-5xl font-bold text-brand-primary mb-1 md:mb-2">{stat.value}</h3>
            <p className="text-sm font-semibold tracking-widest text-brand-white uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;