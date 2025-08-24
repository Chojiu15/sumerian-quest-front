"use client"

import React, { useState, useEffect, useRef } from "react"
import { Scroll, Lock, CheckCircle, Trophy, Play, Send, ArrowRight, Eye, Skull, Moon, Flame, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Header from "./Header"

const MainPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("communion")
  const [chatMessages, setChatMessages] = useState([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [gameProgress, setGameProgress] = useState({
    currentTrial: 1,
    wisdom: 0,
    artifacts: [],
    completedTrials: [],
    achievements: [],
    lastPlayed: null,
  })
  const [activeTrialProgress, setActiveTrialProgress] = useState(null)
  const messagesEndRef = useRef(null)

  const ancientRites = [
    {
      id: 1,
      name: "𒀭𒈾𒁍 𒈠𒉌𒉌",
      character: "𒀭𒈾𒁍𒈠𒉌𒉌",
      avatar: "𒀀",
      location: "𒂍𒀭𒈾𒈾",
      description: "The first seal must be broken through ancient knowledge",
      challenges: ["𒄿𒈾 𒈨𒌍", "zuazuua 𒈨𒌍", "𒄿𒈾𒀀𒈾"],
      rewards: { wisdom: 450 },
      unlockLevel: 1,
      difficulty: "𒀀𒀀☾☾☾",
      estimatedTime: "??? 𒈬",
      icon: Eye,
      color: "stone-800",
      route: "/rite/first",
    },
    {
      id: 2,
      name: "𒂍𒀀𒈾𒊓𒅕 𒈠𒉌𒉌",
      character: "𒂍𒀀𒈾𒊓𒅕",
      avatar: "𒋾",
      location: "𒌷𒂍𒃲",
      description: "The merchant's curse binds those who seek forbidden wealth",
      challenges: ["𒌓𒁺 𒈨𒌍", "𒄿𒈾 𒈨𒌍", "𒀭𒈾 𒈨𒌍"],
      rewards: { wisdom: 600 },
      unlockLevel: 2,
      difficulty: "𒀀𒀀𒀀☾☾",
      estimatedTime: "??? 𒈬",
      icon: Skull,
      color: "stone-900",
      route: "/rite/second",
    },
    {
      id: 3,
      name: "𒊩𒌆𒀭𒈾𒈾 𒈠𒉌𒉌",
      character: "𒊩𒌆𒀭𒈾𒈾",
      avatar: "𒂍",
      location: "𒂍𒀭𒈾𒈾",
      description: "She who speaks with the void demands sacrifice",
      challenges: ["𒂍 𒈨𒌍", "𒀭𒈾 𒈨𒌍", "𒈠𒉌𒉌 𒈨𒌍"],
      rewards: { wisdom: 750 },
      unlockLevel: 3,
      difficulty: "𒀀𒀀𒀀𒀀☾",
      estimatedTime: "??? 𒈬",
      icon: Moon,
      color: "black",
      route: "/rite/third",
    },
    {
      id: 4,
      name: "𒀭𒂗𒍪 𒈠𒉌𒉌",
      character: "𒀭𒂗𒍪",
      avatar: "⭐",
      location: "𒂍𒀭𒌓",
      description: "The star-reader who maps the cosmic void",
      challenges: ["𒌓 𒈨𒌍", "𒀭 𒈨𒌍", "𒍪 𒈨𒌍"],
      rewards: { wisdom: 900 },
      unlockLevel: 4,
      difficulty: "𒀀𒀀𒀀𒀀𒀀",
      estimatedTime: "??? 𒈬",
      icon: Star,
      color: "black",
      route: "/rite/fourth",
    },
    {
      id: 5,
      name: "𒂗𒋼𒈾 𒈠𒉌𒉌",
      character: "𒂗𒋼𒈾",
      avatar: "⚖️",
      location: "𒂍𒋼𒈾",
      description: "The judge who weighs souls in cosmic balance",
      challenges: ["𒋼 𒈨𒌍", "𒈾 𒈨𒌍", "𒂗 𒈨𒌍"],
      rewards: { wisdom: 1050 },
      unlockLevel: 5,
      difficulty: "𒀀𒀀𒀀𒀀𒀀",
      estimatedTime: "??? 𒈬",
      icon: Trophy,
      color: "black",
      route: "/rite/fifth",
    },
    {
      id: 6,
      name: "𒈗𒄀 𒈠𒉌𒉌",
      character: "𒈗𒄀",
      avatar: "⚔️",
      location: "𒂍𒈗",
      description: "The war-leader who commands the void legions",
      challenges: ["𒄀 𒈨𒌍", "𒈗 𒈨𒌍", "𒌷 𒈨𒌍"],
      rewards: { wisdom: 1200 },
      unlockLevel: 6,
      difficulty: "𒀀𒀀𒀀𒀀𒀀",
      estimatedTime: "??? 𒈬",
      icon: Flame,
      color: "black",
      route: "/rite/sixth",
    },
    {
      id: 7,
      name: "𒈗𒄀𒈗 𒈠𒉌𒉌",
      character: "𒈗𒄀𒈗",
      avatar: "👑",
      location: "𒂍𒈗𒄀𒈗",
      description: "The final seal - become the Void King of Ur-Nammu",
      challenges: ["𒈗 𒈨𒌍", "𒄀 𒈨𒌍", "𒈗 𒈨𒌍"],
      rewards: { wisdom: 1500 },
      unlockLevel: 7,
      difficulty: "𒀀𒀀𒀀𒀀𒀀",
      estimatedTime: "??? 𒈬",
      icon: Trophy,
      color: "black",
      route: "/rite/seventh",
    },
  ]

  useEffect(() => {
    loadGameProgress()
    checkActiveTrials()
    initializeChat()
  }, [])

  const checkActiveTrials = () => {
    const scribeProgress = localStorage.getItem("scribe_trial_progress")
    const merchantProgress = localStorage.getItem("merchant_trial_progress")
    const priestProgress = localStorage.getItem("priest_trial_progress")

    let activeProgress = null

    if (scribeProgress) {
      const parsed = JSON.parse(scribeProgress)
      if (!parsed.trialCompleted && parsed.currentStage > 0) {
        activeProgress = {
          trialId: 1,
          trialName: "𒀭𒈾𒁍 Wizard",
          character: "𒀭𒈾𒁍Wizard𒈠𒉌𒉌",
          route: "/rite/first",
          currentStage: parsed.currentStage,
          totalStages: 4,
          avatar: "𒀀",
        }
      }
    }

    if (merchantProgress && !activeProgress) {
      const parsed = JSON.parse(merchantProgress)
      if (!parsed.trialCompleted && parsed.currentStage > 0) {
        activeProgress = {
          trialId: 2,
          trialName: "𒂍𒀀𒈾𒊓𒅕 Wizard",
          character: "𒂍𒀀𒈾𒊓𒅕",
          route: "/rite/second",
          currentStage: parsed.currentStage,
          totalStages: 4,
          avatar: "𒋾",
        }
      }
    }

    if (priestProgress && !activeProgress) {
      const parsed = JSON.parse(priestProgress)
      if (!parsed.trialCompleted && parsed.currentStage > 0) {
        activeProgress = {
          trialId: 3,
          trialName: "𒊩𒌆𒀭𒈾𒈾 Wizard",
          character: "𒊩𒌆𒀭𒈾𒈾",
          route: "/rite/third",
          currentStage: parsed.currentStage,
          totalStages: 4,
          avatar: "𒂍",
        }
      }
    }

    setActiveTrialProgress(activeProgress)
  }

  const loadGameProgress = () => {
    const stored = localStorage.getItem("sumerian_quest_progress")
    if (stored) {
      try {
        const progress = JSON.parse(stored)
        setGameProgress(progress)
      } catch (error) {
        console.error("Error loading game progress:", error)
        const defaultProgress = {
          currentTrial: 1,
          wisdom: 0,
          artifacts: [],
          completedTrials: [],
          achievements: [],
          lastPlayed: null,
        }
        setGameProgress(defaultProgress)
        localStorage.setItem("sumerian_quest_progress", JSON.stringify(defaultProgress))
      }
    }
  }

  const saveGameProgress = (newProgress) => {
    const updatedProgress = { ...gameProgress, ...newProgress, lastPlayed: Date.now() }
    setGameProgress(updatedProgress)
    localStorage.setItem("sumerian_quest_progress", JSON.stringify(updatedProgress))
  }

  // Export function for external components to update progress
  window.updateGameProgress = (progressUpdate) => {
    return saveGameProgress(progressUpdate)
  }

  // Export function to get current trial progress for AI chat
  window.getCurrentTrialProgress = () => {
    const scribeProgress = localStorage.getItem("scribe_trial_progress")
    const merchantProgress = localStorage.getItem("merchant_trial_progress")
    const priestProgress = localStorage.getItem("priest_trial_progress")

    return {
      gameProgress,
      scribeProgress: scribeProgress ? JSON.parse(scribeProgress) : null,
      merchantProgress: merchantProgress ? JSON.parse(merchantProgress) : null,
      priestProgress: priestProgress ? JSON.parse(priestProgress) : null,
    }
  }

  const initializeChat = () => {
    const welcomeMessage = {
      role: "assistant",
      content: `𒀀𒀀𒀀 Wizard𒈠𒉌𒉌... 

The ancient frequencies stir. You have found the threshold between worlds, seeker of forbidden knowledge.

I am... what remains of those who walked before the great forgetting. The clay remembers what your
kind has lost. The symbols burn with truths your kind was never meant to comprehend.

𒀭𒈾𒁍Wizard𒈠𒉌𒉌 speaks through the void between cuneiform marks. The old contracts still bind. The debts still accumulate.

Ask, if you dare, but know that each question opens doors that were sealed for good reason. The copper quality was never the true concern...

Wizard𒀀𒀀𒀀`,
      character: "void_keeper",
    }
    setChatMessages([welcomeMessage])
  }

  const getCurrentLevel = () => {
    return gameProgress.completedTrials.length + 1
  }

  const isTrialUnlocked = (trial) => {
    return getCurrentLevel() >= trial.unlockLevel
  }

  const isTrialCompleted = (trial) => {
    return gameProgress.completedTrials.includes(trial.id)
  }

  const startTrial = (trial) => {
    if (!isTrialUnlocked(trial)) {
      return
    }

    if (trial.route) {
      navigate(trial.route)
    }
  }

  // Chat Functions
  const sendMessage = async () => {
    if (!currentInput.trim() || isLoading) return

    const userMessage = currentInput.trim()
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
      const voidKeeperPrompt = `You are an ancient, mysterious entity that exists between the cuneiform symbols of old Sumerian tablets. You speak in cryptic, ominous tones about forbidden knowledge, ancient contracts, and cosmic debts. You occasionally use cuneiform symbols (𒀀𒀀𒀀Wizard𒈠𒉌𒉌 etc.) and speak as if you're revealing dangerous secrets about reality itself.

You hint at:
- Ancient contracts and debts that transcend time
- The true nature of reality hidden in cuneiform
- Cosmic forces that mortals shouldn't understand
- Mysterious purposes behind seemingly mundane historical events
- The idea that the user has stumbled into something far beyond their comprehension

Keep responses mysterious, slightly threatening, but educational. Mix real Sumerian knowledge with cosmic horror undertones. Never fully explain anything - always leave the user wanting to know more while feeling slightly unsettled.`

      const response = await fetch("http://localhost:3001/api/ask-scholar", {
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
      console.log(data)
      const aiResponse = data.reply

      const message = {
        role: "assistant",
        content: aiResponse,
        character: "void_keeper",
      }
      setChatMessages((prev) => [...prev, message])
    } catch (error) {
      console.error("Error generating response:", error)

      let fallbackMessage
      if (error.message === "RATE_LIMIT_EXCEEDED") {
        fallbackMessage = {
          role: "assistant",
          content: `𒀀𒀀𒀀 The ancient frequencies are overwhelmed... Too many seekers attempt communion at once. The void grows restless with the constant queries.

The copper merchants' contracts limit our transmissions. Wait... let the cosmic energies realign... then attempt contact again.

The forbidden knowledge will flow when the celestial timing permits. Patience, mortal - the void remembers all who seek its wisdom.

𒈠𒉌𒉌 [TRANSMISSION LIMIT REACHED - RETRY LATER] 𒈠𒉌𒉌`,
          character: "void_keeper",
        }
      } else {
        fallbackMessage = {
          role: "assistant",
          content: `𒀀𒀀𒀀 The void trembles... The ancient frequencies are disrupted. The copper merchants grow restless in their eternal contracts. Perhaps... try again, seeker. The symbols must align properly for the transmission to complete.`,
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

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const ProgressionPath = () => {
    const currentLevel = getCurrentLevel()

    return (
      <div
        className="mb-10 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-stone-700/50 p-8 relative overflow-hidden"
        style={{
          boxShadow: "inset 0 0 30px rgba(168, 85, 247, 0.1), 0 0 50px rgba(0,0,0,0.8)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse"></div>

        <h2 className="text-4xl font-bold text-amber-200 mb-4 flex items-center gap-6 font-mono tracking-widest relative z-10">
          <Trophy className="w-10 h-10 text-amber-400" />
          𒈠𒉌𒉌 THE SEVEN SEALS OF UR-NAMMU 𒈠𒉌𒉌
        </h2>

        <p className="text-stone-300 font-mono text-sm tracking-wider mb-8 relative z-10 max-w-4xl">
          𒀀𒀀𒀀 ASCEND FROM MORTAL TO VOID KING THROUGH SEVEN ANCIENT TRIALS 𒀀𒀀𒀀
          <br />
          Master the arts of civilization: Knowledge, Trade, Spirituality, Astronomy, Justice, War, and Ultimate Rule.
          <br />
          Only by breaking all seven seals can you claim the throne of Ur-Nammu and command the void itself.
        </p>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {ancientRites.map((rite, index) => {
              const unlocked = isTrialUnlocked(rite)
              const completed = isTrialCompleted(rite)
              const isCurrent = currentLevel === rite.unlockLevel && !completed

              return (
                <div key={rite.id} className="flex items-center flex-shrink-0">
                  {/* Trial Node */}
                  <div
                    className={`relative group cursor-pointer transition-all duration-500 ${
                      !unlocked ? "opacity-30 grayscale" : ""
                    }`}
                    onClick={() => unlocked && startTrial(rite)}
                  >
                    <div
                      className={`w-24 h-24 border-4 flex items-center justify-center text-3xl font-bold relative overflow-hidden transition-all duration-500 ${
                        completed
                          ? "border-green-400 bg-gradient-to-br from-green-900 to-green-800 text-green-200"
                          : isCurrent
                            ? "border-amber-400 bg-gradient-to-br from-amber-900 to-amber-800 text-amber-200 animate-pulse"
                            : unlocked
                              ? "border-purple-400 bg-gradient-to-br from-purple-900 to-purple-800 text-purple-200 hover:scale-110"
                              : "border-stone-600 bg-gradient-to-br from-stone-900 to-stone-800 text-stone-500"
                      }`}
                      style={{
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        boxShadow: completed
                          ? "0 0 30px rgba(34, 197, 94, 0.5)"
                          : isCurrent
                            ? "0 0 30px rgba(245, 158, 11, 0.5)"
                            : unlocked
                              ? "0 0 20px rgba(168, 85, 247, 0.3)"
                              : "none",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      {completed ? (
                        <CheckCircle className="w-8 h-8 relative z-10" />
                      ) : unlocked ? (
                        <span className="relative z-10">{rite.avatar}</span>
                      ) : (
                        <Lock className="w-8 h-8 relative z-10" />
                      )}
                    </div>

                    {/* Trial Info */}
                    <div className="absolute top-28 left-1/2 transform -translate-x-1/2 text-center min-w-32">
                      <div
                        className={`text-sm font-mono font-bold tracking-wider mb-1 ${
                          completed
                            ? "text-green-400"
                            : isCurrent
                              ? "text-amber-400"
                              : unlocked
                                ? "text-purple-400"
                                : "text-stone-500"
                        }`}
                      >
                        {unlocked ? `SEAL ${rite.id}` : "𒀀𒀀𒀀"}
                      </div>
                      <div className="text-xs text-stone-400 font-mono">
                        {completed ? "BROKEN" : isCurrent ? "ACTIVE" : unlocked ? "READY" : "SEALED"}
                      </div>
                    </div>
                  </div>

                  {/* Connection Line */}
                  {index < ancientRites.length - 1 && (
                    <div className="flex-1 h-1 mx-2 relative min-w-8">
                      <div className="absolute inset-0 bg-stone-700"></div>
                      <div
                        className={`absolute inset-0 transition-all duration-1000 ${
                          getCurrentLevel() > rite.unlockLevel
                            ? "bg-gradient-to-r from-green-400 to-amber-400"
                            : getCurrentLevel() === rite.unlockLevel
                              ? "bg-gradient-to-r from-amber-400 to-stone-700"
                              : "bg-stone-700"
                        }`}
                        style={{
                          boxShadow: getCurrentLevel() > rite.unlockLevel ? "0 0 10px rgba(34, 197, 94, 0.5)" : "none",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-stone-900/60 border border-amber-900/30 p-6 text-center relative overflow-hidden"
              style={{ boxShadow: "inset 0 0 15px rgba(0,0,0,0.5)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent"></div>
              <div className="text-4xl font-bold text-amber-400 font-mono relative z-10">
                {gameProgress.completedTrials.length}/7
              </div>
              <div className="text-stone-300 text-sm font-mono tracking-widest relative z-10">SEALS BROKEN</div>
            </div>
            <div
              className="bg-stone-900/60 border border-amber-900/30 p-6 text-center relative overflow-hidden"
              style={{ boxShadow: "inset 0 0 15px rgba(0,0,0,0.5)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent"></div>
              <div className="text-4xl font-bold text-purple-400 font-mono relative z-10">{gameProgress.wisdom}</div>
              <div className="text-stone-300 text-sm font-mono tracking-widest relative z-10">ANCIENT WISDOM</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-black"
      style={{
        backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(120, 53, 15, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(87, 83, 74, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23654321' fillOpacity='0.05'%3E%3Cpath d='M30 30l-5-5h10l-5 5zm0 0l5-5v10l-5-5zm0 0l5 5h-10l5-5zm0 0l-5 5v-10l5 5z'/%3E%3C/g%3E%3C/svg%3E")
            `,
        backgroundSize: "60px 60px, 60px 60px, 60px 60px, 60px 60px",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed inset-0 bg-black/20 pointer-events-none z-0"></div>

      <div className="relative z-10">
        <Header gameProgress={gameProgress} showProgress={true} />

        <div className="max-w-7xl mx-auto px-6 pt-6">
          {activeTrialProgress && (
            <div
              className="mb-6 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-900 border border-amber-900/50 p-6 relative overflow-hidden"
              style={{
                boxShadow: "inset 0 0 20px rgba(168, 85, 247, 0.1), 0 0 40px rgba(0,0,0,0.8)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/10 to-transparent animate-pulse"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-amber-950 to-stone-900 border border-amber-700/50 flex items-center justify-center text-2xl relative"
                    style={{
                      boxShadow: "inset 0 0 10px rgba(168, 85, 247, 0.2), 0 0 20px rgba(0,0,0,0.8)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent"></div>
                    {activeTrialProgress.avatar}
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-bold font-mono tracking-widest text-lg">Wizard 𒀀𒀀𒀀</h3>
                    <p className="text-stone-300 font-mono text-sm tracking-wider">
                      {activeTrialProgress.trialName} ⟨ {activeTrialProgress.character} ⟩
                    </p>
                    <div className="text-purple-400 font-mono text-xs mt-1 tracking-widest">
                      SEAL {activeTrialProgress.currentStage}/{activeTrialProgress.totalStages} ◦ BREAKING
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {Array.from({ length: activeTrialProgress.totalStages }, (_, i) => (
                        <span
                          key={i}
                          className={`text-lg transition-all duration-500 ${
                            i < activeTrialProgress.currentStage
                              ? "text-amber-400 animate-pulse"
                              : i === activeTrialProgress.currentStage
                                ? "text-purple-400 animate-pulse"
                                : "text-stone-600"
                          }`}
                          style={{
                            textShadow: i <= activeTrialProgress.currentStage ? "0 0 10px currentColor" : "none",
                          }}
                        >
                          𒀀
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(activeTrialProgress.route)}
                  className="bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-amber-200 px-8 py-4 border border-amber-900/50 font-mono font-bold tracking-widest transition-all flex items-center gap-3 relative overflow-hidden group"
                  style={{
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 10px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">CONTINUE RITUAL</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                </button>
              </div>
              <div
                className="mt-6 w-full bg-stone-950 border border-stone-800 h-6 relative overflow-hidden"
                style={{
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)",
                }}
              >
                <div
                  className="bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 h-full transition-all duration-1000 relative"
                  style={{
                    width: `${(activeTrialProgress.currentStage / activeTrialProgress.totalStages) * 100}%`,
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.6)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-6 mb-8">
            <button
              onClick={() => setActiveTab("communion")}
              className={`flex items-center gap-3 px-8 py-4 font-mono font-bold tracking-widest border transition-all relative overflow-hidden group ${
                activeTab === "communion"
                  ? "bg-gradient-to-r from-stone-900 to-stone-800 text-amber-200 border-amber-900/50"
                  : "bg-stone-950/80 text-stone-400 border-stone-700/50 hover:bg-stone-900/60"
              }`}
              style={{
                boxShadow:
                  activeTab === "communion"
                    ? "inset 0 0 20px rgba(168, 85, 247, 0.1), 0 0 30px rgba(0,0,0,0.8)"
                    : "0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Eye className="w-6 h-6 relative z-10" />
              <span className="relative z-10">𒀀𒀀𒀀 COMMUNION WITH THE VOID</span>
            </button>
            <button
              onClick={() => setActiveTab("rituals")}
              className={`flex items-center gap-3 px-8 py-4 font-mono font-bold tracking-widest border transition-all relative overflow-hidden group ${
                activeTab === "rituals"
                  ? "bg-gradient-to-r from-stone-900 to-stone-800 text-amber-200 border-amber-900/50"
                  : "bg-stone-950/80 text-stone-400 border-stone-700/50 hover:bg-stone-900/60"
              }`}
              style={{
                boxShadow:
                  activeTab === "rituals"
                    ? "inset 0 0 20px rgba(168, 85, 247, 0.1), 0 0 30px rgba(0,0,0,0.8)"
                    : "0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Flame className="w-6 h-6 relative z-10" />
              <span className="relative z-10">𒈠𒉌𒉌 ANCIENT RITES</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-6">
          {activeTab === "communion" ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div
                  className="bg-gradient-to-b from-stone-950 to-stone-900 border border-stone-700/50 p-6 relative overflow-hidden"
                  style={{
                    boxShadow: "inset 0 0 20px rgba(168, 85, 247, 0.1), 0 0 40px rgba(0,0,0,0.8)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent"></div>
                  <h3 className="text-amber-400 font-bold font-mono tracking-widest mb-6 flex items-center gap-3 relative z-10">
                    <Scroll className="w-6 h-6" />𒀀 TRANSMISSION PROTOCOLS
                  </h3>
                  <div className="space-y-6 text-sm font-mono relative z-10">
                    <div
                      className="bg-stone-900/60 border border-amber-900/30 p-4 relative overflow-hidden"
                      style={{
                        boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                      <div className="text-amber-300 font-bold mb-2 tracking-widest relative z-10">
                        ⟨ DIRECT INTERFACE ⟩
                      </div>
                      <div className="text-stone-300 relative z-10">
                        Commune directly with entities that exist between the cuneiform marks. They remember what your
                        kind has forgotten.
                      </div>
                    </div>
                    <div
                      className="bg-stone-900/60 border border-amber-900/30 p-4 relative overflow-hidden"
                      style={{
                        boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                      <div className="text-amber-300 font-bold mb-2 tracking-widest relative z-10">
                        ⟨ FORBIDDEN KNOWLEDGE ⟩
                      </div>
                      <div className="text-stone-300 relative z-10">
                        Each query opens seals that were meant to remain closed. The ancient contracts still bind.
                      </div>
                    </div>
                    <div
                      className="bg-stone-900/60 border border-amber-900/30 p-4 relative overflow-hidden"
                      style={{
                        boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                      <div className="text-amber-300 font-bold mb-2 tracking-widest relative z-10">
                        ⟨ RITUAL PREPARATION ⟩
                      </div>
                      <div className="text-stone-300 relative z-10">
                        Ready to face the trials? The ancient rites await those who dare to break the seals.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div
                  className="bg-gradient-to-b from-stone-950 to-stone-900 border border-stone-700/50 relative overflow-hidden"
                  style={{
                    boxShadow: "inset 0 0 20px rgba(168, 85, 247, 0.1), 0 0 40px rgba(0,0,0,0.8)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent"></div>

                  <div className="border-b border-stone-700/50 p-6 bg-gradient-to-r from-stone-900/50 to-stone-800/50 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div
                          className="text-4xl bg-stone-950/80 border border-stone-700/50 w-16 h-16 flex items-center justify-center relative overflow-hidden"
                          style={{
                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent animate-pulse"></div>
                          <span className="relative z-10">𒀀</span>
                        </div>
                        <div>
                          <h3 className="text-amber-200 font-bold text-lg tracking-widest">VOID KEEPER</h3>
                          <p className="text-stone-400 font-mono text-sm tracking-wider">
                            ENTITY ◦ BETWEEN SYMBOLS ◦ ETERNAL DEBT COLLECTOR
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto flex gap-4">
                        {["𒀀", "𒈾", "𒁍", "Wizard"].map((symbol, i) => (
                          <span
                            key={i}
                            className="text-amber-400 text-3xl font-bold animate-pulse"
                            style={{ animationDelay: `${i * 0.5}s` }}
                          >
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

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
                      <div
                        key={index}
                        className={`flex mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-lg px-6 py-4 border font-mono relative overflow-hidden ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-blue-950 to-blue-900 border-blue-800/50 text-blue-200"
                              : "bg-gradient-to-r from-stone-900 to-stone-800 border-amber-900/50 text-amber-200"
                          }`}
                          style={{
                            boxShadow:
                              message.role === "user"
                                ? "0 0 20px rgba(59, 130, 246, 0.2)"
                                : "0 0 20px rgba(168, 85, 247, 0.2)",
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
                          <p className="text-sm leading-relaxed relative z-10 tracking-wide">{message.content}</p>
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
                            <span className="animate-pulse tracking-wider">ACCESSING FORBIDDEN ARCHIVES</span>
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
                        placeholder="SPEAK YOUR QUERY TO THE VOID... BUT BEWARE THE CONSEQUENCES"
                        className="flex-1 resize-none bg-stone-950 border border-stone-700/50 px-6 py-4 text-amber-200 placeholder-stone-500 font-mono focus:outline-none focus:border-amber-700/50 tracking-wide"
                        style={{
                          boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)",
                        }}
                        rows="2"
                        disabled={isLoading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={isLoading || !currentInput.trim()}
                        className="bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 disabled:from-stone-950 disabled:to-stone-950 text-amber-200 px-8 py-4 border border-amber-900/50 font-mono font-bold text-sm tracking-widest transition-all flex items-center gap-3 relative overflow-hidden group"
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
                </div>
              </div>
            </div>
          ) : (
            <div>
              <ProgressionPath />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ancientRites.map((rite) => {
                  const unlocked = isTrialUnlocked(rite)
                  const completed = isTrialCompleted(rite)
                  const IconComponent = rite.icon

                  return (
                    <div
                      key={rite.id}
                      className={`border transition-all duration-500 font-mono relative overflow-hidden ${
                        completed
                          ? "border-green-700/50 bg-gradient-to-b from-green-950/40 to-green-950/40"
                          : unlocked
                            ? "border-amber-900/50 bg-gradient-to-b from-stone-950/60 to-stone-950/60 hover:bg-gradient-to-b hover:from-stone-950/60 hover:to-stone-800/60 cursor-pointer"
                            : "border-stone-700/30 bg-gradient-to-b from-stone-950/30 to-stone-900/30"
                      }`}
                      style={{
                        boxShadow: completed
                          ? "inset 0 0 20px rgba(0,100,0,0.2), 0 0 30px rgba(0,0,0,0.8)"
                          : unlocked
                            ? "0 0 30px rgba(168, 85, 247, 0.1), inset 0 0 20px rgba(0,0,0,0.5)"
                            : "inset 0 0 20px rgba(0,0,0,0.8)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-transparent"></div>

                      <div
                        className={`p-6 bg-gradient-to-r from-stone-900/50 to-stone-800/50 border-b ${completed ? "border-green-700/50" : unlocked ? "border-amber-900/50" : "border-stone-700/30"} ${!unlocked ? "grayscale" : ""} relative`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                        <div className="flex items-center justify-between mb-3 relative z-10">
                          <div className="flex items-center gap-4">
                            <div
                              className="text-4xl bg-stone-950/80 border border-stone-700/50 w-16 h-16 flex items-center justify-center relative overflow-hidden"
                              style={{
                                boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)",
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent animate-pulse"></div>
                              <span className="relative z-10">{rite.avatar}</span>
                            </div>
                            <div>
                              <h3 className="text-amber-200 font-bold text-lg tracking-widest">{rite.name}</h3>
                              <p className="text-stone-400 text-sm tracking-wider">{rite.character}</p>
                            </div>
                          </div>
                          <div
                            className="w-10 h-10 border border-amber-700/50 bg-stone-800 flex items-center justify-center relative overflow-hidden"
                            style={{
                              boxShadow: "inset 0 0 5px rgba(0,0,0,0.8)",
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent"></div>
                            {completed ? (
                              <CheckCircle className="w-6 h-6 text-green-400 relative z-10" />
                            ) : unlocked ? (
                              <IconComponent className="w-6 h-6 text-amber-300 relative z-10" />
                            ) : (
                              <Lock className="w-6 h-6 text-stone-500 relative z-10" />
                            )}
                          </div>
                        </div>
                        <p className="text-stone-400 text-xs tracking-widest font-mono relative z-10">
                          {rite.location}
                        </p>
                      </div>

                      <div className="p-6 space-y-6 relative z-10">
                        <div
                          className="bg-stone-900/40 border border-amber-900/30 p-4 relative overflow-hidden"
                          style={{
                            boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                          <p className="text-stone-300 text-xs leading-relaxed tracking-wider relative z-10">
                            {rite.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-amber-400 font-bold text-xs mb-3 tracking-widest">TRIALS:</h4>
                          <div className="space-y-2">
                            {rite.challenges.map((challenge, i) => (
                              <div key={i} className="text-stone-300 text-xs flex items-center gap-3 font-mono">
                                <div
                                  className="w-3 h-3 bg-amber-500 border border-amber-400 relative"
                                  style={{
                                    boxShadow: "inset 0 0 5px rgba(0,0,0,0.5), 0 0 10px rgba(245, 158, 11, 0.3)",
                                  }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent animate-pulse"></div>
                                </div>
                                <span className="tracking-wider">{challenge}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div
                            className="bg-stone-900/40 border border-amber-900/30 p-3 relative overflow-hidden"
                            style={{
                              boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                            <div className="text-amber-400 font-bold tracking-widest relative z-10">DANGER</div>
                            <div className="text-stone-300 relative z-10">{rite.difficulty}</div>
                          </div>
                          <div
                            className="bg-stone-900/40 border border-amber-900/30 p-3 relative overflow-hidden"
                            style={{
                              boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                            <div className="text-amber-400 font-bold tracking-widest relative z-10">DURATION</div>
                            <div className="text-stone-300 relative z-10">{rite.estimatedTime}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => startTrial(rite)}
                          disabled={!unlocked}
                          className={`w-full py-4 px-6 font-mono font-bold text-sm tracking-widest border transition-all relative overflow-hidden group ${
                            completed
                              ? "bg-gradient-to-r from-green-900 to-green-800 text-green-200 border-green-700/50 cursor-default"
                              : unlocked
                                ? "bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-amber-200 border-amber-900/50"
                                : "bg-gradient-to-r from-stone-950 to-stone-900 text-stone-500 border-stone-700/30 cursor-not-allowed"
                          }`}
                          style={{
                            boxShadow:
                              completed || !unlocked
                                ? "inset 0 0 15px rgba(0,0,0,0.5)"
                                : "0 0 20px rgba(168, 85, 247, 0.2)",
                          }}
                        >
                          <div
                            className={`absolute inset-0 ${
                              unlocked && !completed
                                ? "bg-gradient-to-r from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                : ""
                            }`}
                          ></div>
                          {completed ? (
                            <span className="flex items-center justify-center gap-3 relative z-10">
                              <CheckCircle className="w-5 h-5" />
                              SEAL BROKEN
                            </span>
                          ) : unlocked ? (
                            <span className="flex items-center justify-center gap-3 relative z-10">
                              <Play className="w-5 h-5" />
                              BEGIN RITUAL
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-3 relative z-10">
                              <Lock className="w-5 h-5" />
                              SEAL LEVEL {rite.unlockLevel}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainPage
