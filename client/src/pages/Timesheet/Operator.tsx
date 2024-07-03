import { Box, Flex} from '@mantine/core';
import MessageOverlay from 'components/Messages/MessageOverlay';
import OperatorTimer from 'components/Timer/OperatorTimer';
import Timesheet from 'components/Timesheet/Timesheet';
import TimesheetSettings from 'components/Timesheet/TimesheetSettings';


export default function Operator () {
    return (
        <>
            <Flex direction={'column'} h="100vh" w="100vw">
                <Box mx={'xs'} mb={'xs'}>
                    <OperatorTimer/>
                </Box>
                <Box mx='xs' style={{overflow: 'auto', flexGrow: 1}}>
                    <Timesheet/>
                </Box>
            </Flex>
            <Box style={{ position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 10 }}>
                <TimesheetSettings />
            </Box>
            <MessageOverlay type={'operatorMessage'} />
        </>
    );
}
