
export const ASPEKTE_CHAPTERS = [
  { id: '1.1', module: 1, chapter: 1, part: 1, title: 'Heimat ist... (Teil 1)', topic: 'Identität und Herkunft' },
  { id: '1.2', module: 1, chapter: 1, part: 2, title: 'Heimat ist... (Teil 2)', topic: 'Wurzeln und Migration' },
  { id: '2.1', module: 1, chapter: 2, part: 1, title: 'Spracherlebnisse (Teil 1)', topic: 'Kommunikation' },
  { id: '2.2', module: 1, chapter: 2, part: 2, title: 'Spracherlebnisse (Teil 2)', topic: 'Mehrsprachigkeit' },
  { id: '3.1', module: 1, chapter: 3, part: 1, title: 'Fit für... (Teil 1)', topic: 'Arbeitswelt' },
  { id: '3.2', module: 1, chapter: 3, part: 2, title: 'Fit für... (Teil 2)', topic: 'Berufliche Zukunft' },
  { id: '4.1', module: 2, chapter: 4, part: 1, title: 'Zusammen leben (Teil 1)', topic: 'Wohnformen' },
  { id: '4.2', module: 2, chapter: 4, part: 2, title: 'Zusammen leben (Teil 2)', topic: 'Generationenkonflikte' },
  { id: '5.1', module: 2, chapter: 5, part: 1, title: 'Wer Wissen schafft (Teil 1)', topic: 'Forschung und Studium' },
  { id: '5.2', module: 2, chapter: 5, part: 2, title: 'Wer Wissen schafft (Teil 2)', topic: 'Innovation' },
  { id: '6.1', module: 2, chapter: 6, part: 1, title: 'Fit im Netz (Teil 1)', topic: 'Medienkonsum' },
  { id: '6.2', module: 2, chapter: 6, part: 2, title: 'Fit im Netz (Teil 2)', topic: 'Digitale Welt' },
  { id: '7.1', module: 3, chapter: 7, part: 1, title: 'Kulturwelten (Teil 1)', topic: 'Literatur und Kunst' },
  { id: '8.1', module: 3, chapter: 8, part: 1, title: 'Das Geld (Teil 1)', topic: 'Konsum und Finanzen' },
  { id: '9.1', module: 3, chapter: 9, part: 1, title: 'Natur pur (Teil 1)', topic: 'Umwelt und Klima' },
  { id: '10.1', module: 3, chapter: 10, part: 1, title: 'Zeitgeschehen (Teil 1)', topic: 'Politik und Geschichte' },
];

export const B1_GRAMMAR = [
  {
    title: "Menschen B1: Konjunktiv II",
    explanation: "Wünsche, Träume und höfliche Bitten. Wir verwenden 'würde + Infinitiv' oder die Formen von 'haben' (hätte) und 'sein' (wäre).",
    examples: ["Ich würde gerne am Meer wohnen.", "Hättest du morgen Zeit?", "Wenn ich reich wäre..."]
  },
  {
    title: "Menschen B1: Passiv Präsens",
    explanation: "Der Fokus liegt auf der Handlung, nicht auf der Person. Bildung: werden + Partizip II.",
    examples: ["Das Haus wird gebaut.", "Die Brötchen werden morgens gebacken.", "Hier wird Deutsch gesprochen."]
  },
  {
    title: "Menschen B1: Genitiv",
    explanation: "Zeigt Besitz oder Zugehörigkeit. Artikel: des (Mask/Neut), der (Fem/Plural). Maskuline und neutrale Nomen erhalten meist ein -s oder -es.",
    examples: ["Das Auto meines Vaters.", "Die Tür des Hauses.", "Während der Ferien."]
  }
];

export const B2_GRAMMAR = [
  {
    title: "Aspekte B2: Zweiteilige Konnektoren",
    explanation: "Verbinden Satzteile oder Sätze paarweise. Häufige Paare: nicht nur... sondern auch, sowohl... als auch, entweder... oder, weder... noch.",
    examples: ["Heimat ist nicht nur ein Ort, sondern auch ein Gefühl.", "Er spricht sowohl Deutsch als auch Englisch.", "Weder das Wetter noch das Essen war gut."]
  }
];

