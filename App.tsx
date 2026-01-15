
import React, { useState, useEffect, useMemo } from 'react';
import { ASPEKTE_CHAPTERS, B1_GRAMMAR, B2_GRAMMAR } from './constants';
import { Lesson, AppState, HomeworkSubmission, CustomWord } from './types';
import { generateLessonContent, gradeHomework, playTextToSpeech, translateWordAndGetGrammar } from './geminiService';

// --- Static Grammar Dictionary ---

const GRAMMAR_TERMS: Record<string, string> = {
  "Infinitiv": "Die Grundform des Verbs (z.B. gehen, machen).",
  "Partizip II": "Die Form des Verbs für Perfekt oder Passiv (z.B. gegangen, gemacht).",
  "Partizip I": "Die Form des Verbs für Gleichzeitigkeit (z.B. lachend, gehend).",
  "Hilfsverben": "Verben wie 'haben', 'sein' oder 'werden', die zur Bildung von Zeitformen dienen.",
  "Genitiv": "Der 2. Fall, zeigt meist Besitz oder Zugehörigkeit an (Wessen?). Beispiel: des Vaters.",
  "Präteritum": "Die einfache Vergangenheitsform, oft in schriftlichen Texten oder bei Modalverben genutzt.",
  "Konjunktiv II": "Wird für Wünsche, Höflichkeit oder irreale Situationen genutzt.",
  "Konjunktiv I": "Hauptsächlich für die indirekte Rede in Nachrichten verwendet.",
  "Modalverben": "Verben wie müssen, können, dürfen, wollen, sollen, mögen.",
  "Akkusativ": "Der 4. Fall, meist für das direkte Objekt (Wen oder was?).",
  "Nominativ": "Der 1. Fall, das Subjekt des Satzes (Wer oder was?).",
  "Dativ": "Der 3. Fall, meist für das indirekte Objekt (Wem?).",
  "Zweiteilige Konnektoren": "Satzverbindungen aus zwei Teilen (z.B. nicht nur... sondern auch).",
  "Partizipialattribute": "Partizipien, die wie Adjektive vor einem Nomen stehen (z.B. das schlafende Kind).",
  "Passiv": "Form, bei der die Handlung im Vordergrund steht, nicht der Täter.",
  "Indirekte Rede": "Wiedergabe von Aussagen Dritter, oft im Konjunktiv I.",
  "Konnektoren": "Wörter, die Sätze oder Satzteile verbinden (z.B. weil, obwohl, aber).",
  "Intransitive Verben": "Verben, die kein Akkusativobjekt haben können (z.B. schlafen, gehen).",
  "Funktionsverb": "Verben, die in Verbindung mit Nomen eine neue Bedeutung ergeben (z.B. treffen in 'eine Entscheidung treffen')."
};

// --- Utility Components ---

