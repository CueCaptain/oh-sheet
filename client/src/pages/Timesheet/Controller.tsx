import { Box, Center, Flex } from "@mantine/core";
import ControllerTimer from "components/Timer/ControllerTimer";

export default function Controller() {
  return (
    <>
      <Flex h={'100vh'} w={'100vw'}>
        <Box m={4}>
            <Flex h={'100%'} direction={'column'} maw={363}>
                <Box id="timerBox" m={4} p='lg' bg={'blueGray.9'}>
                    <Center h={'100%'}>
                        <ControllerTimer />
                    </Center>
                </Box>
                <Box id="messageBox" m={4} h={'25%'} bg={'blueGray.9'}>
                    Message Box
                </Box>
                <Box id="serverInfo" m={4} h={'25%'} bg={'blueGray.9'}>
                    Node Media Server
                </Box>
                <Box id="controlOptions" m={4} h={'25%'} bg={'blueGray.9'}>
                    Control Options
                </Box>
            </Flex>
        </Box>
        <Box id='cueSheetBox' m={8} bg={'blueGray.9'} style={{flexGrow: 1}}>
            Cue Sheet Box
        </Box>
      </Flex>
    </>
  );
}

