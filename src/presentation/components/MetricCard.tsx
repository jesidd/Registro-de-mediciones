import { TrendingUp, TrendingDown} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

export default function MetricCard({ title, value, change, trend, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-2 md:p-3 bg-blue-50 rounded-full">
          <Icon className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-3 md:mt-4 flex items-center">
        {trend === 'up' ? (
          <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-500 mr-1" />
        )}
        <span className={`text-xs md:text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}