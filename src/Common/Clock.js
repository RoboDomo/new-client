import React from "react";

const format = (d, military, seconds, ampm) => {
  let hrs = d.getHours(),
    mins = d.getMinutes(),
    secs = d.getSeconds();

  if (mins < 10) {
    mins = "0" + mins;
  }

  if (secs < 10) {
    secs = "0" + secs;
  }

  if (!military) {
    if (ampm) {
      if (hrs > 12) {
        hrs -= 12;
        ampm = " PM";
      } else if (hrs === 0) {
        hrs = 12;
        ampm = " AM";
      } else {
        ampm = " AM";
      }
    } else {
      if (hrs > 12) {
        hrs -= 12;
      } else if (hrs === 0) {
        hrs = 12;
      }
      ampm = false;
    }
  }

  if (seconds) {
    if (seconds === "small") {
      return (
        <>
          {hrs}:{mins}
          <small>{secs}</small>
        </>
      );
    } else {
      if (ampm) {
        return (
          <>
            {hrs}:{mins}:{secs} {ampm}
          </>
        );
      } else {
        return (
          <>
            {hrs}:{mins}:{secs}
          </>
        );
      }
    }
  } else {
    if (ampm) {
      return (
        <>
          {hrs}:{mins}:{secs} {ampm}
        </>
      );
    } else {
      return (
        <>
          {hrs}:{mins}:{secs}
        </>
      );
    }
  }
};

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.timer = null;
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const newState = Object.apply({}, this.state);
      newState.time = new Date();
      if (this.props.cb) {
        this.props.cb(newState.time);
      }
      this.setState(newState);
    }, 1000);
    return () => {};
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <>
        {format(
          this.state.time,
          this.props.military,
          this.props.seconds,
          this.props.ampm
        )}
      </>
    );
  }
}

/*
const Clock = ({ cb, military, seconds, ampm }) => {
  const [time, setTime] = useState(new Date());
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(new Date());
      if (cb) {
        cb(time);
      }
    }, 1000);
    return () => {
      clearInterval(timer.current);
    };
  });

  return <>{format(time, military, seconds, ampm)}</>;
};
*/


//
export default Clock;
