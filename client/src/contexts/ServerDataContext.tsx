import React, { useContext, useState, useEffect, Dispatch, SetStateAction } from "react"
import io from 'socket.io-client';
import { IServerData } from "types";

//TODO: remove moment
//TODO: move all time logic to server and have time difference calculated in client so all clients can stay synced with server time
interface ServerDataInterface {
    connected: boolean;
    data: IServerData;
    sortedHeaders: string[],
    setSortedHeaders: Dispatch<SetStateAction<string[]>>;
    togglePlayPause: (remainingDuration : number) => void;
    updateCurrentDurationWithoutEmit: (newDuration: number) => void;
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
    setSortedHeaders: () => {},
    togglePlayPause: () => {},
    updateCurrentDurationWithoutEmit: () => {},
    toggleStandBy: () => {},
    incrementCurrentPtr: () => {},
    decrementCurrentPtr: () => {},
    setMessageData: () => {}
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

    useEffect(() => {
        const _socket = io(`http://${window.location.hostname}:${import.meta.env.VITE_OHSHEET_BACKEND_SERVER_PORT}`, { transports: ['websocket'] });
        setSocket(_socket);
        _socket.on('connected', (data: IServerData) => {
            setConnected(true);
            setServerData(data);
        });

        _socket.on('serverDataUpdated', (data: IServerData) => {
            setServerData(data);
        });

        return () => {
            setConnected(false);
            _socket.disconnect();
        }
    },[]);

    const emitSocketData = (key: string, data: any = '') => {
        if(socket) socket.emit(key, data);
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

    const togglePlayPause = (remainingDuration : number) => {
        emitSocketData('togglePlayPause', remainingDuration);
    }

    const updateCurrentDurationWithoutEmit = (newDuration : number) => {
        emitSocketData('updateCurrentDurationWithoutEmit', newDuration);
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
        setSortedHeaders: setSortedHeaders,
        togglePlayPause: togglePlayPause,
        updateCurrentDurationWithoutEmit: updateCurrentDurationWithoutEmit,
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