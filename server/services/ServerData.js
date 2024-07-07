import { Server as SocketServer } from 'socket.io';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverDataFilePath = join(__dirname, 'serverdata.json');

//TODO: this needs to emit specific updates to the client. Not the entire data
//TODO: remove moment
//TODO: start and stop time needs to be handled by client if possible such that all client timers are synced
export default class ServerData {
    constructor(server) {
        this.connectedClients = {};
        const storedServerData = this.readServerDataFile();
        this.serverData = storedServerData ? storedServerData : {
            header: "",
            title: "",
            subtitle: "",
            cues: [],
            currentPtr: 0,
            standBy: false,
            timerData: {
                currentDuration: 0,
                timerState: 'pause',
            },            
            messageData: {
                operatorMessage: '',
                stageTimerMessage: '',
            },
            streamKey:'',
        };
        this.io = new SocketServer(server, {
            cors: {
                origin: '*',
            },
        });
      
        this.onConnect();
    }

    onConnect() {
        this.io.on('connection', (socket) => {
            console.log("connected: " + socket.id);
            socket.emit('connected', this.serverData);
            this.connectedClients[socket.id] = socket;
            socket.on('disconnect', () => {
                delete this.connectedClients[socket.id];
                console.log("disconnected: " + socket.id)
            });
            this.initialize(socket);
        })
    }

    initialize(socket) {
        socket.on('updateServerData', (newServerData) => {
            this.updateServerData(newServerData);
        });

        socket.on('toggleStandBy', () => {
            this.toggleStandBy();
        });

        socket.on('updateCurrentPtr', (newPtr) => {
            this.updateCurrentPtr(newPtr);
        });

        socket.on('togglePlayPause', (remainingDuration) => {
            this.togglePlayPause(remainingDuration);
        });

        socket.on('updateCurrentDurationWithoutEmit', (newDuration) => {
            this.updateCurrentDurationWithoutEmit(newDuration);
        });

        socket.on('setMessageData', (messageData) => {
            this.setMessageData(messageData);
        });
    }

    updateServerData(newServerData){
        this.serverData = {...this.serverData, ...newServerData};
        this.serverEmitUpdate();
    }

    openCueSheet(cues){
        this.serverData.cues = cues;
        const cue = cues[0];
        this.serverData.currentPtr = 0;
        this.serverData.timerData = { 
          ...this.serverData.timerData,
          currentDuration: cue?.duration ? cue.duration : 0,
          timerState: 'pause',
        };
        this.serverEmitUpdate();
    }

    setServerDataByKey(key, data) {
        this.serverData[key] = data;
        this.serverEmitUpdate();
    }

    toggleStandBy() {
        const newServerData = {...this.serverData, standBy: !this.serverData.standBy};
        this.updateServerData(newServerData);
    }

    updateCurrentPtr(newPtr) {
        let newServerData = {...this.serverData, currentPtr: newPtr, standBy: false};
        const cue = newServerData.cues[newServerData.currentPtr];
        newServerData.timerData = { 
            ...newServerData.timerData,
            currentDuration: cue?.duration ? cue.duration : 0,
            timerState: 'pause',
        };
        this.updateServerData(newServerData);
    }

    togglePlayPause(remainingDuration) {
        let newTimerData = {...this.serverData.timerData};
        if(remainingDuration !== -1) {
            newTimerData.currentDuration = remainingDuration;
        }
        if(this.serverData.timerData.timerState === 'pause'){
            newTimerData.timerState = 'play';
        } else if (this.serverData.timerData.timerState === 'play'){
            newTimerData.timerState = 'pause';
        }
        const newServerData = {...this.serverData, timerData: newTimerData};
        this.updateServerData(newServerData);
    }

    updateCurrentDurationWithoutEmit(newDuration) {
        let newTimerData = {...this.serverData.timerData, currentDuration: newDuration};
        this.serverData.timerData = newTimerData;
    }

    setMessageData(messageData) {
        let newServerData = {...this.serverData};
        newServerData.messageData = messageData;
        this.updateServerData(newServerData);
    }


    serverEmitUpdate() {
        this.io.sockets.emit('serverDataUpdated', this.serverData);
        this.writeServerDataFile();
    }

    readServerDataFile() {
        try {
            const jsonString = readFileSync(serverDataFilePath, 'utf-8');
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error reading or parsing JSON file:', error);
            return false;
        }
    }

    writeServerDataFile() {
        try {
            const jsonString = JSON.stringify(this.serverData, null, 2);
            writeFileSync(serverDataFilePath, jsonString, { flag: 'w' });
        } catch (error) {
            console.error('Error writing JSON file:', error);
        }
    }
}