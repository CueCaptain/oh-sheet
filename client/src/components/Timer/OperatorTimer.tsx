import {useEffect} from 'react';
import {Flex, Text, Box} from '@mantine/core';
import Countdown, {CountdownApi} from 'react-countdown';
import {useServer} from 'contexts/ServerDataContext';
import StageClock from './StageClock';
import BarTimer from './BarTimer';
import moment from 'moment';

export default function OperatorTimer() {
  let countdownApi: CountdownApi | null = null;
  const server = useServer();
  const timerData = server.data.timerData;

  const setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      countdownApi = countdown.getApi();
    }
  };

  useEffect(() => {
    if (timerData.timerState === 'pause') {
      if (countdownApi) countdownApi.pause();
    } else if (timerData.timerState === 'play') {
      if (countdownApi) countdownApi.start();
    }
  }, [timerData.timerState, countdownApi]);

  return (
    <>
      <Box mt={2} mx={2} px={2} pb={2}>
        <Flex align={'center'} justify={'space-between'}>
          {server.data.cues.length > 0 ? (
            <Countdown
              key={server.data.cues[server.data.currentPtr]?.cue}
              ref={setRef}
              date={moment().valueOf() + timerData.currentDuration * 1000}
              renderer={Renderer}
              autoStart={false}
            />
          ) : (
            <Renderer hours={0} minutes={0} seconds={0} />
          )}
          <StageClock />
        </Flex>
        <BarTimer />
      </Box>
    </>
  );
}

const Renderer = ({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  return (
    <Text>
      {h}:{m}:{s}
    </Text>
  );
};
