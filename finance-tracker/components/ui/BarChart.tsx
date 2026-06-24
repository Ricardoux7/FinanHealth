import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  expenses: number[];
  incomes: number[];
}

export default function BarChart({ labels, expenses, incomes }: BarChartProps) {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: 'Expenses',
            data: expenses,
            backgroundColor: 'rgba(239,68,68,0.75)',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Income',
            data: incomes,
            backgroundColor: 'rgba(34,197,94,0.75)',
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#9ca3af', font: { size: 12 }, boxWidth: 12, boxHeight: 12 },
          },
          tooltip: {
            backgroundColor: '#0F1729',
            borderColor: '#1E2A42',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: '#9ca3af',
            callbacks: {
              label: ctx => {
                const value = ctx.parsed.y;
                return value === null ? ' $0.00' : ` $${value.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: '#1E2A42' },
            ticks: { color: '#6b7280', font: { size: 11 } },
          },
          y: {
            grid: { color: '#1E2A42' },
            ticks: { color: '#6b7280', font: { size: 11 }, callback: v => `$${v}` },
          },
        },
      }}
    />
  );
}