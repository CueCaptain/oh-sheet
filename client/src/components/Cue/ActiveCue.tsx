import {Flex} from '@mantine/core';
import {ICue} from 'types';

import stylex from '@stylexjs/stylex';
import moment from 'moment';
import {useServer} from 'contexts/ServerDataContext';
import {useEffect, useState} from 'react';
import {capitalCase} from 'change-case';
import classnames from 'classnames';

const styles = stylex.create({
  card: {
    background: 'rgba(255,255,255,.2)',
    borderRadius: 6,
    width: '100%',
    height: '40vh',
    minHeight: 300,
  },
  dataRows: {
    width: '100%',
    overflowY: 'auto',
  },
  dataRow: {
    padding: '4px 8px',
    borderLeft: '1px solid rgba(255,255,255,.2)',
  },
  dataTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  dataText: {
    fontSize: 18,
    lineHeight: 1.1,
  },
  padding: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    lineHeight: 1.1,
  },
  headingtext: {
    color: 'rgba(255,255,255,.75)',
  },
  description: {
    color: 'rgba(255,255,255,.5)',
    lineHeight: 0.8,
  },
  timetext: {
    fontSize: 16,
    color: 'rgba(255,255,255,.75)',
  },
  timer: {
    fontSize: 52,
    lineHeight: 0.8,
    fontWeight: 'bold',
    color: '#FB773C',
  },
  activeTimer: {
    color: '#EB3678',
  },
  badge: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: '3px 6px',
    borderRadius: 4,
    width: 'max-content',
  },
  subtext: {
    fontSize: 16,
    lineHeight: 0.8,
  },
  gray: {
    color: 'rgba(255, 255, 255, .5)',
    background: 'rgba(226, 226, 182, .1)',
  },
  cream: {
    color: 'rgba(255, 255, 255, .75)',
    background: 'rgba(226, 226, 182, .5)',
  },
  fullWidth: {
    width: '100%',
  },
});

const TIME_PARSE_FORMAT = 'hh:mm:ss A';

export interface Props {
  currentCueNumber: number;
  cue: ICue;
  type: 'active' | 'up_next';
}

export default function ActiveCue({currentCueNumber, cue, type}: Props) {
  const {
    cue: cueIndex,
    description,
    duration,
    item,
    'program section': programSection,
    start,
    end,
    ...data
  } = cue;

  const server = useServer();

  const isActive = currentCueNumber === cueIndex;
  const startTime = moment(start, TIME_PARSE_FORMAT);
  const endTime = moment(end, TIME_PARSE_FORMAT);
  const remainingSeconds = server.data.timerData.currentDuration;

  const [currentTime, setCurrentTime] = useState<number>(remainingSeconds);

  useEffect(() => {
    setCurrentTime(remainingSeconds);
  }, [duration, remainingSeconds]);

  useEffect(() => {
    const timerID = setInterval(() => {
      if (server.data.timerData.timerState === 'play') {
        setCurrentTime(i => i - 1);
      }
    }, 1000);
    return () => {
      clearInterval(timerID);
    };
  }, [duration, remainingSeconds, server.data.timerData.timerState]);

  return (
    <Flex
      direction="row"
      columnGap={8}
      className={classnames(
        stylex(styles.card),
        isActive && 'ring-4 ring-red-500 shadow-lg shadow-red-500',
      )}>
      <Flex
        direction="column"
        rowGap={8}
        className={stylex(styles.fullWidth, styles.padding)}>
        <Flex direction="row" columnGap={8}>
          <div
            className={classnames(
              stylex(styles.badge),
              isActive ? 'bg-red-500 text-black' : 'bg-amber-500 text-black',
            )}>
            {type === 'active' ? 'Active' : 'Up Next'}
          </div>
          <div className={stylex(styles.cream, styles.badge)}>
            {`${duration / 60} min`}
          </div>
          <div
            className={stylex(
              styles.gray,
              styles.badge,
            )}>{`Cue ${cueIndex + 1}`}</div>
          <div className={stylex(styles.gray, styles.badge)}>
            {programSection}
          </div>
        </Flex>
        <div className={stylex(styles.title)}>{item}</div>
        <div className={stylex(styles.description, styles.subtext)}>
          {description}
        </div>
        <div className={stylex(styles.description, styles.headingtext)}>
          Estimated {startTime.format('hh:mm:ss a')} -{' '}
          {endTime.format('hh:mm:ss a')}
        </div>
        <div style={{height: '100%'}} />
        <div className={stylex(styles.timetext)} style={{marginTop: 12}}>
          {`Started ${startTime.format('hh:mm:ss a')}`}
        </div>
        <div
          className={classnames(
            stylex(styles.timer, isActive && styles.activeTimer),
            'text-red-500',
          )}>
          {moment.utc(currentTime * 1000).format('HH:mm:ss')}
        </div>
      </Flex>
      <Flex
        direction="column"
        rowGap={8}
        className={stylex(styles.fullWidth, styles.dataRows)}>
        {Object.entries(data).map(([key, value]) => {
          return (
            <div key={key} className={stylex(styles.dataRow)}>
              <div className={stylex(styles.dataTitle)}>{capitalCase(key)}</div>
              <div className={stylex(styles.dataText)}>{value}</div>
            </div>
          );
        })}
      </Flex>
    </Flex>
  );
}
