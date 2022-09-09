export declare enum Continuation {
    Continue = 0,
    Cancel = 1,
}
export declare class Intervals {
    private setIntervalHandle;
    private setIntervalLastTime;
    private paused;
    private clientCallbacks;
    static readonly DEFAULT_MILLISECOND_INTERVAL: number;
    start(clientCallback: (timeDelta: number) => Continuation): void;
    stop(): void;
    pause(pause: boolean): void;
    private setIntervalCallback();
}
