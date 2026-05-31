import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  expenses: number[];
  incomes: number[];
  label?: string;
}

export default function BarChart({ labels, expenses, incomes, label = 'Data' }: BarChartProps) {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label,
            data: expenses,
            backgroundColor: 'rgba(34,197,94,0.7)',
            borderRadius: 8,
          },
          {
            label: 'Incomes',
            data: incomes,
            backgroundColor: 'rgba(209,13,22,0.7)',
            borderRadius: 8,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false },
        },
        scales: {
          x: { grid: { color: '#222F44' }, ticks: { color: '#fff' } },
          y: { grid: { color: '#222F44' }, ticks: { color: '#fff' } },
        },
      }}
    />
  );
}
