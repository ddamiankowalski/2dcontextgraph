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

    private horizontalMargin: number = 70;
    private verticalMargin: number = 70;

    private mouseXPosition: number;
    private mouseYPosition: number;

    private xGridThreshold: number = 50;

    private currentTimeSpan: number = 3600000; // the timespan that means what is the current time difference between two vertical lines

    private startTime: number = new Date().getTime();
    
    private viewOffset: number = 0;

    private mouseDown: boolean;
    private mouseDownPosX: number;
    private mouseUpPosX: number;

    public draw(timePassed: number): void {
        this.context.clearRect(0, 0, this.graphWidth, this.graphHeight);

        this.drawGrid();
        this.startTime = new Date().getTime();
        window.requestAnimationFrame(this.draw.bind(this));
    }

    drawGrid(): void {
        this.drawVerticalLines();
        //this.drawMousePosition();
        this.drawTimeline();
    }

    private drawVerticalLines(): void {
        let currentColumn = 0;
        // todo, this is where we need to shuffle things around a bit
        for(let drawingXPosition = this.graphWidth; drawingXPosition + this.viewOffset > 0; drawingXPosition = drawingXPosition - this.graphZoom) {
            this.drawLine(drawingXPosition + this.viewOffset - this.horizontalMargin, 0, drawingXPosition + this.viewOffset - this.horizontalMargin, this.graphHeight - this.verticalMargin);
            this.drawLineTime(currentColumn, drawingXPosition + this.viewOffset);
            currentColumn++;
        }
    }

    private drawTimeline(): void {
        this.context.font = "12px sans-serif";
        this.context.fillStyle = '#A9A9A9';
        this.context.fillText(this.startTime.toString(), this.graphWidth - 100, this.graphHeight - 20);
        this.context.fillText('Current time span in min: ' + (this.currentTimeSpan / 1000 / 60), this.graphWidth / 2 - 100, this.graphHeight - 20);
    }

    drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number): void {
        this.context.beginPath();
        this.context.moveTo(xStart, yStart);
        this.context.lineTo(xEnd, yEnd);
        this.context.strokeStyle = '#A9A9A9';
        this.context.lineWidth = 1;
        this.context.stroke();
    }

    private drawLineTime(currentColumn: number, xPosition: number): void {
        const currentTime = new Date().getHours();

        this.context.font = "12px sans-serif";
        this.context.fillStyle = '#A9A9A9';
        this.context.fillText((currentTime - currentColumn).toString(), xPosition - this.horizontalMargin - 5, this.graphHeight - 50);
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
                this.currentTimeSpan = this.currentTimeSpan * 2;
            } else if(this.graphZoom === this.xGridThreshold * 2) {
                this.graphZoom = this.xGridThreshold + 1;
                this.currentTimeSpan = this.currentTimeSpan / 2;
            }
        })

        // mousemove event
        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            this.mouseXPosition = event.clientX;
            this.mouseYPosition = event.clientY;
        });

        this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
            this.mouseDown = true;
            this.mouseDownPosX = event.x;
        })

        this.canvas.addEventListener('mouseup', (event: MouseEvent) => {
            this.mouseDown = false;
        })

        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            if(this.mouseDown) {
                if(this.viewOffset + event.movementX > 0) {
                    this.viewOffset = this.viewOffset + event.movementX;
                }
            }
        })
    }
}