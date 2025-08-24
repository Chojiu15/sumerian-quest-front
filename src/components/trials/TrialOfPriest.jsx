import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, CheckCircle, Star, Sparkles, Eye, Calendar, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const PriestTrial = () => {
    const navigate = useNavigate();
    const [gameProgress, setGameProgress] = useState({
        currentTrial: 1,
        wisdom: 0,
        artifacts: [],
        completedTrials: [],
        achievements: [],
        lastPlayed: null
    });

    const [chatMessages, setChatMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestStage, setCurrentQuestStage] = useState(0);
    const messagesEndRef = useRef(null);

    // Trial 3 Quest Structure - Spiritual Mysteries
    const questStages = [
        {
            id: 'introduction',
            title: 'Meet Nin-Inanna',
            description: 'Enter the sacred mysteries with the High Priestess',
            type: 'dialog',
            completed: false
        },
        {
            id: 'seven_gates_ritual',
            title: 'The Seven Sacred Gates',
            description: 'Navigate the ritual passage through the underworld gates',
            type: 'ritual',
            scenario: `You must guide a soul through the Seven Gates of the Underworld, following the path of Inanna herself. At each gate, something must be surrendered to continue.

THE SEVEN GATES AND THEIR GUARDIANS:
Gate 1: Guardian of Pride - Demands the Crown of Divine Authority
Gate 2: Guardian of Power - Demands the Rod of Justice  
Gate 3: Guardian of Beauty - Demands the Necklace of Lapis Lazuli
Gate 4: Guardian of Protection - Demands the Breastplate of Bronze
Gate 5: Guardian of Fertility - Demands the Ring of Life
Gate 6: Guardian of Wisdom - Demands the Measuring Rod of Truth
Gate 7: Guardian of Identity - Demands the Robe of Divinity

A merchant's soul stands before the gates, clinging to his gold, his reputation, and his earthly achievements. He refuses to surrender anything.

What must you, as priestess, teach him about the nature of spiritual passage?`,
            question: 'What is the sacred principle of the Seven Gates?',
            answer: 'surrender attachments',
            alternatives: ['surrender', 'let go', 'release attachments', 'abandon worldly things', 'give up possessions', 'spiritual detachment', 'renounce materialism', 'detachment from ego', 'release ego', 'surrender ego', 'abandon pride', 'let go of identity'],
            explanation: 'The Seven Gates teach that spiritual transformation requires progressively surrendering all earthly attachments - power, beauty, possessions, even identity itself. Only by releasing what we cling to can the soul be purified and reborn.',
            reward: { wisdom: 250, artifact: "Sacred Veil of Mysteries" },
            completed: false
        },
        {
            id: 'divine_omens',
            title: 'Reading the Divine Signs',
            description: 'Interpret the gods\' messages in natural phenomena',
            type: 'divination',
            scenario: `The city faces a critical decision about war with a neighboring kingdom. The king requests divine guidance, and the gods have sent signs that must be interpreted:

THE OMENS OBSERVED:
🌅 At dawn: A red sun rises, but is quickly covered by clouds
🦅 At midday: An eagle flies east carrying a snake, then drops it
🌙 At dusk: The moon appears early, pale and ringed with silver
🔥 In the temple: Sacred flames burn low and flicker blue
🌾 In the fields: Grain stalks bend toward the temple without wind
🐑 At the altar: A sacrificial lamb refuses to drink water

The generals urge immediate attack. The merchants fear economic ruin. The people are divided between war and peace.

What do the combined omens reveal about the gods\' will regarding this conflict?`,
            question: 'What is the divine message about war?',
            answer: 'delay brings victory',
            alternatives: ['wait', 'delay', 'patience', 'not now', 'wait for right time', 'timing is crucial', 'delayed victory', 'patient victory', 'victory through waiting', 'postpone', 'bide time', 'divine timing'],
            explanation: 'The signs counsel patience: the covered sun warns against hasty action, the dropped snake shows enemies will defeat themselves, the early moon suggests divine protection, and the bending grain indicates the gods favor the city. Victory comes to those who wait for the right moment.',
            reward: { wisdom: 300, artifact: "Crystal of Divine Sight" },
            completed: false
        },
        {
            id: 'sacred_calendar',
            title: 'The Sacred Calendar Crisis',
            description: 'Resolve a conflict between religious and agricultural timing',
            type: 'wisdom',
            scenario: `A crisis threatens the harmony of city and temple! The sacred calendar marks the Festival of Inanna in three days, but the farmers report the barley is not yet ready for the ritual harvest that must accompany the celebration.

THE CONFLICT:
🏛️ TEMPLE POSITION:
- The Festival of Inanna must occur on the appointed sacred day
- Moving religious festivals angers the gods and brings misfortune  
- The calendar has been followed for generations without change
- Priests have prepared for months and invited neighboring cities

🌾 FARMERS' POSITION:
- Harvesting unripe barley will ruin the year's crop
- The people will starve if the harvest is forced too early
- Weather has been unusual this year, delaying growth
- Better to eat than to appease gods with ruined grain

The king demands a solution that honors both divine law and practical needs. Both the High Priest and the Chief Farmer refuse to compromise.

How do you resolve this conflict between sacred duty and earthly survival?`,
            question: 'How do you balance divine law with human needs?',
            answer: 'spiritual harvest ritual',
            alternatives: ['symbolic harvest', 'ritual without harvest', 'spiritual ceremony', 'sacred symbols', 'ceremonial grain', 'token harvest', 'blessing the fields', 'future harvest blessing', 'promise ceremony', 'spiritual substitute', 'divine understanding'],
            explanation: 'Perform the Festival of Inanna with a symbolic spiritual harvest - use stored grain from previous years for the ritual while blessing the unharvested fields. This honors the gods with proper ceremony while protecting the people\'s livelihood. True divine wisdom accommodates both spiritual and earthly needs.',
            reward: { wisdom: 350, artifact: "Scroll of Sacred Wisdom" },
            completed: false
        }
    ];

    const [questProgress, setQuestProgress] = useState(questStages.map(stage => ({ ...stage })));

    useEffect(() => {
        loadGameProgress();
    }, []);

    useEffect(() => {
        if (gameProgress && questProgress.length > 0) {
            initializeChat();
        }
    }, [gameProgress]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const loadGameProgress = () => {
        const stored = localStorage.getItem('sumerian_quest_progress');
        if (stored) {
            try {
                const progress = JSON.parse(stored);
                setGameProgress(progress);
                
                const trialProgress = localStorage.getItem('priest_trial_progress');
                if (trialProgress) {
                    const parsedTrialProgress = JSON.parse(trialProgress);
                    setQuestProgress(parsedTrialProgress.questStages || questStages.map(stage => ({ ...stage })));
                    setCurrentQuestStage(parsedTrialProgress.currentStage || 0);
                } else if (progress.completedTrials.includes(3)) {
                    const completedQuests = questStages.map(stage => ({ ...stage, completed: true }));
                    setQuestProgress(completedQuests);
                    setCurrentQuestStage(questStages.length);
                } else {
                    setQuestProgress(questStages.map(stage => ({ ...stage })));
                }
            } catch (error) {
                console.error('Error loading progress:', error);
                resetProgress();
            }
        } else {
            setQuestProgress(questStages.map(stage => ({ ...stage })));
        }
    };

    const resetProgress = () => {
        const defaultProgress = {
            currentTrial: 1,
            wisdom: 0,
            artifacts: [],
            completedTrials: [],
            achievements: [],
            lastPlayed: null
        };
        setGameProgress(defaultProgress);
        localStorage.setItem('sumerian_quest_progress', JSON.stringify(defaultProgress));
    };

    const saveGameProgress = (updates) => {
        const newProgress = { ...gameProgress, ...updates, lastPlayed: Date.now() };
        setGameProgress(newProgress);
        localStorage.setItem('sumerian_quest_progress', JSON.stringify(newProgress));
        return newProgress;
    };

    const initializeChat = () => {
        setChatMessages([]);
        
        const messages = [];

        const welcomeMessage = {
            role: 'assistant',
            content: `The sacred flames flicker as you enter my presence, seeker. I am Nin-Inanna, High Priestess of the Temple of Inanna, keeper of the sacred mysteries and voice of the divine feminine.

You have proven yourself in the worldly arts - the scribe's knowledge and the merchant's cunning. But now you enter a realm beyond the physical, where symbols carry power and the invisible shapes all reality.

The goddess Inanna herself walked the path you now must follow. She descended through the Seven Gates of the Underworld, surrendering all earthly power to gain divine wisdom. She learned that true strength comes not from what we possess, but from what we understand.

Three sacred mysteries await your soul:

The Seven Gates Ritual - Navigate the spiritual passage that transforms the soul
The Divine Omens - Read the gods' messages in the language of nature  
The Sacred Calendar - Balance divine law with earthly wisdom

In this temple, young seeker, you will learn that the greatest power is not to command others, but to understand the divine forces that move through all things.

Are you prepared to surrender your certainties and embrace the sacred mysteries?`,
            character: 'nin-inanna'
        };
        messages.push(welcomeMessage);

        if (questProgress && questProgress.length > 0) {
            questProgress.forEach((stage, index) => {
                if (stage.completed) {
                    if (stage.type !== 'dialog') {
                        messages.push({
                            role: 'assistant',
                            content: generateChallengePresentation(stage),
                            character: 'nin-inanna'
                        });

                        messages.push({
                            role: 'user',
                            content: getCorrectAnswerForStage(stage)
                        });

                        messages.push({
                            role: 'assistant',
                            content: generateSuccessResponseForStage(stage),
                            character: 'nin-inanna'
                        });
                    }
                }
            });

            if (currentQuestStage < questStages.length && !questProgress[currentQuestStage]?.completed) {
                const currentStage = questStages[currentQuestStage];
                if (currentStage.type !== 'dialog') {
                    messages.push({
                        role: 'assistant',
                        content: generateChallengePresentation(currentStage),
                        character: 'nin-inanna'
                    });
                }
            }

            if (isTrialComplete()) {
                messages.push({
                    role: 'assistant',
                    content: `Sacred transformation complete, divine seeker.

You have walked the path of Inanna herself and emerged with the wisdom of the gods. Through the Seven Gates, you learned the power of surrender. Through divine omens, you gained the sight to read the gods' will. Through the sacred calendar, you found the balance between heaven and earth.

The goddess herself smiles upon your journey. You now possess the spiritual authority to guide others through the mysteries of existence.

**Trial Complete! You have earned:**
• 900 Total Wisdom Points
• 3 Sacred Artifacts of Divine Power
• "Voice of the Divine" Achievement
• Access to the next trial

The path leads now to Sin-leqi-unninni, Master Astronomer, who will teach you to read the language of the stars themselves. The divine mysteries you have learned here will serve you well in understanding the celestial patterns that govern all earthly affairs.

May the goddess light your path, sacred one.`,
                    character: 'nin-inanna'
                });
            }
        }

        setChatMessages(messages);
    };

    const generateChallengePresentation = (stage) => {
        switch (stage.type) {
            case 'ritual':
                return `**${stage.title}**

${stage.description}

${stage.scenario}

${stage.question}`;

            case 'divination':
                return `**${stage.title}**

${stage.description}

${stage.scenario}

${stage.question}`;

            case 'wisdom':
                return `**${stage.title}**

${stage.description}

${stage.scenario}

${stage.question}`;

            default:
                return `**${stage.title}** - ${stage.description}`;
        }
    };

    const getCorrectAnswerForStage = (stage) => {
        return stage.answer;
    };

    const generateSuccessResponseForStage = (stage) => {
        const baseResponses = {
            seven_gates_ritual: `The sacred truth flows through you! ${stage.explanation}

**Reward earned:** +${stage.reward.wisdom} Wisdom Points and the "${stage.reward.artifact}"

You understand that the journey through the gates is not about loss, but about liberation from the illusions that bind the soul. Now you must learn to read the divine messages that surround us always.`,
            
            divine_omens: `Your spiritual sight is awakening! ${stage.explanation}

**Reward earned:** +${stage.reward.wisdom} Wisdom Points and the "${stage.reward.artifact}"

The gods speak constantly to those who know how to listen. You have shown you can interpret their language. Now face the greatest challenge - balancing divine will with human needs.`,
            
            sacred_calendar: `Divine wisdom encompasses all understanding! ${stage.explanation}

**Reward earned:** +${stage.reward.wisdom} Wisdom Points and the "${stage.reward.artifact}"

You have learned that true spiritual authority serves both gods and people. This is the highest wisdom - to bridge the divine and earthly realms with compassion and understanding.`
        };
        
        return baseResponses[stage.id] || `The sacred mysteries reveal themselves to you.

**Reward earned:** +${stage.reward?.wisdom || 0} Wisdom Points${stage.reward?.artifact ? ` and the "${stage.reward.artifact}"` : ''}`;
    };

    const reaskCurrentQuestion = () => {
        if (currentQuestStage >= questStages.length || questProgress[currentQuestStage]?.completed) {
            return;
        }

        const currentStage = questStages[currentQuestStage];
        if (currentStage.type !== 'dialog') {
            const reaskMessage = {
                role: 'assistant',
                content: `Let the sacred flames illuminate the mystery before you:

${generateChallengePresentation(currentStage)}`,
                character: 'nin-inanna'
            };
            setChatMessages(prev => [...prev, reaskMessage]);
        }
    };

    const completeCurrentStage = () => {
        const currentStage = questProgress[currentQuestStage];
        if (!currentStage || currentStage.completed) return;

        const updatedQuests = [...questProgress];
        updatedQuests[currentQuestStage] = { ...currentStage, completed: true };
        setQuestProgress(updatedQuests);

        if (currentStage.reward) {
            const wisdomGain = currentStage.reward.wisdom || 0;
            const newArtifacts = currentStage.reward.artifact ? 
                [...gameProgress.artifacts, currentStage.reward.artifact] : 
                gameProgress.artifacts;

            saveGameProgress({
                wisdom: gameProgress.wisdom + wisdomGain,
                artifacts: newArtifacts
            });
        }

        const nextStage = currentQuestStage + 1;
        setCurrentQuestStage(nextStage);

        const trialProgressData = {
            currentStage: nextStage,
            questStages: updatedQuests,
            lastUpdated: Date.now()
        };
        localStorage.setItem('priest_trial_progress', JSON.stringify(trialProgressData));

        if (nextStage >= questStages.length) {
            completeEntireTrial();
        } else {
            setTimeout(() => {
                presentNextChallenge(nextStage);
            }, 1500);
        }
    };

    const completeEntireTrial = () => {
        const completionUpdate = {
            completedTrials: [...gameProgress.completedTrials, 3],
            achievements: [...gameProgress.achievements, "Voice of the Divine"]
        };

        saveGameProgress(completionUpdate);
        
        const finalQuestProgress = questProgress.map(stage => ({ ...stage, completed: true }));
        const trialProgressData = {
            currentStage: questStages.length,
            questStages: finalQuestProgress,
            lastUpdated: Date.now(),
            trialCompleted: true
        };
        localStorage.setItem('priest_trial_progress', JSON.stringify(trialProgressData));

        const completionMessage = {
            role: 'assistant',
            content: `Sacred transformation complete, divine seeker.

You have walked the path of Inanna herself and emerged with the wisdom of the gods. Through the Seven Gates, you learned the power of surrender. Through divine omens, you gained the sight to read the gods' will. Through the sacred calendar, you found the balance between heaven and earth.

The goddess herself smiles upon your journey. You now possess the spiritual authority to guide others through the mysteries of existence.

**Trial Complete! You have earned:**
• 900 Total Wisdom Points
• 3 Sacred Artifacts of Divine Power
• "Voice of the Divine" Achievement
• Access to the next trial

The path leads now to Sin-leqi-unninni, Master Astronomer, who will teach you to read the language of the stars themselves. The divine mysteries you have learned here will serve you well in understanding the celestial patterns that govern all earthly affairs.

May the goddess light your path, sacred one.`,
            character: 'nin-inanna'
        };

        setChatMessages(prev => [...prev, completionMessage]);
    };

    const presentNextChallenge = (stageIndex) => {
        const stage = questStages[stageIndex];
        if (!stage) return;

        const challengeMessage = {
            role: 'assistant',
            content: generateChallengePresentation(stage),
            character: 'nin-inanna'
        };

        setChatMessages(prev => [...prev, challengeMessage]);
    };

    const sendMessage = async () => {
        if (!currentInput.trim() || isLoading) return;

        const userMessage = currentInput.trim();
        setCurrentInput('');
        setIsLoading(true);

        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        setTimeout(() => {
            processUserInput(userMessage);
            setIsLoading(false);
        }, 1000);
    };

    const processUserInput = (input) => {
        if (currentQuestStage >= questStages.length) {
            const message = {
                role: 'assistant',
                content: "Your sacred journey through the mysteries is complete. Return to the main hall to continue your path toward divine kingship.",
                character: 'nin-inanna'
            };
            setChatMessages(prev => [...prev, message]);
            return;
        }

        const currentStage = questStages[currentQuestStage];

        if (currentStage.type === 'dialog') {
            const introResponse = {
                role: 'assistant',
                content: `Your willingness to embrace the unknown shows wisdom beyond your years. Let us begin with the first sacred mystery...`,
                character: 'nin-inanna'
            };
            setChatMessages(prev => [...prev, introResponse]);
            completeCurrentStage();
            return;
        }

        const userAnswer = input.toLowerCase().trim();
        const correctAnswer = currentStage.answer.toLowerCase();
        const alternatives = currentStage.alternatives?.map(alt => alt.toLowerCase()) || [];

        if (userAnswer === correctAnswer || alternatives.some(alt => userAnswer.includes(alt))) {
            let successMessage = generateSuccessResponseForStage(currentStage);

            const message = {
                role: 'assistant',
                content: successMessage,
                character: 'nin-inanna'
            };

            setChatMessages(prev => [...prev, message]);
            setTimeout(() => completeCurrentStage(), 1500);

        } else {
            const hints = {
                seven_gates_ritual: `The merchant clings to what he believes defines him, but the gates demand something deeper. Consider what Inanna herself had to release to gain true power. The path of spiritual transformation requires releasing what we think we need most.`,
                
                divine_omens: `Look more carefully at the patterns, seeker. The sun hidden suggests waiting, the eagle dropping its burden shows enemies defeating themselves, the early moon indicates divine protection. What do these signs counsel about the timing of action?`,
                
                sacred_calendar: `Both the temple and the farmers speak truth, but divine wisdom finds a third path. Consider how the goddess might honor both spiritual duty and earthly need. What ritual would please the gods while protecting the people?`
            };

            const hintMessage = {
                role: 'assistant',
                content: hints[currentStage.id] || "The sacred mysteries require deeper contemplation, seeker. Look beyond the surface to find the divine truth.",
                character: 'nin-inanna'
            };

            setChatMessages(prev => [...prev, hintMessage]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const goBack = () => {
        navigate('/');
    };

    const getCompletedStagesCount = () => {
        return questProgress.filter(stage => stage.completed).length;
    };

    const isTrialComplete = () => {
        return currentQuestStage >= questStages.length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900">
            <Header gameProgress={gameProgress} showProgress={true} />
            
            <div className="max-w-6xl mx-auto px-6 pt-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 px-4 py-2 bg-black/40 text-purple-300 rounded-lg hover:bg-black/60 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Main Hall
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-2xl">
                            🌟
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-purple-100">Trial of the Priest</h1>
                            <p className="text-purple-300/80">Embrace the Sacred Mysteries with Nin-Inanna</p>
                        </div>
                    </div>
                </div>
                <div className="mb-6 bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-purple-300 font-semibold">Sacred Progress</span>
                        <span className="text-purple-300 text-sm">{getCompletedStagesCount()}/{questStages.length} Mysteries</span>
                    </div>
                    
                    <div className="w-full bg-purple-900/30 rounded-full h-3 mb-4">
                        <div 
                            className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(getCompletedStagesCount() / questStages.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {questStages.map((stage, index) => {
                            const isCompleted = questProgress[index]?.completed || false;
                            const isCurrent = currentQuestStage === index && !isCompleted;
                            const icon = stage.type === 'ritual' ? Sparkles : 
                                        stage.type === 'divination' ? Eye :
                                        stage.type === 'wisdom' ? Calendar : Star;
                            const IconComponent = icon;
                            
                            return (
                                <div
                                    key={stage.id}
                                    className={`p-3 rounded-lg border text-center ${
                                        isCompleted 
                                            ? 'bg-purple-900/30 border-purple-500/50 text-purple-300'
                                            : isCurrent
                                                ? 'bg-purple-900/30 border-purple-500/50 text-purple-300'
                                                : 'bg-gray-900/30 border-gray-600/50 text-gray-400'
                                    }`}
                                >
                                    <IconComponent className="w-6 h-6 mx-auto mb-2" />
                                    <div className="font-semibold text-sm">{stage.title}</div>
                                    <div className="text-xs opacity-80 mt-1">{stage.description}</div>
                                    <div className="mt-2">
                                        {isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-purple-400 mx-auto" />
                                        ) : isCurrent ? (
                                            <Star className="w-5 h-5 text-purple-400 mx-auto animate-pulse" />
                                        ) : (
                                            <div className="w-5 h-5 border-2 border-gray-500 rounded-full mx-auto"></div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
                
            <div className="max-w-6xl mx-auto px-6 pb-6">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg shadow-2xl border border-purple-500/30">
                    <div className="border-b border-purple-500/30 p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-2xl">
                                🌟
                            </div>
                            <div>
                                <h3 className="text-purple-100 font-bold">Priestess Nin-Inanna</h3>
                                <p className="text-purple-300/80 text-sm">High Priestess • Sacred Temple • Keeper of Divine Mysteries</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                {['🌙', '⭐', '🔮'].map((symbol, i) => (
                                    <span key={i} className="text-purple-400 text-lg opacity-60">{symbol}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-96 overflow-y-auto p-6 space-y-4">
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-lg px-4 py-3 rounded-lg ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-purple-100/90 text-purple-900 rounded-bl-none border border-purple-300'
                                }`}>
                                    {message.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">🌟</span>
                                            <span className="text-xs font-semibold text-purple-700">Nin-Inanna</span>
                                        </div>
                                    )}
                                    <div className="text-sm leading-relaxed whitespace-pre-line">
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-purple-100/90 border border-purple-300 rounded-lg rounded-bl-none px-4 py-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🌟</span>
                                        <span className="text-xs font-semibold text-purple-700">Nin-Inanna</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-purple-500/30 p-4">
                        {isTrialComplete() ? (
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-purple-400 font-semibold mb-3">
                                    <Trophy className="w-5 h-5" />
                                    Sacred Mysteries Mastered!
                                </div>
                                <button
                                    onClick={goBack}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                                >
                                    Return to Main Hall
                                </button>
                            </div>
                        ) : (
                            <div>
                                {currentQuestStage < questStages.length && !questProgress[currentQuestStage]?.completed && currentQuestStage > 0 && (
                                    <div className="mb-