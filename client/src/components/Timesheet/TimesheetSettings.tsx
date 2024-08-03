import {ActionIcon, Box, Modal} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {CueListSortWizard} from 'components/Cue/CueListSortWizard';
import {useServer} from 'contexts/ServerDataContext';
import {IoSettingsOutline} from 'react-icons/io5';

export default function TimesheetSettings() {
  const [opened, {open, close}] = useDisclosure();
  const server = useServer();

  return (
    <Box bottom={12} right={12} pos="absolute">
      <Modal
        id="idk"
        opened={opened}
        onClose={close}
        title="Timesheet Settings"
        centered>
        <Box w={'100%'} h={'100%'}>
          {server.data.cues.length > 0 ? (
            <CueListSortWizard />
          ) : (
            'A timesheet must be loaded before continuing with settings'
          )}
        </Box>
      </Modal>
      <ActionIcon size={'lg'} onClick={open}>
        <IoSettingsOutline style={{width: '70%', height: '70%'}} />
      </ActionIcon>
    </Box>
  );
}
