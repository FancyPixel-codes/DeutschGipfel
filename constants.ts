
export const ASPEKTE_CHAPTERS = [
  // Kapitel 1: Heimat ist ...
  { id: '1.1', module: 1, chapter: 1, part: 1, title: 'Neue Heimat', topic: 'Erfahrungen beim Auswandern' },
  { id: '1.2', module: 1, chapter: 1, part: 2, title: 'Ein Land, viele Sprachen', topic: 'Vielsprachigkeit in der Schweiz' },
  { id: '1.3', module: 1, chapter: 1, part: 3, title: 'Missverständliches', topic: 'Interkulturelle Kommunikation' },
  { id: '1.4', module: 1, chapter: 1, part: 4, title: 'Zu Hause in Deutschland', topic: 'Integration & Einwanderung' },
  
  // Kapitel 2: Sprich mit mir!
  { id: '2.1', module: 1, chapter: 2, part: 1, title: 'Gesten sagen mehr als tausend Worte', topic: 'Nonverbale Kommunikation' },
  { id: '2.2', module: 1, chapter: 2, part: 2, title: 'Sprachen kinderleicht?!', topic: 'Frühes Fremdsprachenlernen' },
  { id: '2.3', module: 1, chapter: 2, part: 3, title: 'Smalltalk', topic: 'Die Kunst der kleinen Worte' },
  { id: '2.4', module: 1, chapter: 2, part: 4, title: 'Wenn zwei sich streiten...', topic: 'Konfliktlösung' },

  // Kapitel 3: Arbeit ist das halbe Leben?
  { id: '3.1', module: 1, chapter: 3, part: 1, title: 'Mein Weg zum Job', topic: 'Stellensuche' },
  { id: '3.2', module: 1, chapter: 3, part: 2, title: 'Glücklich im Job?', topic: 'Arbeitszufriedenheit' },
  { id: '3.3', module: 1, chapter: 3, part: 3, title: 'Teamgeist', topic: 'Teambildung' },
  { id: '3.4', module: 1, chapter: 3, part: 4, title: 'Werben Sie für sich!', topic: 'Lebenslauf & Bewerbung' },

  // Kapitel 4: Zusammen leben
  { id: '4.1', module: 2, chapter: 4, part: 1, title: 'Sport gegen Gewalt', topic: 'Jugendprojekte' },
  { id: '4.2', module: 2, chapter: 4, part: 2, title: 'Armut', topic: 'Soziale Herausforderungen' },
  { id: '4.3', module: 2, chapter: 4, part: 3, title: 'Im Netz', topic: 'Internetverhalten' },
  { id: '4.4', module: 2, chapter: 4, part: 4, title: 'Der kleine Unterschied', topic: 'Rollenbilder' },

  // Kapitel 5: Wer Wissen schafft
  { id: '5.1', module: 2, chapter: 5, part: 1, title: 'Wissenschaft für Kinder', topic: 'Nachwuchsförderung' },
  { id: '5.2', module: 2, chapter: 5, part: 2, title: 'Wer einmal lügt...', topic: 'Wahrheit & Lüge' },
  { id: '5.3', module: 2, chapter: 5, part: 3, title: 'Ist da jemand?', topic: 'Zukunftsvisionen' },
  { id: '5.4', module: 2, chapter: 5, part: 4, title: 'Gute Nacht!', topic: 'Schlafforschung' },
];

export const B1_GRAMMAR = [
  {
    title: "Konjunktiv II",
    explanation: "Drückt Wünsche, Träume und höfliche Bitten aus. Bildung meist mit 'würde + Infinitiv' oder speziellen Formen von haben/sein.",
    examples: ["Ich würde gerne am Meer wohnen.", "Hättest du morgen Zeit?", "Wenn ich reich wäre..."]
  },
  {
    title: "Passiv Präsens",
    explanation: "Fokus auf die Handlung. Bildung: werden + Partizip II.",
    examples: ["Das Haus wird gebaut.", "Hier wird Deutsch gesprochen."]
  }
];

