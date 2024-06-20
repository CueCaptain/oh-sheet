import { useEffect } from 'react';
import { Flex, Group, Box, Title } from '@mantine/core';
import { ActionIcon } from '@mantine/core';

import { IoPlay, IoPlaySkipBack, IoPlaySkipForward, IoPause } from 'react-icons/io5';
import { AiOutlineAlert, AiFillAlert } from 'react-icons/ai';
import Countdown, { CountdownApi } from 'react-countdown';
import { useServer } from 'contexts/ServerDataContext';
import moment from 'moment';

export default function ControllerTimer () {
    let countdownApi: CountdownApi | null = null;
    const server = useServer();
    const standBy = server.data.standBy;
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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLInputElement;
            if(target.id.includes('no-key-down')) return null;
            if (event.key === "ArrowRight" || event.key === "d" || event.key === 'MediaTrackNext') {
                server.incrementCurrentPtr();
            } else if (event.key === "ArrowLeft" || event.key === "a" || event.key === 'MediaTrackPrevious') {
                server.decrementCurrentPtr();
            } else if (event.key === "ArrowUp" || event.key === "w") {
                server.toggleStandBy();
            } else if (event.key === ' ' || event.key === 'MediaPlayPause') {
                server.togglePlayPause();
            }
        };
        document.addEventListener('keydown', handleKeyDown)
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown)
        }
      }, [server]);

    return (
        <>
            <Flex direction={'column'} justify={'center'} align={'center'}>
                <Box mb={4}>
                    { server.data.cues.length > 0 ? <Countdown 
                        key={server.data.cues[server.data.currentPtr]?.cue}
                        ref={setRef}
                        date={timerData?.timerState === 'pause' ? (moment().unix() + timerData.currentDuration) * 1000 : timerData?.currentEndTime * 1000} 
                        renderer={Renderer} 
                        autoStart={false}
                    /> : <Renderer hours={0} minutes={0} seconds={0}/> }
                </Box>
                <Flex justify={'center'} align={'center'} >
                    <Group>
                        <ActionIcon onClick={server.decrementCurrentPtr}>
                            <IoPlaySkipBack />
                        </ActionIcon>
                        <ActionIcon onClick={server.togglePlayPause}>
                            {timerData.timerState === 'pause' ? <IoPlay /> : <IoPause /> }
                        </ActionIcon>
                        <ActionIcon onClick={server.incrementCurrentPtr}>
                            <IoPlaySkipForward />
                        </ActionIcon>
                        <ActionIcon onClick={server.toggleStandBy}>
                            {standBy ? <AiFillAlert /> : <AiOutlineAlert /> }
                        </ActionIcon>
                    </Group>
                </Flex>
            </Flex>
        </>
    );
}

const Renderer = ({ hours, minutes, seconds } : {hours: number, minutes: number, seconds: number}) => {
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    return <Title>{h}:{m}:{s}</Title>;
};
