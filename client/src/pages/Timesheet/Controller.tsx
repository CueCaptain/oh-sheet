import { Box, Center, Flex } from "@mantine/core";
import MediaServerInfo from "components/Livestream/MediaServerInfo";
import ControllerMessageBox from "components/Messages/ControllerMessageBox";
import ControllerTimer from "components/Timer/ControllerTimer";
import TimesheetSettings from "components/Timesheet/TimesheetSettings";

export default function Controller() {
  return (
    <>
      <Flex h={'100vh'} w={'100vw'}>
        <Box m={4}>
            <Flex h={'100%'} direction={'column'} maw={363}>
                <Box id="timerBox" m={4} p='lg' bg={'dark.7'} style={{borderRadius: '1rem'}}>
                    <Center h={'100%'}>
                        <ControllerTimer />
                    </Center>
                </Box>
                <Box id="messageBox" m={4} p={'lg'} bg={'dark.7'} style={{borderRadius: '1rem'}}>
                    <ControllerMessageBox />
                </Box>
                <Box id="serverInfo" m={4} bg={'dark.7'} style={{borderRadius: '1rem'}}>
                    <MediaServerInfo/>
                </Box>
                <Box id="controlOptions" m={4} p={'lg'} bg={'dark.7'} style={{borderRadius: '1rem'}}>
                  <TimesheetSettings />
                </Box>
            </Flex>
        </Box>
        <Box id='cueSheetBox' m={8} bg={'dark.7'} style={{flexGrow: 1, borderRadius: '1rem'}}>
            Cue Sheet Box
        </Box>
      </Flex>
    </>
  );
}

