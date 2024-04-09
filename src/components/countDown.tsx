import { FC, useRef, useEffect, useState, MutableRefObject } from "react";

// SCSS
import "../styles/countDown.scss";

// NPM
import DayJS from 'dayjs'
import DayJSUtc from 'dayjs/plugin/utc'
import DayJSTimezone from 'dayjs/plugin/timezone'

DayJS.extend(DayJSUtc)
DayJS.extend(DayJSTimezone)

// Custom
const eventMessage: string = "It's time of event"; // Message
const endEventDateTime: string = "2030-04-10 15:00:00"; // Date
const eventTimeZone: string = "America/Toronto"; // Time zone

// Types
type DateTimeObject = {
  d: number | null;
  h: number | null;
  m: number | null;
  s: number | null;
};

// Counter
const Counter: FC<{ datetimeObj: DateTimeObject }> = ({ datetimeObj }) => {
  return (
    <div className="container">
      <div>
        <span>{datetimeObj.d}</span>
        <span>Days</span>
      </div>
      <div>
        <span>{datetimeObj.h}</span>
        <span>Hours</span>
      </div>
      <div>
        <span>{datetimeObj.m}</span>
        <span>Min</span>
      </div>
      <div>
        <span>{datetimeObj.s}</span>
        <span>Sec</span>
      </div>
    </div>
  );
};

// Event message
const Message: FC = () => {
  return <p>{eventMessage}</p>;
};

// Countdown component
const Countdown: FC = () => {
  // Constants
  const startDateTime: string = DayJS().format();
  const startTimeZone: string = DayJS.tz.guess();

  // States
  const [startDate, setStartDate] = useState<string>(startDateTime);
  const [timeDiff, setTimeDiff] = useState<{
    d: number | null;
    h: number | null;
    m: number | null;
    s: number | null;
  }>({
    d: null,
    h: null,
    m: null,
    s: null,
  });

  // React hook reference
  const intervalRef: MutableRefObject<NodeJS.Timeout | null> =
    useRef<NodeJS.Timeout | null>(null);

  // Border effects
  useEffect(() => {
    // Decrease counter fnct
    const decreaseDate = () => {
      // Update +1 second and format
      let newStartDate = DayJS(startDate)
        .add(1, "second")
        .format("YYYY-MM-DD HH:mm:ss");

      // Record the new date
      setStartDate(newStartDate);
      // Timezone difference
      let tzStart = DayJS(startDate).tz(startTimeZone);
      let tzEnd = DayJS(endEventDateTime).tz(eventTimeZone);
      let diff = tzEnd.diff(tzStart);

      // Calculations
      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor(diff / (1000 * 60 * 60));
      let mins = Math.floor(diff / (1000 * 60));
      let secs = Math.floor(diff / 1000);
      let d = days;
      let h = hours - days * 24;
      let m = mins - hours * 60;
      let s = secs - mins * 60;

      // Response
      let res = { d: d, h: h, m: m, s: s };

      // Record
      setTimeDiff(res);

      return startDate;
    };

    // Run fnct every seconds
    intervalRef.current = setInterval(decreaseDate, 1000);

    return () => {
      // Check if intervalRef.current exist before clean it
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTimeZone, startDate]);

  return (
    <>
      {DayJS(endEventDateTime).tz(eventTimeZone).diff(DayJS()) >= 0 ? (
        <Counter datetimeObj={timeDiff} />
      ) : (
        <Message />
      )}
    </>
  );
};

export default Countdown;
