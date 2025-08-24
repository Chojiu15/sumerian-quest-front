"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send, ArrowLeft } from "lucide-react"
import Header from "../Header"

const MerchantTrial = () => {
  const [gameProgress, setGameProgress] = useState({
    currentTrial: 2,
    wisdom: 450,
    artifacts: ["Cursed Stylus of the Void", "Stone of Forbidden Numbers", "Fragment of the Void Tablet"],
    completedTrials: [1],
    achievements: ["Breaker of the First Seal"],
    lastPlayed: null,
  })

  const [chatMessages, setChatMessages] = useState([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestStage, setCurrentQuestStage] = useState(0)
  const messagesEndRef = useRef(null)

  const merchantCurses = [
    {
      id: "awakening",
      name: "The Copper Merchant Stirs",
      description: "Ea-nasir's spirit awakens from eternal contracts",
      type: "dialog",
      completed: false,
    },
    {
      id: "copper_conspiracy",
      name: "𒋾𒀀 The Quality Deception",
      description: "Uncover the truth behind the eternal copper curse",
      type: "investigation",
      scenario: `The merchant's ghost whispers of ancient betrayal:

"Listen well, seeker... A wealthy customer, Nanni, sent this curse upon me:

'Ea-nasir, you have dishonored me! The copper you sold me is inferior - it contains too much tin and is not pure as promised. I paid good silver for Meluhha copper, but this is clearly adulterated!'

The copper tested at 85% purity (15% tin content). Pure Meluhha copper is 99% pure when mined. Someone in my supply chain was stealing my reputation... and my soul.

WHO cursed my copper with inferior metal?"`,
      question: "Who adulterates the copper and binds the curse?",
      answer: "river barge operator",
      alternatives: [
        "barge operator",
        "river transport",
        "the barge captain",
        "river captain",
        "transport on the river",
        "river transportation",
        "during transport",
        "in transport",
        "while transporting",
        "river journey",
        "on the river",
        "river route",
        "transport route",
        "shipping route",
        "during shipping",
      ],
      explanation:
        "The river barge operator mixed inferior local copper with pure Meluhha copper during transport, binding my soul to eternal debt.",
      reward: { wisdom: 200, artifact: "Scales of Cosmic Justice" },
      completed: false,
    },
    {
      id: "profit_paths",
      name: "𒌓𒁺 The Route of Endless Greed",
      description: "Navigate the cursed trade routes of maximum profit",
      type: "optimization",
      scenario: `The merchant's curse compels eternal trading:

"100 silver shekels burn in my ghostly hands. I am doomed to trade forever, seeking the perfect profit that will free my soul.

THE CURSED CITIES:
🏺 UR (My Eternal Prison):
- Buys: Lapis Lazuli (3 silver/unit), Pearls (2 silver/unit)  
- Sells: Silver (1 silver/unit)

🌊 DILMUN (Island of Sorrows):
- Buys: Silver (2 silver/unit)
- Sells: Pearls (1 silver/unit), Cedar Wood (4 silver/unit)

🏔️ MELUHHA (Mountain of Betrayal):  
- Buys: Cedar Wood (6 silver/unit), Pearls (2 silver/unit)
- Sells: Lapis Lazuli (1 silver/unit), Copper (2 silver/unit)

What trading sequence will break my curse and maximize the profit that binds my soul?"`,
      question: "What path breaks the merchant's eternal curse?",
      answer: "buy lapis in meluhha sell in ur",
      alternatives: [
        "lapis lazuli from meluhha to ur",
        "meluhha lapis to ur",
        "buy lapis meluhha sell ur",
        "lapis from meluhha",
        "meluhha to ur lapis",
        "buy lapis lazuli meluhha",
        "lapis lazuli meluhha ur",
        "meluhha lapis lazuli",
        "buy from meluhha sell in ur",
        "lapis lazuli route meluhha ur",
        "purchase lapis lazuli from meluhha",
        "get lapis lazuli from meluhha",
        "lapis lazuli trade meluhha ur",
        "meluhha lapis lazuli ur",
        "buy lapis lazuli in meluhha sell in ur",
        "lapis lazuli trade meluhha ur",
      ],
      explanation:
        "Buy Lapis Lazuli in Meluhha (1 silver) → Sell in Ur (3 silver) = 200% profit. The curse demands maximum greed.",
      reward: { wisdom: 250, artifact: "Map of Cursed Routes" },
      completed: false,
    },
    {
      id: "embargo_curse",
      name: "𒀭𒈾 The Diplomatic Binding",
      description: "Break the trade embargo that traps souls in eternal conflict",
      type: "diplomacy",
      scenario: `The merchant's greatest curse - eternal conflict:

"The embargo that destroyed my final days still binds the trade routes. The King of Dilmun's rage echoes through eternity:

🏛️ DILMUN'S ETERNAL WRATH:
- Claims Ur fishermen steal from sacred waters
- Demands exclusive fishing rights in the disputed realm
- Threatens to block all trade until the end of time

🏺 UR'S ENDLESS PRIDE:
- The fishing waters have been shared since the first kings
- Ur's people starve without the sacred fish
- Cannot accept total banishment from ancestral waters

The embargo binds both kingdoms in eternal suffering. Both rulers' pride traps their souls in the void. Find the solution that breaks this cosmic deadlock and frees the trade routes from their curse."`,
      question: "What compromise shatters the eternal embargo curse?",
      answer: "seasonal fishing rights",
      alternatives: [
        "seasonal fishing",
        "seasonal access",
        "shared seasons",
        "alternating seasons",
        "fishing seasons",
        "take turns fishing",
        "rotate fishing rights",
        "fishing schedule",
        "timed access",
        "fishing calendar",
        "seasonal sharing",
        "fishing rotation",
        "divide fishing areas",
        "separate zones",
        "fishing boundaries",
        "territorial division",
        "shared waters",
        "split the waters",
        "fishing territories",
        "boundary agreement",
        "water borders",
        "designated areas",
        "fishing zones",
        "alternating access",
        "turn based fishing",
        "share the waters",
      ],
      explanation:
        "Seasonal fishing rights break the curse: Dilmun gets spawning season (protecting the sacred cycle), Ur gets other seasons (feeding their people). Both souls find peace.",
      reward: { wisdom: 300, artifact: "Tablet of Eternal Contracts" },
      completed: false,
    },
  ]

  const [curseProgress, setCurseProgress] = useState(merchantCurses.map((curse) => ({ ...curse })))

  useEffect(() => {
    loadGameProgress()
  }, [])

  useEffect(() => {
    if (gameProgress && curseProgress.length > 0) {
      initializeChat()
    }
  }, [gameProgress])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const loadGameProgress = () => {
    setCurseProgress(merchantCurses.map((curse) => ({ ...curse })))
  }

  const saveGameProgress = (updates) => {
    const newProgress = { ...gameProgress, ...updates, lastPlayed: Date.now() }
    setGameProgress(newProgress)
    return newProgress
  }

  const initializeChat = () => {
    setChatMessages([])

    const messages = []

    const welcomeMessage = {
      role: "assistant",
      content: `𒋾𒀀𒀀𒀀 You... you have broken the first seal. The void trembles with your progress.

I am what remains of Ea-nasir... the copper merchant whose name became a curse. My soul is bound to eternal contracts, trapped between the cuneiform marks of customer complaints and broken promises.

The copper quality... it was never about the copper. It was about the cosmic debt that binds all merchants to the void. Every transaction, every betrayal, every broken promise - they accumulate like interest on a loan that can never be repaid.

You seek to break the second seal? To understand the merchant's curse that traps souls in endless greed?

Three curses bind my spirit to this realm:
• **𒋾𒀀 The Quality Deception** - Who poisoned my copper and my soul?
• **𒌓𒁺 The Route of Endless Greed** - The trading path that damns merchants
• **𒀭𒈾 The Diplomatic Binding** - The embargo that traps kingdoms in eternal conflict

The void watches through my hollow eyes. The ancient contracts demand payment. Are you prepared to face the merchant's curse, seeker?

𒈠𒉌𒉌 The copper remembers... the debt grows... 𒈠𒉌𒉌`,
      character: "cursed_merchant",
    }
    messages.push(welcomeMessage)

    setChatMessages(messages)
  }

  const generateCursedChallenge = (curse) => {
    switch (curse.type) {
      case "investigation":
        return `𒋾𒀀 **${curse.name}**

*The merchant's ghost materializes, copper coins falling from skeletal fingers*

"${curse.scenario}"

The curse runs deeper than metal and silver. Who bound my soul to this eternal debt?`

      case "optimization":
        return `𒌓𒁺 **${curse.name}**

*Ghostly trade routes shimmer in the void, marked with blood and silver*

"${curse.scenario}"

Show me the path that breaks the curse of endless greed, seeker.`

      case "diplomacy":
        return `𒀭𒈾 **${curse.name}**

*The spirits of two kingdoms clash in eternal conflict*

"${curse.scenario}"

What solution will shatter the diplomatic curse and free the trade routes from eternal suffering?`

      default:
        return `**${curse.name}** - ${curse.description}`
    }
  }

  const generateCursedResponse = (curse) => {
    switch (curse.type) {
      case "investigation":
        return `𒋾 **The curse is revealed!** Yes, the river barge operator - the one who mixed my pure copper with inferior metal, binding my soul to eternal debt! ${curse.explanation}

**Void essence flows:** +${curse.reward.wisdom} and the "${curse.reward.artifact}" materializes from the merchant's curse.

The cosmic ledger is balanced... but greater curses await.`

      case "optimization":
        return `𒌓 **The greed path is clear!** ${curse.explanation} You understand the merchant's curse - maximum profit at any cost!

**Void essence flows:** +${curse.reward.wisdom} and the "${curse.reward.artifact}" burns with eternal greed.

The trading routes bend to your will... but the final curse remains.`

      case "diplomacy":
        return `𒀭 **The diplomatic curse shatters!** ${curse.explanation} You have found the solution that frees both kingdoms from eternal conflict!

**Void essence flows:** +${curse.reward.wisdom} and the "${curse.reward.artifact}" seals the cosmic agreement.

The merchant's curse weakens... you have proven worthy of the void's secrets.`

      default:
        return `The cursed merchant acknowledges your understanding.

**Void essence flows:** +${curse.reward?.wisdom || 0}${curse.reward?.artifact ? ` and the "${curse.reward.artifact}" is bound to your essence` : ""}`
    }
  }

  // ... existing game logic methods ...

  const completeCurrentCurse = () => {
    const currentCurse = curseProgress[currentQuestStage]
    if (!currentCurse || currentCurse.completed) return

    const updatedCurses = [...curseProgress]
    updatedCurses[currentQuestStage] = { ...currentCurse, completed: true }
    setCurseProgress(updatedCurses)

    if (currentCurse.reward) {
      const wisdomGain = currentCurse.reward.wisdom || 0
      const newArtifacts = currentCurse.reward.artifact
        ? [...gameProgress.artifacts, currentCurse.reward.artifact]
        : gameProgress.artifacts

      saveGameProgress({
        wisdom: gameProgress.wisdom + wisdomGain,
        artifacts: newArtifacts,
      })
    }

    const nextStage = currentQuestStage + 1
    setCurrentQuestStage(nextStage)

    if (nextStage >= merchantCurses.length) {
      completeEntireCurse()
    } else {
      setTimeout(() => {
        presentNextCurse(nextStage)
      }, 1500)
    }
  }

  const completeEntireCurse = () => {
    const completionUpdate = {
      completedTrials: [...gameProgress.completedTrials, 2],
      achievements: [...gameProgress.achievements, "Breaker of the Merchant's Curse"],
    }

    saveGameProgress(completionUpdate)

    const completionMessage = {
      role: "assistant",
      content: `𒋾𒀀𒀀𒀀 The second seal... crumbles to dust.

*Ea-nasir's ghost begins to fade, copper coins dissolving into void essence*

You have broken the merchant's eternal curse, seeker. The copper quality was revealed, the greed path mastered, the diplomatic binding shattered. My soul is finally free from the cosmic debt that bound me to this realm.

**The Second Seal is Broken:**
• 750 Total Void Essence absorbed
• 6 Cursed Relics claimed  
• "Breaker of the Merchant's Curse" - the void marks your progress

The priestess awaits... but her curse runs deeper than mine. She who speaks with the void demands the ultimate sacrifice. The copper was nothing compared to what she will ask of you.

Return to the threshold when you are ready to face the final seal. The void grows stronger with each broken binding.

𒈠𒉌𒉌 The ancient contracts are nearly complete... 𒈠𒉌𒉌`,
      character: "cursed_merchant",
    }

    setChatMessages((prev) => [...prev, completionMessage])
  }

  const presentNextCurse = (stageIndex) => {
    const curse = merchantCurses[stageIndex]
    if (!curse) return

    const challengeMessage = {
      role: "assistant",
      content: generateCursedChallenge(curse),
      character: "cursed_merchant",
    }

    setChatMessages((prev) => [...prev, challengeMessage])
  }

  const processUserInput = (input) => {
    if (currentQuestStage >= merchantCurses.length) {
      const message = {
        role: "assistant",
        content:
          "The merchant's curse is broken, seeker. My soul is free. Return to the threshold to face the final seal... if you dare.",
        character: "cursed_merchant",
      }
      setChatMessages((prev) => [...prev, message])
      return
    }

    const currentCurse = merchantCurses[currentQuestStage]

    if (currentCurse.type === "dialog") {
      const introResponse = {
        role: "assistant",
        content: `The merchant's ghost nods... your willingness to face the curse has been noted. The cosmic debt demands payment. Let the trials begin...`,
        character: "cursed_merchant",
      }
      setChatMessages((prev) => [...prev, introResponse])
      completeCurrentCurse()
      return
    }

    const userAnswer = input.toLowerCase().trim()
    const correctAnswer = currentCurse.answer.toLowerCase()
    const alternatives = currentCurse.alternatives?.map((alt) => alt.toLowerCase()) || []

    if (userAnswer === correctAnswer || alternatives.some((alt) => userAnswer.includes(alt))) {
      const successMessage = generateCursedResponse(currentCurse)

      const message = {
        role: "assistant",
        content: successMessage,
        character: "cursed_merchant",
      }

      setChatMessages((prev) => [...prev, message])
      setTimeout(() => completeCurrentCurse(), 1500)
    } else {
      const cursedHints = {
        copper_conspiracy: `The copper coins rattle... "${input}" does not break the curse, seeker. Think about the journey from pure Meluhha copper to adulterated metal. Who handles the precious cargo during its cursed voyage? The 15% tin content whispers of deliberate betrayal...`,

        profit_paths: `The ghostly ledger burns... "${input}" will not maximize the cursed profit. Calculate the margins that bind souls to greed! What can you buy for 1 silver and sell for 3 silver? That 200% profit is the path that damns merchants to eternal trading...`,

        embargo_curse: `The kingdoms' spirits wail... "${input}" will not break the diplomatic curse. Think about what each realm truly needs - Dilmun seeks to protect their sacred waters, Ur needs to feed their people. The solution lies in the cosmic timing that governs all things...`,
      }

      const hintMessage = {
        role: "assistant",
        content:
          cursedHints[currentCurse.id] ||
          "The merchant's curse resists your answer, seeker. Think deeper about the cosmic forces that bind souls to eternal debt.",
        character: "cursed_merchant",
      }

      setChatMessages((prev) => [...prev, hintMessage])
    }
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

  const isCurseComplete = () => {
    return currentQuestStage >= merchantCurses.length
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
                <span className="relative z-10">𒋾</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-amber-200 font-mono tracking-widest">𒂍𒀀𒈾𒊓𒅕 SECOND SEAL</h1>
                <p className="text-stone-400 font-mono text-sm tracking-wider">THE MERCHANT'S ETERNAL CURSE</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-mono text-sm tracking-widest">CURSES:</span>
              <div className="flex gap-2">
                {merchantCurses.map((curse, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 border flex items-center justify-center text-lg transition-all duration-500 ${
                      index < currentQuestStage
                        ? "bg-gradient-to-br from-amber-600 to-amber-800 border-amber-500 text-amber-100 shadow-lg"
                        : index === currentQuestStage && !isCurseComplete()
                          ? "bg-gradient-to-br from-purple-800 to-purple-900 border-purple-600 text-purple-200 animate-pulse shadow-lg"
                          : "bg-stone-900 border-stone-700 text-stone-600"
                    }`}
                    style={{
                      boxShadow:
                        index <= currentQuestStage ? "0 0 15px rgba(168, 85, 247, 0.4)" : "0 0 5px rgba(0,0,0,0.5)",
                    }}
                  >
                    {index < currentQuestStage ? "𒋾" : index === currentQuestStage && !isCurseComplete() ? "𒀀" : "𒈾"}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {["𒋾", "𒀀", "𒈾", "𒊓"].map((symbol, i) => (
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
                  <span className="relative z-10">𒋾</span>
                </div>
                <div>
                  <h3 className="text-amber-200 font-bold text-lg tracking-widest">CURSED MERCHANT</h3>
                  <p className="text-stone-400 font-mono text-sm tracking-wider">
                    EA-NASIR'S GHOST ◦ COPPER DEBT ◦ ETERNAL CONTRACTS
                  </p>
                </div>
              </div>
              <div className="ml-auto flex gap-4">
                {["𒋾", "𒀀", "𒈾", "𒊓"].map((symbol, i) => (
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
                      <span className="text-2xl">𒋾</span>
                      <span className="text-xs font-bold text-amber-400 tracking-widest">CURSED MERCHANT</span>
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
                    <span className="text-2xl animate-pulse">𒋾</span>
                    <span className="text-xs font-bold text-amber-400 tracking-widest">CURSED MERCHANT</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 relative z-10">
                    <span className="animate-pulse tracking-wider">THE COPPER REMEMBERS</span>
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
            {isCurseComplete() ? (
              <div className="text-center relative z-10">
                <div
                  className="bg-gradient-to-r from-green-950 to-green-900 border border-green-700/50 p-6 font-mono mb-6 relative overflow-hidden"
                  style={{
                    boxShadow: "inset 0 0 20px rgba(0,100,0,0.2)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-transparent animate-pulse"></div>
                  <div className="text-green-200 font-bold tracking-widest relative z-10">
                    𒋾 SECOND SEAL BROKEN ◦ THE MERCHANT'S CURSE IS LIFTED 𒋾
                  </div>
                </div>
                <button
                  onClick={goBack}
                  className="bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-amber-200 px-8 py-4 border border-amber-900/50 font-mono font-bold tracking-widest transition-all relative overflow-hidden group"
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
                  placeholder="SPEAK TO THE CURSED MERCHANT... THE COPPER DEBT AWAITS"
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

export default MerchantTrial
