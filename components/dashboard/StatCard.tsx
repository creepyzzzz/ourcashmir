import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
}

export default function StatCard({ label, value, change, changeType, icon }: StatCardProps) {
    return (
        <div className="bg-brand-surface border border-brand-primary/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 relative overflow-hidden group hover:border-brand-primary/20 transition-colors">
            <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4">
                <div className="p-1.5 sm:p-2 bg-brand-primary/10 rounded-md sm:rounded-lg text-brand-primary">
                    {icon}
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${changeType === 'positive' ? 'bg-green-500/10 text-green-400' :
                        changeType === 'negative' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'
                        }`}>
                        {changeType === 'positive' && <TrendingUp size={10} className="sm:w-3 sm:h-3" />}
                        {changeType === 'negative' && <TrendingDown size={10} className="sm:w-3 sm:h-3" />}
                        {changeType === 'neutral' && <Minus size={10} className="sm:w-3 sm:h-3" />}
                        <span className="hidden xs:inline">{change}</span>
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{label}</h3>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-brand-white">{value}</p>
            </div>
        </div>
    );
}
