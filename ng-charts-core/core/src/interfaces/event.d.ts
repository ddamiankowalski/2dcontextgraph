export interface ChartEvent<T = any> {
    eventName: string;
    callback: (event: T) => void;
}
