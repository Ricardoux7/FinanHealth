import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#22d3ee', '#818cf8', '#f472b6', '#fbbf24',
  '#34d399', '#f87171', '#a78bfa', '#38bdf8',
];

interface PieChartProps {
  labels: string[];
  amounts: number[];
}

function PieBase({ labels, amounts }: PieChartProps) {
  const total = amounts.reduce((s, a) => s + a, 0);
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 w-full">
      <div style={{ width: 220, height: 220, flexShrink: 0 }}>
        <Pie
          data={{
            labels,
            datasets: [{
              data: amounts,
              backgroundColor: COLORS.map(c => c + '33'),
              borderColor: COLORS,
              borderWidth: 2,
              hoverOffset: 8,
            }],
          }}
          options={{
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0F1729',
                borderColor: '#1E2A42',
                borderWidth: 1,
                titleColor: '#fff',
                bodyColor: '#9ca3af',
                callbacks: {
                  label: ctx => ` $${(ctx.parsed as number).toFixed(2)} (${total > 0 ? Math.round((ctx.parsed as number) / total * 100) : 0}%)`,
                },
              },
            },
          }}
        />
      </div>
      <div className="flex flex-col gap-2 flex-1 w-full">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-gray-300 text-sm truncate">{label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-white text-sm font-medium">${amounts[i].toFixed(2)}</span>
              <span className="text-gray-500 text-xs w-10 text-right">{total > 0 ? Math.round(amounts[i] / total * 100) : 0}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PieChartExpenses({ labels, amounts }: PieChartProps) {
  return <PieBase labels={labels} amounts={amounts} />;
}

export function PieChartIncomes({ labels, amounts }: PieChartProps) {
  return <PieBase labels={labels} amounts={amounts} />;
}