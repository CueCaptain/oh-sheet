import {Text, TextProps} from '@mantine/core';
import {useState, useEffect} from 'react';

export default function StageClock(props: TextProps) {
  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  return (
    <Text {...props}>
      {date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
    </Text>
  );
}
