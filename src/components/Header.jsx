"use client"

import React, { useState, useEffect } from "react"
import { Eye, Flame } from "lucide-react"

const Header = ({ showProgress = true }) => {
  const [gameProgress, setGameProgress] = useState({
    wisdom: 0,
    completedTrials: [],
    artifacts: [],
  })

  useEffect(() => {
    const loadProgress = () => {
      try {
        const stored = localStorage.getItem("sumerian_quest_progress")
        if (stored) {
          const progress = JSON.parse(stored)
          setGameProgress(progress)
        }
      } catch (error) {
        console.error("Error loading progress:", error)
      }
    }

    loadProgress()

    // Listen for storage changes to update progress in real-time
    const handleStorageChange = () => {
      loadProgress()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events when progress updates
    window.addEventListener("progressUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("progressUpdated", handleStorageChange)
    }
  }, [])

  return (
    <header className="bg-gradient-to-r from-black via-stone-950 to-black border-b border-stone-800/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 bg-gradient-to-br from-stone-800 to-stone-900 border border-amber-700/50 flex items-center justify-center text-3xl relative overflow-hidden"
                style={{
                  boxShadow: "inset 0 0 15px rgba(168, 85, 247, 0.2), 0 0 25px rgba(0,0,0,0.8)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent animate-pulse"></div>
                <span className="relative z-10">𒀀</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-amber-200 font-mono tracking-widest">𒀀𒆠 VOID INTERFACE 𒀀𒆠</h1>
                <p className="text-stone-400 font-mono text-sm tracking-wider">
                  ⟨ ANCIENT PROTOCOLS ◦ FORBIDDEN TRANSMISSIONS ⟩
                </p>
              </div>
            </div>
          </div>

          {showProgress && (
            <div className="flex items-center gap-6">
              <div
                className="bg-gradient-to-r from-stone-900 to-stone-800 border border-amber-900/50 px-6 py-3 relative overflow-hidden"
                style={{
                  boxShadow: "inset 0 0 10px rgba(168, 85, 247, 0.1), 0 0 20px rgba(0,0,0,0.8)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <Eye className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-amber-300 font-mono text-xs tracking-widest">VOID ESSENCE</div>
                    <div className="text-amber-200 font-mono font-bold text-lg">{gameProgress?.wisdom || 0}</div>
                  </div>
                </div>
              </div>

              <div
                className="bg-gradient-to-r from-stone-900 to-stone-800 border border-amber-900/50 px-6 py-3 relative overflow-hidden"
                style={{
                  boxShadow: "inset 0 0 10px rgba(168, 85, 247, 0.1), 0 0 20px rgba(0,0,0,0.8)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-amber-300 font-mono text-xs tracking-widest">SEALS BROKEN</div>
                    <div className="text-amber-200 font-mono font-bold text-lg">
                      {gameProgress?.completedTrials?.length || 0}/7
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
