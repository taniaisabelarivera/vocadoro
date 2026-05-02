import { useState, useEffect } from 'react'
import Mascot from './components/Mascot'
import TodoList from './components/TodoList'
import Notepad from './components/Notepad'
import MusicPlayer from './components/MusicPlayer'
import bedroomBg from './assets/backgrounds/bedroom.jpg'
import cafeBg from './assets/backgrounds/cafe.jpg'
import libraryBg from './assets/backgrounds/library.jpg'
import iaSprite from './assets/ia.png'
import lenSprite from './assets/len.png'
import mikuSprite from './assets/miku.png'
import oneSprite from './assets/one.png'
import tetoSprite from './assets/teto.png'

const CHARACTERS = {
  miku: {
    sprite: mikuSprite,
    dialogue: {
      idle:      "Here to study?",
      working:   "You're doing great, keep it up!",
      paused:    "Don't give up now!",
      breakTime: "Break time! You earned it!",
      taskDone:  "Task complete! You're amazing!",
    }
  },
  ia: {
    sprite: iaSprite,
    dialogue: {
      idle:      "Ready when you are.",
      working:   "Stay focused, I believe in you!",
      paused:    "Take your time, I'll be here.",
      breakTime: "Nice work, take a breather!",
      taskDone:  "Another one down!",
    }
  },
  len: {
    sprite: lenSprite,
    dialogue: {
      idle:      "Let's get to work!",
      working:   "Keep going, you've got this!",
      paused:    "Hurry back, we're not done yet!",
      breakTime: "Rest up, you've earned it!",
      taskDone:  "Yes! Nailed it!",
    }
  },
  one: {
    sprite: oneSprite,
    dialogue: {
      idle:      "Whenever you're ready...",
      working:   "One step at a time!",
      paused:    "Come back when you're ready.",
      breakTime: "Good work, enjoy the break!",
      taskDone:  "Look at you go!",
    }
  },
  teto: {
    sprite: tetoSprite,
    dialogue: {
      idle:      "Heheh, let's do this!",
      working:   "No slacking, keep it up!",
      paused:    "Oi, get back to work soon!",
      breakTime: "Woohoo, break time!!",
      taskDone:  "Crushed it! I knew you could!",
    }
  },
}

const BACKGROUNDS = {
  bedroom: bedroomBg,
  cafe:    cafeBg,
  library: libraryBg,
}

export default function App() {
  const [background, setBackground]           = useState('library')
  const [nextBackground, setNextBackground]   = useState(null)
  const [currentCharacter, setCurrentCharacter] = useState('miku')
  const [dialogue, setDialogue]               = useState(CHARACTERS.miku.dialogue.idle)
  const [mode, setMode]                       = useState('study')
  const [studyDuration, setStudyDuration]     = useState(25)
  const [breakDuration, setBreakDuration]     = useState(5)
  const [timeLeft, setTimeLeft]               = useState(25 * 60)
  const [timerActive, setTimerActive]         = useState(false)
  const [pomodoroCount, setPomodoroCount]     = useState(0)

  // When the character changes, update dialogue to match current timer state
  useEffect(() => {
    const char = CHARACTERS[currentCharacter].dialogue
    if (timerActive && mode === 'study')  setDialogue(char.working)
    else if (timerActive && mode === 'break') setDialogue(char.breakTime)
    else if (!timerActive && mode === 'study') setDialogue(char.idle)
    else setDialogue(char.breakTime)
  }, [currentCharacter])

  function fadeToBackground(newBg) {
    setNextBackground(newBg)
    setTimeout(() => {
      setBackground(newBg)
      setNextBackground(null)
    }, 500)
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const secondsLeft = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setTimeLeft((nextMode === 'study' ? studyDuration : breakDuration) * 60)
    setDialogue(nextMode === 'study'
      ? CHARACTERS[currentCharacter].dialogue.working
      : CHARACTERS[currentCharacter].dialogue.breakTime
    )
    setTimerActive(false)
  }

  useEffect(() => {
    if (!timerActive) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (mode === 'study') handleSessionEnd()
          const nextMode = mode === 'study' ? 'break' : 'study'
          setMode(nextMode)
          setDialogue(nextMode === 'study'
            ? CHARACTERS[currentCharacter].dialogue.working
            : CHARACTERS[currentCharacter].dialogue.breakTime
          )
          return (nextMode === 'study' ? studyDuration : breakDuration) * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, mode, studyDuration, breakDuration, currentCharacter])

  useEffect(() => {
    if (!timerActive) {
      setTimeLeft((mode === 'study' ? studyDuration : breakDuration) * 60)
    }
  }, [mode, studyDuration, breakDuration])

  function handleSessionEnd() {
    setPomodoroCount(prev => prev + 1)
    setDialogue(CHARACTERS[currentCharacter].dialogue.breakTime)
  }

  function handleTaskComplete() {
    setDialogue(CHARACTERS[currentCharacter].dialogue.taskDone)
    setTimeout(() => {
      setDialogue(CHARACTERS[currentCharacter].dialogue.idle)
    }, 3000)
  }

  function handleStart() {
    setTimerActive(true)
    setDialogue(CHARACTERS[currentCharacter].dialogue.working)
  }

  function handlePause() {
    setTimerActive(false)
    setDialogue(CHARACTERS[currentCharacter].dialogue.paused)
  }

  function handleReset() {
    setTimerActive(false)
    setTimeLeft((mode === 'study' ? studyDuration : breakDuration) * 60)
    setDialogue(CHARACTERS[currentCharacter].dialogue.idle)
  }

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${BACKGROUNDS[background]})` }}
    >
      <div className="overlay" />
      {nextBackground && (
        <div
          className="background-fade"
          style={{ backgroundImage: `url(${BACKGROUNDS[nextBackground]})` }}
        />
      )}

      <div className="bg-selector">
        {Object.keys(BACKGROUNDS).map(name => (
          <button
            key={name}
            className={background === name ? 'active' : ''}
            onClick={() => fadeToBackground(name)}
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
              <button className="control-btn start" onClick={handleStart}>Start</button>
              <button className="control-btn pause" onClick={handlePause}>Pause</button>
              <button className="control-btn reset" onClick={handleReset}>Reset</button>
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

          <div className="character-selector">
            {Object.keys(CHARACTERS).map(name => (
              <button
                key={name}
                className={currentCharacter === name ? 'active' : ''}
                onClick={() => setCurrentCharacter(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <Mascot
            sprite={CHARACTERS[currentCharacter].sprite}
            dialogue={dialogue}
          />
          <p className="pomodoro-count">Pomodoros completed: {pomodoroCount}</p>
        </div>

        <div className="right-col">
          <Notepad />
          <MusicPlayer />
        </div>
      </div>
    </div>
  )
}