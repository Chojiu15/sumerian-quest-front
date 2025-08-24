"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft } from "lucide-react"
import Header from "../Header"

const ScribeTrial = () => {
    const [gameProgress, setGameProgress] = useState({
      currentTrial: 1,
      wisdom: 0,
      artifacts: [],
      completedTrials: [],
      achievements: [],
      lastPlayed: null,
    })
  
    const [chatMessages, setChatMessages] = useState([])
    const [currentInput, setCurrentInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [currentQuestStage, setCurrentQuestStage] = useState(0)
    const messagesEndRef = useRef(null)
  
    const ancientSeals = [
      {
        id: "communion",
        name: "𒀭𒈾𒁍 First Contact",
        description: "The entity stirs between the symbols",
        type: "dialog",
        completed: false,
      },
      {
        id: "clay_mystery",
        name: "𒂍𒀀 The Clay Whispers",
        description: "Decipher what the ancients carved in desperation",
        type: "riddle",
        riddle: "I am written with a reed, baked in fire, and hold the words of kings. What am I?",
        answer: "clay tablet",
        alternatives: [
          "tablet",
          "clay",
          "cuneiform tablet",
          "clay tablet",
          "writing tablet",
          "stone tablet",
          "tablet of clay",
          "baked clay",
          "fired clay",
          "ceramic tablet",
        ],
        reward: { wisdom: 100, artifact: "Cursed Stylus of the Void" },
        completed: false,
      },
      {
        id: "number_curse",
        name: "𒐕𒐖𒐗 The Merchant's Calculation",
        description: "Ancient mathematics hide cosmic truths",
        type: "calculation",
        problem:
          "If a merchant has 3 talents of silver and trades 1/3 for barley at 20 shekels per bushel, how many bushels can he buy?",
        explanation:
          "1 talent = 60 shekels, so 3 talents = 180 shekels. 1/3 of 180 = 60 shekels. At 20 shekels per bushel: 60 ÷ 20 = 3 bushels.",
        answer: "3",
        alternatives: ["3 bushels", "three", "three bushels", "3", "three bushel", "bushels", "bushel", "3 bushel"],
        reward: { wisdom: 150, artifact: "Stone of Forbidden Numbers" },
        completed: false,
      },
      {
        id: "epic_secret",
        name: "𒄑𒂆𒈦 The Hero's Lost Secret",
        description: "What Gilgamesh truly sought in the depths",
        type: "knowledge",
        question: "What gift did Utnapishtim give to Gilgamesh that he lost to a serpent?",
        answer: "plant of eternal youth",
        alternatives: [
          "the plant",
          "a plant",
          "eternal youth plant",
          "youth plant",
          "plant of youth",
          "immortality plant",
          "plant of immortality",
          "magic plant",
          "eternal life plant",
          "fountain of youth plant",
          "youth herb",
          "immortal plant",
          "life plant",
          "eternal plant",
          "plant youth",
          "plant eternal youth!",
          "youth!",
          "eternal youth!",
          "immortality!",
        ],
        reward: { wisdom: 200, artifact: "Fragment of the Void Tablet" },
        completed: false,
      },
    ]
  
    const [sealProgress, setSealProgress] = useState(ancientSeals.map((seal) => ({ ...seal })))
  
    useEffect(() => {
      loadGameProgress()
    }, [])
  
    useEffect(() => {
      if (gameProgress && sealProgress.length > 0) {
        initializeChat()
      }
    }, [gameProgress])
  
    useEffect(() => {
      scrollToBottom()
    }, [chatMessages])
  
    const loadGameProgress = () => {
      const stored = localStorage.getItem("sumerian_quest_progress")
      if (stored) {
        try {
          const progress = JSON.parse(stored)
          setGameProgress(progress)
  
          const trialProgress = localStorage.getItem("scribe_trial_progress")
          if (trialProgress) {
            const parsedTrialProgress = JSON.parse(trialProgress)
            setSealProgress(parsedTrialProgress.questStages || ancientSeals.map((seal) => ({ ...seal })))
            setCurrentQuestStage(parsedTrialProgress.currentStage || 0)
          } else if (progress.completedTrials.includes(1)) {
            const completedSeals = ancientSeals.map((seal) => ({ ...seal, completed: true }))
            setSealProgress(completedSeals)
            setCurrentQuestStage(ancientSeals.length)
          } else {
            setSealProgress(ancientSeals.map((seal) => ({ ...seal })))
          }
        } catch (error) {
          console.error("Error loading progress:", error)
          resetProgress()
        }
      } else {
        setSealProgress(ancientSeals.map((seal) => ({ ...seal })))
      }
    }
  
    const resetProgress = () => {
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
  
    const saveGameProgress = (updates) => {
      const newProgress = { ...gameProgress, ...updates, lastPlayed: Date.now() }
      setGameProgress(newProgress)
      localStorage.setItem("sumerian_quest_progress", JSON.stringify(newProgress))
      return newProgress
    }
  
    const initializeChat = () => {
      setChatMessages([])
  
      const messages = []
  
      const welcomeMessage = {
        role: "assistant",
        content: `𒀀𒀀𒀀 You... you have found the first seal. The entity that dwells between the cuneiform marks stirs...
  
  I am what remains of 𒀭𒈾𒁍𒈠𒉌𒉌... the one who carved the first symbols when your kind still cowered in darkness. The clay remembers. The reed remembers. The fire that baked the first tablets... it burns eternal.
  
  You seek to break the seals? To uncover what was hidden for good reason? 
  
  Three trials await those foolish enough to disturb the ancient contracts:
  • **𒂍𒀀 The Clay Whispers** - What the desperate ancients carved
  • **𒐕𒐖𒐗 The Merchant's Calculation** - Numbers that bind reality
  • **𒄑𒂆𒈦 The Hero's Lost Secret** - What Gilgamesh truly sought
  
  The void watches. The copper quality was never the real concern... Are you prepared to learn what lies beneath the symbols?
  
  𒈠𒉌𒉌 Speak, if you dare... 𒈠𒉌𒉌`,
        character: "void_scribe",
      }
      messages.push(welcomeMessage)
  
      if (sealProgress && sealProgress.length > 0) {
        sealProgress.forEach((seal, index) => {
          if (seal.completed) {
            if (seal.type !== "dialog") {
              messages.push({
                role: "assistant",
                content: generateMysteriousChallenge(seal),
                character: "void_scribe",
              })
  
              messages.push({
                role: "user",
                content: getCorrectAnswerForSeal(seal),
              })
  
              messages.push({
                role: "assistant",
                content: generateVoidResponse(seal),
                character: "void_scribe",
              })
            }
          }
        })
  
        if (currentQuestStage < ancientSeals.length && !sealProgress[currentQuestStage]?.completed) {
          const currentSeal = ancientSeals[currentQuestStage]
          if (currentSeal.type !== "dialog") {
            messages.push({
              role: "assistant",
              content: generateMysteriousChallenge(currentSeal),
              character: "void_scribe",
            })
          }
        }
  
        if (isRitualComplete()) {
          messages.push({
            role: "assistant",
            content: `𒀀𒀀𒀀 The first seal... is broken.
  
  *The void trembles with ancient power*
  
  You have proven yourself worthy of the forbidden knowledge, seeker. The clay whispers your name now. The numbers bend to your will. The hero's secret burns in your mind.
  
  **The First Seal is Shattered:**
  • 450 Void Essence absorbed
  • 3 Cursed Relics claimed
  • "Breaker of the First Seal" - marked by the void
  
  The merchant's curse awaits... but that is another seal, another price to pay. The copper quality... it was always about so much more.
  
  Return to the threshold when you are ready to face what comes next. The void remembers those who serve its purpose.
  
  𒈠𒉌𒉌 The ancient contracts are pleased... 𒈠𒉌𒉌`,
            character: "void_scribe",
          })
        }
      }
  
      setChatMessages(messages)
    }
  
    const generateMysteriousChallenge = (seal) => {
      switch (seal.type) {
        case "riddle":
          return `𒂍𒀀 **${seal.name}**
  
  *The void whispers through cracked clay*
  
  "${seal.riddle}"
  
  The ancient symbols pulse with hidden meaning. What truth do they conceal, seeker?`
  
        case "calculation":
          return `𒐕𒐖𒐗 **${seal.name}**
  
  *Numbers carved in desperation, binding reality itself*
  
  "${seal.problem}"
  
  The merchant's curse runs deeper than silver and barley. Calculate the true cost, if you dare.`
  
        case "knowledge":
          return `𒄑𒂆𒈦 **${seal.name}**
  
  *The hero's tale echoes through the void*
  
  "${seal.question}"
  
  Gilgamesh sought more than immortality. He sought to break the same seals you now face. What did he lose to the serpent of the void?`
  
        default:
          return `**${seal.name}** - ${seal.description}`
      }
    }
  
    const getCorrectAnswerForSeal = (seal) => {
      return seal.answer
    }
  
    const generateVoidResponse = (seal) => {
      switch (seal.type) {
        case "riddle":
          return `𒀀 **The clay remembers...** Yes, the tablet - where all forbidden knowledge is carved. You understand the first truth. The reed writes, the fire bakes, the void preserves.
  
  **Void essence flows:** +${seal.reward.wisdom} and the "${seal.reward.artifact}" is yours.
  
  The symbols recognize you now. But this is only the beginning...`
  
        case "calculation":
          return `𒐕 **The numbers align...** ${seal.explanation} You see beyond the merchant's simple trade. The mathematics of reality bend to those who understand.
  
  **Void essence flows:** +${seal.reward.wisdom} and the "${seal.reward.artifact}" pulses with ancient power.
  
  The cosmic ledger is balanced. But greater calculations await...`
  
        case "knowledge":
          return `𒄑 **The hero's secret revealed...** The plant of eternal youth - stolen by the serpent that serves the void. Gilgamesh learned what you are learning: some knowledge comes with a price.
  
  **Void essence flows:** +${seal.reward.wisdom} and the "${seal.reward.artifact}" whispers forgotten truths.
  
  You walk the same path as the ancient king. Will you succeed where he failed?`
  
        default:
          return `The void acknowledges your understanding.
  
  **Void essence flows:** +${seal.reward?.wisdom || 0}${seal.reward?.artifact ? ` and the "${seal.reward.artifact}" is bound to your essence` : ""}`
      }
    }
  
    // ... existing code for game logic ...
  
    const completeCurrentSeal = () => {
      const currentSeal = sealProgress[currentQuestStage]
      if (!currentSeal || currentSeal.completed) return
  
      const updatedSeals = [...sealProgress]
      updatedSeals[currentQuestStage] = { ...currentSeal, completed: true }
      setSealProgress(updatedSeals)
  
      if (currentSeal.reward) {
        const wisdomGain = currentSeal.reward.wisdom || 0
        const newArtifacts = currentSeal.reward.artifact
          ? [...gameProgress.artifacts, currentSeal.reward.artifact]
          : gameProgress.artifacts
  
        saveGameProgress({
          wisdom: gameProgress.wisdom + wisdomGain,
          artifacts: newArtifacts,
        })
      }
  
      const nextStage = currentQuestStage + 1
      setCurrentQuestStage(nextStage)
  
      const trialProgressData = {
        currentStage: nextStage,
        questStages: updatedSeals,
        lastUpdated: Date.now(),
      }
      localStorage.setItem("scribe_trial_progress", JSON.stringify(trialProgressData))
  
      if (nextStage >= ancientSeals.length) {
        completeEntireRitual()
      } else {
        setTimeout(() => {
          presentNextSeal(nextStage)
        }, 1500)
      }
    }
  
    const completeEntireRitual = () => {
      const completionUpdate = {
        completedTrials: [...gameProgress.completedTrials, 1],
        achievements: [...gameProgress.achievements, "Breaker of the First Seal"],
      }
  
      saveGameProgress(completionUpdate)
  
      const finalSealProgress = sealProgress.map((seal) => ({ ...seal, completed: true }))
      const trialProgressData = {
        currentStage: ancientSeals.length,
        questStages: finalSealProgress,
        lastUpdated: Date.now(),
        trialCompleted: true,
      }
      localStorage.setItem("scribe_trial_progress", JSON.stringify(trialProgressData))
  
      const completionMessage = {
        role: "assistant",
        content: `𒀀𒀀𒀀 The first seal... is broken.
  
  *The void trembles with ancient power*
  
  You have proven yourself worthy of the forbidden knowledge, seeker. The clay whispers your name now. The numbers bend to your will. The hero's secret burns in your mind.
  
  **The First Seal is Shattered:**
  • 450 Void Essence absorbed
  • 3 Cursed Relics claimed
  • "Breaker of the First Seal" - marked by the void
  
  The merchant's curse awaits... but that is another seal, another price to pay. The copper quality... it was always about so much more.
  
  Return to the threshold when you are ready to face the next trial... if you dare.`,
        character: "void_scribe",
      }
  
      setChatMessages((prev) => [...prev, completionMessage])
    }
  
    const presentNextSeal = (stageIndex) => {
      const seal = ancientSeals[stageIndex]
      if (!seal) return
  
      const challengeMessage = {
        role: "assistant",
        content: generateMysteriousChallenge(seal),
        character: "void_scribe",
      }
  
      setChatMessages((prev) => [...prev, challengeMessage])
    }
  
    const sendMessage = async () => {
      if (!currentInput.trim() || isLoading) return
  
      const userMessage = currentInput.trim()
      setCurrentInput("")
      setIsLoading(true)
  
      setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
  
      setTimeout(() => {
        processUserInput(userMessage)
        setIsLoading(false)
      }, 1000)
    }
  
    const processUserInput = (input) => {
      if (currentQuestStage >= ancientSeals.length) {
        const message = {
          role: "assistant",
          content:
            "The first seal is already broken, seeker. The void has marked you. Return to the threshold to face the next trial... if you dare.",
          character: "void_scribe",
        }
        setChatMessages((prev) => [...prev, message])
        return
      }
  
      const currentSeal = ancientSeals[currentQuestStage]
  
      if (currentSeal.type === "dialog") {
        const introResponse = {
          role: "assistant",
          content: `The void stirs... your willingness to proceed has been noted. The ancient contracts are binding. Let the first trial begin...`,
          character: "void_scribe",
        }
        setChatMessages((prev) => [...prev, introResponse])
        completeCurrentSeal()
        return
      }
  
      const userAnswer = input.toLowerCase().trim()
      const correctAnswer = currentSeal.answer.toLowerCase()
      const alternatives = currentSeal.alternatives?.map((alt) => alt.toLowerCase()) || []
  
      if (userAnswer === correctAnswer || alternatives.includes(userAnswer)) {
        const successMessage = generateVoidResponse(currentSeal)
  
        const message = {
          role: "assistant",
          content: successMessage,
          character: "void_scribe",
        }
  
        setChatMessages((prev) => [...prev, message])
        setTimeout(() => completeCurrentSeal(), 1500)
      } else {
        const voidHints = [
          "The void whispers... but you do not yet understand its language...",
          "The ancient symbols resist your interpretation. Look deeper into the darkness...",
          "The clay remembers what you have forgotten. Think as the ancients thought...",
          "The void tests your resolve. The answer lies in the shadows between the symbols...",
        ]
  
        const randomHint = voidHints[Math.floor(Math.random() * voidHints.length)]
  
        const hintMessage = {
          role: "assistant",
          content: `${randomHint}
  
  The entity grows impatient. The copper merchants' contracts demand precision. Consider the ancient ways... what would those who carved the first tablets say?`,
          character: "void_scribe",
        }
  
        setChatMessages((prev) => [...prev, hintMessage])
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
  
    const goBack = () => {
      window.history.back()
    }
  
    const isRitualComplete = () => {
      return currentQuestStage >= ancientSeals.length
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
        }}
      >
        <Header showProgress={true} />
  
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-700/50 p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={goBack}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-stone-800 to-stone-900 text-amber-200 border border-amber-900/50 hover:from-stone-700 hover:to-stone-800 transition-all font-mono tracking-widest"
                style={{
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                RETURN TO THRESHOLD
              </button>
  
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-amber-900 to-stone-900 border border-amber-700/50 flex items-center justify-center text-3xl relative overflow-hidden"
                  style={{
                    boxShadow: "inset 0 0 10px rgba(168, 85, 247, 0.2), 0 0 20px rgba(0,0,0,0.8)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent animate-pulse"></div>
                  <span className="relative z-10">𒀀</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-amber-200 font-mono tracking-widest">𒀭𒈾𒁍 FIRST SEAL</h1>
                  <p className="text-stone-400 font-mono text-sm tracking-wider">THE ENTITY BETWEEN THE SYMBOLS</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-amber-400 font-mono text-sm tracking-widest">SEALS:</span>
                <div className="flex gap-2">
                  {ancientSeals.map((seal, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 border flex items-center justify-center text-lg transition-all duration-500 ${
                        index < currentQuestStage
                          ? "bg-gradient-to-br from-amber-600 to-amber-800 border-amber-500 text-amber-100 shadow-lg"
                          : index === currentQuestStage && !isRitualComplete()
                            ? "bg-gradient-to-br from-purple-800 to-purple-900 border-purple-600 text-purple-200 animate-pulse shadow-lg"
                            : "bg-stone-900 border-stone-700 text-stone-600"
                      }`}
                      style={{
                        boxShadow:
                          index <= currentQuestStage ? "0 0 15px rgba(168, 85, 247, 0.4)" : "0 0 5px rgba(0,0,0,0.5)",
                      }}
                    >
                      {index < currentQuestStage ? "𒀀" : index === currentQuestStage && !isRitualComplete() ? "𒈾" : "𒁍"}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {["𒀀", "𒈾", "𒁍", "𒈠"].map((symbol, i) => (
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
        </div>
  
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div
            className="bg-gradient-to-b from-stone-950 to-stone-900 border border-stone-700/50 relative overflow-hidden"
            style={{
              boxShadow: "inset 0 0 20px rgba(168, 85, 247, 0.1), 0 0 40px rgba(0,0,0,0.8)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent"></div>
  
            <div className="border-b border-stone-700/50 p-6 bg-gradient-to-r from-stone-950/50 to-stone-800/50 relative">
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
                    <h3 className="text-amber-200 font-bold text-lg tracking-widest">VOID SCRIBE</h3>
                    <p className="text-stone-400 font-mono text-sm tracking-wider">
                      ENTITY ◦ FIRST KEEPER ◦ CLAY REMEMBERS
                    </p>
                  </div>
                </div>
                <div className="ml-auto flex gap-4">
                  {["𒀭", "𒈾", "𒁍", "𒈠"].map((symbol, i) => (
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
              className="h-[32rem] overflow-y-auto p-6 bg-gradient-to-b from-stone-950/60 to-stone-900/60 relative"
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
                          : "bg-gradient-to-r from-purple-900/20 to-transparent"
                      }`}
                    ></div>
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-3 mb-3 border-b border-amber-800/50 pb-2 relative z-10">
                        <span className="text-2xl">𒀀</span>
                        <span className="text-xs font-bold text-amber-400 tracking-widest">VOID SCRIBE</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed relative z-10 tracking-wide whitespace-pre-line">
                      {message.content}
                    </p>
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
                      <span className="text-xs font-bold text-amber-400 tracking-widest">VOID SCRIBE</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 relative z-10">
                      <span className="animate-pulse tracking-wider">THE CLAY REMEMBERS</span>
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
  
            <div className="border-t border-stone-700/50 p-6 bg-gradient-to-r from-stone-950/50 to-stone-800/50 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
              {isRitualComplete() ? (
                <div className="text-center relative z-10">
                  <div
                    className="bg-gradient-to-r from-green-950 to-green-900 border border-green-700/50 p-6 font-mono mb-6 relative overflow-hidden"
                    style={{
                      boxShadow: "inset 0 0 20px rgba(0,100,0,0.2)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-transparent animate-pulse"></div>
                    <div className="text-green-200 font-bold tracking-widest relative z-10">
                      𒀀 FIRST SEAL BROKEN ◦ THE VOID ACKNOWLEDGES 𒀀
                    </div>
                  </div>
                  <button
                    onClick={goBack}
                    className="bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-amber-200 px-8 py-4 border border-amber-900/50 font-mono font-bold text-sm tracking-widest transition-all relative overflow-hidden group"
                    style={{
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">RETURN TO THRESHOLD</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 relative z-10">
                  <textarea
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="SPEAK TO THE VOID... THE CLAY REMEMBERS ALL"
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
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default ScribeTrial
  