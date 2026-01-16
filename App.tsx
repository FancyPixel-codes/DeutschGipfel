
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ASPEKTE_CHAPTERS, B1_GRAMMAR, B2_GRAMMAR } from './constants';
import { Lesson, AppState, HomeworkSubmission, CustomWord, HomeworkTask } from './types';
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
    const termKey = Object.keys(GRAMMAR_TERMS).find(key => key.toLowerCase() === clean.toLowerCase() || (clean.toLowerCase().includes(key.toLowerCase()) && key.length > 4));
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
        const termKey = clean ? Object.keys(GRAMMAR_TERMS).find(key => key.toLowerCase() === clean.toLowerCase() || (clean.toLowerCase().includes(key.toLowerCase()) && key.length > 4)) : null;
        if (termKey) {
          return (
            <span key={i} onClick={(e) => handleTermClick(e, token)} className="cursor-help border-b border-indigo-300 text-indigo-700 hover:bg-indigo-100 transition-colors px-1 rounded inline-block">
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

const GenderedWord: React.FC<{ gender: string; word: string; className?: string; allowWrap?: boolean; }> = ({ gender, word, className = "", allowWrap = false }) => {
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
    <span className={`${getColorClass()} ${className} font-bold inline-flex items-baseline gap-1.5 ${allowWrap ? 'flex-wrap justify-center' : 'whitespace-nowrap'}`}>
      {genderLabel && <UmlautRenderer text={genderLabel} />}
      <UmlautRenderer text={cleanWord} />
    </span>
  );
};

const PluralHighlighter: React.FC<{ singular: string; plural: string }> = ({ singular, plural }) => {
  const cleanSingular = singular.replace(/^(der|die|das)\s+/i, '').toLowerCase();
  const cleanPlural = plural.replace(/^(der|die|das)\s+/i, '').toLowerCase();
  const actualPlural = plural.replace(/^(der|die|das)\s+/i, '');
  return (
    <span className="font-bold text-indigo-600">
      {actualPlural.split('').map((char, i) => {
        const singularChar = cleanSingular[i];
        const pluralChar = cleanPlural[i];
        const isDifferent = pluralChar !== singularChar;
        const isExtended = i >= cleanSingular.length;
        return <span key={i} className={isDifferent || isExtended ? "text-red-500 bg-red-50 px-0.5 rounded" : ""}>{actualPlural[i]}</span>;
      })}
    </span>
  );
};

// --- Sub-components ---
const WordRenderer: React.FC<{ text: string; glossary: Record<string, string>; isWordSaved: (word: string) => boolean; onToggleWord: (word: string, translation: string, grammarNote?: string, example?: string) => void; }> = ({ text, glossary, isWordSaved, onToggleWord }) => {
  const [selectedWord, setSelectedWord] = useState(null as { word: string, translation: string, grammarNote?: string, example?: string, x: number, y: number, loading?: boolean } | null);
  const [localGlossary, setLocalGlossary] = useState({} as Record<string, { t: string, g?: string, e?: string }>);

  useEffect(() => {
    const initial: Record<string, { t: string, g?: string, e?: string }> = {};
    Object.keys(glossary).forEach((k) => { initial[k] = { t: glossary[k] }; });
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
      setSelectedWord({ word: clean, translation: localGlossary[lowerClean].t, grammarNote: localGlossary[lowerClean].g, example: localGlossary[lowerClean].e, x, y });
      return;
    }
    setSelectedWord({ word: clean, translation: 'Wird übersetzt...', x, y, loading: true });
    try {
      const data = await translateWordAndGetGrammar(clean, text);
      setLocalGlossary(prev => ({ ...prev, [lowerClean]: { t: data.translation, g: data.grammarNote, e: data.example } }));
      setSelectedWord({ word: clean, translation: data.translation, grammarNote: data.grammarNote, example: data.example, x, y, loading: false });
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
            <span key={i} onClick={(e) => handleWordClick(e, token)} className={`cursor-pointer transition-colors px-0.5 rounded border-b inline ${highlighted ? 'border-dotted border-indigo-400 text-indigo-900 bg-indigo-50/30 px-1' : 'border-transparent hover:bg-indigo-100/50 hover:text-indigo-700'}`}>
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
              {selectedWord.grammarNote && <span className="text-[10px] text-slate-400 mt-1 italic border-t border-slate-800 pt-1">{selectedWord.grammarNote}</span>}
            </div>
            {!selectedWord.loading && selectedWord.translation !== 'Fehler' && (
              <button onClick={(e) => { e.stopPropagation(); onToggleWord(selectedWord.word, selectedWord.translation, selectedWord.grammarNote, selectedWord.example); setSelectedWord(null); }} className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 transition-colors ${isWordSaved(selectedWord.word) ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                {isWordSaved(selectedWord.word) ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
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

const HomeworkTaskView: React.FC<{ task: HomeworkTask; onWritingSubmit: (text: string) => void; isGrading: boolean; submission?: HomeworkSubmission; taskIndex: number; }> = ({ task, onWritingSubmit, isGrading, submission, taskIndex }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const isCorrect = userAnswer.trim().toLowerCase() === task.solution.trim().toLowerCase();

  if (task.type === 'writing') {
    return (
      <div className="space-y-6 p-8 bg-white border-2 border-indigo-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">{taskIndex + 1}</div>
          <div><h4 className="font-bold text-xl text-slate-800">{task.title}</h4><span className="text-xs font-black uppercase tracking-widest text-indigo-500">Kreatives Schreiben</span></div>
        </div>
        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 italic text-slate-700 whitespace-pre-wrap leading-relaxed">"{task.instruction}"</div>
        {submission ? (
          <div className="space-y-4">
            <div className="p-4 bg-white border rounded-xl shadow-sm text-slate-700 leading-relaxed">{submission.userText}</div>
            {submission.feedback && (
               <div className="p-6 bg-indigo-900 text-white rounded-2xl shadow-xl animate-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between mb-4"><span className="text-2xl font-black">Feedback & Note: {submission.feedback.score}%</span><span className="bg-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Lehrer-KI</span></div>
                  <p className="text-indigo-100 mb-6 italic">"{submission.feedback.generalComment}"</p>
                  <div className="space-y-3">
                    {submission.feedback.corrections.map((c, i) => (
                      <div key={i} className="bg-indigo-800/50 p-3 rounded-xl border border-indigo-700">
                         <div className="flex items-center gap-2 mb-1"><span className="text-red-300 line-through text-xs font-medium">{c.original}</span><svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" /></svg><span className="text-green-300 font-bold text-xs">{c.correction}</span></div>
                         <p className="text-[10px] text-indigo-300">{c.explanation}</p>
                      </div>
                    ))}
                  </div>
               </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Schreibe hier deine Antwort (mind. 150 Wörter)..." className="w-full h-80 p-6 border-2 border-slate-100 rounded-2xl shadow-inner focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all text-lg leading-relaxed" disabled={isGrading} />
            <button onClick={() => onWritingSubmit(userAnswer)} disabled={!userAnswer.trim() || isGrading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-tighter">{isGrading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Wird bewertet...</> : 'Abgeben und Korrektur erhalten'}</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-sm transition-all hover:border-indigo-100">
      <div className="flex items-center gap-4 mb-6"><div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">{taskIndex + 1}</div><div><h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{task.title}</h4><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Übung</span></div></div>
      <p className="text-slate-600 mb-8 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 italic">{task.instruction.replace(/\[____\]/, '______')}</p>
      {task.type === 'multiple-choice' ? (
        <div className="space-y-3 mb-8">
          <p className="font-bold text-slate-800 mb-4 text-xl">{task.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {task.options?.map((opt, i) => (
              <button key={i} disabled={showResult} onClick={() => setUserAnswer(opt)} className={`text-left px-6 py-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-between ${userAnswer === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.01]' : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-600 hover:bg-slate-50'} ${showResult && userAnswer === opt && !isCorrect ? 'bg-red-500 border-red-500' : ''} ${showResult && opt === task.solution ? 'bg-green-600 border-green-600 text-white' : ''}`}>
                <span>{opt}</span>
                {userAnswer === opt && !showResult && <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"><div className="w-2.5 h-2.5 bg-white rounded-full" /></div>}
                {showResult && opt === task.solution && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8"><div className="flex flex-col gap-4"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deine Antwort:</label><input type="text" disabled={showResult} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Trage hier die Lösung ein..." className={`w-full px-6 py-4 border-2 focus:outline-none rounded-2xl text-xl font-bold shadow-sm transition-all ${showResult ? (isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500') : 'bg-white border-slate-100 focus:border-indigo-600'}`} /></div></div>
      )}
      {showResult && (
        <div className={`p-6 rounded-2xl border-2 mb-6 animate-in zoom-in-95 duration-200 ${isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
           <div className="flex items-center gap-3 font-black text-lg mb-2">{isCorrect ? <><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> EXZELLENT!</> : <><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg> FAST RICHTIG.</>}</div>
           {!isCorrect && <p className="font-bold">Die korrekte Lösung ist: <span className="underline decoration-red-400 decoration-2 underline-offset-4">{task.solution}</span></p>}
        </div>
      )}
      {!showResult ? <button disabled={!userAnswer.trim()} onClick={() => setShowResult(true)} className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all disabled:opacity-30 uppercase tracking-tighter">Lösung prüfen</button> : <button onClick={() => { setUserAnswer(''); setShowResult(false); }} className="px-10 py-3 bg-indigo-100 text-indigo-700 rounded-2xl font-black hover:bg-indigo-200 transition-all uppercase tracking-tighter">Nochmal versuchen</button>}
    </div>
  );
};

const Sidebar: React.FC<{ onSelect: (id: string) => void; activeId: string | null; completedIds: string[]; onReview: () => void; onGrammarReview: (level: 'B1' | 'B2') => void; mode: string; isSyncing: boolean; }> = ({ onSelect, activeId, completedIds, onReview, onGrammarReview, mode, isSyncing }) => {
  const progressPercent = Math.round((completedIds.length / ASPEKTE_CHAPTERS.length) * 100);
  return (
    <div className="w-80 h-full bg-white border-r overflow-y-auto flex flex-col p-4 shadow-sm shrink-0">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">D</div>
          <h1 className="text-xl font-bold text-slate-800">DeutschGipfel</h1>
        </div>
        {isSyncing && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" title="Lektionen werden im Hintergrund geladen..." />}
      </div>
      <div className="px-2 mb-8">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"><span>Gesamtfortschritt</span><span>{progressPercent}%</span></div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} /></div>
      </div>
      <div className="flex-1 space-y-1">
        {ASPEKTE_CHAPTERS.map((chap) => (
          <button key={chap.id} onClick={() => onSelect(chap.id)} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeId === chap.id && mode === 'lesson' ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}>
            <div className={`w-2 h-2 rounded-full ${completedIds.includes(chap.id) ? 'bg-green-500' : 'bg-slate-300'}`} />
            <div className="flex-1 min-w-0"><div className="text-xs uppercase tracking-wider opacity-60">Lektion {chap.id}</div><div className="truncate font-medium">{chap.title}</div></div>
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <button onClick={onReview} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${mode === 'review' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="font-bold">Wortschatz-Meister</span></button>
        <button onClick={() => onGrammarReview('B1')} className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${mode === 'grammarB1' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50'}`}><span className="font-bold text-sm">Grammatik B1 (Menschen)</span></button>
        <button onClick={() => onGrammarReview('B2')} className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${mode === 'grammarB2' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-indigo-600 border-indigo-50 hover:bg-indigo-50'}`}><span className="font-bold text-sm">Grammatik B2 (Aspekte)</span></button>
      </div>
    </div>
  );
};

const LessonView: React.FC<{ lessonId: string; lesson: Lesson | null; isGenerating: boolean; onHomeworkSubmit: (text: string) => void; isWordSaved: (word: string) => boolean; onToggleWord: (word: string, translation: string, grammarNote?: string, example?: string) => void; submission?: HomeworkSubmission; isGrading: boolean; }> = ({ lessonId, lesson, isGenerating, onHomeworkSubmit, isWordSaved, onToggleWord, submission, isGrading }) => {
  const [activeTab, setActiveTab] = useState<'reading' | 'vocabulary' | 'grammar' | 'listening' | 'homework'>('reading');
  const chapterMeta = useMemo(() => ASPEKTE_CHAPTERS.find(c => c.id === lessonId), [lessonId]);
  const groupedVocabulary = useMemo(() => {
    if (!lesson) return { der: [], das: [], die: [], none: [] };
    const groups = { der: [] as any[], das: [] as any[], die: [] as any[], none: [] as any[] };
    lesson.content.vocabulary.forEach(v => { if (v.gender in groups) groups[v.gender as keyof typeof groups].push(v); else groups.none.push(v); });
    return groups;
  }, [lesson]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      <div className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between mb-2"><h2 className="text-2xl font-bold text-slate-800">{lessonId}. {chapterMeta?.title}</h2><div className="flex items-center gap-3">{isGenerating && <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100 animate-pulse"><span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>Wird generiert...</div>}<div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{chapterMeta?.topic}</div></div></div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar">{(['reading', 'vocabulary', 'grammar', 'listening', 'homework'] as const).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-sm font-medium capitalize border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab === 'reading' ? 'Lesen' : tab === 'vocabulary' ? 'Wortschatz' : tab === 'grammar' ? 'Grammatik' : tab === 'listening' ? 'Hören' : 'Hausaufgabe'}</button>)}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-8 min-h-[400px] flex flex-col">
          {!lesson || (isGenerating && !lesson) ? <div className="flex-1 flex flex-col items-center justify-center space-y-4"><div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div><p className="text-slate-400 font-medium italic">Inhalte werden vorbereitet...</p></div> : (
            <>{activeTab === 'reading' && <div className="prose prose-slate max-w-none"><h3 className="text-2xl font-bold mb-4">Leseverstehen</h3><WordRenderer text={lesson.content.readingText} glossary={lesson.content.glossary} isWordSaved={isWordSaved} onToggleWord={onToggleWord} /></div>}
              {activeTab === 'vocabulary' && <div className="space-y-10">{(['der', 'das', 'die', 'none'] as const).map(gender => { const words = groupedVocabulary[gender]; if (words.length === 0) return null; return <div key={gender}><h4 className={`text-sm font-black uppercase tracking-widest mb-4 border-b pb-2 ${gender === 'der' ? 'text-blue-600 border-blue-100' : gender === 'die' ? 'text-red-600 border-red-100' : gender === 'das' ? 'text-slate-900 border-slate-200' : 'text-slate-400 border-slate-100'}`}>{gender === 'none' ? 'Wichtige Ausdrücke' : gender.toUpperCase()}</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{words.map((v, i) => { const english = lesson.content.glossary[v.word.toLowerCase()] || ""; const saved = isWordSaved(v.word); return <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-start transition-all hover:bg-white hover:shadow-md"><div className="flex-1"><div className="flex flex-col gap-1"><GenderedWord gender={v.gender} word={v.word} className="text-xl" />{english && <div className="text-sm text-slate-400 font-medium tracking-tight">[{english}]</div>}{v.pluralWord && <div className="flex items-center gap-2 mt-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plural:</span><PluralHighlighter singular={v.word} plural={v.pluralWord} /></div>}</div><div className="text-slate-600 text-sm mt-3 italic flex items-center gap-2 bg-white/50 p-2 rounded-lg"><span className="w-1.5 h-1.5 bg-indigo-200 rounded-full shrink-0"></span><UmlautRenderer text={v.meaning} /></div></div><button onClick={() => onToggleWord(v.word, v.meaning, undefined, v.example)} className={`p-2 transition-all rounded-xl ${saved ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'}`}>{saved ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>}</button></div>; })}</div></div>; })}</div>}
              {activeTab === 'grammar' && <div className="space-y-8"><h3 className="text-2xl font-black text-slate-800 tracking-tight">{lesson.content.grammarPoint.title}</h3><div className="p-8 bg-indigo-50/50 border-2 border-indigo-100 rounded-3xl text-slate-800 leading-relaxed text-lg"><GrammarTermRenderer text={lesson.content.grammarPoint.explanation} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{lesson.content.grammarPoint.examples.map((ex, i) => <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"><span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs flex-shrink-0">✓</span><span className="text-slate-700 font-medium italic"><UmlautRenderer text={ex} /></span></div>)}</div></div>}
              {activeTab === 'listening' && <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200"><div className="mb-6 mx-auto w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center"><svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></div><h4 className="text-xl font-black text-slate-800 mb-2">Hörverstehen</h4><p className="text-slate-500 mb-8 max-w-sm mx-auto">Höre dir den Text an und versuche die Hauptpunkte zu erfassen.</p><button onClick={() => playTextToSpeech(lesson.content.listeningScript)} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:shadow-indigo-200 transition-all uppercase tracking-tighter">Audio abspielen</button></div>}
              {activeTab === 'homework' && <div className="space-y-16 py-4"><div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden"><div className="relative z-10"><h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Mastery Checkpoint</h3><p className="text-slate-300 font-medium">Bearbeite alle Aufgaben für deinen Lernfortschritt.</p></div><div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div></div><div className="grid grid-cols-1 gap-12">{lesson.content.homeworkTasks.map((task, i) => <HomeworkTaskView key={i} task={task} taskIndex={i} onWritingSubmit={onHomeworkSubmit} isGrading={isGrading} submission={submission} />)}</div></div>}</>
          )}
        </div>
      </div>
    </div>
  );
};

const VocabularyReview: React.FC<{ lessonCache: Record<string, Lesson>, completedIds: string[], customVocab: CustomWord[], onRemoveCustomWord: (word: string) => void }> = ({ lessonCache, completedIds, customVocab, onRemoveCustomWord }) => {
  const [view, setView] = useState('all' as 'all' | 'custom' | 'flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState({} as Record<string, boolean>);
  const allVocab = useMemo(() => {
    const lessonVocab = completedIds.flatMap(id => { const lesson = lessonCache[id]; if (!lesson) return []; return lesson.content.vocabulary.map(v => ({ ...v, source: `Lektion ${id}`, custom: false, english: lesson.content.glossary[v.word.toLowerCase()] || "" })); });
    const custom = customVocab.map(v => ({ word: v.word, meaning: v.meaning, gender: 'none' as const, source: 'Wörterbuch', custom: true, pluralWord: '', english: v.meaning, example: v.example || '' }));
    return [...lessonVocab, ...custom];
  }, [lessonCache, completedIds, customVocab]);
  const displayVocab = view === 'custom' ? allVocab.filter(v => v.custom) : allVocab;
  const renderCardFront = (v: any, i: number | string) => (<div className="absolute inset-0 bg-white border p-6 rounded-2xl [backface-visibility:hidden] flex flex-col justify-between items-center text-center overflow-hidden select-none"><div className="w-full text-[10px] font-bold text-indigo-500 flex justify-between uppercase shrink-0"><span className="truncate max-w-[70%]">{v.source}</span>{v.custom && <button onClick={(e) => { e.stopPropagation(); onRemoveCustomWord(v.word); }} className="text-red-400 hover:text-red-600 shrink-0">Entfernen</button>}</div><div className="flex flex-col items-center gap-2 py-4 flex-1 justify-center w-full min-h-0 overflow-hidden"><GenderedWord gender={v.gender} word={v.word} className="text-3xl leading-tight text-center break-words max-w-full" allowWrap={true} /><div className="text-lg text-indigo-600 font-extrabold px-2 leading-snug line-clamp-3 overflow-hidden text-center break-words max-w-full">{v.english || v.meaning}</div>{v.pluralWord && <div className="mt-1 flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm shrink-0"><span className="whitespace-nowrap">Plural:</span><PluralHighlighter singular={v.word} plural={v.pluralWord} /></div>}</div><div className="text-[9px] text-slate-300 font-medium italic shrink-0">Klicken zum Wenden</div></div>);
  const renderCardBack = (v: any) => (<div className="absolute inset-0 bg-indigo-600 rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden select-none"><div className="text-lg font-bold leading-relaxed mb-4 line-clamp-6 overflow-hidden w-full px-2">{v.example ? <UmlautRenderer text={v.example} /> : <span className="opacity-50 italic">Kein Beispiel vorhanden</span>}</div><div className="mt-2 pt-3 border-t border-indigo-400/50 w-full text-[10px] font-black uppercase tracking-widest opacity-60 shrink-0">Beispielsatz (DE)</div></div>);
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 h-full"><div className="max-w-4xl mx-auto"><header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"><h2 className="text-3xl font-bold text-slate-900">Wortschatz-Meister</h2><div className="flex bg-white p-1 rounded-xl shadow-sm border">{(['all', 'custom', 'flashcards'] as const).map(v => <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${view === v ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>{v === 'custom' ? 'Dictionary' : v}</button>)}</div></header>
        {view === 'flashcards' && displayVocab.length > 0 ? <div className="flex flex-col items-center"><div onClick={() => setFlipped(p => ({...p, curr: !p.curr}))} className="w-full max-w-lg h-[350px] cursor-pointer"><div className={`relative h-full w-full rounded-3xl shadow-2xl transition-all duration-700 [transform-style:preserve-3d] ${flipped.curr ? '[transform:rotateY(180deg)]' : ''}`}>{renderCardFront(displayVocab[currentCardIndex], 'flash')}{renderCardBack(displayVocab[currentCardIndex])}</div></div><div className="flex gap-8 mt-10 items-center"><button onClick={() => { setFlipped({}); setCurrentCardIndex(i => (i - 1 + displayVocab.length) % displayVocab.length); }} className="px-6 py-2 bg-white rounded-full border shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Zurück</button><span className="font-bold text-slate-400">{currentCardIndex + 1} / {displayVocab.length}</span><button onClick={() => { setFlipped({}); setCurrentCardIndex(i => (i + 1) % displayVocab.length); }} className="px-6 py-2 bg-white rounded-full border shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Weiter</button></div></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">{displayVocab.map((v, i) => <div key={`${v.word}-${i}`} onClick={() => setFlipped(p => ({...p, [i]: !p[i]}))} className="group h-64 cursor-pointer relative"><div className={`relative h-full w-full rounded-2xl shadow-sm transition-all duration-500 [transform-style:preserve-3d] ${flipped[i] ? '[transform:rotateY(180deg)]' : ''}`}>{renderCardFront(v, i)}{renderCardBack(v)}</div></div>)}</div>}
      </div></div>
  );
};

// --- Grammar Library Component to fix "Cannot find name 'GrammarLibrary'" error ---
const GrammarLibrary: React.FC<{ level: 'B1' | 'B2'; rules: typeof B1_GRAMMAR }> = ({ level, rules }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 h-full">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-xl">{level}</span>
            Grammatik-Bibliothek
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Alle wichtigen Regeln für das Niveau {level} auf einen Blick.</p>
        </header>
        <div className="space-y-6">
          {rules.map((rule, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-800 mb-4">{rule.title}</h3>
              <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 mb-6 text-slate-700 leading-relaxed">
                <GrammarTermRenderer text={rule.explanation} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Beispiele:</p>
                {rule.examples.map((ex, j) => (
                  <div key={j} className="flex items-center gap-3 text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
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

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const savedVocab = localStorage.getItem('deutsch_custom_vocab');
      const dictionary = savedVocab ? JSON.parse(savedVocab) : [];
      const savedState = localStorage.getItem('deutsch_app_state');
      const baseState = savedState ? JSON.parse(savedState) : { completedLessons: [], homeworkSubmissions: {}, currentLessonId: '1.1', lessonCache: {} };
      return { ...baseState, customVocabulary: dictionary } as AppState;
    } catch (e) {
      return { completedLessons: [], homeworkSubmissions: {}, currentLessonId: '1.1', lessonCache: {}, customVocabulary: [] } as AppState;
    }
  });

  const [generatingId, setGeneratingId] = useState(null as string | null);
  const [isGrading, setIsGrading] = useState(false);
  const [mode, setMode] = useState('lesson' as 'lesson' | 'review' | 'grammarB1' | 'grammarB2');
  const [notification, setNotification] = useState(null as { message: string; type: 'success' | 'remove' } | null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Hardened persistence with LRU cache pruning to avoid storage quotas
  useEffect(() => { 
    try {
      localStorage.setItem('deutsch_custom_vocab', JSON.stringify(state.customVocabulary));
      const { customVocabulary, ...rest } = state;
      localStorage.setItem('deutsch_app_state', JSON.stringify(rest)); 
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        const cacheKeys = Object.keys(state.lessonCache);
        if (cacheKeys.length > 3) {
           const prunedCache = { ...state.lessonCache };
           delete prunedCache[cacheKeys[0]]; // Remove oldest lesson
           setState(prev => ({ ...prev, lessonCache: prunedCache }));
        }
      }
    }
  }, [state]);

  const loadLesson = useCallback(async (id: string, isBackground: boolean = false) => {
    if (state.lessonCache[id]) return;
    if (!isBackground) setGeneratingId(id);
    else setIsSyncing(true);

    const chapter = ASPEKTE_CHAPTERS.find(c => c.id === id);
    if (chapter) {
      try {
        const content = await generateLessonContent(chapter.id, chapter.title, chapter.topic);
        setState(prev => ({ ...prev, lessonCache: { ...prev.lessonCache, [id]: content } }));
      } catch (error) {
        console.error(`Failed to load lesson ${id}:`, error);
      } finally {
        if (!isBackground) setGeneratingId(null);
        else setIsSyncing(false);
      }
    }
  }, [state.lessonCache]);

  // Initial load of current lesson
  useEffect(() => {
    if (state.currentLessonId && !state.lessonCache[state.currentLessonId]) {
      loadLesson(state.currentLessonId);
    }
  }, [state.currentLessonId, state.lessonCache, loadLesson]);

  // Background Preloading Logic: Pre-fetches lessons that haven't been opened yet.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isSyncing || generatingId) return;
      
      const nextChaptersToPreload = ASPEKTE_CHAPTERS.filter(c => !state.lessonCache[c.id]).slice(0, 3);
      if (nextChaptersToPreload.length > 0) {
         loadLesson(nextChaptersToPreload[0].id, true);
      }
    }, 5000); // Wait 5s of idle time before background sync
    return () => clearTimeout(timeout);
  }, [state.lessonCache, isSyncing, generatingId, loadLesson]);

  const handleSelectChapter = (id: string) => {
    setMode('lesson');
    setState(prev => ({ ...prev, currentLessonId: id }));
  };

  const isWordSaved = (word: string) => state.customVocabulary.some(v => v.word.toLowerCase() === word.toLowerCase());

  const handleToggleWord = (word: string, meaning: string, grammarNote?: string, example?: string) => {
    if (isWordSaved(word)) {
      setState(p => ({ ...p, customVocabulary: p.customVocabulary.filter(v => v.word.toLowerCase() !== word.toLowerCase()) }));
      setNotification({ message: `"${word}" wurde entfernt`, type: 'remove' });
    } else {
      setState(p => ({ ...p, customVocabulary: [...p.customVocabulary, { word, meaning, grammarNote, example, addedAt: Date.now() }] }));
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
    } catch (e) {} finally { setIsGrading(false); }
  };

  return (
    <div className="flex h-screen w-full text-slate-900 bg-slate-50 overflow-hidden font-inter">
      <Sidebar onSelect={handleSelectChapter} activeId={state.currentLessonId} completedIds={state.completedLessons} onReview={() => setMode('review')} onGrammarReview={(lvl) => setMode(lvl === 'B1' ? 'grammarB1' : 'grammarB2')} mode={mode} isSyncing={isSyncing} />
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {mode === 'review' ? <VocabularyReview lessonCache={state.lessonCache} completedIds={state.completedLessons} customVocab={state.customVocabulary} onRemoveCustomWord={(word) => handleToggleWord(word, '')} /> : 
         mode === 'grammarB1' ? <GrammarLibrary level="B1" rules={B1_GRAMMAR} /> : 
         mode === 'grammarB2' ? <GrammarLibrary level="B2" rules={B2_GRAMMAR} /> : 
         state.currentLessonId ? <LessonView lessonId={state.currentLessonId} lesson={state.lessonCache[state.currentLessonId]} isGenerating={generatingId === state.currentLessonId} onHomeworkSubmit={handleHomeworkSubmit} isWordSaved={isWordSaved} onToggleWord={handleToggleWord} submission={state.homeworkSubmissions[state.currentLessonId]} isGrading={isGrading} /> :
         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white"><h2 className="text-4xl font-bold mb-4">Willkommen bei DeutschGipfel!</h2><p className="text-slate-500 max-w-md">Lerne Deutsch B1 & B2 mit dem Meister-Kurs. Wähle eine Lektion links oder stöbere in der Grammatik-Bibliothek.</p></div>
        }
      </main>
      {notification && <Notification message={notification.message} type={notification.type} onHide={() => setNotification(null)} />}
    </div>
  );
}
