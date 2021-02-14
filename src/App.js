import logo from './logo.svg';
import './App.css';
import React from 'react';


function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(new Audio("./src/c-beat.mp3"));

  function playBreakSound() {
    breakAudio.currentTime = 0;
    breakAudio.play();
    console.log("audio played");
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    return (
      (minutes < 10 ? "0" + minutes : minutes) + 
      ":" + 
      (seconds < 10 ? "0" + seconds : seconds)
    )
  }

  const changeTime = (amount, type) => {
    if (type == "break") {
      if(breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount)
    } else {
      if(sessionTime <= 60 && amount < 0) {
        return;
      }
      if (!timerOn) {
        setDisplayTime(sessionTime + amount)
      }
      setSessionTime((prev) => prev + amount)
    }
  }

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if(!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime(prev => {
            if(prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable=true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable=false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1
          })
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if(timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  }
  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  }

  return (
    <div className="center-align">
    <h1>25 + 5 Clock</h1>
    <div className="dual-container">
      <Length 
      
      title={"break length"} 
      changeTime={changeTime} 
      type={"break"} 
      time={breakTime} 
      formatTime={formatTime} 

      />

<Length 
      title={"session length"} 
      changeTime={changeTime} 
      type={"session"} 
      time={sessionTime} 
      formatTime={formatTime} 

      />
      </div>
      <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
      <h1 id="time-left">{formatTime(displayTime)}</h1>
      <button className="btn-large deep-purple lighten-2" onClick={controlTime}>
        {timerOn ? (
          <i 
          id={timerOn ? "start_stop" : "start_stop"}
          className="material-icons">pause_circle_filled</i>
        ) : (
          <i 
          id={!timerOn ? "start_stop" : "start-stop"}
          className="material-icons">play_circle_filled</i>
        )
        }
      </button>
      <button className="btn-large deep-purple lighten-2" onClick={resetTime}>
        <i className="material-icons" id="reset">autorenew</i>
      </button>

      
    </div>
  )
}

function Length({title, changeTime, type, time, formatTime}) {
  return (
    <div>
      <h3
      id={title == "break length" ? "break-label" : "session-label"}
      >{title}</h3>
      <div className="time-sets">
        <button className="btn-small deep-purple lighten-2"
        onClick={() => changeTime(-60, type)}
        
        >
          <i 
         id={title == "break length" ? "break-decrement" : "session-decrement"}
          className="material-icons">arrow_downward</i>
        </button>
        <h3
        id={title == "break length" ? "break-length" : "session-length"}
        >{formatTime(time)}</h3>
        <button className="btn-small deep-purple lighten-2"
        onClick={() => changeTime(+60, type)}
        >
          <i 
          id={title == "break length" ? "break-increment" : "session-increment"}
          className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  )
}

export default App;
