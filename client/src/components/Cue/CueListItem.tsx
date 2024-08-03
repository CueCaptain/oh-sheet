import {ICue} from 'types';

import stylex from '@stylexjs/stylex';
import moment from 'moment';
import classNames from 'classnames';

const styles = stylex.create({
  card: {
    width: '100%',
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
    lineHeight: 1,
  },
  padding: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    lineHeight: 1,
  },
  headingtext: {
    color: 'rgba(255,255,255,.75)',
  },
  description: {
    color: 'rgba(255,255,255,.5)',
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
    lineHeight: 1,
  },
  active: {
    color: 'white',
    background: '#EB3678',
  },
  upnext: {
    color: 'white',
    background: '#FB773C',
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
  id?: string;
  isLast?: boolean;
}

export default function CueListItem({
  currentCueNumber,
  cue,
  id,
  isLast = false,
}: Props) {
  const {
    cue: cueIndex,
    description,
    duration,
    item,
    'program section': programSection,
    start,
    end,
  } = cue;

  const isActive = currentCueNumber === cueIndex;
  const isPrev = currentCueNumber - 1 === cueIndex;
  const startTime = moment(start, TIME_PARSE_FORMAT);
  const endTime = moment(end, TIME_PARSE_FORMAT);

  return (
    <div
      className={classNames(
        'w-full grid grid-cols-[500px_1fr] gap-x-4 transition-all border-l-2',
        isActive ? 'border-l-red-500' : 'border-l-transparent',
      )}
      id={id}>
      <div
        className={classNames(
          'transition-all py-4 border-white/15',
          isActive ? 'border-y ml-4 w-[calc(100%-16px)]' : 'ml-0 w-full',
          isPrev || isLast ? 'border-b-0' : 'border-b',
        )}>
        <div className="flex space-x-2 mb-2">
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
        </div>
        <div className={stylex(styles.title)}>{item}</div>
        <div className={stylex(styles.description, styles.headingtext)}>
          Estimated {startTime.format('hh:mm:ss a')} -{' '}
          {endTime.format('hh:mm:ss a')}
        </div>
        <div className={stylex(styles.description, styles.subtext)}>
          {description}
        </div>
      </div>
      <div
        className={classNames(
          'w-full transition-all py-4 border-white/15',
          isPrev || isLast ? 'border-b-0' : 'border-b border-dashed',
        )}>
        TEST
      </div>
    </div>
  );
}
