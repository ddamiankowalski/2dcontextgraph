import { Chart } from './chart/chart';

export * from './chart/chart';
export * from './chart/api/api-controller';

const chartElement = document.getElementById('chart');
const chart = new Chart(chartElement as HTMLCanvasElement);