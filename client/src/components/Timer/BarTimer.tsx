import { useEffect } from 'react';
import { Progress } from '@mantine/core';
import Countdown, { CountdownApi } from 'react-countdown';
import { useServer } from 'contexts/ServerDataContext';
import moment from 'moment';

export default function BarTimer () {
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

    const Renderer = ({ hours, minutes, seconds } : {hours: number, minutes: number, seconds: number}) => {
        const currentTimeLeftInSeconds = seconds + (60 * minutes) + (60 * 60 * hours);
        const percentage = ((currentTimeLeftInSeconds/(timerData.currentEndTime - timerData.currentStartTime)) * 100);
        return <Progress size={'xl'} value={percentage} radius={'xl'} />;
    };

    return (
        <>
            { server.data.cues.length > 0 ? <Countdown 
                key={server.data.cues[server.data.currentPtr]?.cue}
                ref={setRef}
                date={timerData?.timerState === 'pause' ? (moment().unix() + timerData.currentDuration) * 1000 : timerData?.currentEndTime * 1000} 
                renderer={Renderer} 
                autoStart={false}
            /> : <Progress size={'xl'} value={0} radius={'xl'} />}
        </>
    );
}