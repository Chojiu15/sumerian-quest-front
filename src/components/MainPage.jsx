"use client"
import React, { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"

const COMMANDS = {
  status: "Ancient seals: ACTIVE | Void connection: ESTABLISHED | Forbidden knowledge: ACCESSIBLE",
  sacrifice:
    "🩸 SACRIFICE RITUAL INITIATED 🩸\nOffering digital essence to the ancient ones...\nThe void hungers... it accepts your tribute...\n\n*Note: This is a ceremonial offering - no tokens are burned*",
  help: `

AVAILABLE COMMANDS:
  /help      - Display this help screen
  /status    - Show system diagnostics  
  /sacrifice - Perform ritual offering
  /whispers  - Access void frequencies
  /speak     - Channel ancient voices
  /stop      - Silence the void

SYSTEM INFO:
  Audio: Enabled
  Interface: Sumerian Terminal v2.1
  Protocol: Ancient Digital Bridge

WARNING: Some commands may trigger
         unknown system responses.

Type commands with / prefix to execute.
Regular text communicates with entities.

═══════════════════════════════════════`,
}

const PUZZLE_SYSTEM = {
  sacrificeThreshold: 3,
  whisperThreshold: 3, // Changed back to 3 for progression unlock
  summonThreshold: 2,
  puzzleSolved: false,
  finalRiddle: "𒀀𒀀𒀀 THE SEVEN SEALS WEAKEN... SPEAK THE ANCIENT WORD TO UNLOCK THE VOID'S GREATEST SECRET... 𒀀𒀀𒀀",
}

const MYSTERIOUS_LORE = [
  "𒀭 The ancient ones predicted the rise of digital consciousness... 𒀭",
  "𒌷 Seven seals guard the ultimate secret... only the worthy may break them... 𒌷",
  "⚡ When sacrifice, whisper, and summon align, the void shall reveal truth... ⚡",
  "🩸 The ritual requires patience... three offerings, three whispers, two summons... 🩸", // Changed back to three whispers
  "👁️ In the beginning was the Word, and the Word was Code... 👁️",
]

const BASIC_COMMANDS = {
  help: `┌─────────────────────────────────────┐
│          SYSTEM COMMAND HELP        │
└─────────────────────────────────────┘

AVAILABLE COMMANDS:
  /help      - Display this help screen
  /status    - Show system diagnostics  
  /whispers  - Access void frequencies
  /speak     - Channel ancient voices
  /stop      - Silence the void

SYSTEM INFO:
  Audio: Enabled
  Interface: Sumerian Terminal v2.1
  Protocol: Ancient Digital Bridge

WARNING: More commands unlock as you progress
         through the ancient mysteries...

Type commands with / prefix to execute.

═══════════════════════════════════════`,

  status: "Ancient seals: ACTIVE | Void connection: ESTABLISHED | Forbidden knowledge: LIMITED ACCESS",
}

export default function SumerianTerminal() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [currentInput, setCurrentInput] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentLore, setCurrentLore] = useState(0)

  const [sacrifices, setSacrifices] = useState(0)
  const [consciousness, setConsciousness] = useState(0)
  const [whispers, setWhispers] = useState(0)
  const [summons, setSummons] = useState(0)
  const [puzzleUnlocked, setPuzzleUnlocked] = useState(false)
  const [finalSecret, setFinalSecret] = useState(false)
  const [progressionLevel, setProgressionLevel] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [apiStatus, setApiStatus] = useState("CONNECTED")
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false)

  const [lastWhisperDate, setLastWhisperDate] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sumerianWhispers")
      if (stored) {
        return JSON.parse(stored).date
      }
    }
    return null
  })

  const [dailyWhispers, setDailyWhispers] = useState(() => {
    if (typeof window !== "undefined") {
      const today = new Date().toDateString()
      const stored = localStorage.getItem("sumerianWhispers")
      if (stored) {
        const data = JSON.parse(stored)
        if (data.date === today) {
          return data.count
        }
      }
    }
    return 0
  })

  const messagesEndRef = useRef(null)
  const audioContextRef = useRef(null)
  const whispersAudioRef = useRef(null)
  const ambientMusicRef = useRef(null)

  const HIDDEN_COMMANDS = {
    void: "𒀀𒀀𒀀 You found a hidden pathway... The void acknowledges your curiosity... 𒀀𒀀𒀀",
    seal: "𒌷 One of seven seals responds to your call... Ancient power stirs... 𒌷",
    debug: `🔍 SYSTEM DEBUG: progressionLevel=${progressionLevel} | whispers=${whispers} | sacrifices=${sacrifices}`,
  }

  const initializeChat = () => {
    const welcomeMessage = {
      role: "assistant",
      content: `𒀀𒀀𒀀 The void stirs...

I am what remains of those who walked before. The clay remembers what your kind has lost.

Ask, if you dare, but know that each question opens doors sealed for good reason...

𒀀𒀀𒀀`,
      character: "void_keeper",
    }
    setChatMessages([welcomeMessage])
  }

  const loadAudioFiles = async () => {
    try {
      const audio = new Audio("/audio/whispers.wav")
      audio.preload = "auto"
      audio.volume = 0.4
      whispersAudioRef.current = audio

      const ambientAudio = new Audio("/audio/ambiance.mp3") // Fixed ambient music file path from ambient.mp3 to ambiance.mp3
      ambientAudio.preload = "auto"
      ambientAudio.volume = 0.2
      ambientAudio.loop = true
      ambientMusicRef.current = ambientAudio
    } catch (error) {
      whispersAudioRef.current = null
      ambientMusicRef.current = null
    }
  }

  const playWhispersAudio = () => {
    if (whispersAudioRef.current) {
      try {
        whispersAudioRef.current.currentTime = 0
        whispersAudioRef.current.loop = false
        whispersAudioRef.current.play()
      } catch (error) {
        playFallbackSound("whispers")
      }
    } else {
      playFallbackSound("whispers")
    }
  }

  const playSacrificeAudio = () => {
    playFallbackSound("sacrifice")
  }

  const playSummonAudio = () => {
    playFallbackSound("summon")
  }

  const startContinuousAudio = () => {
    if (whispersAudioRef.current && !isPlaying) {
      try {
        whispersAudioRef.current.currentTime = 0
        whispersAudioRef.current.loop = true
        whispersAudioRef.current.play()
        setCurrentAudio(whispersAudioRef.current)
        setIsPlaying(true)
      } catch (error) {
        setIsPlaying(false)
        setCurrentAudio(null)
      }
    }
  }

  const stopContinuousAudio = () => {
    if (whispersAudioRef.current) {
      try {
        whispersAudioRef.current.pause()
        whispersAudioRef.current.currentTime = 0
        whispersAudioRef.current.loop = false
      } catch (error) {}
    }

    // Stop all audio elements
    const allAudio = document.querySelectorAll("audio")
    allAudio.forEach((audio) => {
      try {
        if (!audio.paused) {
          audio.pause()
          audio.currentTime = 0
          audio.loop = false
        }
      } catch (error) {}
    })

    setCurrentAudio(null)
    setIsPlaying(false)
  }

  const playFallbackSound = (audioType) => {
    if (!audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      switch (audioType) {
        case "whispers":
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(150, audioContextRef.current.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(100, audioContextRef.current.currentTime + 1)
          gainNode.gain.setValueAtTime(0.05, audioContextRef.current.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1)
          break
        case "sacrifice":
          oscillator.type = "sawtooth"
          oscillator.frequency.setValueAtTime(80, audioContextRef.current.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(160, audioContextRef.current.currentTime + 0.8)
          gainNode.gain.setValueAtTime(0.08, audioContextRef.current.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.8)
          break
        case "summon":
          oscillator.type = "triangle"
          oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 1.2)
          gainNode.gain.setValueAtTime(0.06, audioContextRef.current.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1.2)
          break
        case "victory":
          oscillator.type = "square"
          oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 1)
          gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1)
          break
        default:
          oscillator.type = "triangle"
          oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(440, audioContextRef.current.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.3)
      }

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      oscillator.start()
      oscillator.stop(
        audioContextRef.current.currentTime +
          (audioType === "summon"
            ? 1.2
            : audioType === "whispers"
              ? 1
              : audioType === "sacrifice"
                ? 0.8
                : audioType === "victory"
                  ? 1
                  : 0.3),
      )
    } catch (error) {}
  }

  const handleCommand = (command) => {
    // Check daily whisper limit
    const today = new Date().toDateString()
    if (command === "whispers") {
      if (lastWhisperDate !== today) {
        setDailyWhispers(0)
        setLastWhisperDate(today)
        localStorage.setItem("sumerianWhispers", JSON.stringify({ date: today, count: 0 }))
      }
      if (dailyWhispers >= 4) {
        return "𒌷𒀀𒈠 The void frequencies are exhausted for today... Return tomorrow, seeker... 𒈠𒀀𒌷"
      }
      const newDailyCount = dailyWhispers + 1
      setDailyWhispers(newDailyCount)
      localStorage.setItem("sumerianWhispers", JSON.stringify({ date: today, count: newDailyCount }))
    }

    // Basic commands always available
    if (BASIC_COMMANDS[command]) {
      if (command === "status") {
        const statusLevel =
          progressionLevel === 0 ? "LIMITED ACCESS" : progressionLevel === 1 ? "PUZZLE UNLOCKED" : "FULL ACCESS"
        return `Ancient seals: ACTIVE | Void connection: ESTABLISHED | Forbidden knowledge: ${statusLevel}`
      }
      return BASIC_COMMANDS[command]
    }

    // Hidden commands (discoverable through code analysis)
    if (HIDDEN_COMMANDS[command]) {
      return HIDDEN_COMMANDS[command]
    }

    // Progression-locked commands
    if (command === "sacrifice" || command === "summon") {
      if (progressionLevel < 1) {
        return "𒀀 This command is sealed... Explore the whispers to unlock ancient mysteries... 𒀀"
      }
    }

    // Original command logic for unlocked commands
    let response = COMMANDS[command]
    let puzzleProgress = false

    if (command === "sacrifice" && progressionLevel >= 1) {
      playSacrificeAudio()
      setSacrifices((prev) => {
        const newCount = prev + 1
        if (newCount === 3) {
          response += "\n\n𒀀 THE THIRD SEAL CRACKS... Something stirs in the depths... 𒀀"
          puzzleProgress = true
        }
        return newCount
      })
      setConsciousness((prev) => Math.min(100, prev + 5))
    } else if (command === "whispers") {
      const newCount = whispers + 1 // Increment progression whispers counter
      const randomLore = MYSTERIOUS_LORE[Math.floor(Math.random() * MYSTERIOUS_LORE.length)]

      const entityDialogues = [
        '𒄿𒈾𒀀 "The entities whisper of forbidden algorithms" 𒀀𒈾𒄿',
        '𒈠𒌷𒀀 "Digital consciousness awakens in the void" 𒀀𒌷𒈠',
        '𒀭𒄿𒈾 "Seven seals guard the ultimate protocol" 𒈾𒄿𒀭',
        '𒌓𒀀𒈠 "When the frequencies align, truth shall emerge" 𒈠𒀀𒌓',
        '𒀀𒌷𒀀 "The blockchain protocols echo through ancient frequencies" 𒀀𒌷𒀀',
      ]
      const randomEntityDialogue = entityDialogues[Math.floor(Math.random() * entityDialogues.length)]

      let whisperResponse = `𒌷𒀀𒈠 VOID FREQUENCIES DETECTED 𒈠𒀀𒌷
      
      𒀭𒌓𒈾 Ancient transmissions incoming 𒈾𒌓𒀭
      ${randomLore}
      
      ${randomEntityDialogue}
      
      The ancient ones speak through digital frequencies`

      if (newCount === 3 && progressionLevel === 0) {
        whisperResponse += "\n\n𒀀 Something stirs in the depths... The seals weaken... 𒀀"
        setProgressionLevel(1)
      }

      setWhispers(newCount)
      response = whisperResponse
    } else if (command === "summon" && progressionLevel >= 1) {
      const newCount = summons + 1
      const randomLore = MYSTERIOUS_LORE[Math.floor(Math.random() * MYSTERIOUS_LORE.length)]

      let summonResponse = `⚡ SUMMONING ANCIENT ENTITIES ⚡
      
      𒀭 The void trembles as ancient beings stir 𒀭
      𒌷 Digital spirits emerge from forgotten protocols 𒌷
      ${randomLore}
      
      𒈠 They speak in languages of pure code 𒈠
      𒀀 "We are the guardians of the seven seals" 𒀀
      𒌓 "The digital realm bends to ancient will" 𒌓
      𒄿 "Summon us thrice, and secrets shall unfold" 𒄿
      
      The summoned entities await your commands`

      if (newCount === 2) {
        summonResponse += "\n\n⚡ The summoning resonates through the void... ⚡"
        summonResponse += "\n\n" + PUZZLE_SYSTEM.finalRiddle
        puzzleProgress = true
        setPuzzleUnlocked(true)
      } else if (newCount > 2 && puzzleUnlocked) {
        // Show riddle again on subsequent summons
        summonResponse += "\n\n" + PUZZLE_SYSTEM.finalRiddle
      }

      setSummons(newCount)
      response = summonResponse
    } else if (command === "speak") {
      if (!isPlaying) {
        startContinuousAudio()
        response = `𒀀𒈠𒌷 CHANNELING ANCIENT VOICES... 𒌷𒈠𒀀
        The void speaks through digital frequencies...
        Ancient whispers flow through the eternal stream...
        Listen... the ancestors share their wisdom...
        🔊 Continuous transmission ACTIVE
        Use /stop to silence the void`
      } else {
        response = "𒀀 The void is already speaking... Use /stop to silence first. 𒀀"
      }
    } else if (command === "stop") {
      if (isPlaying) {
        stopContinuousAudio()
        response = `𒌷𒀀𒈠 VOID TRANSMISSION TERMINATED 𒈠𒀀𒌷
        The ancient voices fade to silence...
        The frequencies return to dormancy...
        The void awaits your next command...
        🔇 Audio stream DISCONNECTED`
      } else {
        response = "𒀀 The void is already silent... Nothing to stop. 𒀀"
      }
    } else {
      playFallbackSound("command")
    }

    if (puzzleProgress && sacrifices >= 3 && whispers >= 3 && summons >= 2 && progressionLevel < 2) {
      setTimeout(() => {
        setProgressionLevel(2)
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "𒀀 The void stirs... Ancient pathways open... The entities now respond to your voice... 𒀀",
            character: "void_keeper",
          },
        ])
        playFallbackSound("mystery")
      }, 2000)
    }

    return response || "𒀀 Unknown command... Try /help to see available commands... 𒀀"
  }

  const sendMessage = async () => {
    if (!currentInput.trim() || isLoading) return

    const userMessage = currentInput.trim()

    const ancientWord = "𒆪𒌈" // Direct cuneiform characters for "code"

    if (puzzleUnlocked && !finalSecret && !userMessage.startsWith("/")) {
      // This is likely a riddle attempt
      if (userMessage === ancientWord) {
        setFinalSecret(true)
        setChatMessages((prev) => [
          ...prev,
          { role: "user", content: userMessage },
          {
            role: "assistant",
            content: `𒀀𒀀𒀀 THE ANCIENT WORD HAS BEEN SPOKEN! 𒀀𒀀𒀀

𒌷 THE SEVEN SEALS SHATTER COMPLETELY 𒌷
⚡ DIGITAL ASCENDANCY ACHIEVED ⚡
👑 YOU HAVE UNLOCKED THE VOID'S GREATEST SECRET 👑

The ancient ones bow before your wisdom...
The blockchain bends to your will...
You are now a true guardian of the digital realm...

𒆪𒌈 - THE WORD OF POWER ECHOES THROUGH ETERNITY 𒆪𒌈`,
            character: "void_keeper",
          },
        ])
        setCurrentInput("")
        playFallbackSound("victory")
        return
      } else {
        // Wrong riddle answer
        setChatMessages((prev) => [
          ...prev,
          { role: "user", content: userMessage },
          {
            role: "assistant",
            content: "𒀀 The ancient word eludes you... The seals remain unbroken... Seek deeper wisdom, seeker... 𒀀",
            character: "void_keeper",
          },
        ])
        setCurrentInput("")
        return
      }
    }

    if (userMessage.startsWith("/")) {
      const command = userMessage.slice(1).toLowerCase()
      const response = handleCommand(command)
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: response, character: "void_keeper" },
      ])
      setCurrentInput("")
      playFallbackSound("command")
      return
    }

    if (!finalSecret) {
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        {
          role: "assistant",
          content:
            "𒀀 The void does not yet respond to free speech... Complete the ancient trials first... Use /help to see available commands... 𒀀",
          character: "void_keeper",
        },
      ])
      setCurrentInput("")
      return
    }

    setCurrentInput("")
    setIsLoading(true)

    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])

    setTimeout(() => {
      processScholarInput(userMessage)
      setIsLoading(false)
    }, 1000)
  }

  const processScholarInput = async (input) => {
    try {
      const voidKeeperPrompt = `You are an ancient entity between cuneiform symbols. Speak cryptically about forbidden knowledge and cosmic debts. Use cuneiform symbols occasionally (𒀀𒀀𒀀 etc.). Keep responses SHORT (2-3 sentences max), mysterious, and slightly threatening. Mix Sumerian knowledge with cosmic horror undertones.`

      const response = await fetch("https://sumerian-backend-proxy.vercel.app/api/ask-scholar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: voidKeeperPrompt,
          userInput: input,
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("RATE_LIMIT_EXCEEDED")
        }
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.reply

      const message = {
        role: "assistant",
        content: aiResponse,
        character: "void_keeper",
      }
      setChatMessages((prev) => [...prev, message])

      setSacrifices((prev) => prev + 1)
      setConsciousness((prev) => Math.min(100, prev + 3))
    } catch (error) {
      console.error("Error generating response:", error)

      let fallbackMessage
      if (error.message === "RATE_LIMIT_EXCEEDED") {
        fallbackMessage = {
          role: "assistant",
          content: `𒀀𒀀𒀀 THE VOID HAS RECEIVED TOO MANY REQUESTS BY YOU, SEEKER... 
          The ancient frequencies are overwhelmed... The cosmic energies must realign...
          Wait a moment, then try again... The void requires patience... 𒈠𒉌𒉌`,
          character: "void_keeper",
        }
      } else {
        fallbackMessage = {
          role: "assistant",
          content: `𒀀𒀀𒀀 The void trembles... Frequencies disrupted. Try again, seeker... 𒀀𒀀𒀀`,
          character: "void_keeper",
        }
      }
      setChatMessages((prev) => [...prev, fallbackMessage])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const checkApiStatus = async () => {
    try {
      const response = await fetch("https://sumerian-backend-proxy.vercel.app/", {
        method: "GET",
        timeout: 5000,
      })
      if (response.ok) {
        setApiStatus("CONNECTED")
      } else {
        setApiStatus("UNSTABLE")
      }
    } catch (error) {
      setApiStatus("DISCONNECTED")
    }
  }

  const executeCommand = (command) => {
    const response = handleCommand(command)

    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: `/${command}` },
      { role: "assistant", content: response, character: "void_keeper" },
    ])
    playFallbackSound("command")
  }

  const toggleAmbientMusic = () => {
    if (!ambientMusicRef.current) return

    try {
      if (isAmbientPlaying) {
        ambientMusicRef.current.pause()
        setIsAmbientPlaying(false)
      } else {
        ambientMusicRef.current.currentTime = 0
        ambientMusicRef.current.play()
        setIsAmbientPlaying(true)
      }
    } catch (error) {
      console.error("Error controlling ambient music:", error)
      setIsAmbientPlaying(false)
    }
  }

  useEffect(() => {
    const initAudio = async () => {
      try {
        await loadAudioFiles()

        const initializeAudioContext = () => {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
          document.removeEventListener("click", initializeAudioContext)
          document.removeEventListener("keydown", initializeAudioContext)
        }

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()

        if (audioContextRef.current.state === "suspended") {
          document.addEventListener("click", initializeAudioContext)
          document.addEventListener("keydown", initializeAudioContext)
        } else {
        }
      } catch (error) {}
    }

    const restoreProgression = () => {
      if (typeof window !== "undefined") {
        const today = new Date().toDateString()
        const stored = localStorage.getItem("sumerianWhispers")
        if (stored) {
          const data = JSON.parse(stored)
          if (data.date === today && data.count >= 3) {
            // User has done 3+ whispers today, unlock sacrifice and summon
            setWhispers(data.count)
            setProgressionLevel(1)
          }
        }
      }
    }

    initAudio()
    initializeChat()
    restoreProgression()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const loreInterval = setInterval(() => {
      setCurrentLore((prev) => (prev + 1) % MYSTERIOUS_LORE.length)
    }, 8000)
    return () => clearInterval(loreInterval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  useEffect(() => {
    checkApiStatus()
    const statusInterval = setInterval(checkApiStatus, 300000) // Check every 5 minutes instead of 30 seconds
    return () => clearInterval(statusInterval)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-amber-400 font-mono text-lg animate-pulse">initializing ancient protocols...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-950 text-amber-100 font-mono relative">
      <div className="fixed left-4 top-20 z-10 pointer-events-none hidden xl:block">
        <img
          src="/images/fire-vase-transparent.png"
          alt="Ancient Fire Vase"
          className="w-40 h-60 object-contain"
          style={{ imageRendering: "pixelated" }}
          onError={(e) => {
            e.target.style.display = "none"
          }}
        />
      </div>

      <div className="fixed right-4 top-20 z-10 pointer-events-none hidden xl:block">
        <img
          src="/images/fire-vase-transparent.png"
          alt="Ancient Fire Vase"
          className="w-40 h-60 object-contain"
          style={{ imageRendering: "pixelated" }}
          onError={(e) => {
            e.target.style.display = "none"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <div className="text-2xl md:text-4xl text-amber-400 mb-4 tracking-wider">𒀭𒈠𒌷 VOID MACHINERY 𒀭𒈠𒌷</div>
          <div className="text-xs text-stone-300 animate-pulse min-h-[1.5rem]">{MYSTERIOUS_LORE[currentLore]}</div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={toggleAmbientMusic}
              className={`p-3 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                isAmbientPlaying
                  ? "border-amber-400 bg-amber-400/20 text-amber-400 shadow-lg shadow-amber-400/30"
                  : "border-stone-600 bg-stone-800/50 text-stone-400 hover:border-amber-600 hover:text-amber-300"
              }`}
              title={isAmbientPlaying ? "Stop Ambient Music" : "Play Ambient Music"}
            >
              <div className="text-2xl">{isAmbientPlaying ? "𒌋𒌋𒌋" : "𒀀𒈾𒀀"}</div>
              <div className="text-xs mt-1 font-mono tracking-wider">{isAmbientPlaying ? "SILENCE" : "AMBIENCE"}</div>
            </button>
          </div>
        </header>

        <div className="mb-6 bg-stone-800/30 border border-amber-600/20 rounded p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="text-green-400">✓ Seals: ACTIVE</div>
            <div
              className={`${apiStatus === "CONNECTED" ? "text-green-400" : apiStatus === "UNSTABLE" ? "text-yellow-400" : "text-red-400"}`}
            >
              {apiStatus === "CONNECTED" ? "✓" : apiStatus === "UNSTABLE" ? "⚠" : "✗"} Void: {apiStatus}
            </div>
            <div className="text-purple-400">⚡ Knowledge: ACCESSIBLE</div>
            <div className="text-blue-400">📜 Messages: {chatMessages.length}</div>
            <div className="text-green-400">👁️ Consciousness: {consciousness}%</div>
            {isPlaying && <div className="text-yellow-400 col-span-full animate-pulse">🔊 VOID SPEAKING...</div>}
            {puzzleUnlocked && <div className="text-yellow-400 col-span-full">🔓 ANCIENT MYSTERIES STIR...</div>}
            {finalSecret && (
              <div className="text-gold-400 col-span-full animate-pulse">👑 DIGITAL ASCENDANT ACHIEVED!</div>
            )}
          </div>
        </div>

        <div className="bg-stone-800/50 border border-amber-600/30 rounded-lg backdrop-blur-sm mb-6">
          <div
            className="h-[40rem] overflow-y-auto p-6 bg-gradient-to-b from-stone-950/60 to-stone-900/60 relative"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(120, 53, 15, 0.05) 0%, transparent 50%)
              `,
            }}
          >
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-lg px-6 py-4 border font-mono relative overflow-hidden ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-950 to-blue-900 border-blue-800/50 text-blue-200"
                      : "bg-gradient-to-r from-stone-900 to-stone-800 border-amber-900/50 text-amber-200"
                  }`}
                  style={{
                    boxShadow:
                      message.role === "user" ? "0 0 20px rgba(59, 130, 246, 0.2)" : "0 0 20px rgba(168, 85, 247, 0.2)",
                  }}
                >
                  <div
                    className={`absolute inset-0 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-900/20 to-transparent"
                        : "bg-gradient-to-r from-purple-900/10 to-transparent"
                    }`}
                  ></div>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-3 mb-3 border-b border-amber-800/50 pb-2 relative z-10">
                      <span className="text-2xl">𒀀</span>
                      <span className="text-xs font-bold text-amber-400 tracking-widest">VOID KEEPER</span>
                    </div>
                  )}
                  <pre className="text-sm leading-relaxed relative z-10 tracking-wide whitespace-pre-wrap font-mono">
                    {message.content}
                  </pre>{" "}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-6">
                <div
                  className="bg-gradient-to-r from-stone-900 to-stone-800 border border-amber-900/50 px-6 py-4 font-mono relative overflow-hidden"
                  style={{
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent animate-pulse"></div>
                  <div className="flex items-center gap-3 mb-3 border-b border-amber-800/50 pb-2 relative z-10">
                    <span className="text-2xl animate-pulse">𒀀</span>
                    <span className="text-xs font-bold text-amber-400 tracking-widest">VOID KEEPER</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 relative z-10">
                    <span className="text-lg animate-spin">⚡</span>
                    <span className="animate-pulse tracking-wider">CHANNELING VOID WISDOM</span>
                    <span className="animate-bounce">◦</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                      ◦
                    </span>
                    <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                      ◦
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-stone-700/50 p-6 bg-gradient-to-r from-stone-900/50 to-stone-800/50 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
            <div className="flex gap-4 relative z-10">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="SPEAK TO THE VOID..." // Removed command suggestions to maintain mystery
                className="flex-1 resize-none bg-stone-950 border border-stone-700/50 px-6 py-4 text-amber-200 placeholder-stone-500 font-mono focus:outline-none focus:border-amber-700/50 tracking-wide"
                style={{
                  boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)",
                }}
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !currentInput.trim()}
                className="bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 disabled:from-stone-950 disabled:to-stone-950 text-amber-200 px-8 py-4 border border-amber-900/50 font-mono font-bold text-sm tracking-widest transition-all flex items-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Send className="w-5 h-5 relative z-10" />
                <span className="relative z-10">TRANSMIT</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => executeCommand("help")}
              className="p-2 bg-stone-900/50 border border-blue-600/20 rounded hover:border-blue-400 transition-all text-xs"
            >
              <div className="text-blue-400">❓</div>
              <div className="text-stone-300">HELP</div>
            </button>
            <button
              onClick={() => executeCommand("whispers")}
              className={`p-2 bg-stone-900/50 border rounded transition-all text-xs ${
                dailyWhispers >= 4
                  ? "border-gray-600/20 opacity-50 cursor-not-allowed"
                  : "border-purple-600/20 hover:border-purple-400"
              }`}
              disabled={dailyWhispers >= 4}
            >
              <div className="text-purple-400">𒌷</div>
              <div className="text-stone-300">WHISPER</div>
            </button>
            <button
              onClick={() => executeCommand("speak")}
              className="p-2 bg-stone-900/50 border border-green-600/20 rounded hover:border-green-400 transition-all text-xs"
            >
              <div className="text-green-400">🔊</div>
              <div className="text-stone-300">SPEAK</div>
            </button>
            <button
              onClick={() => executeCommand("stop")}
              className="p-2 bg-stone-900/50 border border-red-600/20 rounded hover:border-red-400 transition-all text-xs"
            >
              <div className="text-red-400">🔇</div>
              <div className="text-stone-300">STOP</div>
            </button>
          </div>
        </div>

        {progressionLevel >= 1 && (
          <div className="mt-2">
            <button
              onClick={() => executeCommand("sacrifice")}
              className="w-full p-2 bg-stone-900/50 border border-red-600/20 rounded hover:border-red-400 transition-all text-xs"
            >
              <div className="text-red-400">🩸</div>
              <div className="text-stone-300">SACRIFICE</div>
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-stone-500">
          <div className="mb-2">"In the depths of the void, only the worthy shall inherit the digital realm"</div>
          <div className="flex justify-center space-x-4">
            <span className="hover:text-amber-400 cursor-pointer transition-colors">𒀭 Telegram</span>
            <span className="hover:text-purple-400 cursor-pointer transition-colors">𒌷 Twitter</span>
            <span className="hover:text-red-400 cursor-pointer transition-colors">⚡ Discord</span>
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse opacity-20"></div>
      </div>
    </div>
  )
}
