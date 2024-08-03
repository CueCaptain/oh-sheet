import {Box} from '@mantine/core';
import Stream from 'components/Livestream/Stream';

export default function WatchLiveStream() {
  return (
    <>
      <Box w="100vw" h="100vh">
        <Stream />
      </Box>
    </>
  );
}
