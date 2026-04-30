/*
TIMER NEEDED FOR MOST OF THIS STUFF TO WORK!!!
Suggestions:
Make sure to run this code and fix any bugs, because my laptop
is fried and my mac is not set up for programming. I had to make
all of this on onecompiler and it was hell. Very sorry.

Try implementing a study mode and break mode! Part of this was made with that in mind.
Happy coding? Idk
*/

import { useState } from 'react'
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
  const [pomodoroCount, setPomodoroCount] = useState(0)

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  function updateMascot() {
    setCurrentSprite('baseline')
    setDialogue(randomFrom(DIALOGUE.idle))
  }
  
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