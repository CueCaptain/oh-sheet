import {Flex} from '@mantine/core';
import ActiveCue from 'components/Cue/ActiveCue';
import {useServer} from 'contexts/ServerDataContext';
import {ICue} from 'types';

import stylex from '@stylexjs/stylex';
import {useMemo} from 'react';
import CueListItem from 'components/Cue/CueListItem';

const styles = stylex.create({
  completed: {
    background: '#EB3678',
  },
  cuePreview: {
    borderRadius: 6,
    height: 4,
    background: 'rgba(255,255,255,.2)',
    width: '100%',
  },
  cueStep: {
    flexGrow: 0,
    flexShrink: 0,
  },
});

export interface ICueProps {
  cues: ICue[];
}

export default function Layout({cues}: ICueProps) {
  const server = useServer();
  const currentPtr = server.data.currentPtr;

  const totalDuration = useMemo(() => {
    return cues.reduce((acc, cue) => acc + cue.duration, 0);
  }, [cues]);

  return (
    <Flex
      direction="column"
      rowGap={12}
      style={{height: '100%', padding: 0, margin: 0}}>
      <Flex direction="row" align="center" columnGap={16}>
        <Flex direction="row" align="center" className={stylex(styles.cueStep)}>
          Cue {currentPtr + 1} of {cues.length}
        </Flex>
        <Flex align="center" columnGap={4} style={{flexGrow: 1, flexShrink: 1}}>
          {cues.map((cue, idx) => {
            const duration = cue.duration <= 0 ? 10 : cue.duration;
            return (
              <Flex
                className={stylex(
                  styles.cuePreview,
                  currentPtr >= Number(cue.cue) && styles.completed,
                )}
                key={idx}
                style={{
                  width: `${(duration / totalDuration) * 100}%`,
                }}
              />
            );
          })}
        </Flex>
      </Flex>
      <Flex columnGap={12}>
        <ActiveCue
          cue={cues[currentPtr]}
          currentCueNumber={currentPtr}
          type="active"
        />
        <ActiveCue
          cue={cues[Math.min(currentPtr + 1, cues.length - 1)]}
          currentCueNumber={currentPtr}
          type="up_next"
        />
      </Flex>
      <div className="h-full overflow-y-auto rounded-[6px]">
        {cues.map(cue => {
          return (
            <CueListItem
              key={cue.cue}
              id={'cue-' + cue.cue}
              cue={cue}
              currentCueNumber={currentPtr}
              isLast={cue.cue === cues.length - 1}
            />
          );
        })}
      </div>
    </Flex>
  );
}
