import { Renderer } from '../interfaces/renderer';

export class ChartRenderer implements Renderer {
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.context = context;
        this.canvas = canvas;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.height = canvas.offsetHeight;
        this.canvas.width = canvas.offsetWidth;
        this.graphWidth = canvas.width;
        this.graphHeight = canvas.height;
        this.graphZoom = 100;

        this.canvas.style.backgroundColor = "#252525";
        this.addCanvasListeners();
    }

    private context: CanvasRenderingContext2D | undefined;
    private canvas: HTMLCanvasElement | undefined;
    private graphWidth: number;
    private graphHeight: number;
    private graphZoom: number;

    private horizontalMargin: number = 50;
    private verticalMargin: number = 20;

    private mouseXPosition: number;
    private mouseYPosition: number;

    private xGridThreshold: number = 50;

    public draw(timePassed: number): void {
        this.context.clearRect(0, 0, this.graphWidth, this.graphHeight);

        this.drawGrid();
        window.requestAnimationFrame(this.draw.bind(this));
    }

    drawGrid(): void {
        this.drawVerticalLines();
        //this.drawMousePosition();
    }

    private drawVerticalLines(): void {
        for(let drawingXPosition = 0; drawingXPosition < this.graphWidth; drawingXPosition = drawingXPosition + this.graphZoom) {
            this.drawLine(drawingXPosition, 0, drawingXPosition, this.graphHeight);
        }
    }

    private drawMousePosition(): void {
        this.drawLine(0, this.mouseYPosition, this.graphWidth, this.mouseYPosition);
        this.drawLine(this.mouseXPosition, 0, this.mouseXPosition, this.graphHeight);
    }

    drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number): void {
        this.context.beginPath();
        this.context.moveTo(xStart, yStart);
        this.context.lineTo(xEnd, yEnd);
        this.context.strokeStyle = '#FFFFFF';
        this.context.lineWidth = 1;
        this.context.stroke();
    }

    private addCanvasListeners(): void {
        this.canvas.addEventListener('wheel', (event: WheelEvent) => {
            if(event.deltaY > 0) {
                if(this.graphZoom - 2 !== 30) {
                    this.graphZoom = this.graphZoom - .5;
                }
            } else {
                this.graphZoom = this.graphZoom + .5;
            }

            console.log(this.graphZoom, this.xGridThreshold)

            if(this.graphZoom < this.xGridThreshold) {
                this.graphZoom = this.xGridThreshold + 100;
            }
        })

        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            this.mouseXPosition = event.clientX;
            this.mouseYPosition = event.clientY;
        });
    }
}