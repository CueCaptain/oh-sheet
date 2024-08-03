import {ActionIcon, Box, Button, Flex, Text} from '@mantine/core';
import {useServer} from 'contexts/ServerDataContext';
import {useState} from 'react';
import {IoRefreshOutline} from 'react-icons/io5';

export default function MediaServerInfo() {
  const [loading, setLoading] = useState(false);
  const server = useServer();
  const streamKey = server.data.streamKey;
  const streamAdminPage = `http://${window.location.hostname}:${import.meta.env.VITE_OHSHEET_MEDIA_SERVER_PORT}/admin`;
  const generateStreamKey = () => {
    setLoading(true);
    fetch(
      `http://${window.location.hostname}:${import.meta.env.VITE_OHSHEET_BACKEND_SERVER_PORT}/mediaserver/generate_stream_key`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(() => {
      setLoading(false);
    });
  };
  return (
    <Box>
      <Box
        style={{
          borderBottom:
            'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)',
        }}
      >
        <Box w={'100%'} m={'xs'}>
          <Text>stream url:</Text>
          <Flex align={'center'} justify={'center'}>
            {`rtmp://${window.location.hostname}/live`}
          </Flex>
        </Box>
      </Box>
      <Box
        style={{
          borderBottom:
            'calc(0.0625rem* var(--mantine-scale)) solid var(--mantine-color-dark-4)',
        }}
      >
        <Box w={'100%'} m={'xs'}>
          <Text mx={2} mt={2}>
            stream key:
          </Text>
          <Flex align={'center'} justify={'center'}>
            <Box mr={2}>{streamKey}</Box>
            {streamKey === '' ? (
              <Button loading={loading} onClick={generateStreamKey}>
                Generate Stream Key
              </Button>
            ) : (
              <ActionIcon
                variant="subtle"
                loading={loading}
                onClick={generateStreamKey}
              >
                {' '}
                <IoRefreshOutline />{' '}
              </ActionIcon>
            )}
          </Flex>
        </Box>
      </Box>
      <Box w={'100%'}>
        <Flex align={'center'} justify={'center'} wrap={'wrap'} m={'xs'}>
          <Button
            m={2}
            size="xs"
            variant="outline"
            onClick={() => window.open(streamAdminPage, '_blank')}
          >
            Stream Admin Page
          </Button>
          <Button
            m={2}
            size="xs"
            variant="outline"
            onClick={() => window.open('/watch', '_blank')}
          >
            Watch
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
