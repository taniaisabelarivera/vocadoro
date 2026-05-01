//I think the pomodoro completed thing only works when the timer 
// finishes and not when its checked off? 

import { useState, useEffect } from 'react'
import Mascot from './components/Mascot'
import TodoList from './components/TodoList'
import Notepad from './components/Notepad'
import bedroomBg from './assets/backgrounds/bedroom.jpg'
import cafeBg from './assets/backgrounds/cafe.jpg'
import libraryBg from './assets/backgrounds/library.jpg'
import mikuBaseline from './assets/miku/miku_baseline.png'
import mikuConcerned from './assets/miku/miku_concerned.png'
import mikuExcited from './assets/miku/miku_excited.png'
import mikuMad from './assets/miku/miku_mad.png'
import mikuMotivated from './assets/miku/miku_motivated.png'
import mikuSleep from './assets/miku/miku_sleep.png'
import mikuSurprised from './assets/miku/miku_surprised.png'
import mikuTeasing from './assets/miku/miku_teasing.png'

const SPRITES = {
  baseline: mikuBaseline,
  concerned: mikuConcerned,
  excited: mikuExcited,
  mad: mikuMad,
  motivated: mikuMotivated,
  sleep: mikuSleep,
  surprised: mikuSurprised,
  teasing: mikuTeasing,
}

const BACKGROUNDS = {
  bedroom: bedroomBg,
  cafe: cafeBg,
  library: libraryBg,
}

const DIALOGUE = {
  idle:      ["Here to study?", "Pick a timer and let's go!", "Time is money. Time is study. Study, money."],
  working:   ["You're doing great, keep it up!", "Stay focused!", "One step at a time!"],
  paused:    ["Taking a little break? That's okay.", "Don't give up now!", "Come back when you're ready~"],
  breakTime: ["Break time! You earned it!", "Rest up, you worked hard!", "Nice job finishing that session!"],
  taskDone:  ["Task complete! You're amazing!", "One down, crushing it!", "Look at you go!!"],
}

export default function App() {
  const [background, setBackground] = useState('library')
  const [currentSprite, setCurrentSprite] = useState('baseline')
  const [dialogue, setDialogue] = useState(DIALOGUE.idle[0])
  const [mode, setMode] = useState('study')
  const [studyDuration, setStudyDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [timeLeft, setTimeLeft] = useState(studyDuration * 60)
  const [timerActive, setTimerActive] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  function updateMascot() {
    setCurrentSprite('baseline')
    setDialogue(randomFrom(DIALOGUE.idle))
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const secondsLeft = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setTimeLeft((nextMode === 'study' ? studyDuration : breakDuration) * 60)
    setDialogue(nextMode === 'study' ? randomFrom(DIALOGUE.working) : randomFrom(DIALOGUE.breakTime))
    setCurrentSprite(nextMode === 'study' ? 'motivated' : 'baseline')
    setTimerActive(false)
  }

  useEffect(() => {
    if (!timerActive) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (mode === 'study') {
            handleSessionEnd()
          }

          const nextMode = mode === 'study' ? 'break' : 'study'
          setMode(nextMode)
          setDialogue(nextMode === 'study' ? randomFrom(DIALOGUE.working) : randomFrom(DIALOGUE.breakTime))
          setCurrentSprite(nextMode === 'study' ? 'motivated' : 'baseline')
          return (nextMode === 'study' ? studyDuration : breakDuration) * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, mode, studyDuration, breakDuration])

  useEffect(() => {
    if (!timerActive) {
      setTimeLeft((mode === 'study' ? studyDuration : breakDuration) * 60)
    }
  }, [mode, studyDuration, breakDuration, timerActive])

  function handleSessionEnd() {
    const newCount = pomodoroCount + 1
    setPomodoroCount(newCount)
    setCurrentSprite('excited')
    setDialogue(randomFrom(DIALOGUE.breakTime))
  }

  function handleTaskComplete() {
    setCurrentSprite('surprised')
    setDialogue(randomFrom(DIALOGUE.taskDone))
    setTimeout(() => updateMascot(), 3000)
  }

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${BACKGROUNDS[background]})` }}
    >
      <div className="overlay" />

      <div className="bg-selector">
        {Object.keys(BACKGROUNDS).map(name => (
          <button
            key={name}
            className={background === name ? 'active' : ''}
            onClick={() => setBackground(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="main-layout">
        <div className="left-col">
          <TodoList onTaskComplete={handleTaskComplete} pomodoroCount={pomodoroCount} />
        </div>

        <div className="center-col">
          <div className={`timer-card ${mode === 'break' ? 'break-mode' : ''}`}>
            <div className="mode-label">{mode === 'study' ? 'Study Mode' : 'Break Mode'}</div>
            <div className="preset-row">
              <button
                className={mode === 'study' ? 'preset-btn active' : 'preset-btn'}
                onClick={() => switchMode('study')}
              >
                Study
              </button>
              <button
                className={mode === 'break' ? 'preset-btn active' : 'preset-btn'}
                onClick={() => switchMode('break')}
              >
                Break
              </button>
            </div>
            <div className="time-display">{formatTime(timeLeft)}</div>
            <div className="control-row">
              <button className="control-btn start" onClick={() => setTimerActive(true)}>Start</button>
              <button className="control-btn pause" onClick={() => setTimerActive(false)}>Pause</button>
              <button
                className="control-btn reset"
                onClick={() => {
                  setTimerActive(false)
                  setTimeLeft((mode === 'study' ? studyDuration : breakDuration) * 60)
                }}
              >
                Reset
              </button>
            </div>
            <div className="custom-row">
              <input
                type="number"
                min="1"
                value={studyDuration}
                onChange={e => setStudyDuration(Number(e.target.value) || 1)}
                title="Study length in minutes"
              />
              <input
                type="number"
                min="1"
                value={breakDuration}
                onChange={e => setBreakDuration(Number(e.target.value) || 1)}
                title="Break length in minutes"
              />
            </div>
          </div>
          <Mascot
            sprites={SPRITES}
            currentSprite={currentSprite}
            dialogue={dialogue}
          />
          <p className="pomodoro-count">Pomodoros completed: {pomodoroCount}</p>
        </div>

        <div className="right-col">
          <Notepad />
        </div>
      </div>
    </div>
  )
}