export const B2_GRAMMAR = [
  {
    title: "Wortstellung im Mittelfeld (TEKAMOLO)",
    explanation: "Die Reihenfolge der Angaben im Satz folgt meist dem Schema: Temporal (Wann?), Kausal (Warum?), Modal (Wie?), Lokal (Wo?).",
    examples: [
      "Ich bin letztes Jahr (T) aus Liebe (K) ziemlich spontan (M) nach Australien (L) ausgewandert.",
      "Ein Bekannter hat Ella letztes Jahr (T) netterweise (M) bei der Wohnungssuche (L) geholfen."
    ]
  },
  {
    title: "Relativsätze mit 'wer'",
    explanation: "Werden verwendet, um Personen unbestimmt zu beschreiben. Sie beginnen mit 'wer', 'wen', 'wem'. Im Hauptsatz steht oft ein Demonstrativpronomen wie 'der', 'den', 'dem'.",
    examples: [
      "Wer erwischt wurde, der bekam Hausverbot.",
      "Wem er Taekwondo beibringt, der merkt schnell, dass es keinen Sinn macht, Mist zu bauen."
    ]
  },
  {
    title: "Passiv und Passiversatzformen",
    explanation: "Neben dem Passiv mit 'werden' gibt es Alternativen: 'sein + zu + Infinitiv' (müssen/können), 'sich lassen + Infinitiv' (können) oder Adjektive auf -bar/-lich.",
    examples: [
      "Die Begeisterung ist zu wecken. (= muss geweckt werden)",
      "Die Scheu lässt sich abbauen. (= kann abgebaut werden)",
      "Experimente sind durchführbar. (= können durchgeführt werden)"
    ]
  }
];