const Notification: React.FC<{ message: string; type: 'success' | 'remove'; onHide: () => void }> = ({ message, type, onHide }) => {
  useEffect(() => {
    const timer = setTimeout(onHide, 3000);
    return () => clearTimeout(timer);
  }, [onHide]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300">
      <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-white font-bold ${type === 'success' ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-slate-600'}`}>
        {type === 'success' ? (
          <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-7 7-7-7" /></svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

const UmlautRenderer: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/([äöüÄÖÜ])/);
  return (
    <span>
      {parts.map((p, i) => /[äöüÄÖÜ]/.test(p) ? <span key={i} className="text-red-500">{p}</span> : p)}
    </span>
  );
};

const GrammarTermRenderer: React.FC<{ text: string }> = ({ text }) => {
  const [activeTerm, setActiveTerm] = useState(null as { term: string; definition: string; x: number; y: number } | null);

  const tokens = useMemo(() => text.split(/(\s+|[.,!?;:()"])/), [text]);

  const handleTermClick = (e: React.MouseEvent, rawToken: string) => {
    const clean = rawToken.replace(/[.,!?;:()"]/g, '').trim();
    if (!clean) return;

    const termKey = Object.keys(GRAMMAR_TERMS).find(
      key => key.toLowerCase() === clean.toLowerCase() || 
             (clean.toLowerCase().includes(key.toLowerCase()) && key.length > 4)
    );

    if (termKey) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setActiveTerm({
        term: termKey,
        definition: GRAMMAR_TERMS[termKey],
        x: Math.min(rect.left + window.scrollX, window.innerWidth - 220),
        y: rect.top + window.scrollY - 70
      });
    }
  };

  return (
    <span className="inline">
      {tokens.map((token, i) => {
        const clean = token.replace(/[.,!?;:()"]/g, '').trim();
        const termKey = clean ? Object.keys(GRAMMAR_TERMS).find(
          key => key.toLowerCase() === clean.toLowerCase() || 
                 (clean.toLowerCase().includes(key.toLowerCase()) && key.length > 4)
        ) : null;

        if (termKey) {
          return (
            <span
              key={i}
              onClick={(e) => handleTermClick(e, token)}
              className="cursor-help border-b border-indigo-300 text-indigo-700 hover:bg-indigo-100 transition-colors px-1 rounded inline-block"
            >
              <UmlautRenderer text={token} />
            </span>
          );
        }
        return <UmlautRenderer key={i} text={token} />;
      })}

      {activeTerm && (
        <div className="fixed z-50 animate-in fade-in zoom-in duration-150" style={{ left: activeTerm.x, top: activeTerm.y }}>
          <div className="bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs max-w-[240px] border border-indigo-700">
            <div className="font-black text-indigo-300 uppercase tracking-tighter mb-1 border-b border-indigo-800 pb-1">{activeTerm.term}</div>
            <div className="leading-relaxed">{activeTerm.definition}</div>
          </div>
        </div>
      )}
      {activeTerm && <div className="fixed inset-0 z-40" onClick={() => setActiveTerm(null)} />}
    </span>
  );
};

const GenderedWord: React.FC<{ 
  gender: string; 
  word: string; 
  plural?: string;
  className?: string;
  hidePluralInWord?: boolean;
}> = ({ gender, word, plural, className = "", hidePluralInWord = false }) => {
  const cleanWord = word.replace(/^(der|die|das)\s+/i, '').trim();
  
  const getGenderText = () => {
    switch(gender) {
      case 'der': return 'Der';
      case 'das': return 'Das';
      case 'die': return 'Die';
      case 'plural': return 'Die';
      default: return '';
    }
  };

  const getColorClass = () => {
    switch(gender) {
      case 'der': return 'text-blue-600';
      case 'das': return 'text-slate-900';
      case 'die': return 'text-red-600';
      case 'plural': return 'text-red-600';
      default: return 'text-slate-700';
    }
  };

  const genderLabel = getGenderText();

  return (
    <span className={`${getColorClass()} ${className} font-bold inline-flex items-baseline gap-1.5 whitespace-nowrap`}>
      {genderLabel && <UmlautRenderer text={genderLabel} />}
      <UmlautRenderer text={cleanWord} />
      {plural && plural !== '-' && !hidePluralInWord && (
        <span className="text-slate-400 font-normal ml-0.5 text-[0.8em]">
          (
          <span className={gender === 'die' ? 'text-blue-500' : ''}>
            <UmlautRenderer text={plural} />
          </span>
          )
        </span>
      )}
    </span>
  );
};

// --- Sub-components ---

const WordRenderer: React.FC<{ 
  text: string; 
  glossary: Record<string, string>;
  isWordSaved: (word: string) => boolean;
  onToggleWord: (word: string, translation: string, grammarNote?: string) => void;
}> = ({ text, glossary, isWordSaved, onToggleWord }) => {
  const [selectedWord, setSelectedWord] = useState(null as { word: string, translation: string, grammarNote?: string, x: number, y: number, loading?: boolean } | null);
  const [localGlossary, setLocalGlossary] = useState({} as Record<string, { t: string, g?: string }>);

  useEffect(() => {
    const initial: Record<string, { t: string, g?: string }> = {};
    Object.keys(glossary).forEach((k) => {
      initial[k] = { t: glossary[k] };
    });
    setLocalGlossary(initial);
  }, [glossary]);

  const tokens = useMemo(() => text.split(/(\s+|[.,!?;:()"])/), [text]);

  const handleWordClick = async (e: React.MouseEvent, rawWord: string) => {
    const clean = rawWord.replace(/[.,!?;:()"]/g, '').trim();
    if (!clean) return;

    const lowerClean = clean.toLowerCase();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = Math.min(rect.left + window.scrollX, window.innerWidth - 220);
    const y = rect.top + window.scrollY - 90;

    if (localGlossary[lowerClean]) {
      setSelectedWord({ word: clean, translation: localGlossary[lowerClean].t, grammarNote: localGlossary[lowerClean].g, x, y });
      return;
    }

    setSelectedWord({ word: clean, translation: 'Wird übersetzt...', x, y, loading: true });
    try {
      const data = await translateWordAndGetGrammar(clean, text);
      setLocalGlossary(prev => ({ ...prev, [lowerClean]: { t: data.translation, g: data.grammarNote } }));
      setSelectedWord({ word: clean, translation: data.translation, grammarNote: data.grammarNote, x, y, loading: false });
    } catch (err) {
      setSelectedWord({ word: clean, translation: 'Fehler', x, y, loading: false });
    }
  };

  const isNewWord = (rawWord: string) => {
    const clean = rawWord.replace(/[.,!?;:()"]/g, '').trim().toLowerCase();
    return !!glossary[clean];
  };

  return (
    <div className="relative leading-loose text-lg text-slate-700 select-none">
      {tokens.map((token, i) => {
        const clean = token.replace(/[.,!?;:()"]/g, '').trim();
        if (clean) {
          const highlighted = isNewWord(token);
          return (
            <span 
              key={i}
              onClick={(e) => handleWordClick(e, token)}
              className={`cursor-pointer transition-colors px-0.5 rounded border-b inline ${
                highlighted 
                  ? 'border-dotted border-indigo-400 text-indigo-900 bg-indigo-50/30 px-1' 
                  : 'border-transparent hover:bg-indigo-100/50 hover:text-indigo-700'
              }`}
            >
              <UmlautRenderer text={token} />
            </span>
          );
        }
        return <span key={i} className="inline">{token}</span>;
      })}

      {selectedWord && (
        <div className="fixed z-50 animate-in fade-in zoom-in duration-150" style={{ left: selectedWord.x, top: selectedWord.y }}>
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-4 min-w-[200px] border border-slate-700">
            <div className="flex flex-col flex-1">
              <span className="font-bold text-indigo-400 text-xs uppercase tracking-tighter mb-1">{selectedWord.word}</span>
              <span className={selectedWord.loading ? 'animate-pulse opacity-50' : ''}>{selectedWord.translation}</span>
              {selectedWord.grammarNote && (
                <span className="text-[10px] text-slate-400 mt-1 italic border-t border-slate-800 pt-1">{selectedWord.grammarNote}</span>
              )}
            </div>
            {!selectedWord.loading && selectedWord.translation !== 'Fehler' && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleWord(selectedWord.word, selectedWord.translation, selectedWord.grammarNote); setSelectedWord(null); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 transition-colors ${
                  isWordSaved(selectedWord.word) ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {isWordSaved(selectedWord.word) ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); setSelectedWord(null); }} className="opacity-40 hover:opacity-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          </div>
        </div>
      )}
      {selectedWord && <div className="fixed inset-0 z-40" onClick={() => setSelectedWord(null)} />}
    </div>
  );
};

const Sidebar: React.FC<{ 
  onSelect: (id: string) => void; 
  activeId: string | null;
  completedIds: string[];
  onReview: () => void;
  onGrammarReview: (level: 'B1' | 'B2') => void;
  mode: string;
}> = ({ onSelect, activeId, completedIds, onReview, onGrammarReview, mode }) => {
  const progressPercent = Math.round((completedIds.length / ASPEKTE_CHAPTERS.length) * 100);

  return (
    <div className="w-80 h-full bg-white border-r overflow-y-auto flex flex-col p-4 shadow-sm shrink-0">
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">D</div>
        <h1 className="text-xl font-bold text-slate-800">DeutschGipfel</h1>
      </div>

      <div className="px-2 mb-8">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          <span>Gesamtfortschritt</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex-1 space-y-1">
        {ASPEKTE_CHAPTERS.map((chap) => (
          <button
            key={chap.id}
            onClick={() => onSelect(chap.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
              activeId === chap.id && mode === 'lesson' ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${completedIds.includes(chap.id) ? 'bg-green-500' : 'bg-slate-300'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-wider opacity-60">Lektion {chap.id}</div>
              <div className="truncate font-medium">{chap.title}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          onClick={onReview}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
            mode === 'review' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="font-bold">Wortschatz-Meister</span>
        </button>
        <button onClick={() => onGrammarReview('B1')} className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${mode === 'grammarB1' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50'}`}>
          <span className="font-bold text-sm">Grammatik B1 (Menschen)</span>
        </button>
        <button onClick={() => onGrammarReview('B2')} className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${mode === 'grammarB2' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50'}`}>
          <span className="font-bold text-sm">Grammatik B2 (Aspekte)</span>
        </button>
      </div>
    </div>
  );
};

const LessonView: React.FC<{ 
  lessonId: string;
  lesson: Lesson | null; 
  isGenerating: boolean;
  onHomeworkSubmit: (text: string) => void;
  isWordSaved: (word: string) => boolean;
  onToggleWord: (word: string, translation: string, grammarNote?: string) => void;
  submission?: HomeworkSubmission;
  isGrading: boolean;
}> = ({ lessonId, lesson, isGenerating, onHomeworkSubmit, isWordSaved, onToggleWord, submission, isGrading }) => {
  const [activeTab, setActiveTab] = useState<'reading' | 'vocabulary' | 'grammar' | 'listening' | 'homework'>('reading');
  const [draft, setDraft] = useState('');

  const chapterMeta = useMemo(() => ASPEKTE_CHAPTERS.find(c => c.id === lessonId), [lessonId]);

  useEffect(() => {
    if (lesson && lesson.id === lessonId) {
      if (submission) {
        setDraft(submission.userText);
        localStorage.removeItem(`draft_${lesson.id}`);
      } else {
        setDraft(localStorage.getItem(`draft_${lesson.id}`) || '');
      }
    } else {
        setDraft(localStorage.getItem(`draft_${lessonId}`) || '');
    }
  }, [lesson, lessonId, submission]);

  const groupedVocabulary = useMemo(() => {
    if (!lesson) return { der: [], das: [], die: [], none: [] };
    const groups = { der: [] as any[], das: [] as any[], die: [] as any[], none: [] as any[] };
    lesson.content.vocabulary.forEach(v => {
      if (v.gender in groups) groups[v.gender as keyof typeof groups].push(v);
      else groups.none.push(v);
    });
    return groups;
  }, [lesson]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      <div className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-800">{lessonId}. {chapterMeta?.title}</h2>
          <div className="flex items-center gap-3">
             {isGenerating && (
                 <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100 animate-pulse">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                    Wird generiert...
                 </div>
             )}
             <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{chapterMeta?.topic}</div>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {(['reading', 'vocabulary', 'grammar', 'listening', 'homework'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-sm font-medium capitalize border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab === 'reading' ? 'Lesen' : tab === 'vocabulary' ? 'Wortschatz' : tab === 'grammar' ? 'Grammatik' : tab === 'listening' ? 'Hören' : 'Hausaufgabe'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-8 min-h-[400px] flex flex-col">
          {!lesson || (isGenerating && !lesson) ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium italic">Inhalte werden vorbereitet...</p>
              </div>
          ) : (
            <>
              {activeTab === 'reading' && (
                <div className="prose prose-slate max-w-none">
                  <h3 className="text-2xl font-bold mb-4">Leseverstehen</h3>
                  <WordRenderer text={lesson.content.readingText} glossary={lesson.content.glossary} isWordSaved={isWordSaved} onToggleWord={onToggleWord} />
                </div>
              )}

              {activeTab === 'vocabulary' && (
                <div className="space-y-10">
                  {(['der', 'das', 'die', 'none'] as const).map(gender => {
                    const words = groupedVocabulary[gender];
                    if (words.length === 0) return null;
                    return (
                      <div key={gender}>
                        <h4 className={`text-sm font-black uppercase tracking-widest mb-4 border-b pb-2 ${gender === 'der' ? 'text-blue-600 border-blue-100' : gender === 'die' ? 'text-red-600 border-red-100' : gender === 'das' ? 'text-slate-900 border-slate-200' : 'text-slate-400 border-slate-100'}`}>
                          {gender === 'none' ? 'Wichtige Ausdrücke' : gender.toUpperCase()}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {words.map((v, i) => {
                            const english = lesson.content.glossary[v.word.toLowerCase()] || "";
                            const saved = isWordSaved(v.word);
                            return (
                              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex flex-col gap-1">
                                    <GenderedWord gender={v.gender} word={v.word} className="text-lg" hidePluralInWord={true} />
                                    {english && <div className="text-sm text-slate-400 font-medium">[{english}]</div>}
                                    {v.plural && v.plural !== '-' && (
                                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Plural: {v.plural}</div>
                                    )}
                                  </div>
                                  <div className="text-slate-600 text-sm mt-2 italic flex items-center gap-2">
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <UmlautRenderer text={v.meaning} />
                                  </div>
                                </div>
                                <button 
                                  onClick={() => onToggleWord(v.word, v.meaning)} 
                                  className={`p-2 transition-all rounded-lg ${saved ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                >
                                  {saved ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'grammar' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">{lesson.content.grammarPoint.title}</h3>
                  <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl mb-6 text-slate-800 leading-relaxed">
                    <GrammarTermRenderer text={lesson.content.grammarPoint.explanation} />
                  </div>
                  <h4 className="font-bold text-slate-700 mb-3">Beispiele:</h4>
                  <ul className="space-y-2">
                    {lesson.content.grammarPoint.examples.map((ex, i) => (
                      <li key={i} className="flex gap-3 items-start"><span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs flex-shrink-0 mt-1">✓</span><span className="text-slate-700 italic"><UmlautRenderer text={ex} /></span></li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'listening' && (
                <div className="text-center py-12">
                  <div className="mb-6 mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center"><svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></div>
                  <button onClick={() => playTextToSpeech(lesson.content.listeningScript)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Audio abspielen</button>
                </div>
              )}

              {activeTab === 'homework' && (
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border rounded-xl"><h4 className="font-bold mb-2">Aufgabe:</h4><p className="italic text-slate-600">"{lesson.homeworkPrompt}"</p></div>
                  {submission ? <div className="p-6 border rounded-xl">{submission.userText}</div> : <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Deine Antwort..." className="w-full h-64 p-4 border rounded-xl" disabled={isGrading} />}
                  {!submission && <button onClick={() => onHomeworkSubmit(draft)} disabled={!draft.trim() || isGrading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">{isGrading ? 'Wird bewertet...' : 'Hausaufgabe einreichen'}</button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const GrammarLibrary: React.FC<{ level: string, rules: any[] }> = ({ level, rules }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 h-full scroll-smooth">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 bg-white/80 backdrop-blur sticky top-0 z-10 p-6 rounded-3xl border shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Grammatik {level}</h2>
          <p className="text-slate-500">Klicke auf markierte Begriffe für Erklärungen.</p>
        </header>
        <div className="space-y-8 pb-20">
          {rules.map((point, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-sm border p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">{level}</span>
                <h3 className="text-2xl font-bold text-slate-800">{point.title}</h3>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border mb-6 text-slate-700 leading-relaxed italic">
                <GrammarTermRenderer text={point.explanation} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {point.examples.map((ex: string, j: number) => (
                  <div key={j} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm italic text-slate-600 flex gap-3">
                    <span className="text-indigo-400 font-bold">•</span>
                    <UmlautRenderer text={ex} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VocabularyReview: React.FC<{ 
  lessonCache: Record<string, Lesson>, 
  completedIds: string[], 
  customVocab: CustomWord[],
  onRemoveCustomWord: (word: string) => void
}> = ({ lessonCache, completedIds, customVocab, onRemoveCustomWord }) => {
  const [view, setView] = useState('all' as 'all' | 'custom' | 'flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState({} as Record<string, boolean>);

  const allVocab = useMemo(() => {
    const lessonVocab = completedIds.flatMap(id => {
      const lesson = lessonCache[id];
      if (!lesson) return [];
      return lesson.content.vocabulary.map(v => ({ 
        ...v, 
        source: `Lektion ${id}`, 
        custom: false,
        english: lesson.content.glossary[v.word.toLowerCase()] || ""
      }));
    });
    const custom = customVocab.map(v => ({ 
      word: v.word, 
      meaning: v.meaning, 
      gender: 'none' as const, 
      source: 'Wörterbuch', 
      custom: true, 
      plural: '',
      english: v.meaning 
    }));
    return [...lessonVocab, ...custom];
  }, [lessonCache, completedIds, customVocab]);

  const displayVocab = view === 'custom' ? allVocab.filter(v => v.custom) : allVocab;

  const renderCardFront = (v: any, i: number | string) => (
    <div className="absolute inset-0 bg-white border p-6 rounded-2xl [backface-visibility:hidden] flex flex-col justify-between items-center text-center">
      <div className="w-full text-[10px] font-bold text-indigo-500 flex justify-between uppercase">
        <span>{v.source}</span>
        {v.custom && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemoveCustomWord(v.word); }}
            className="text-red-400 hover:text-red-600"
          >
            Entfernen
          </button>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-4 py-4 flex-1 justify-center">
        {/* The main German word with article and correct spacing */}
        <GenderedWord gender={v.gender} word={v.word} className="text-3xl" hidePluralInWord={true} />
        
        {/* The English translation - prominent and clearly visible on the front */}
        <div className="text-xl text-indigo-600 font-extrabold px-4 leading-tight">
          {v.english || v.meaning}
        </div>

        {/* The Plural form in German - prominently displayed on the front */}
        {v.plural && v.plural !== '-' && (
          <div className="mt-2 flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm">
            <span>Plural:</span>
            <span className="text-indigo-600">
              {v.gender === 'none' ? '' : 'die '}
              {v.word.replace(/^(der|die|das)\s+/i, '').trim()}{v.plural}
            </span>
          </div>
        )}
      </div>
      
      <div className="text-[10px] text-slate-300 font-medium italic">Klicken zum Wenden</div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 h-full">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-3xl font-bold text-slate-900">Wortschatz-Meister</h2>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border">
            {(['all', 'custom', 'flashcards'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${view === v ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>{v === 'custom' ? 'Dictionary' : v}</button>
            ))}
          </div>
        </header>

        {view === 'flashcards' && displayVocab.length > 0 ? (
          <div className="flex flex-col items-center">
            <div onClick={() => setFlipped(p => ({...p, curr: !p.curr}))} className="w-full max-w-lg h-96 cursor-pointer">
              <div className={`relative h-full w-full rounded-3xl shadow-2xl transition-all duration-700 [transform-style:preserve-3d] ${flipped.curr ? '[transform:rotateY(180deg)]' : ''}`}>
                {renderCardFront(displayVocab[currentCardIndex], 'flash')}
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl p-10 text-white flex items-center justify-center text-center leading-relaxed [backface-visibility:hidden] [transform:rotateY(180deg)] text-2xl font-bold overflow-y-auto">
                  {displayVocab[currentCardIndex].meaning}
                </div>
              </div>
            </div>
            <div className="flex gap-8 mt-10 items-center">
              <button onClick={() => { setFlipped({}); setCurrentCardIndex(i => (i - 1 + displayVocab.length) % displayVocab.length); }} className="px-6 py-2 bg-white rounded-full border shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Zurück</button>
              <span className="font-bold text-slate-400">{currentCardIndex + 1} / {displayVocab.length}</span>
              <button onClick={() => { setFlipped({}); setCurrentCardIndex(i => (i + 1) % displayVocab.length); }} className="px-6 py-2 bg-white rounded-full border shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Weiter</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVocab.map((v, i) => (
              <div key={`${v.word}-${i}`} onClick={() => setFlipped(p => ({...p, [i]: !p[i]}))} className="group h-64 cursor-pointer relative">
                <div className={`relative h-full w-full rounded-2xl shadow-sm transition-all duration-500 [transform-style:preserve-3d] ${flipped[i] ? '[transform:rotateY(180deg)]' : ''}`}>
                  {renderCardFront(v, i)}
                  <div className="absolute inset-0 bg-indigo-600 p-6 rounded-2xl text-white flex items-center justify-center text-center font-bold text-lg [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto">
                    {v.meaning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState(() => {
    try {
      // 1. Load dictionary (custom vocab) separately for high reliability
      const savedVocab = localStorage.getItem('deutsch_custom_vocab');
      const dictionary = savedVocab ? JSON.parse(savedVocab) : [];

      // 2. Load the rest of the application state (lessons, cache, submissions)
      const savedState = localStorage.getItem('deutsch_app_state');
      const baseState = savedState ? JSON.parse(savedState) : { completedLessons: [], homeworkSubmissions: {}, currentLessonId: null, lessonCache: {} };
      
      return { 
        ...baseState, 
        customVocabulary: dictionary 
      } as AppState;
    } catch (e) {
      console.warn("Failed to load state from localStorage:", e);
      return { completedLessons: [], homeworkSubmissions: {}, currentLessonId: null, lessonCache: {}, customVocabulary: [] } as AppState;
    }
  });

  const [generatingId, setGeneratingId] = useState(null as string | null);
  const [isGrading, setIsGrading] = useState(false);
  const [mode, setMode] = useState('lesson' as 'lesson' | 'review' | 'grammarB1' | 'grammarB2');
  const [notification, setNotification] = useState(null as { message: string; type: 'success' | 'remove' } | null);

  // Persistence logic - saves both state parts reliably
  useEffect(() => { 
    try {
      // Save dictionary separately
      localStorage.setItem('deutsch_custom_vocab', JSON.stringify(state.customVocabulary));
      
      // Save overall state (lessons, submissions, etc.)
      const { customVocabulary, ...rest } = state;
      localStorage.setItem('deutsch_app_state', JSON.stringify(rest)); 
    } catch (e) {
      console.warn("Storage quota might be exceeded. Pruning cache to save important data.");
      // If we hit a quota limit, we prioritize the dictionary and prune the lesson cache
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        const prunedCache = Object.fromEntries(Object.entries(state.lessonCache).slice(-2)); // Keep only last 2 lessons
        const { customVocabulary, ...rest } = state;
        localStorage.setItem('deutsch_app_state', JSON.stringify({ ...rest, lessonCache: prunedCache }));
      }
    }
  }, [state]);

  const handleSelectChapter = async (id: string) => {
    setMode('lesson');
    setState(prev => ({ ...prev, currentLessonId: id }));
    
    if (state.lessonCache[id]) {
      return;
    }
    
    if (generatingId !== id) {
      setGeneratingId(id);
      const chapter = ASPEKTE_CHAPTERS.find(c => c.id === id);
      if (chapter) {
        try {
          const content = await generateLessonContent(chapter.id, chapter.title, chapter.topic);
          setState(prev => ({ 
            ...prev, 
            lessonCache: { ...prev.lessonCache, [id]: content } 
          }));
        } catch (error) { 
          console.error("Error generating lesson:", error); 
        } finally {
          setGeneratingId(null);
        }
      }
    }
  };

  const isWordSaved = (word: string) => 
    state.customVocabulary.some(v => v.word.toLowerCase() === word.toLowerCase());

  const handleToggleWord = (word: string, meaning: string, grammarNote?: string) => {
    const exists = isWordSaved(word);
    if (exists) {
      setState(p => ({
        ...p,
        customVocabulary: p.customVocabulary.filter(v => v.word.toLowerCase() !== word.toLowerCase())
      }));
      setNotification({ message: `"${word}" wurde entfernt`, type: 'remove' });
    } else {
      setState(p => ({
        ...p,
        customVocabulary: [...p.customVocabulary, { word, meaning, grammarNote, addedAt: Date.now() }]
      }));
      setNotification({ message: `"${word}" wurde gespeichert`, type: 'success' });
    }
  };

  const handleHomeworkSubmit = async (text: string) => {
    const lessonId = state.currentLessonId;
    const currentLesson = lessonId ? state.lessonCache[lessonId] : null;
    if (!currentLesson || !text) return;
    setIsGrading(true);
    try {
      const feedback = await gradeHomework(currentLesson.homeworkPrompt, text);
      setState(p => ({
        ...p,
        homeworkSubmissions: { ...p.homeworkSubmissions, [currentLesson.id]: { lessonId: currentLesson.id, userText: text, timestamp: Date.now(), feedback } },
        completedLessons: p.completedLessons.includes(currentLesson.id) ? p.completedLessons : [...p.completedLessons, currentLesson.id]
      }));
    } catch (e) { alert("Fehler bei der Bewertung."); }
    setIsGrading(false);
  };

  const currentLessonData = state.currentLessonId ? state.lessonCache[state.currentLessonId] : null;

  return (
    <div className="flex h-screen w-full text-slate-900 bg-slate-50 overflow-hidden font-inter">
      <Sidebar onSelect={handleSelectChapter} activeId={state.currentLessonId} completedIds={state.completedLessons} onReview={() => setMode('review')} onGrammarReview={(lvl) => setMode(lvl === 'B1' ? 'grammarB1' : 'grammarB2')} mode={mode} />
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {mode === 'review' ? (
          <VocabularyReview 
            lessonCache={state.lessonCache} 
            completedIds={state.completedLessons} 
            customVocab={state.customVocabulary} 
            onRemoveCustomWord={(word) => handleToggleWord(word, '')} 
          />
        ) : mode === 'grammarB1' ? (
          <GrammarLibrary level="B1" rules={B1_GRAMMAR} />
        ) : mode === 'grammarB2' ? (
          <GrammarLibrary level="B2" rules={B2_GRAMMAR} />
        ) : state.currentLessonId ? (
          <LessonView 
            lessonId={state.currentLessonId}
            lesson={currentLessonData} 
            isGenerating={generatingId === state.currentLessonId && !currentLessonData} 
            onHomeworkSubmit={handleHomeworkSubmit} 
            isWordSaved={isWordSaved}
            onToggleWord={handleToggleWord}
            submission={state.homeworkSubmissions[state.currentLessonId]} 
            isGrading={isGrading} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
            <h2 className="text-4xl font-bold mb-4">Willkommen bei DeutschGipfel!</h2>
            <p className="text-slate-500 max-w-md">Lerne Deutsch B1 & B2 mit dem Meister-Kurs. Wähle eine Lektion links oder stöbere in der Grammatik-Bibliothek.</p>
          </div>
        )}
      </main>

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onHide={() => setNotification(null)} 
        />
      )}
    </div>
  );
}
