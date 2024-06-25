import {Center, Flex} from '@mantine/core';
import StageClock from 'components/Timer/StageClock';
import StageTimer from 'components/Timer/StageTimer';
// import MessageOverlay from 'components/message/MessageOverlay';
import { useEffect, useRef } from 'react';


export default function Stage () {
    const scaleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleResize = () => {
        if(!scaleRef || !scaleRef.current) return;
        const parent = scaleRef.current.parentElement;
        if(!parent) return;
        const parentHeight = parent.clientHeight;
        const childHeight = scaleRef.current.clientHeight;
    
        const scaleHeight = parentHeight / childHeight;
        const scale = scaleHeight;
    
        scaleRef.current.style.transform = `scale(${scale * 0.95})`;
        scaleRef.current.style.transformOrigin = 'center';
      };
  
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [scaleRef]);
    
    return (
        <>
            <Center h={'100vh'} w={'100vw'}>
                <Flex 
                    id='scaledFlex' 
                    align={'center'}
                    justify={'center'}
                    direction={'column'}
                    ref={scaleRef}
                >
                    <StageTimer size={'1rem'}/>
                    <Flex justify={'end'}>
                        <StageClock size={'0.5rem'} />
                    </Flex>
                </Flex>
            </Center>
            {/* <MessageOverlay type={'stageTimerMessage'} /> */}
        </>
    );
}
