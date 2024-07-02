import React, { useContext, useState, useEffect, Dispatch, SetStateAction } from "react"
import io from 'socket.io-client';
import moment from 'moment';
import { IServerData } from "types";

//TODO: remove moment
//TODO: move all time logic to server and have time difference calculated in client so all clients can stay synced with server time
interface ServerDataInterface {
    connected: boolean;
    data: IServerData;
    sortedHeaders: string[],
    timerOffset: number,
    setSortedHeaders: Dispatch<SetStateAction<string[]>>;
    togglePlayPause: () => void;
    toggleStandBy: () => void;
    incrementCurrentPtr: () => void;
    decrementCurrentPtr: () => void;
    setMessageData: (key: 'operatorMessage' | 'stageTimerMessage', message:string) => void;
};

const ServerDataContext = React.createContext<ServerDataInterface>({
    connected: false,
    data: {    
        header: "",
        title: "",
        subtitle: "",
        cues: [],
        currentPtr: 0,
        standBy: false,
        timerData: {
            currentStartTime: 0,
            currentEndTime: 0,
            currentDuration: 0,
            timerState: 'pause',
        },
        messageData: {
            operatorMessage: '',
            stageTimerMessage: '',
        },
        streamKey: '',
    },
    sortedHeaders: [],
    timerOffset: 0,
    setSortedHeaders: () => {},
    togglePlayPause: () => {},
    toggleStandBy: () => {},
    incrementCurrentPtr: () => {},
    decrementCurrentPtr: () => {},
    setMessageData: (key: 'operatorMessage' | 'stageTimerMessage', message:string) => {}
});

export function useServer() {
    return useContext(ServerDataContext);
}

export default function ServerDataProvider({ children } : {children: JSX.Element | JSX.Element[] | never[] | null}) {
    const [socket, setSocket] = useState<any>();
    const [connected, setConnected] = useState<boolean>(false);
    const [serverData, setServerData] = useState<IServerData>({    
        header: "",
        title: "",
        subtitle: "",
        cues: [],
        currentPtr: 0,
        standBy: false,
        timerData: {
            currentStartTime: 0,
            currentEndTime: 0,
            currentDuration: 0,
            timerState: 'pause',
        },
        messageData: {
            operatorMessage: '',
            stageTimerMessage: '',
        },
        streamKey: '',
    });
    const [sortedHeaders, setSortedHeaders] = useState<string[]>([]);
    const [timerOffset, setTimerOffset] = useState<number>(0);

    useEffect(() => {
        calculateTimerOffset();
        const calculateTimerOffsetInterval = setInterval(async () => {
            await calculateTimerOffset();
        }, 60000);

        const _socket = io(import.meta.env.VITE_OHSHEET_BACKEND_SERVER_ADDR, { transports: ['websocket'] });
        setSocket(_socket);
        _socket.on('connected', (data: IServerData) => {
            setConnected(true);
            setServerData(data);
        });

        _socket.on('serverDataUpdated', (data: IServerData) => {
            // console.log('serverDataUpdated', data);
            setServerData(data);
        });

        return () => {
            clearInterval(calculateTimerOffsetInterval);
            setConnected(false);
            _socket.disconnect();
        }
    },[]);

    const calculateTimerOffset = async () => {
        try {
            const url = `${import.meta.env.VITE_OHSHEET_BACKEND_SERVER_ADDR}/ntp/time?t1=${moment().unix()}`;    
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            if (response.ok) {
                const { flightDifference, t3 } = await response.json();
                const t4 = moment().unix();
                const offset = (flightDifference + (t3 - t4)) / 2;
                setTimerOffset(offset);
            } else {
                const e = await response.json();
                throw new Error(e.message);
            }
        } catch (error) {
            console.error("Could not Calculate Timer Offset", error);
        }
    };
    

    const emitSocketData = (key: string, data: any = '') => {
        if(socket) socket.emit(key, data);
    }

    const updateServerData = (newServerData: IServerData) => {
        emitSocketData('updateServerData', newServerData);
    }

    const toggleStandBy = () => {
        emitSocketData('toggleStandBy');
    };

    const incrementCurrentPtr = () => {
        const newPtr = serverData.currentPtr >= serverData.cues.length - 1 ? 0 : ++serverData.currentPtr;
        emitSocketData('updateCurrentPtr', newPtr);
    }

    const decrementCurrentPtr = () => {
        const newPtr = serverData.currentPtr <= 0 ? 0 : --serverData.currentPtr;
        emitSocketData('updateCurrentPtr', newPtr);
    }

    const togglePlayPause = () => {
        emitSocketData('togglePlayPause');
    }

    const setMessageData = (key: 'operatorMessage' | 'stageTimerMessage', message:string) => {
        let messageData = {...serverData.messageData};
        messageData[key] = message;
        emitSocketData('setMessageData', messageData);
    }

    const value = {
        connected: connected,
        data: serverData,
        sortedHeaders: sortedHeaders,
        timerOffset: timerOffset,
        setSortedHeaders: setSortedHeaders,
        togglePlayPause: togglePlayPause,
        toggleStandBy: toggleStandBy,
        incrementCurrentPtr: incrementCurrentPtr,
        decrementCurrentPtr: decrementCurrentPtr,
        setMessageData: setMessageData,
    };

    return (
        <ServerDataContext.Provider value={value}>
            {connected && children}
        </ServerDataContext.Provider>
    )
}