import { Renderer } from '../interfaces/renderer';

export class ChartRenderer implements Renderer {
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.context = context;
        this.canvas = canvas;
        this.canvas.style.width = '850px';
        this.canvas.style.height = '450px';
        this.canvas.height = canvas.offsetHeight;
        this.canvas.width = canvas.offsetWidth;
        this.graphWidth = canvas.width;
        this.graphHeight = canvas.height;
        this.scrollSpeed = 2;
        this.graphZoom = 60;

        this.canvas.style.backgroundColor = "#252525";
        this.addCanvasListeners();
    }

    /**
     * My suggestion is to calculate the absolute canvas width (canvas.style.width - this.horizontalMargin)
     * In current situation, this will leave
     */

    private context: CanvasRenderingContext2D | undefined;
    private canvas: HTMLCanvasElement | undefined;
    private graphWidth: number;
    private graphHeight: number;
    private graphZoom: number;

    private horizontalMargin: number = 70;
    private verticalMargin: number = 70;

    private xGridThreshold: number = 48;

    private currentTimeSpan: number = 3600000; // the timespan that means what is the current time difference between two vertical lines

    private startTime: number = new Date().getTime();
    
    private viewOffset: number = 0;

    private mouseDown: boolean;

    private scrollSpeed: number;

    public draw(timePassed: number): void {
        this.context.clearRect(0, 0, this.graphWidth, this.graphHeight);

        this.drawGrid();
        this.startTime = new Date().getTime();
        window.requestAnimationFrame(this.draw.bind(this));
    }

    drawGrid(): void {
        this.drawVerticalLines();
        this.drawTimeline();
    }

    private drawVerticalLines(): void {
        let currentColumn = 0;
        // todo, this is where we need to shuffle things around a bit
        for(let drawingXPosition = this.graphWidth; drawingXPosition + this.viewOffset > 0; drawingXPosition = drawingXPosition - this.graphZoom) {
            if(drawingXPosition + this.viewOffset - this.horizontalMargin > 0) {
                this.drawLine(drawingXPosition + this.viewOffset - this.horizontalMargin, 0, drawingXPosition + this.viewOffset - this.horizontalMargin, this.graphHeight - this.verticalMargin);
                this.drawLineTime(currentColumn, drawingXPosition + this.viewOffset);
                currentColumn++;
            }
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
            const columnToGraphZoomRatio = (this.graphWidth + this.viewOffset - this.horizontalMargin - event.offsetX) / this.graphZoom * this.scrollSpeed;

            if(event.deltaY > 0 && (this.graphZoom - this.scrollSpeed > this.xGridThreshold && this.currentTimeSpan || this.currentTimeSpan !== 3600000)) {
                this.graphZoom = this.graphZoom - this.scrollSpeed;
                this.viewOffset = this.viewOffset - columnToGraphZoomRatio;
            } else if(event.deltaY < 0) {
                this.graphZoom = this.graphZoom + this.scrollSpeed;
                this.viewOffset = this.viewOffset + columnToGraphZoomRatio;
            }

            if(this.graphZoom === this.xGridThreshold) {
                if(this.currentTimeSpan === 3600000) {
                    return;
                }
                this.graphZoom = this.xGridThreshold * 2 - this.scrollSpeed;
                this.currentTimeSpan = this.currentTimeSpan * 2;
                this.viewOffset = this.viewOffset - columnToGraphZoomRatio / 2;
            } else if(this.graphZoom === this.xGridThreshold * 2) {
                this.graphZoom = this.xGridThreshold + this.scrollSpeed;
                this.currentTimeSpan = this.currentTimeSpan / 2;
                this.viewOffset = this.viewOffset + columnToGraphZoomRatio * 2;


                console.log('zoomed in, currentoffsetview: ', this.viewOffset)
            }

            this.blockViewOffset();
        })

        this.canvas.addEventListener('mouseout', (event: MouseEvent) => {
            this.mouseDown = false;
        });

        this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
            this.mouseDown = true;
        })

        this.canvas.addEventListener('mouseup', (event: MouseEvent) => {
            this.mouseDown = false;
        })

        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            if(this.viewOffset + event.movementX > 0 && this.mouseDown) {
                this.viewOffset = this.viewOffset + event.movementX;
            }
        })
    }

    private blockViewOffset(): void {
        if(this.viewOffset < 0) {
            this.viewOffset = 0;
        }
    }
}