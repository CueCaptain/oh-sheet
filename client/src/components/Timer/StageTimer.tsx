import { useEffect } from 'react';
import { Box, Title, Center } from '@mantine/core';
import Countdown, { CountdownApi } from 'react-countdown';
import { useServer } from 'contexts/ServerDataContext';
import moment from 'moment';

export interface IStageTimerProps {
    size: string
}


export default function StageTimer (props: IStageTimerProps) {
    let countdownApi: CountdownApi | null = null;
    const server = useServer();
    const timerData = server.data.timerData;

    const setRef = (countdown: Countdown | null): void => {
        if(countdown){
            countdownApi = countdown.getApi();
        }
    }

    useEffect(() => {
        if(timerData.timerState === 'pause'){
            if(countdownApi) countdownApi.pause();
        } else if (timerData.timerState === 'play') {
            if(countdownApi) countdownApi.start();
        }
    }, [timerData.timerState, countdownApi]);

    return (
        <>
            <Box
                m={4}
                px={2}
                pb={2}
                style={{borderRadius: '1rem'}}
            >
                <Center>
                    { server.data.cues.length > 0 ? <Countdown 
                        key={server.data.cues[server.data.currentPtr]?.cue}
                        ref={setRef}
                        date={timerData?.timerState === 'pause' ? (moment().unix() + timerData.currentDuration) * 1000 : timerData?.currentEndTime * 1000}
                        renderer={(rendererProps) => <Renderer {...rendererProps} size={props.size}/>} 
                        autoStart={false}
                    /> : <Renderer hours={0} minutes={0} seconds={0} size={props.size} /> }
                </Center>
            </Box>
        </>
    );
}

const Renderer = ({ hours, minutes, seconds, size } : {hours: number, minutes: number, seconds: number, size: string}) => {
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    return <Title size={size}>{h}:{m}:{s}</Title>;
};
