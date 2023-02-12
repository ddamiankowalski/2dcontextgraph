export abstract class Renderer {
    abstract draw(timePassed?: number): void;
    abstract drawGrid(): void;
    abstract drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number): void;
}