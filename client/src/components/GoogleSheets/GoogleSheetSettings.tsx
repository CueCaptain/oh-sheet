import {ActionIcon, Box, Modal} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {SiGooglesheets} from 'react-icons/si';
import GoogleSheetImportWizard from './GoogleSheetImportWizard';

export default function GoogleSheetSettings() {
  const [opened, {open, close}] = useDisclosure();

  return (
    <Box>
      <Modal
        opened={opened}
        onClose={close}
        title="Google Sheet Import Wizard"
        centered
      >
        <Box w={'100%'} h={'100%'}>
          <GoogleSheetImportWizard onLoadCallback={close} />
        </Box>
      </Modal>
      <ActionIcon size={'lg'} onClick={open}>
        <SiGooglesheets style={{width: '70%', height: '70%'}} />
      </ActionIcon>
    </Box>
  );
}
