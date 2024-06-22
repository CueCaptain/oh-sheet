import { ActionIcon, Box, Center, Flex, Group } from "@mantine/core";
import GoogleSheetSettings from "components/GoogleSheets/GoogleSheetSettings";
import MediaServerInfo from "components/Livestream/MediaServerInfo";
import ControllerMessageBox from "components/Messages/ControllerMessageBox";
import ControllerTimer from "components/Timer/ControllerTimer";
import TimesheetSettings from "components/Timesheet/TimesheetSettings";
import { BiTimer } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";


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
                            <Group>
                                <TimesheetSettings />
                                <GoogleSheetSettings />
                                <ActionIcon size={'lg'} onClick={() => window.open('/timesheet/stage_timer' , '_blank')}>
                                    <BiTimer style={{ width: '70%', height: '70%' }} />
                                </ActionIcon>
                                <ActionIcon size={'lg'} onClick={() => window.open('/timesheet/operator' , '_blank')}>
                                    <FaUsers style={{ width: '70%', height: '70%' }} />
                                </ActionIcon>
                            </Group>
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