export const STATIC_LESSON_DATA: Record<string, any> = {
  "1.1": {
    readingText: "Was ist eigentlich 'Heimat'? Für viele Menschen ist Heimat dort, wo sie geboren sind. Aber Heimat kann sich im Laufe des Lebens verändern. In einer globalisierten Welt definieren vor vor allem junge Menschen Heimat oft über soziale Netzwerke und Freundschaften. Es ist kein fester geografischer Ort mehr, sondern ein Gefühl von Sicherheit und Vertrautheit. Migration spielt hierbei eine zentrale Rolle: Wer seine Wurzeln verlässt, muss oft eine 'neue Heimat' finden. Dies ist ein Prozess der Integration, aber auch der Bewahrung der eigenen kulturellen Identität. Sprache ist dabei der wichtigste Schlüssel. Ohne die Fähigkeit, sich in der neuen Umgebung auszudrücken, bleibt man ein Fremder. Doch Heimat kann auch ein Geruch, eine Melodie oder ein bestimmtes Gericht sein. Letztendlich ist Heimat dort, wo man sich verstanden und sicher fühlt.",
    glossary: { "die Wurzeln": "roots", "die Identität": "identity", "die Integration": "integration", "die Vertrautheit": "familiarity" },
    vocabulary: [
      { word: "die Heimat", gender: "die", meaning: "homeland", example: "Heimat ist ein Gefühl." },
      { word: "die Wurzeln", gender: "plural", meaning: "roots", example: "Er hat seine Wurzeln in Berlin." },
      { word: "die Identität", gender: "die", meaning: "identity", example: "Sprache prägt die Identität." }
    ],
    grammarPoint: {
      title: "Zweiteilige Konnektoren",
      explanation: "Verbinden Satzteile paarweise (nicht nur... sondern auch).",
      examples: ["Heimat ist nicht nur ein Ort, sondern auch ein Gefühl."]
    },
    listeningScript: "Dialog über Heimatgefühle und Umzüge.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Leseverstehen", instruction: "Wählen Sie die richtige Aussage zum Text.", question: "Wie definieren junge Menschen heute oft Heimat?", options: ["Nur über den Geburtsort", "Über soziale Netzwerke", "Über das Wetter"], solution: "Über soziale Netzwerke" },
      { type: "multiple-choice", title: "Aufgabe 2: Details", instruction: "Wählen Sie die richtige Ergänzung.", question: "Warum ist Sprache laut Text so wichtig?", options: ["Wegen der Grammatik", "Weil sie der Schlüssel zur Integration ist", "Um neue Lieder zu lernen"], solution: "Weil sie der Schlüssel zur Integration ist" },
      { type: "multiple-choice", title: "Aufgabe 3: Interpretation", instruction: "Was ist eine weitere Definition von Heimat im Text?", options: ["Ein Bankkonto", "Ein Geruch oder eine Melodie", "Ein schneller Internetanschluss"], solution: "Ein Geruch oder eine Melodie" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Was bedeutet Heimat für Sie persönlich? Schreiben Sie 150-200 Wörter.", solution: "Individuell" }
    ]
  },
  "1.2": {
    readingText: "Migration und Identität sind eng miteinander verknüpft. Wenn Menschen auswandern, nehmen sie ihre Kultur mit, passen sich aber auch an die neue Umgebung an. Dieser Prozess wird oft als 'Akkulturation' bezeichnet. In der B2-Lektion von Aspekte lernen wir, wie wichtig es ist, die eigene Herkunft zu reflektieren, während man sich in eine neue Gesellschaft integriert. Ein wichtiger Aspekt ist die Mehrsprachigkeit: Viele Migranten leben zwischen zwei oder mehr Sprachen, was sowohl eine Herausforderung als auch eine große Bereicherung darstellen kann.",
    glossary: { "auswandern": "to emigrate", "anpassen": "to adapt", "die Herkunft": "origin" },
    vocabulary: [
      { word: "die Herkunft", gender: "die", meaning: "origin", example: "Meine Herkunft ist wichtig." },
      { word: "auswandern", gender: "none", meaning: "to emigrate", example: "Sie sind vor Jahren ausgewandert." }
    ],
    grammarPoint: {
      title: "Nominalisierung",
      explanation: "Verben und Adjektive werden zu Nomen (z.B. das Wandern, die Wichtigkeit).",
      examples: ["Das Auswandern ist ein großer Schritt.", "Die Bedeutung der Sprache."]
    },
    listeningScript: "Interview mit einer Soziologin über Migration.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Was ist 'Akkulturation'?", options: ["Eine Reise", "Anpassung an eine neue Umgebung", "Spracherwerb"], solution: "Anpassung an eine neue Umgebung" },
      { type: "multiple-choice", title: "Aufgabe 2: Mehrsprachigkeit", instruction: "Wie wird Mehrsprachigkeit im Text bewertet?", options: ["Als reines Hindernis", "Als Herausforderung und Bereicherung", "Als unwichtig"], solution: "Als Herausforderung und Bereicherung" },
      { type: "multiple-choice", title: "Aufgabe 3: Identität", instruction: "Was sollten Migranten laut Text tun?", options: ["Ihre Herkunft vergessen", "Ihre Herkunft reflektieren", "Nur noch die neue Sprache sprechen"], solution: "Ihre Herkunft reflektieren" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Berichten Sie über die Vor- und Nachteile der Mehrsprachigkeit.", solution: "Individuell" }
    ]
  },
  "2.1": {
    readingText: "Small Talk ist mehr als nur oberflächliches Gerede. Er ist der 'soziale Kitt', der Beziehungen initiiert und das Betriebsklima verbessert. In Deutschland gibt es jedoch bestimmte Regeln: Politik und Religion sind oft tabu für den ersten Kontakt. Man spricht lieber über das Wetter, Hobbys oder die Anreise. Ein guter Gesprächspartner stellt offene Fragen und zeigt echtes Interesse. Wer die Kunst des Small Talks beherrscht, findet leichter Zugang zu neuen Gruppen und baut schneller Vertrauen auf.",
    glossary: { "oberflächlich": "superficial", "der Kitt": "glue", "das Betriebsklima": "work atmosphere" },
    vocabulary: [
      { word: "plaudern", gender: "none", meaning: "to chat", example: "Wir haben kurz über das Wetter geplaudert." },
      { word: "das Gespräch", gender: "das", meaning: "conversation", example: "Ein interessantes Gespräch führen." }
    ],
    grammarPoint: {
      title: "Nomen-Verb-Verbindungen",
      explanation: "Kombinationen wie 'ein Gespräch führen' oder 'Interesse zeigen'.",
      examples: ["Wir müssen ein Gespräch führen.", "Er zeigt großes Interesse."]
    },
    listeningScript: "Dialog: Zwei Kollegen beim Kaffeetrinken.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Leseverstehen", instruction: "Welche Themen sind in Deutschland beim Small Talk oft tabu?", options: ["Wetter und Hobbys", "Politik und Religion", "Arbeit und Urlaub"], solution: "Politik und Religion" },
      { type: "multiple-choice", title: "Aufgabe 2: Wirkung", instruction: "Was bewirkt guter Small Talk laut Text?", options: ["Er löst Probleme", "Er verbessert das Betriebsklima", "Er spart Zeit"], solution: "Er verbessert das Betriebsklima" },
      { type: "multiple-choice", title: "Aufgabe 3: Gesprächsführung", instruction: "Was macht einen guten Gesprächspartner aus?", options: ["Er redet viel über sich", "Er stellt offene Fragen", "Er schweigt meistens"], solution: "Er stellt offene Fragen" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Wie wichtig ist Small Talk in Ihrer Kultur? Vergleichen Sie mit Deutschland.", solution: "Individuell" }
    ]
  },
  "2.2": {
    readingText: "Körpersprache sagt oft mehr als tausend Worte. Mimik, Gestik und die Körperhaltung sind entscheidende Faktoren der Kommunikation. Forscher haben herausgefunden, dass nur ein kleiner Teil unserer Botschaft über das gesprochene Wort vermittelt wird. Der Rest wird nonverbal transportiert. In verschiedenen Kulturen können die gleichen Signale jedoch unterschiedliche Bedeutungen haben. Ein Nicken bedeutet nicht überall 'Ja'. Wer professionell kommunizieren will, muss lernen, auch auf die Zwischentöne zu achten.",
    glossary: { "die Mimik": "facial expressions", "die Gestik": "gestures", "nonverbal": "non-verbal" },
    vocabulary: [
      { word: "wahrnehmen", gender: "none", meaning: "to perceive", example: "Er hat die Signale sofort wahrgenommen." },
      { word: "die Körperhaltung", gender: "die", meaning: "posture", example: "Achten Sie auf Ihre Körperhaltung." }
    ],
    grammarPoint: {
      title: "Partizip I als Adjektiv",
      explanation: "Beschreibt eine laufende Handlung (der lachende Mann).",
      examples: ["Die eintreffenden Gäste.", "Ein weinendes Kind."]
    },
    listeningScript: "Vortrag über nonverbale Kommunikation im Beruf.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Wie viel unserer Kommunikation ist laut Text nonverbal?", options: ["Nur ein kleiner Teil", "Fast die Hälfte", "Der größte Teil"], solution: "Der größte Teil" },
      { type: "multiple-choice", title: "Aufgabe 2: Interkulturelles", instruction: "Gilt Körpersprache international?", options: ["Ja, immer", "Nein, Signale können variieren", "Nur in Europa"], solution: "Nein, Signale können variieren" },
      { type: "multiple-choice", title: "Aufgabe 3: Professionalität", instruction: "Worauf sollte man im Beruf achten?", options: ["Nur auf den Text", "Auf Zwischentöne und Körpersprache", "Auf lautes Sprechen"], solution: "Auf Zwischentöne und Körpersprache" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Beschreiben Sie eine Situation, in der Körpersprache zu einem Missverständnis geführt hat.", solution: "Individuell" }
    ]
  },
  "3.1": {
    readingText: "Die moderne Arbeitswelt fordert Flexibilität und lebenslanges Lernen. Früher blieb man oft sein ganzes Leben im gleichen Betrieb. Heute ist Job-Hopping und ständige Weiterbildung normal. Homeoffice und flexible Arbeitszeiten gehören mittlerweile zum Standard in vielen Branchen. Doch diese Freiheit bringt auch Herausforderungen mit sich: Die Grenze zwischen Arbeit und Privatleben verschwimmt immer mehr. Viele Arbeitnehmer klagen über Stress und ständige Erreichbarkeit.",
    glossary: { "die Flexibilität": "flexibility", "verschwimmen": "to blur", "die Erreichbarkeit": "accessibility" },
    vocabulary: [
      { word: "die Herausforderung", gender: "die", meaning: "challenge", example: "Das ist eine große Herausforderung für mich." },
      { word: "flexibel", gender: "none", meaning: "flexible", example: "Wir brauchen flexible Lösungen." }
    ],
    grammarPoint: {
      title: "Konjunktiv II (Vergangenheit)",
      explanation: "Wünsche oder Irrealität in der Vergangenheit (hätte... gemacht).",
      examples: ["Ich wäre gerne gekommen.", "Hätte ich das nur früher gewusst!"]
    },
    listeningScript: "Diskussionsrunde zum Thema 'Homeoffice - Fluch oder Segen?'.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Leseverstehen", instruction: "Was ist ein Nachteil der modernen Arbeitswelt laut Text?", options: ["Zu viel Freizeit", "Ständige Erreichbarkeit", "Geringe Bezahlung"], solution: "Ständige Erreichbarkeit" },
      { type: "multiple-choice", title: "Aufgabe 2: Veränderung", instruction: "Was war früher anders?", options: ["Man wechselte öfter den Job", "Man blieb oft im gleichen Betrieb", "Es gab mehr Homeoffice"], solution: "Man blieb oft im gleichen Betrieb" },
      { type: "multiple-choice", title: "Aufgabe 3: Work-Life-Balance", instruction: "Was passiert mit der Grenze zwischen Job und Privatleben?", options: ["Sie wird klarer", "Sie verschwimmt", "Sie bleibt gleich"], solution: "Sie verschwimmt" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Wie sieht Ihr idealer Arbeitsplatz aus? Gehen Sie auf Arbeitszeiten und Umfeld ein.", solution: "Individuell" }
    ]
  },
  "3.2": {
    readingText: "Erfolg im Beruf hängt nicht nur vom Fachwissen ab, sondern auch von den sogenannten 'Soft Skills'. Teamfähigkeit, Empathie und Konfliktmanagement sind heute wichtiger denn je. Viele Unternehmen investieren massiv in die Fortbildung ihrer Mitarbeiter. Dabei geht es nicht nur um neue Technologien, sondern auch um die Persönlichkeitsentwicklung. Wer bereit ist, sich ständig weiterzuentwickeln und offen für Neues bleibt, hat auf dem Arbeitsmarkt die besten Chancen.",
    glossary: { "die Fortbildung": "further training", "die Empathie": "empathy", "die Notwendigkeit": "necessity" },
    vocabulary: [
      { word: "erwerben", gender: "none", meaning: "to acquire", example: "Er hat neue Qualifikationen erworben." },
      { word: "lebenslang", gender: "none", meaning: "lifelong", example: "Lebenslanges Lernen ist wichtig." }
    ],
    grammarPoint: {
      title: "Modalverb-ähnliche Verben",
      explanation: "Verben wie 'lassen', 'scheinen' oder 'bleiben' mit Infinitiv.",
      examples: ["Er lässt sich die Haare schneiden.", "Die Situation scheint schwierig zu sein."]
    },
    listeningScript: "Bericht über Trends auf dem deutschen Arbeitsmarkt.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Was sind 'Soft Skills' laut Text?", options: ["Programmierkenntnisse", "Teamfähigkeit und Empathie", "Fremdsprachen"], solution: "Teamfähigkeit und Empathie" },
      { type: "multiple-choice", title: "Aufgabe 2: Investition", instruction: "Worin investieren viele Unternehmen?", options: ["In neue Gebäude", "In die Fortbildung der Mitarbeiter", "In Marketing"], solution: "In die Fortbildung der Mitarbeiter" },
      { type: "multiple-choice", title: "Aufgabe 3: Karriere", instruction: "Wer hat die besten Chancen am Arbeitsmarkt?", options: ["Wer viel Glück hat", "Wer offen für Neues bleibt", "Wer nur eine Sache gut kann"], solution: "Wer offen für Neues bleibt" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Schreiben Sie eine Bewerbung für ein Praktikum in einem Bereich Ihrer Wahl.", solution: "Individuell" }
    ]
  },
  "4.1": {
    readingText: "Die Wohnsituation in deutschen Großstädten ist angespannt. Immer mehr Menschen suchen bezahlbaren Wohnraum, doch das Angebot ist knapp. Ein Trend ist das 'Co-Living' oder generationenübergreifende Wohnprojekte. Hier teilen sich Jung und Alt nicht nur den Raum, sondern unterstützen sich auch gegenseitig im Alltag. Dies wirkt der Vereinsamung entgegen und schafft neue soziale Strukturen. Dennoch bleibt der Wunsch nach den eigenen vier Wänden stark.",
    glossary: { "angespannt": "tense", "der Wohnraum": "living space", "das Eigenheim": "own home" },
    vocabulary: [
      { word: "der Wohnraum", gender: "der", meaning: "living space", example: "Wohnraum ist in München sehr teuer." },
      { word: "pendeln", gender: "none", meaning: "to commute", example: "Er muss jeden Tag eine Stunde pendeln." }
    ],
    grammarPoint: {
      title: "Satzverbindungen",
      explanation: "Konnektoren wie 'obwohl' (Nebensatz) und 'dennoch' (Hauptsatz).",
      examples: ["Obwohl die Mieten hoch sind, wollen viele in die Stadt.", "Dennoch ziehen Familien aufs Land."]
    },
    listeningScript: "Interview über modernes Wohnen.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Warum ist die Wohnsituation angespannt?", options: ["Zu viele Wohnungen", "Knappes Angebot an bezahlbarem Raum", "Niemand will in die Stadt"], solution: "Knappes Angebot an bezahlbarem Raum" },
      { type: "multiple-choice", title: "Aufgabe 2: Co-Living", instruction: "Was ist ein Vorteil von Co-Living?", options: ["Man ist immer allein", "Man unterstützt sich gegenseitig", "Es ist immer laut"], solution: "Man unterstützt sich gegenseitig" },
      { type: "multiple-choice", title: "Aufgabe 3: Wohnträume", instruction: "Was wünschen sich viele Familien weiterhin?", options: ["Ein kleines Zimmer", "Ein Eigenheim", "Ein Hotelzimmer"], solution: "Ein Eigenheim" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Wie wohnen Sie zurzeit? Beschreiben Sie Ihre Wohnung und Umgebung.", solution: "Individuell" }
    ]
  },
  "4.2": {
    readingText: "Der Generationenkonflikt wird oft in Diskussionen über das Rentensystem oder den Klimawandel thematisiert. Jüngere Menschen fordern radikalere Veränderungen, während Ältere oft auf Stabilität und bewährte Systeme setzen. Doch es gibt auch viele Beispiele für erfolgreiche Zusammenarbeit. In Mentoring-Programmen geben Erfahrene ihr Wissen an Berufseinsteiger weiter. Wichtig ist ein respektvoller Dialog, um gegenseitiges Verständnis zu fördern und gemeinsame Lösungen für gesellschaftliche Probleme zu finden.",
    glossary: { "der Konflikt": "conflict", "das Mentoring": "mentoring", "bewährt": "proven" },
    vocabulary: [
      { word: "fördern", gender: "none", meaning: "to promote/encourage", example: "Wir müssen den Dialog fördern." },
      { word: "das Verständnis", gender: "das", meaning: "understanding", example: "Gegenseitiges Verständnis ist wichtig." }
    ],
    grammarPoint: {
      title: "Adverbien",
      explanation: "Wörter wie 'allerdings', 'einerseits... andererseits'.",
      examples: ["Einerseits gibt es Konflikte, andererseits gibt es Kooperation.", "Allerdings ist der Dialog schwierig."]
    },
    listeningScript: "Podiumsdiskussion über den Zusammenhalt der Generationen.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Worüber wird oft diskutiert?", options: ["Über das Wetter", "Über Renten und Klima", "Über Sport"], solution: "Über Renten und Klima" },
      { type: "multiple-choice", title: "Aufgabe 2: Zusammenarbeit", instruction: "Wo arbeiten Generationen gut zusammen?", options: ["In Mentoring-Programmen", "Überhaupt nicht", "Nur im Urlaub"], solution: "In Mentoring-Programmen" },
      { type: "multiple-choice", title: "Aufgabe 3: Ziel", instruction: "Was ist laut Text für die Gesellschaft wichtig?", options: ["Dass Junge immer gewinnen", "Respektvoller Dialog", "Weniger Kommunikation"], solution: "Respektvoller Dialog" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Gibt es in Ihrer Familie oder Firma Generationenkonflikte? Berichten Sie.", solution: "Individuell" }
    ]
  },
  "5.1": {
    readingText: "Ein Studium an einer deutschen Hochschule gilt als anspruchsvoll, bietet aber exzellente Karrieremöglichkeiten. Die Studierenden müssen viel Eigeninitiative zeigen und ihr Lernen selbst organisieren. Neben den Vorlesungen spielen Seminare und praktische Übungen eine große Rolle. Ein Trend ist die Internationalisierung: Immer mehr Studiengänge werden auf Englisch angeboten, um Talente aus aller Welt anzuziehen. Gleichzeitig wird der Druck durch Prüfungen und straffe Lehrpläne oft kritisiert.",
    glossary: { "anspruchsvoll": "demanding", "die Eigeninitiative": "initiative", "der Lehrplan": "curriculum" },
    vocabulary: [
      { word: "die Vorlesung", gender: "die", meaning: "lecture", example: "Die Vorlesung beginnt um 8 Uhr." },
      { word: "das Seminar", gender: "das", meaning: "seminar", example: "Im Seminar diskutieren wir viel." }
    ],
    grammarPoint: {
      title: "Zustandspassiv",
      explanation: "Beschreibt einen Zustand nach einer Handlung (ist geöffnet).",
      examples: ["Die Universität ist am Wochenende geschlossen.", "Die Aufgabe ist bereits gelöst."]
    },
    listeningScript: "Campus-Reportage: Studenten berichten von ihrem Alltag.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Was müssen Studenten in Deutschland zeigen?", options: ["Wenig Fleiß", "Viel Eigeninitiative", "Kein Interesse"], solution: "Viel Eigeninitiative" },
      { type: "multiple-choice", title: "Aufgabe 2: Internationalisierung", instruction: "Was ändert sich an den Unis?", options: ["Es gibt weniger Kurse", "Mehr englischsprachige Studiengänge", "Keine Prüfungen mehr"], solution: "Mehr englischsprachige Studiengänge" },
      { type: "multiple-choice", title: "Aufgabe 3: Kritik", instruction: "Was wird laut Text oft kritisiert?", options: ["Die schönen Gebäude", "Der Prüfungsdruck", "Die billigen Cafeterien"], solution: "Der Prüfungsdruck" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Möchten Sie in Deutschland studieren oder arbeiten? Warum (nicht)?", solution: "Individuell" }
    ]
  },
  "5.2": {
    readingText: "Forschung und Entwicklung (F&E) sind entscheidend für die Wettbewerbsfähigkeit der deutschen Wirtschaft. Besonders in Bereichen wie Automobilbau, Chemie und Maschinenbau wird viel investiert. Aber auch Start-ups in der Tech-Branche gewinnen an Bedeutung. Innovation entsteht oft dort, wo Wissenschaft und Wirtschaft eng kooperieren. Der Staat fördert diese Projekte durch Fördergelder. Das Ziel ist es, nachhaltige Technologien zu entwickeln, die den Herausforderungen des Klimawandels gerecht werden.",
    glossary: { "die Wettbewerbsfähigkeit": "competitiveness", "nachhaltig": "sustainable", "das Start-up": "start-up" },
    vocabulary: [
      { word: "entwickeln", gender: "none", meaning: "to develop", example: "Sie entwickeln einen neuen Motor." },
      { word: "fördern", gender: "none", meaning: "to promote", example: "Der Staat fördert Innovationen." }
    ],
    grammarPoint: {
      title: "Infinitiv mit 'zu'",
      explanation: "Verwendung nach bestimmten Verben (versuchen, planen).",
      examples: ["Wir versuchen, die Technik zu verbessern.", "Es ist wichtig, nachhaltig zu handeln."]
    },
    listeningScript: "Interview mit einem Forschungsleiter.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Warum ist F&E wichtig?", options: ["Für die Wettbewerbsfähigkeit", "Nur zum Spaß", "Wegen der Steuern"], solution: "Für die Wettbewerbsfähigkeit" },
      { type: "multiple-choice", title: "Aufgabe 2: Kooperation", instruction: "Wer sollte laut Text zusammenarbeiten?", options: ["Sportler und Musiker", "Wissenschaft und Wirtschaft", "Ärzte und Piloten"], solution: "Wissenschaft und Wirtschaft" },
      { type: "multiple-choice", title: "Aufgabe 3: Nachhaltigkeit", instruction: "Was ist ein wichtiges Ziel der Forschung?", options: ["Mehr Müll produzieren", "Nachhaltige Technologien entwickeln", "Preise erhöhen"], solution: "Nachhaltige Technologien entwickeln" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Welche Innovation finden Sie am wichtigsten für die Zukunft?", solution: "Individuell" }
    ]
  },
  "6.1": {
    readingText: "Soziale Medien haben die Art, wie wir kommunizieren, grundlegend verändert. Während sie uns ermöglichen, weltweit vernetzt zu bleiben, gibt es auch Schattenseiten. Filterblasen und Fake News können die öffentliche Meinung manipulieren. Besonders junge Menschen verbringen viel Zeit auf Plattformen wie Instagram oder TikTok. Experten raten dazu, die eigene Bildschirmzeit kritisch zu hinterfragen und Pausen einzulegen. Eine gute Medienkompetenz bedeutet auch, Quellen prüfen zu können und nicht alles blind zu glauben.",
    glossary: { "die Filterblase": "filter bubble", "manipulieren": "to manipulate", "hinterfragen": "to scrutinize" },
    vocabulary: [
      { word: "vernetzt", gender: "none", meaning: "networked", example: "Wir sind alle vernetzt." },
      { word: "die Kompetenz", gender: "die", meaning: "competence", example: "Medienkompetenz ist wichtig." }
    ],
    grammarPoint: {
      title: "Satzverbindungen (Während...)",
      explanation: "Vergleich von Gegensätzen in einem Satz.",
      examples: ["Während die einen online sind, gehen die anderen spazieren.", "Während es Vorteile gibt, existieren auch Risiken."]
    },
    listeningScript: "Bericht über soziale Medien.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Was ist eine 'Schattenseite' der sozialen Medien laut Text?", options: ["Kostenlose Nutzung", "Filterblasen und Fake News", "Schnelle Nachrichten"], solution: "Filterblasen und Fake News" },
      { type: "multiple-choice", title: "Aufgabe 2: Empfehlung", instruction: "Was raten Experten?", options: ["Mehr Zeit online zu verbringen", "Die Bildschirmzeit zu hinterfragen", "Alle Accounts zu löschen"], solution: "Die Bildschirmzeit zu hinterfragen" },
      { type: "multiple-choice", title: "Aufgabe 3: Medienkompetenz", instruction: "Was gehört zur Medienkompetenz?", options: ["Schnelles Tippen", "Quellen prüfen", "Viele Follower haben"], solution: "Quellen prüfen" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Wie nutzen Sie soziale Medien? Schreiben Sie über Ihre Erfahrungen.", solution: "Individuell" }
    ]
  },
  "6.2": {
    readingText: "Die Digitalisierung der Arbeitswelt schreitet voran. Begriffe wie 'New Work' beschreiben eine flexiblere, digitale Arbeitsweise. Viele Aufgaben werden heute von Software oder Robotern übernommen. Das erfordert von den Arbeitnehmern neue Qualifikationen. Gleichzeitig bietet die digitale Welt Chancen für ortsunabhängiges Arbeiten ('Digitale Nomaden'). Doch der Schutz der persönlichen Daten wird in dieser vernetzten Welt immer schwieriger. Cyber-Sicherheit ist daher ein zentrales Thema für Unternehmen und Privatpersonen geworden.",
    glossary: { "die Digitalisierung": "digitization", "ortsunabhängig": "location-independent", "die Cyber-Sicherheit": "cyber security" },
    vocabulary: [
      { word: "die Qualifikation", gender: "die", meaning: "qualification", example: "Neue Qualifikationen erwerben." },
      { word: "schützen", gender: "none", meaning: "to protect", example: "Daten müssen wir schützen." }
    ],
    grammarPoint: {
      title: "Passiv mit Modalverben",
      explanation: "Bildung: Modalverb + Partizip II + werden.",
      examples: ["Die Daten müssen geschützt werden.", "Das Problem konnte gelöst werden."]
    },
    listeningScript: "Podcast über die Zukunft der Arbeit.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Was beschreibt 'New Work'?", options: ["Härtere Arbeit", "Flexiblere, digitale Arbeitsweise", "Wenig Urlaub"], solution: "Flexiblere, digitale Arbeitsweise" },
      { type: "multiple-choice", title: "Aufgabe 2: Digitale Nomaden", instruction: "Was ist ein Merkmal digitaler Nomaden?", options: ["Sie arbeiten im Büro", "Ortsunabhängiges Arbeiten", "Sie nutzen keine Computer"], solution: "Ortsunabhängiges Arbeiten" },
      { type: "multiple-choice", title: "Aufgabe 3: Datensicherheit", instruction: "Was wird laut Text schwieriger?", options: ["Computer kaufen", "Schutz persönlicher Daten", "E-Mails schreiben"], solution: "Schutz persönlicher Daten" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Stellen Sie sich vor, Sie könnten von überall auf der Welt arbeiten. Wo wäre das?", solution: "Individuell" }
    ]
  },
  "7.1": {
    readingText: "Kultur ist ein weites Feld: Von klassischer Literatur bis hin zur modernen Street Art. In Deutschland hat Kultur einen hohen Stellenwert und wird oft staatlich gefördert. Theater, Opernhäuser und Museen sind feste Bestandteile des gesellschaftlichen Lebens. Doch auch die 'Subkultur' in den Städten prägt das Image des Landes. Kultur bietet die Möglichkeit, sich mit gesellschaftlichen Werten auseinanderzusetzen und neue Perspektiven einzunehmen. Sie ist ein Spiegel der Zeit und hilft uns, die Welt besser zu verstehen.",
    glossary: { "der Stellenwert": "significance", "gefördert": "promoted/funded", "auseinandersetzen": "to deal with/confront" },
    vocabulary: [
      { word: "die Kunst", gender: "die", meaning: "art", example: "Moderne Kunst gefällt mir." },
      { word: "prägen", gender: "none", meaning: "to shape/influence", example: "Erfahrungen prägen den Menschen." }
    ],
    grammarPoint: {
      title: "Präpositionen mit Genitiv",
      explanation: "Wörter wie 'während', 'wegen', 'trotz' und 'anstelle'.",
      examples: ["Trotz des Regens gingen wir ins Museum.", "Wegen der Förderung gibt es viele Projekte."]
    },
    listeningScript: "Kulturbericht aus Berlin.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Welche Rolle spielt Kultur in Deutschland?", options: ["Keine wichtige Rolle", "Hoher Stellenwert, oft staatlich gefördert", "Sie ist verboten"], solution: "Hoher Stellenwert, oft staatlich gefördert" },
      { type: "multiple-choice", title: "Aufgabe 2: Wirkung", instruction: "Was ermöglicht Kultur laut Text?", options: ["Nur Unterhaltung", "Auseinandersetzung mit Werten", "Mehr Geld zu verdienen"], solution: "Auseinandersetzung mit Werten" },
      { type: "multiple-choice", title: "Aufgabe 3: Definition", instruction: "Was wird als 'Spiegel der Zeit' bezeichnet?", options: ["Die Uhr", "Die Kultur", "Das Fernsehen"], solution: "Die Kultur" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Welches kulturelle Ereignis hat Sie zuletzt beeindruckt? Beschreiben Sie es.", solution: "Individuell" }
    ]
  },
  "8.1": {
    readingText: "Geld allein macht nicht glücklich, aber es beruhigt. In unserer Konsumgesellschaft spielt Geld eine zentrale Rolle. Viele Menschen definieren ihren Status über materielle Besitztümer. Gleichzeitig wächst die Kritik an diesem Lebensstil: Bewegungen wie der Minimalismus fordern dazu auf, weniger zu besitzen und bewusster zu konsumieren. In Zeiten von Inflation und steigenden Preisen wird der Umgang mit Finanzen immer wichtiger. Es geht darum, Prioritäten zu setzen und zu lernen, wie man sein Geld sinnvoll anlegt oder spart.",
    glossary: { "der Minimalismus": "minimalism", "die Inflation": "inflation", "sinnvoll": "meaningful" },
    vocabulary: [
      { word: "der Konsum", gender: "der", meaning: "consumption", example: "Bewusster Konsum ist wichtig." },
      { word: "sparen", gender: "none", meaning: "to save money", example: "Er spart für ein neues Auto." }
    ],
    grammarPoint: {
      title: "Vergleiche mit 'je... desto'",
      explanation: "Je mehr man arbeitet, desto mehr verdient man.",
      examples: ["Je reicher man ist, desto mehr kann man kaufen.", "Je weniger man besitzt, desto freier ist man."]
    },
    listeningScript: "Radio-Talk über Finanzen und Konsum.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Was fordern Minimalisten?", options: ["Mehr Geld zu verdienen", "Weniger zu besitzen", "Teurere Autos zu kaufen"], solution: "Weniger zu besitzen" },
      { type: "multiple-choice", title: "Aufgabe 2: Status", instruction: "Wie definieren viele Menschen ihren Status?", options: ["Über Bildung", "Über materielle Besitztümer", "Über Humor"], solution: "Über materielle Besitztümer" },
      { type: "multiple-choice", title: "Aufgabe 3: Finanzen", instruction: "Warum wird der Umgang mit Geld wichtiger?", options: ["Weil man alles ausgeben soll", "Wegen Inflation und steigender Preise", "Weil es keine Banken mehr gibt"], solution: "Wegen Inflation und steigender Preise" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Sparen Sie Geld oder geben Sie es lieber aus? Begründen Sie Ihre Einstellung.", solution: "Individuell" }
    ]
  },
  "9.1": {
    readingText: "Der Schutz der Umwelt ist die größte Herausforderung unserer Zeit. Der Klimawandel führt zu extremen Wetterereignissen und bedroht viele Lebensräume. In Deutschland wird intensiv über die Energiewende diskutiert: Der Ausstieg aus Kohle und Atomkraft sowie der Ausbau erneuerbarer Energien wie Wind- und Solarkraft sind zentrale Ziele. Aber auch jeder Einzelne kann einen Beitrag leisten: Weniger Fleisch essen, Plastik vermeiden oder öfter das Fahrrad nutzen. Es geht darum, unsere natürlichen Ressourcen für zukünftige Generationen zu bewahren.",
    glossary: { "der Klimawandel": "climate change", "die Ressource": "resource", "nachhaltig": "sustainable" },
    vocabulary: [
      { word: "die Umwelt", gender: "die", meaning: "environment", example: "Wir müssen die Umwelt schützen." },
      { word: "vermeiden", gender: "none", meaning: "to avoid", example: "Wir sollten Müll vermeiden." }
    ],
    grammarPoint: {
      title: "Satzverbindungen (Finalsätze)",
      explanation: "Verwendung von 'damit' und 'um... zu'.",
      examples: ["Wir sparen Energie, um das Klima zu schützen.", "Der Staat fördert E-Autos, damit die Luft sauberer wird."]
    },
    listeningScript: "Interview mit einem Klimaforscher.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Was ist ein Ziel der deutschen Energiewende?", options: ["Mehr Kohle verbrennen", "Ausbau erneuerbarer Energien", "Preise für Strom senken"], solution: "Ausbau erneuerbarer Energien" },
      { type: "multiple-choice", title: "Aufgabe 2: Individueller Beitrag", instruction: "Was kann jeder Einzelne tun?", options: ["Mehr Plastik nutzen", "Weniger Fleisch essen", "Jeden Tag Auto fahren"], solution: "Weniger Fleisch essen" },
      { type: "multiple-choice", title: "Aufgabe 3: Motivation", instruction: "Warum sollten wir Ressourcen bewahren?", options: ["Für zukünftige Generationen", "Um Geld zu verdienen", "Weil es modern ist"], solution: "Für zukünftige Generationen" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "Was tun Sie bereits für den Umweltschutz? Was könnten Sie noch besser machen?", solution: "Individuell" }
    ]
  },
  "10.1": {
    readingText: "Die Auseinandersetzung mit der Geschichte ist wichtig, um die Gegenwart zu verstehen. In Deutschland spielt die Erinnerungskultur eine zentrale Rolle, besonders im Hinblick auf das 20. Jahrhundert. Aber auch aktuelle politische Entwicklungen prägen das Zeitgeschehen. Demokratie ist keine Selbstverständlichkeit, sondern muss immer wieder neu verteidigt und gelebt werden. Bürgerliches Engagement, freie Medien und eine starke Zivilgesellschaft sind die Säulen eines freien Landes. Wer sich politisch informiert und einmischt, gestaltet die Zukunft aktiv mit.",
    glossary: { "die Gegenwart": "present", "das Engagement": "commitment/engagement", "die Zivilgesellschaft": "civil society" },
    vocabulary: [
      { word: "die Geschichte", gender: "die", meaning: "history", example: "Geschichte ist ein spannendes Fach." },
      { word: "gestalten", gender: "none", meaning: "to shape/design", example: "Wir gestalten unsere Zukunft." }
    ],
    grammarPoint: {
      title: "Futur I",
      explanation: "Zukunft oder Vermutungen (werden + Infinitiv).",
      examples: ["Wir werden das Ziel erreichen.", "Das wird wohl wahr sein."]
    },
    listeningScript: "Bericht über bürgerliches Engagement.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Aufgabe 1: Verständnis", instruction: "Warum ist Geschichte wichtig?", options: ["Nur zum Auswendiglernen", "Um die Gegenwart zu verstehen", "Um Prüfungen zu bestehen"], solution: "Um die Gegenwart zu verstehen" },
      { type: "multiple-choice", title: "Aufgabe 2: Demokratie", instruction: "Was wird über Demokratie gesagt?", options: ["Sie ist ein Selbstläufer", "Sie muss verteidigt werden", "Sie ist unwichtig"], solution: "Sie muss verteidigt werden" },
      { type: "multiple-choice", title: "Aufgabe 3: Säulen", instruction: "Was gehört zu den Säulen eines freien Landes?", options: ["Starke Zivilgesellschaft", "Nur das Militär", "Hohe Zinsen"], solution: "Starke Zivilgesellschaft" },
      { type: "writing", title: "Aufgabe 4: Textproduktion", instruction: "In welcher historischen Zeit hätten Sie gerne gelebt? Warum?", solution: "Individuell" }
    ]
  }
};
