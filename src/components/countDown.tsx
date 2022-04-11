import { useRef, useEffect, useState } from "react";

// NPM
import moment from "moment";
import "moment-timezone";

// SCSS
import "../styles/countDown.scss";

// Custom
const eventMessage = "It's time of event"; // Message
const eventDate = "2030-04-10 15:00:00"; // Date
const eventTimeZone = "America/Toronto"; // Time zone

// Counter
const Counter = ({ datetimeObj }: any) => {
  return (
    <>
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
    </>
  );
};

// Event message
const Message = () => {
  return (
    <>
      <p>{eventMessage}</p>
    </>
  );
};

// Countdown component
const Countdown = () => {
  // Dates object
  const dateObj = {
    startDateTime: moment().format(),
    startTimeZone: moment.tz.guess(),
    endDateTime: eventDate,
    endTimeZone: eventTimeZone,
  };

  // States
  const [startDate, setStartDate] = useState<string>(dateObj.startDateTime);
  const [timeDiff, setTimeDiff] = useState<any>({
    d: null,
    h: null,
    m: null,
    s: null,
  });

  // Ref
  let intervalRef: any = useRef<HTMLDivElement>(null);

  // Border effects
  useEffect(() => {
    // Decrease counter fnct
    const decreaseDate = () => {
      // Update +1 second and format
      let newStartDate = moment(startDate)
        .add(1, "seconds")
        .format("YYYY-MM-DD HH:mm:ss");

      // Record the new date
      setStartDate(newStartDate);

      // Timezone difference
      var tzStart = moment.tz(startDate, dateObj.startTimeZone);
      var tzEnd = moment.tz(dateObj.endDateTime, dateObj.endTimeZone);
      var diff = tzEnd.diff(tzStart);

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

    return () => clearInterval(intervalRef.current);
  }, [
    dateObj.endDateTime,
    dateObj.endTimeZone,
    dateObj.startTimeZone,
    startDate,
  ]);

  return (
    <>
      {moment.tz(eventDate, eventTimeZone).diff(moment()) >= 0 ? (
        <Counter datetimeObj={timeDiff} />
      ) : (
        <Message />
      )}
    </>
  );
};

export default Countdown;