export const STATIC_LESSON_DATA: Record<string, any> = {
  "1.1": {
    readingText: "Mein Glück in der neuen Heimat\nSoll ich das wirklich riskieren? Mein gewohntes Leben aufgeben, den Job kündigen, Familie und Freunde verlassen und in einem anderen Land komplett neu anfangen? Ich habe es gewagt! Ich bin letztes Jahr aus Liebe ziemlich spontan nach Australien ausgewandert. Eigentlich bin ich gar kein so besonders abenteuerlicher Typ. Aber als ich vor zwei Jahren zufällig David kennengelernt hatte, beschloss ich, mein Leben komplett zu ändern. Das war ganz schön aufregend. Ich musste mich um ein Visum kümmern, meine Zeugnisse übersetzen lassen, meine Wohnung auflösen usw.\nDer Anfang in einem neuen Land ist allerdings ganz schön schwierig. Ich kannte niemanden außer David, musste mir Arbeit suchen und eine Arbeitserlaubnis zu bekommen war schwieriger, als ich gedacht hatte. Ich hatte ziemlich großes Heimweh. Aber ich habe nicht aufgegeben und zum Glück eine Stelle als Grafikerin gefunden.",
    glossary: { "auswandern": "to emigrate", "auflösen": "to terminate/dissolve", "Heimweh": "homesickness" },
    vocabulary: [
      { word: "auswandern", gender: "none", meaning: "to emigrate", example: "Sie ist nach Australien ausgewandert." },
      { word: "das Heimweh", gender: "das", meaning: "homesickness", example: "Ella hatte am Anfang großes Heimweh." },
      { word: "die Arbeitserlaubnis", gender: "die", meaning: "work permit", example: "Es war schwer, eine Arbeitserlaubnis zu bekommen." }
    ],
    grammarPoint: {
      title: "Angaben im Mittelfeld (TEKAMOLO)",
      explanation: "Temporal - Kausal - Modal - Lokal. Wenn man eine Angabe besonders betonen möchte, kann man sie auf Position 1 stellen.",
      examples: ["Aus Liebe bin ich letztes Jahr ziemlich spontan nach Australien ausgewandert."]
    },
    homeworkTasks: [
      { type: "multiple-choice", title: "Wortstellung", instruction: "Wählen Sie die richtige Position.", question: "Ein Bekannter hat Ella letztes Jahr netterweise ... geholfen.", options: ["bei der Wohnungssuche", "Wohnungssuche bei der"], solution: "bei der Wohnungssuche" },
      { type: "writing", title: "Erfahrungsbericht", instruction: "Schreiben Sie einen kurzen Text über Ihre eigenen Erfahrungen im Ausland oder einen Wunschort.", solution: "Individuell" }
    ]
  },
  "4.1": {
    readingText: "Sport gegen Gewalt\nWie in jeder Großstadt gibt es auch in Hamburg soziale Probleme. Denn was machen 15-Jährige in einem sozial schwachen Stadtteil nach der Schule? Vor einigen Jahren hätten die meisten Kids von Hamburg Jenfeld geantwortet: 'Ab ins Einkaufszentrum.' Hier ist es warm und trocken und man kann sich seine Langeweile vertreiben: das eine oder andere klauen, Handtaschen stehlen, Graffiti sprühen und so weiter.\nFahim Yusufzai, ein gebürtiger Afghane, arbeitete viele Jahre als Sicherheitsleiter im Einkaufszentrum Jenfeld. Irgendwann wollte er nicht mehr tatenlos akzeptieren, dass es immer die gleichen Jugendlichen waren, die Ärger machten. Er gründete den Verein 'Sport gegen Gewalt'. Wer zu ihm ins Taekwondo-Training kommt, den bringt er nicht zur Polizei. Das regelmäßige Training stärkt das Gefühl, respektiert zu werden und etwas leisten zu können.",
    glossary: { "vertreiben": "to drive away/kill (time)", "gebuertig": "born in", "tatenlos": "inactive" },
    vocabulary: [
      { word: "die Disziplin", gender: "die", meaning: "discipline", example: "Sport erfordert viel Disziplin." },
      { word: "respektieren", gender: "none", meaning: "to respect", example: "Man muss die Regeln respektieren." }
    ],
    grammarPoint: {
      title: "Relativsätze mit 'wer'",
      explanation: "Relativsätze mit 'wer' beschreiben eine unbestimmte Person näher. Der Nebensatz beginnt mit 'wer', der Hauptsatz oft mit 'der'.",
      examples: ["Wer erwischt wurde, der bekam Hausverbot.", "Wem er Taekwondo beibringt, der merkt schnell, dass es keinen Sinn macht, Mist zu bauen."]
    },
    homeworkTasks: [
      { type: "multiple-choice", title: "Relativpronomen", instruction: "Wählen Sie das richtige Pronomen.", question: "... täglich Sport treibt, wird von Krankheiten verschont.", options: ["Wer", "Wen", "Wem"], solution: "Wer" },
      { type: "multiple-choice", title: "Dativ-Bezug", instruction: "Wählen Sie die richtige Form.", question: "... sich oft müde fühlt, ist Sport zu empfehlen.", options: ["Wer", "Wen", "Wem"], solution: "Wem" }
    ]
  },
  "5.1": {
    readingText: "Wissenschaft für Kinder\nOft klagen Lehrer über die mangelnde Konzentration und Motivation ihrer Schüler im Unterrichtsalltag. Doch ein Tag im 'NatLab' ist alles andere als Alltag. Die Schüler hängen einem jungen Mann an den Lippen, stellen interessierte Fragen und versuchen begeistert, Antworten zu geben. Kurze Zeit später stehen die Kinder im Labor und führen ein Experiment durch. Beim Besuch des Mitmachlabors der Freien Universität Berlin sind die Kinder konzentriert bei der Sache. Seit sie sich ihre weißen Laborkittel angezogen haben, sind sie wie ausgewechselt. Im NatLab werden die Kinder sanft und mit viel Spaß an die Wissenschaft herangeführt. Naturwissenschaftliche Phänomene sind so viel besser verständlich. Das NatLab wurde 2002 gegründet und ist nur eine von vielen Einrichtungen in der Hauptstadt.",
    glossary: { "mangelnd": "lacking", "an den Lippen hängen": "to hang on every word", "ausgewechselt": "transformed" },
    vocabulary: [
      { word: "das Phänomen", gender: "das", meaning: "phenomenon", example: "Naturwissenschaftliche Phänomene sind spannend." },
      { word: "die Forschung", gender: "die", meaning: "research", example: "Die Forschung ist überlebenswichtig." }
    ],
    grammarPoint: {
      title: "Passiversatzformen",
      explanation: "Statt Passiv mit 'werden' kann man oft 'sein + zu + Infinitiv' oder 'sich lassen + Infinitiv' verwenden.",
      examples: [
        "Die Begeisterung ist zu wecken. (= muss geweckt werden)",
        "Die Scheu lässt sich abbauen. (= kann abgebaut werden)"
      ]
    },
    homeworkTasks: [
      { type: "multiple-choice", title: "Satzumbau", instruction: "Wählen Sie die Passiversatzform.", question: "Kinder können leicht motiviert werden. -> Kinder ...", options: ["lassen sich leicht motivieren", "sind leicht zu motivieren", "beides ist richtig"], solution: "beides ist richtig" },
      { type: "multiple-choice", title: "Bedeutung", instruction: "Welche Bedeutung hat 'sein + zu'?", question: "Die Aufgabe ist bis morgen zu lösen.", options: ["Möglichkeit", "Notwendigkeit"], solution: "Notwendigkeit" }
    ]
  }
};
