import MessageOverlay from 'components/Messages/MessageOverlay';
import Timesheet from 'components/Timesheet/Timesheet';
import TimesheetSettings from 'components/Timesheet/TimesheetSettings';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  root: {
    backgroundColor: '#021526',
    height: '100vh',
    width: '100vw',
    padding: 24,
  },
});

export default function Operator() {
  return (
    <div className={stylex(styles.root)}>
      <Timesheet />
      <TimesheetSettings />
      <MessageOverlay type={'operatorMessage'} />
    </div>
  );
}
