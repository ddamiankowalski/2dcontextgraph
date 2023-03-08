export * from './chart/chart';
export * from './chart/api/api-controller';

import { Chart } from './chart/chart';

const chartCanvas = document.getElementById('chart');
const chart = new Chart(chartCanvas as HTMLCanvasElement);


const worker = new Worker(new URL('./worker.ts', import.meta.url));

worker.postMessage({
    question:
      'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  });
  worker.onmessage = ({ data: { answer } }) => {
    console.log(answer);
  };