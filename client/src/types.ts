export interface ICue {
    cue: number;
    start: string;
    end: string;
    item: string;
    duration: number;
    [x: string | number | symbol]: string | number;
}

export interface ITimerData {
    currentStartTime: number;
    currentEndTime: number;
    currentDuration: number;
    timerState: 'play' | 'pause';
}

export interface IMessageData {
    operatorMessage: string;
    stageTimerMessage: string;
}

export interface IServerData {
    header: string;
    title: string;
    subtitle: string;
    cues: ICue[];
    currentPtr: number;
    standBy: boolean;
    timerData: ITimerData;
    messageData: IMessageData;
    streamKey: string;
}