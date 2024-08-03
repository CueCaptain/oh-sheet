import {Modal, Text} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useServer} from 'contexts/ServerDataContext';
import {useEffect} from 'react';

export interface IMessageOverlayProps {
  type: 'operatorMessage' | 'stageTimerMessage';
}

export default function MessageOverlay(props: IMessageOverlayProps) {
  const server = useServer();
  const message = server.data.messageData[props.type];
  const [opened, {open, close}] = useDisclosure();

  useEffect(() => {
    if (message === '') {
      close();
    } else {
      open();
    }
  }, [message, close, open]);

  return (
    <Modal opened={opened} onClose={close} title="Attention" centered>
      <Text>{message}</Text>
    </Modal>
  );
}
