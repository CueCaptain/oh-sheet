import { Button, Title, Loader, Center, Group, Tabs, Flex } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"

import { useServer } from 'contexts/ServerDataContext';

export default function Landing () {
    const navigate = useNavigate ();
    const server = useServer();

    return (<>
        <Flex w={'100vw'} h={'100vh'}>
            <Flex miw={'50%'} maw={'50%'} justify={'flex-end'} align={'center'}>
                <motion.div
                    key="heading"
                    initial={{ opacity: 1, scale: 2, x:"50%", y:"50%"}}
                    animate={{ opacity: 1, scale: 1, x:"0%", y:"0%" }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <Title order={1} size="4rem">
                        oh sheet.
                    </Title>
                </motion.div>
            </Flex>
            <Flex miw={'50%'} maw={'50%'} align={'center'}>
                {server.connected ? 
                    <motion.div
                        key="buttons"                     
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                    >
                        <Tabs orientation="vertical" defaultValue={'timesheets'}>
                            <Tabs.List>
                                <Tabs.Tab value='timesheets'>
                                    Timesheets
                                </Tabs.Tab>
                                <Tabs.Tab value='livestream' disabled={!server.data.streamKey} onClick={() => navigate('/watch')}>
                                    Livestream
                                </Tabs.Tab>
                            </Tabs.List>
                            <Center>
                                <Tabs.Panel value="timesheets">
                                    <Group>
                                        <Button variant='subtle' onClick={() => {navigate('/timesheet/controller')}}> Controller </Button> 
                                        <Button variant='subtle' onClick={() => {navigate('/timesheet/operator')}}> Operator </Button> 
                                        <Button variant='subtle' onClick={() => {navigate('/timesheet/stage_timer')}}> Stage Timer </Button> 
                                    </Group>
                                </Tabs.Panel>
                            </Center>
                        </Tabs>
                    </motion.div >
                    :
                    <Loader/> 
                }
            </Flex>
        </Flex>
    </>);
}
