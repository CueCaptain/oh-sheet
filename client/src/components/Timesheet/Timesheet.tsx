import {useEffect} from 'react';
import {Box, Center, Title} from '@mantine/core';
import Cue from 'components/Cue/Cue';
import {useServer} from 'contexts/ServerDataContext';
import Layout from 'components/Layout/Layout';

export default function Timesheet() {
  const server = useServer();
  const cues = server.data.cues;
  const currentPtr = server.data.currentPtr;
  const standBy = server.data.standBy;
  const currentCueColor = 'red.9';
  const standByColor = 'yellow.9';
  const standardColor = 'dark.6';

  useEffect(() => {
    document
      .getElementById('cue-' + currentPtr)
      ?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }, [currentPtr, standBy]);

  if (cues.length === 0) {
    return (
      <Center h={'100%'}>
        <Title size={'2rem'}>No timesheet open.</Title>
      </Center>
    );
  }

  return <Layout cues={cues} />;

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        overflowX: 'auto',
        display: 'flex',
        gap: '1rem',
      }}>
      {cues.map((cue, i) => {
        const bgCol =
          currentPtr === i
            ? currentCueColor
            : standBy && i === currentPtr + 1
              ? standByColor
              : standardColor;
        return (
          <Box
            id={'cue-' + i}
            key={String(cue.cue)}
            style={{
              height: '100%',
              minWidth: '20rem',
            }}>
            <Cue cue={cue} bg={bgCol} />
          </Box>
        );
      })}
    </div>
  );
}
