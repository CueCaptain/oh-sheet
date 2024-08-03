import {Box, Flex, Group, Text} from '@mantine/core';
import {ICue} from 'types';
import {useServer} from 'contexts/ServerDataContext';
export interface ICueProps {
  cue: ICue;
  bg: string;
}

export default function Cue(props: ICueProps) {
  const cue = props.cue;
  const server = useServer();
  const headers =
    server.sortedHeaders.length > 0 ? server.sortedHeaders : Object.keys(cue);
  const extraStyles =
    props.bg !== 'dark.6'
      ? {
          overflow: 'auto',
          borderRadius: '1rem',
          flexGrow: 1,
          outline: `calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-${props.bg.replace('.', '-')})`,
        }
      : {overflow: 'auto', borderRadius: '1rem', flexGrow: 1, opacity: '65%'};

  const opacityStyle = props.bg === 'dark.6' ? {opacity: '65%'} : {};

  return (
    <Flex direction={'column'} h={'100%'} p={1} style={opacityStyle}>
      <Box
        h={'32px'}
        bg={props.bg}
        mb={'xs'}
        style={{overflow: 'hidden', borderRadius: '1rem'}}
      >
        <Flex align={'center'} h={'100%'}>
          <Box p={'xs'}>{cue.cue}</Box>
          <Box>{cue.item}</Box>
        </Flex>
      </Box>
      <Box maw={'500px'} miw={'fit-content'} bg={'dark.6'} style={extraStyles}>
        <Box
          miw={'300px'}
          top={0}
          bg={'dark.6'}
          style={{
            position: 'sticky',
            borderBottom:
              'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)',
          }}
        >
          <Flex align={'center'} justify={'space-between'}>
            <Flex
              p={6}
              justify={'center'}
              style={{
                flexGrow: 1,
                borderRight:
                  'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)',
              }}
            >
              <Text size="sm" mr={4}>
                Start
              </Text>
              <Text size="sm">{cue.start}</Text>
            </Flex>
            <Flex p={6} justify={'center'} style={{flexGrow: 1}}>
              <Text size="sm" mr={4}>
                End
              </Text>
              <Text size="sm">{cue.end}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box miw={'300px'} maw={'500px'}>
          {headers.map((key, index) => {
            const alternatingColors = index % 2 === 0 ? '' : 'dark.7';
            if (
              key !== 'cue' &&
              key !== 'item' &&
              key !== 'start' &&
              key !== 'end' &&
              key !== 'duration'
            )
              return (
                <Box key={key + '-' + props.cue} bg={alternatingColors}>
                  <Group justify="space-between" align="center" p={4}>
                    <Text size="md">{key}: </Text>
                    <Text size="md">{cue[key]}</Text>
                  </Group>
                </Box>
              );
            return null;
          })}
        </Box>
      </Box>
    </Flex>
  );
}
