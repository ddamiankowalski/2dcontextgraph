import { EventManager } from './chart/events/event-manager';
import { Mousedown } from './chart/events/mousedown';
import { Mousemove } from './chart/events/mousemove';
import { Mouseout } from './chart/events/mouseout';
import { Mouseup } from './chart/events/mouseup';
import { Wheel } from './chart/events/wheel';

export * from './chart/chart';
export * from './chart/api/api-controller';

const canvas = document.getElementById('chart') as HTMLCanvasElement;
canvas.style.backgroundColor = "#191f2c";
canvas.style.width = `${1280}px`;
canvas.style.height = `${400}px`;
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

const worker = new Worker(new URL('./worker.ts', import.meta.url));
const offscreen = canvas.transferControlToOffscreen();

worker.postMessage({ canvas: offscreen }, [offscreen]);

worker.onmessage = (payload) => {
    console.log(payload.data);

    const eventManager = new EventManager(canvas, payload.data.dimensions, payload.data.view);
    eventManager.listen(new Wheel());
    eventManager.listen(new Mouseout());
    eventManager.listen(new Mousedown());
    eventManager.listen(new Mouseup());
    eventManager.listen(new Mousemove());
}

