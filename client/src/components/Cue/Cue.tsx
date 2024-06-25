import { Box, Flex, Group, Text } from '@mantine/core';
import { ICue } from 'types';
import { useServer } from 'contexts/ServerDataContext';
export interface ICueProps {
    cue: ICue,
    bg: string,
}

export default function Cue (props: ICueProps) {
    const cue = props.cue;
    const server = useServer();
    const headers = server.sortedHeaders.length > 0 ? server.sortedHeaders : Object.keys(cue);

    return (
        <Box
            h={'100%'}
            maw={'500px'}
            miw={'fit-content'}
            style={{overflow: 'auto', borderRadius: '1rem'}}
        >
            <Box miw={'300px'} top={0} bg={props.bg} style={{position: 'sticky', borderBottom: 'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)'}}>
                <Flex align={'center'} style={{borderBottom: 'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)'}}>
                    <Box p={6} h={'100%'}>
                        {cue.cue}
                    </Box>
                    <Box p={6} style={{borderLeft: 'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)'}}>
                        {cue.item}
                    </Box>
                </Flex>
                <Flex align={'center'} justify={'space-between'}>
                    <Flex p={6} justify={'center'} style={{flexGrow: 1, borderRight: 'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)'}}>
                        <Text size='sm' mr={4}>Start</Text> 
                        <Text size='sm'>{cue.start}</Text>
                    </Flex>
                    <Flex p={6} justify={'center'} style={{flexGrow: 1}}>
                        <Text size='sm' mr={4}>End</Text> 
                        <Text size='sm'>{cue.end}</Text>
                    </Flex>
                </Flex>
            </Box>
            <Box miw={'300px'} maw={'500px'}>
                {headers.map(key => {
                    if(key !== 'cue' && key !== 'item' && key !== 'start' && key !== 'end' && key !== 'duration') return (
                        <Box key={key+'-'+props.cue}>
                            <Group justify='space-between' align='center' m={4}>
                                <Text size='md'>{key}: </Text> 
                                <Text size='md'>{cue[key]}</Text>
                            </Group>
                            <Box style={{borderBottom: 'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)'}} />
                        </Box>
                    );
                    return null;
                })}
            </Box>
        </Box>
    );
}
