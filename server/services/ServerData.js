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
                currentStartTime: 0,
                currentEndTime: 0,
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
        })
    }

    updateServerData(newServerData){
        this.serverData = {...this.serverData, ...newServerData};
        this.serverEmitUpdate();
    }

    openCueSheet(cues){
        this.serverData.cues = cues;
        const cue = cues[0];
        const now = moment().unix();
        this.serverData.currentPtr = 0;
        this.serverData.timerData = { 
          ...this.serverData.timerData,
          currentStartTime: 0,
          currentEndTime:  now + this.serverData.timerData.currentDuration,
          currentDuration: cue?.duration ? cue.duration : 0,
          timerState: 'pause',
        };
        this.serverEmitUpdate();
    }

    setServerDataByKey(key, data) {
        this.serverData[key] = data;
        this.serverEmitUpdate();
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