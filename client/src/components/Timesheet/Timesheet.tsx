import { useEffect } from 'react';
import {Box, Center, Title } from '@mantine/core';
import Cue from 'components/Cue/Cue';
import { useServer } from 'contexts/ServerDataContext';

export default function Timesheet () {
    const server = useServer();
    const cues = server.data.cues;
    const currentPtr = server.data.currentPtr;
    const standBy = server.data.standBy;
    const currentCueColor = "green.9";
    const standByColor = "blue.9";
    const standardColor = 'dark.6';

    useEffect(() => {
        if(standBy) document.getElementById('cue-'+(currentPtr+1))?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
        else document.getElementById('cue-'+currentPtr)?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
    }, [currentPtr, standBy]);

    return (
        <>
        { cues.length > 0 ?
            <div style={{ height: '100%', width: '100%', overflowX: 'auto', display: 'flex', gap: '1rem' }}>
                {
                    cues.map((cue, i) => {
                        const bgCol = currentPtr === i ? currentCueColor : (standBy && i === currentPtr + 1 ? standByColor : standardColor);
                        return (
                            <Box
                                id={'cue-'+i} 
                                key={String(cue.cue)}
                                style={{
                                    height: '100%', 
                                    minWidth: '20rem',
                                }}
                            >
                                <Cue cue={cue} bg={bgCol} />
                            </Box>
                        );
                    })
                }
            </div> 
        :
            <Center h={'100%'}>
                <Title size={'2rem'}>
                    no timesheet open.
                </Title>
            </Center>
        }
        </>

    );
}
