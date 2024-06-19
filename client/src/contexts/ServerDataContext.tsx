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
  setSortedHeaders: Dispatch<SetStateAction<string[]>>;
  togglePlayPause: () => void;
  toggleStandBy: () => void;
  incrementCurrentPtr: () => void;
  decrementCurrentPtr: () => void;
  setMessageData: (key: 'operatorMessage' | 'stageTimerMessage', message:string) => void;
  countdown: (num: number) => void;
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
  toggleStandBy: () => {},
  incrementCurrentPtr: () => {},
  decrementCurrentPtr: () => {},
  setMessageData: (key: 'operatorMessage' | 'stageTimerMessage', message:string) => {},
  countdown: (num: number) => {},
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
      setConnected(false);
      _socket.disconnect();
    }
  },[])

  const updateServerData = (newServerData: IServerData) => {
    if(socket) socket.emit('updateServerData', newServerData);
  }

  const toggleStandBy = () => {
    const newServerData = {...serverData, standBy: !serverData.standBy};
    updateServerData(newServerData);
  };

  const incrementCurrentPtr = () => {
    const newPtr = serverData.currentPtr >= serverData.cues.length - 1 ? 0 : ++serverData.currentPtr;
    let newServerData = {...serverData, currentPtr: newPtr, standBy: false};
    newServerData = determineTimerData(newServerData);
    updateServerData(newServerData);
  }

  const decrementCurrentPtr = () => {
    const newPtr = serverData.currentPtr <= 0 ? 0 : --serverData.currentPtr;
    let newServerData = {...serverData, currentPtr: newPtr, standBy: false};
    newServerData = determineTimerData(newServerData);
    updateServerData(newServerData);
  }

  const togglePlayPause = () => {
    let newTimerData = {...serverData.timerData};
    if(serverData.timerData.timerState === 'pause'){
      newTimerData.timerState = 'play';
      const now = moment().unix();
      newTimerData.currentStartTime = now;
      newTimerData.currentEndTime = now + newTimerData.currentDuration;
    } else if (serverData.timerData.timerState === 'play'){
      newTimerData.timerState = 'pause';
      const now = moment().unix();
      const newDuration = newTimerData.currentEndTime - now >= 0 ? newTimerData.currentEndTime - now : 0;
      newTimerData.currentDuration = newDuration;
      newTimerData.currentEndTime = now + newTimerData.currentDuration;
    }
    const newServerData = {...serverData, timerData: newTimerData};
    updateServerData(newServerData);
  }

  const determineTimerData = (newServerData: IServerData) => {
    const cue = newServerData.cues[newServerData.currentPtr];
    const now = moment().unix();
    newServerData.timerData = { 
      ...newServerData.timerData,
      currentStartTime: 0,
      currentEndTime:  now + newServerData.timerData.currentDuration,
      currentDuration: cue?.duration ? cue.duration : 0,
      timerState: 'pause',
    };
    return newServerData;
  }

  const setMessageData = (key: 'operatorMessage' | 'stageTimerMessage', message:string) => {
    let newServerData = {...serverData};
    newServerData.messageData[key] = message;
    updateServerData(newServerData);
  }
  const countdown = (num: number) => {
    let newTimerData = {...serverData.timerData};
    newTimerData.timerState = 'pause';
    newTimerData.currentStartTime = 0;
    newTimerData.currentEndTime = num;
    newTimerData.currentDuration = num;
    const newServerData = {...serverData, timerData: newTimerData};
    updateServerData(newServerData);
  }

  const value = {
    connected: connected,
    data: serverData,
    sortedHeaders: sortedHeaders,
    setSortedHeaders: setSortedHeaders,
    togglePlayPause: togglePlayPause,
    toggleStandBy: toggleStandBy,
    incrementCurrentPtr: incrementCurrentPtr,
    decrementCurrentPtr: decrementCurrentPtr,
    setMessageData: setMessageData,
    countdown: countdown,
  };

  return (
    <ServerDataContext.Provider value={value}>
      {connected && children}
    </ServerDataContext.Provider>
  )
}