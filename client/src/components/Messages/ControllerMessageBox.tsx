import {useState} from 'react';
import {Flex, Input, ActionIcon} from '@mantine/core';
import {IoArrowForward, IoCloseOutline} from 'react-icons/io5';
import {useServer} from 'contexts/ServerDataContext';

export default function ControllerMessageBox() {
  const server = useServer();
  const messageData = server.data.messageData;
  const [stageTimerMessage, setStageTimerMessage] = useState('');
  const [operatorMessage, setOperatorMessage] = useState('');
  const resetMessage = (key: 'stageTimerMessage' | 'operatorMessage') => () => {
    if (key === 'stageTimerMessage') {
      setStageTimerMessage('');
      server.setMessageData('stageTimerMessage', '');
    } else if (key === 'operatorMessage') {
      setOperatorMessage('');
      server.setMessageData('operatorMessage', '');
    }
  };

  return (
    <>
      <Flex direction={'column'}>
        <div>stage timer:</div>
        <Flex align={'center'} mb={'sm'}>
          <Input
            id="StageTimerInput-no-key-down"
            placeholder="Type Stage Timer message here..."
            value={stageTimerMessage}
            disabled={messageData.stageTimerMessage !== ''}
            onChange={(e: any) => {
              setStageTimerMessage(e.target.value);
            }}
            mr={'lg'}
          />
          {messageData.stageTimerMessage !== '' ? (
            <ActionIcon size={'lg'} onClick={resetMessage('stageTimerMessage')}>
              <IoCloseOutline />
            </ActionIcon>
          ) : (
            <ActionIcon
              size={'lg'}
              onClick={() =>
                server.setMessageData('stageTimerMessage', stageTimerMessage)
              }
            >
              <IoArrowForward />
            </ActionIcon>
          )}
        </Flex>
        <div>operators:</div>
        <Flex align={'center'}>
          <Input
            id="OperatorInput-no-key-down"
            placeholder="Type Operator message here..."
            value={operatorMessage}
            disabled={messageData.operatorMessage !== ''}
            onChange={e => {
              setOperatorMessage(e.target.value);
            }}
            mr={'lg'}
          />
          {messageData.operatorMessage !== '' ? (
            <ActionIcon size={'lg'} onClick={resetMessage('operatorMessage')}>
              <IoCloseOutline />
            </ActionIcon>
          ) : (
            <ActionIcon
              size={'lg'}
              onClick={() =>
                server.setMessageData('operatorMessage', operatorMessage)
              }
            >
              <IoArrowForward />
            </ActionIcon>
          )}
        </Flex>
      </Flex>
    </>
  );
}
