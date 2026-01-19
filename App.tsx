
import React, { useState, useEffect, useMemo } from 'react';
import { ASPEKTE_CHAPTERS, B1_GRAMMAR, B2_GRAMMAR } from './constants';
import { Lesson, AppState, HomeworkSubmission, CustomWord, HomeworkTask } from './types';
import { generateLessonContent, gradeHomework, playTextToSpeech, translateWordAndGetGrammar, stopAudio } from './geminiService';

const GrammarLibrary: React.FC<{ title: string; rules: typeof B1_GRAMMAR }> = ({ title, rules }) => (
  <div className="animate-in fade-in duration-500">
    <header className="mb-12">
      <h2 className="text-5xl font-black mb-4 text-slate-800 tracking-tighter leading-none">{title}</h2>
      <p className="text-xl text-slate-500 font-medium italic border-l-4 border-blue-500 pl-4 py-1">Klarheit durch Struktur: Erklärungen & Beispiele</p>
    </header>
    <div className="grid grid-cols-1 gap-10">
      {rules.map((rule, i) => (
        <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="bg-slate-50 p-8 border-b border-slate-100">
             <div className="flex items-center gap-4 mb-3">
               <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">{i + 1}</span>
               <h3 className="text-3xl font-black text-slate-800">{rule.title}</h3>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-blue-100 text-slate-700 leading-relaxed text-lg shadow-inner">
               <span className="block text-xs font-black text-blue-500 uppercase tracking-widest mb-2">Erklärung</span>
               {rule.explanation}
             </div>
          </div>
          <div className="p-8 bg-white">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <span className="w-4 h-[2px] bg-slate-200"></span>
               Beispiele aus dem Lehrwerk
               <span className="w-4 h-[2px] bg-slate-200"></span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rule.examples.map((ex, j) => (
                <div key={j} className="flex items-start gap-4 text-slate-700 italic bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all group">
                  <div className="mt-1 w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">✓</div>
                  <span className="text-lg font-medium">"{ex}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('aspekte_app_state');
    if (saved) return JSON.parse(saved);
    return {
      completedLessons: [],
      homeworkSubmissions: {},
      currentLessonId: ASPEKTE_CHAPTERS[0].id,
      lessonCache: {},
      customVocabulary: [],
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'reading' | 'vocabulary' | 'grammar' | 'listening' | 'homework'>('reading');
  const [mode, setMode] = useState<'lesson' | 'grammar-b1' | 'grammar-b2' | 'my-vocab'>('lesson');
  const [homeworkText, setHomeworkText] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    localStorage.setItem('aspekte_app_state', JSON.stringify(state));
  }, [state]);

  const currentLesson = state.currentLessonId ? state.lessonCache[state.currentLessonId] : null;

  useEffect(() => {
    const loadLesson = async () => {
      if (!state.currentLessonId || state.lessonCache[state.currentLessonId]) return;
      setIsLoading(true);
      const chapter = ASPEKTE_CHAPTERS.find(c => c.id === state.currentLessonId);
      if (chapter) {
        const lesson = await generateLessonContent(chapter.id, chapter.title, chapter.topic);
        setState(prev => ({
          ...prev,
          lessonCache: { ...prev.lessonCache, [chapter.id]: lesson }
        }));
      }
      setIsLoading(false);
    };
    if (mode === 'lesson') loadLesson();
  }, [state.currentLessonId, state.lessonCache, mode]);

  const handleGradeHomework = async () => {
    const writingTask = currentLesson?.content.homeworkTasks.find(t => t.type === 'writing');
    if (!state.currentLessonId || !currentLesson || !homeworkText.trim() || !writingTask) return;
    setIsGrading(true);
    try {
      const feedback = await gradeHomework(writingTask.instruction, homeworkText);
      const submission: HomeworkSubmission = {
        lessonId: state.currentLessonId,
        userText: homeworkText,
        timestamp: Date.now(),
        feedback
      };
      setState(prev => ({
        ...prev,
        homeworkSubmissions: { ...prev.homeworkSubmissions, [state.currentLessonId!]: submission },
        completedLessons: prev.completedLessons.includes(state.currentLessonId!) 
          ? prev.completedLessons : [...prev.completedLessons, state.currentLessonId!]
      }));
    } catch (error) {
      console.error("Grading failed", error);
    }
    setIsGrading(false);
  };

  const handleToggleCustomWord = async (word: string, gender?: string, meaning?: string, example?: string) => {
    const isSaved = state.customVocabulary.some(v => v.word.toLowerCase() === word.toLowerCase());
    if (isSaved) {
      setState(prev => ({ ...prev, customVocabulary: prev.customVocabulary.filter(v => v.word.toLowerCase() !== word.toLowerCase()) }));
    } else {
      if (meaning) {
        const newWord: CustomWord = { word, meaning, example, addedAt: Date.now() };
        setState(prev => ({ ...prev, customVocabulary: [newWord, ...prev.customVocabulary] }));
      } else {
        const data = await translateWordAndGetGrammar(word, "B2 context");
        const newWord: CustomWord = { word, meaning: data.translation, grammarNote: data.grammarNote, example: data.example, addedAt: Date.now() };
        setState(prev => ({ ...prev, customVocabulary: [newWord, ...prev.customVocabulary] }));
      }
    }
  };

  const handlePlayReading = async () => {
    if (isReading) {
      stopAudio();
      setIsReading(false);
    } else if (currentLesson) {
      setIsReading(true);
      await playTextToSpeech(currentLesson.content.readingText, () => setIsReading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      <aside className="w-full md:w-80 bg-slate-900 text-white overflow-y-auto md:h-screen sticky top-0 z-20 shadow-xl flex flex-col">
        <div className="p-8">
          <h1 className="text-3xl font-extrabold text-blue-400 tracking-tighter">DeutschGipfel</h1>
          <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-bold">Aspekte B2 & Menschen B1</p>
        </div>
        <nav className="flex-1 overflow-y-auto space-y-6 pb-8">
          <div>
            <div className="px-8 text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Lektionen (Aspekte B2)</div>
            <div className="space-y-1">
              {ASPEKTE_CHAPTERS.map(chapter => (
                <button key={chapter.id} onClick={() => { setMode('lesson'); setState(prev => ({ ...prev, currentLessonId: chapter.id })); }}
                  className={`w-full text-left px-8 py-3 transition-all flex items-center gap-4 ${state.currentLessonId === chapter.id && mode === 'lesson' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${state.completedLessons.includes(chapter.id) ? 'bg-green-400' : 'bg-slate-700'}`} />
                  <div className="truncate">
                    <div className="text-[10px] opacity-60 font-bold uppercase tracking-tighter">Kapitel {chapter.id}</div>
                    <div className="text-sm font-semibold truncate">{chapter.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="px-8 text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Grammatik & Wortschatz</div>
            <div className="space-y-1">
              <button onClick={() => setMode('grammar-b1')} className={`w-full text-left px-8 py-4 flex items-center gap-4 transition-all ${mode === 'grammar-b1' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                <span className="text-xl">📖</span><span className="font-bold text-sm">Menschen B1</span>
              </button>
              <button onClick={() => setMode('grammar-b2')} className={`w-full text-left px-8 py-4 flex items-center gap-4 transition-all ${mode === 'grammar-b2' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                <span className="text-xl">📘</span><span className="font-bold text-sm">Aspekte B2</span>
              </button>
              <button onClick={() => setMode('my-vocab')} className={`w-full text-left px-8 py-4 flex items-center gap-4 transition-all ${mode === 'my-vocab' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                <span className="text-xl">🗂️</span><span className="font-bold text-sm">Wortschatz-Meister</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full">
        {mode === 'grammar-b1' ? <GrammarLibrary title="Menschen B1 Grammatik" rules={B1_GRAMMAR} /> :
         mode === 'grammar-b2' ? <GrammarLibrary title="Aspekte B2 Grammatik" rules={B2_GRAMMAR} /> :
         mode === 'my-vocab' ? (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10"><h2 className="text-4xl font-black mb-3 text-slate-800 tracking-tight">Mein Wortschatz</h2><p className="text-xl text-slate-500 italic font-medium">Gespeicherte Vokabeln</p></header>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
              <h3 className="text-xl font-black mb-4">Wort hinzufügen</h3>
              <div className="flex gap-4">
                <input id="manualWord" type="text" placeholder="Wort..." className="flex-1 p-5 border-2 border-slate-200 rounded-2xl outline-none" />
                <button onClick={() => { const inp = document.getElementById('manualWord') as HTMLInputElement; handleToggleCustomWord(inp.value); inp.value = ''; }} className="px-8 bg-blue-600 text-white font-black rounded-2xl">Hinzufügen</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.customVocabulary.map((v, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm relative group">
                  <button onClick={() => handleToggleCustomWord(v.word)} className="absolute top-6 right-6 text-red-500 font-black text-2xl">–</button>
                  <div className="flex items-center gap-4 mb-2"><span className="text-2xl font-black">{v.word}</span><button onClick={() => playTextToSpeech(v.word)} className="text-blue-500">🔊</button></div>
                  <p className="text-blue-700 font-bold mb-2">{v.meaning}</p>
                  {v.example && <p className="text-slate-500 italic text-sm">"{v.example}"</p>}
                </div>
              ))}
            </div>
          </div>
         ) : currentLesson ? (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10">
              <h2 className="text-4xl font-black mb-3 text-slate-800">{currentLesson.title}</h2>
              <p className="text-xl text-slate-500 italic">{currentLesson.topic}</p>
            </header>
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide whitespace-nowrap">
              {(['reading', 'vocabulary', 'grammar', 'listening', 'homework'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 font-bold transition-all border-b-4 -mb-1 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  {tab === 'reading' ? 'Lesen' : tab === 'vocabulary' ? 'Wortschatz' : tab === 'grammar' ? 'Grammatik' : tab === 'listening' ? 'Hören' : 'Hausaufgabe'}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-12">
              {activeTab === 'reading' && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black text-slate-800">Lesetext (Aspekte B2)</h3>
                    <button onClick={handlePlayReading} className={`px-8 py-4 rounded-full font-black text-white shadow-xl transition-all ${isReading ? 'bg-red-500' : 'bg-blue-600 hover:scale-105 active:scale-95'}`}>
                      {isReading ? '⏹ Pause' : '🔊 Vorlesen'}
                    </button>
                  </div>
                  <div className="text-slate-800 leading-relaxed text-2xl space-y-8 font-serif">
                    {currentLesson.content.readingText.split('\n').map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                </div>
              )}
              {activeTab === 'vocabulary' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentLesson.content.vocabulary.map((v, i) => {
                    const saved = state.customVocabulary.some(cv => cv.word.toLowerCase() === v.word.toLowerCase());
                    return (
                      <div key={i} className="p-8 border border-slate-100 rounded-3xl relative hover:border-blue-100 transition-colors">
                        <button onClick={() => handleToggleCustomWord(v.word, v.gender, v.meaning, v.example)} className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-md transition-all ${saved ? 'bg-red-100 text-red-500 rotate-0' : 'bg-blue-600 text-white rotate-90'}`}>
                          {saved ? '–' : '+'}
                        </button>
                        <div className="mb-4">
                          <span className={`text-[10px] uppercase px-3 py-1 rounded-full font-black mr-3 ${v.gender === 'der' ? 'bg-blue-100 text-blue-700' : v.gender === 'die' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{v.gender}</span>
                          <span className="text-2xl font-black text-slate-800">{v.word}</span>
                        </div>
                        <p className="text-slate-600 font-bold text-lg">{v.meaning}</p>
                        {v.example && <p className="mt-4 p-4 bg-slate-50 rounded-2xl italic text-slate-500 text-sm">"{v.example}"</p>}
                      </div>
                    );
                  })}
                </div>
              )}
              {activeTab === 'grammar' && (
                <div className="max-w-3xl mx-auto">
                  <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] text-white mb-10 shadow-lg">
                    <h3 className="text-3xl font-black mb-6">{currentLesson.content.grammarPoint.title}</h3>
                    <p className="text-blue-100 text-xl font-medium leading-relaxed">{currentLesson.content.grammarPoint.explanation}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Beispiele aus der Lektion</h4>
                    {currentLesson.content.grammarPoint.examples.map((ex, i) => <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl italic text-xl font-medium shadow-sm hover:shadow-md transition-shadow">» {ex}</div>)}
                  </div>
                </div>
              )}
              {activeTab === 'listening' && (
                <div className="text-center py-24">
                  <div onClick={() => playTextToSpeech(currentLesson.content.listeningScript)} className="group relative w-48 h-48 mx-auto cursor-pointer">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                      <span className="text-7xl text-white ml-2">▶</span>
                    </div>
                  </div>
                  <h3 className="text-4xl font-black mt-12 text-slate-800">Hörverstehen starten</h3>
                  <p className="text-slate-400 font-medium mt-4">Kapitel {currentLesson.id}: {currentLesson.topic}</p>
                </div>
              )}
              {activeTab === 'homework' && (
                <div className="max-w-4xl mx-auto space-y-20">
                  {/* Exercises Section */}
                  <div className="space-y-12">
                    <h3 className="text-4xl font-black text-slate-800 border-b-8 border-blue-100 inline-block pb-2">Wissens-Check</h3>
                    {currentLesson.content.homeworkTasks.filter(t => t.type !== 'writing').map((task, i) => (
                      <div key={i} className="p-12 border border-slate-100 rounded-[3rem] bg-white shadow-sm transition-all hover:shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="bg-blue-600 text-white px-5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Multiple Choice</span>
                          <h4 className="font-black text-2xl text-slate-800">{task.title}</h4>
                        </div>
                        <p className="text-slate-500 text-xl mb-8 font-medium italic">{task.instruction}</p>
                        {task.question && <p className="font-black text-3xl mb-10 text-slate-900 leading-tight">"{task.question}"</p>}
                        
                        {task.options && (
                          <div className="grid grid-cols-1 gap-4 mb-10">
                            {task.options.map((opt, oi) => (
                              <button key={oi} className="text-left px-10 py-5 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition-all hover:text-blue-700">
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        <details className="group">
                          <summary className="text-blue-600 font-black cursor-pointer uppercase text-xs tracking-widest hover:text-blue-800 flex items-center gap-2">
                             <span className="group-open:rotate-180 transition-transform">▼</span>
                             Lösung anzeigen
                          </summary>
                          <div className="mt-8 p-8 bg-green-50 text-green-800 rounded-3xl font-black text-2xl text-center border-2 border-green-100 animate-in slide-in-from-top-2">
                            {task.solution}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>

                  {/* Writing Task Section */}
                  <div className="pt-20 border-t-8 border-slate-50">
                    <h3 className="text-4xl font-black text-slate-800 mb-10 border-b-8 border-indigo-100 inline-block pb-2">Textproduktion</h3>
                    {currentLesson.content.homeworkTasks.filter(t => t.type === 'writing').map((task, i) => (
                      <div key={i} className="space-y-12">
                        <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                          <div className="flex items-center gap-4 mb-6">
                            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">B2 Aufgabe</span>
                            <h4 className="font-black text-2xl">Freies Schreiben</h4>
                          </div>
                          <p className="text-2xl font-bold leading-relaxed whitespace-pre-wrap">{task.instruction}</p>
                        </div>

                        {state.homeworkSubmissions[currentLesson.id] ? (
                          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex items-center gap-10 bg-white p-12 rounded-[3.5rem] border-8 border-green-50 shadow-2xl">
                              <div className="text-9xl font-black text-green-600 tabular-nums leading-none">
                                {state.homeworkSubmissions[currentLesson.id].feedback?.score}
                              </div>
                              <div>
                                <div className="font-black text-slate-800 text-4xl">Gesamtbewertung</div>
                                <div className="text-slate-400 font-bold text-xl uppercase tracking-widest mt-2">Niveau B2 Bestanden</div>
                              </div>
                            </div>

                            <div className="p-12 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm text-slate-800 leading-relaxed font-serif text-3xl italic">
                              "{state.homeworkSubmissions[currentLesson.id].userText}"
                            </div>

                            <div className="space-y-8">
                              <h4 className="font-black text-slate-800 text-3xl">KI-Dozentenfeedback</h4>
                              <div className="p-12 bg-slate-900 text-slate-200 rounded-[3.5rem] leading-relaxed text-xl font-medium shadow-2xl border-t-8 border-blue-500">
                                {state.homeworkSubmissions[currentLesson.id].feedback?.generalComment}
                              </div>
                              
                              <div className="grid grid-cols-1 gap-6">
                                {state.homeworkSubmissions[currentLesson.id].feedback?.corrections.map((c, ci) => (
                                  <div key={ci} className="p-10 border-2 border-slate-100 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-red-400 line-through text-lg mb-2 font-bold opacity-60">{c.original}</div>
                                    <div className="text-green-600 font-black text-3xl mb-4 flex items-center gap-4">
                                       <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">Korrektur</span>
                                       ➜ {c.correction}
                                    </div>
                                    <div className="text-slate-600 text-lg font-medium bg-slate-50 p-6 rounded-2xl border-l-8 border-slate-200">
                                      {c.explanation}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setHomeworkText(state.homeworkSubmissions[currentLesson.id].userText);
                                setState(prev => {
                                  const subs = { ...prev.homeworkSubmissions };
                                  delete subs[currentLesson.id];
                                  return { ...prev, homeworkSubmissions: subs };
                                });
                              }}
                              className="w-full py-8 bg-slate-100 text-slate-600 rounded-full font-black text-2xl hover:bg-slate-200 transition-colors shadow-inner"
                            >
                              Text für neue Bewertung überarbeiten
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-8">
                            <textarea
                              value={homeworkText}
                              onChange={(e) => setHomeworkText(e.target.value)}
                              placeholder="Fangen Sie hier an zu schreiben..."
                              className="w-full h-[32rem] p-16 border-8 border-slate-50 rounded-[4rem] focus:ring-12 focus:ring-blue-50 focus:border-blue-500 outline-none resize-none font-serif text-3xl leading-relaxed shadow-inner transition-all bg-white"
                            />
                            <div className="flex justify-between items-center px-6">
                              <div className="text-lg font-black text-slate-300 uppercase tracking-[0.2em]">
                                Wortanzahl: <span className={homeworkText.trim().split(/\s+/).length >= 100 ? 'text-green-500' : 'text-orange-400'}>{homeworkText.trim() === '' ? 0 : homeworkText.trim().split(/\s+/).length}</span>
                              </div>
                              <button
                                onClick={handleGradeHomework}
                                disabled={isGrading || homeworkText.trim().length < 50}
                                className={`px-20 py-8 rounded-full font-black text-3xl transition-all shadow-2xl flex items-center gap-6 ${
                                  isGrading || homeworkText.trim().length < 50 ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                                }`}
                              >
                                {isGrading ? (
                                  <><span className="animate-spin text-4xl">◎</span> Prüfen...</>
                                ) : 'Korrektur anfordern'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
         ) : null}
      </main>
    </div>
  );
};

export default App;
