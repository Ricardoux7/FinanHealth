import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


interface PieChartProps {
  labels: string[];
  amounts: number[];
  label?: string;
}

export default function PieChartExpenses({ labels, amounts, label = 'Data' }: PieChartProps) {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <Pie
      data={{
        labels,
        datasets: [
          {
            label,
            data: amounts,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }}
      options={{
        plugins: {
          legend: { labels: { color: '#fff' } }
        }
      }}
    />
    </div>
  )
}

export function PieChartIncomes({ labels, amounts, label = 'Data' }: PieChartProps) {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <Pie
        data={{
          labels,
          datasets: [
            {
              label,
              data: amounts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],            
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { labels: { color: '#fff' } }
          }
        }}
      />
    </div>
  )
}