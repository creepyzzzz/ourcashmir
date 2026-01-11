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
        <div className="bg-brand-surface border border-brand-primary/10 rounded-xl p-6 relative overflow-hidden group hover:border-brand-primary/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                    {icon}
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${changeType === 'positive' ? 'bg-green-500/10 text-green-400' :
                            changeType === 'negative' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'
                        }`}>
                        {changeType === 'positive' && <TrendingUp size={12} />}
                        {changeType === 'negative' && <TrendingDown size={12} />}
                        {changeType === 'neutral' && <Minus size={12} />}
                        {change}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{label}</h3>
                <p className="text-2xl font-bold text-brand-white">{value}</p>
            </div>
        </div>
    );
}
