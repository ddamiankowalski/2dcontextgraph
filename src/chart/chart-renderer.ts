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
        this.graphZoom = 75;

        this.canvas.style.backgroundColor = "#252525";
        this.addCanvasListeners();
    }

    private context: CanvasRenderingContext2D | undefined;
    private canvas: HTMLCanvasElement | undefined;
    private graphWidth: number;
    private graphHeight: number;
    private graphZoom: number;

    private horizontalMargin: number = 50;
    private verticalMargin: number = 50;

    private mouseXPosition: number;
    private mouseYPosition: number;

    private xGridThreshold: number = 50;

    private startTime: number = new Date().getTime();
    private endTime: number = new Date().getTime();

    public draw(timePassed: number): void {
        this.context.clearRect(0, 0, this.graphWidth, this.graphHeight);

        this.drawGrid();
        window.requestAnimationFrame(this.draw.bind(this));
    }

    drawGrid(): void {
        this.drawVerticalLines();
        //this.drawMousePosition();
        this.drawTimeline();
    }

    private drawVerticalLines(): void {
        for(let drawingXPosition = this.graphWidth; drawingXPosition > 0; drawingXPosition = drawingXPosition - this.graphZoom) {
            this.drawLine(drawingXPosition, 0, drawingXPosition, this.graphHeight - this.verticalMargin);
        }
    }

    private drawTimeline(): void {
        this.context.font = "12px sans-serif";
        this.context.fillStyle = '#A9A9A9';
        this.context.fillText(this.startTime.toString(), this.graphWidth - 100, this.graphHeight - 20);
        this.context.fillText('Current time span between columns:', this.graphWidth / 2 - 100, this.graphHeight - 20);
    }

    private drawMousePosition(): void {
        this.drawLine(0, this.mouseYPosition, this.graphWidth, this.mouseYPosition);
        this.drawLine(this.mouseXPosition, 0, this.mouseXPosition, this.graphHeight);
    }

    drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number): void {
        this.context.beginPath();
        this.context.moveTo(xStart, yStart);
        this.context.lineTo(xEnd, yEnd);
        this.context.strokeStyle = '#A9A9A9';
        this.context.lineWidth = 1;
        this.context.stroke();
    }

    private addCanvasListeners(): void {

        // wheel event
        this.canvas.addEventListener('wheel', (event: WheelEvent) => {
            if(event.deltaY > 0) {
                if(this.graphZoom - 2 !== 30) {
                    this.graphZoom = this.graphZoom - 1;
                }
            } else {
                this.graphZoom = this.graphZoom + 1;
            }

            if(this.graphZoom === this.xGridThreshold) {
                this.graphZoom = this.xGridThreshold * 2 - 1;
            } else if(this.graphZoom === this.xGridThreshold * 2) {
                this.graphZoom = this.xGridThreshold + 1;
            }
        })

        // mousemove event
        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            this.mouseXPosition = event.clientX;
            this.mouseYPosition = event.clientY;
        });
    }
}