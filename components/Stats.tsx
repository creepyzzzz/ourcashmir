import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { value: '12', label: 'YEARS EXPERIENCE' },
    { value: '5,6M+', label: 'TOTAL USER' },
    { value: '4,8', label: 'AVERAGE REVIEW' },
    { value: '80+', label: 'PROFESSIONAL TEAM' },
  ];

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 max-w-screen-2xl mx-auto mb-12 md:mb-24">
      <div className="w-full bg-brand-surface rounded-2xl md:rounded-[30px] border border-brand-primary/20 py-6 md:py-12 px-4 md:px-6 grid grid-cols-2 md:flex justify-between items-center gap-y-6 gap-x-4 md:gap-4 text-center md:divide-x divide-white/10">
        {stats.map((stat, index) => (
          <div key={index} className="w-full md:w-auto">
            <h3 className="text-2xl md:text-4xl font-bold text-brand-white mb-1 md:mb-2">{stat.value}</h3>
            <p className="text-[9px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;