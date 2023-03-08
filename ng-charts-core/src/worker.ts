import { Chart } from './chart/chart';

self.onmessage = (evt) => {
    const canvas = evt.data.canvas;
    const chart = new Chart(canvas);

    setTimeout(() => {
        self.postMessage({
            view: chart.getView(),
            dimensions: chart.getDimensions()
        });
    }, 1000)
};