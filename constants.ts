
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
  { id: '2.4', module: 1, chapter: 2, part: 4, title: 'Wenn zwei sich streiten...', topic: 'Konstruktive Kritik' },

  // Kapitel 3: Arbeit ist das halbe Leben?
  { id: '3.1', module: 1, chapter: 3, part: 1, title: 'Mein Weg zum Job', topic: 'Stellensuche' },
  { id: '3.2', module: 1, chapter: 3, part: 2, title: 'Glücklich im Job?', topic: 'Arbeitszufriedenheit' },
  { id: '3.3', module: 1, chapter: 3, part: 3, title: 'Teamgeist', topic: 'Teambildung' },
  { id: '3.4', module: 1, chapter: 3, part: 4, title: 'Werben Sie für sich!', topic: 'Lebenslauf & Bewerbung' },
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
    title: "Vergleichssätze mit 'als' und 'wie'",
    explanation: "Gleichheit: so / genauso + Grundform + wie. Ungleichheit: Komparativ + als.",
    examples: [
      "Körpersprache ist genauso wichtig wie die gesprochene Sprache.",
      "Botschaften nehmen wir viel schneller wahr, als wir meinen."
    ]
  },
  {
    title: "Zweiteilige Konnektoren",
    explanation: "Verbinden Sätze oder Satzteile paarweise, um Aufzählungen, Alternativen oder Gegensätze auszudrücken.",
    examples: [
      "nicht nur ..., sondern auch (Aufzählung)",
      "weder ... noch (negative Aufzählung)",
      "entweder ... oder (Alternative)",
      "zwar ... aber (Einschränkung)"
    ]
  }
];

export const STATIC_LESSON_DATA: Record<string, any> = {
  "1.1": {
    readingText: "Mein Glück in der neuen Heimat\ngeschrieben am 17. Dezember von Ella Australia\n\nSoll ich das wirklich riskieren? Mein gewohntes Leben aufgeben, den Job kündigen, Familie und Freunde verlassen und in einem anderen Land komplett neu anfangen? Ich habe es gewagt! Ich bin letztes Jahr aus Liebe ziemlich spontan nach Australien ausgewandert.\n\nEigentlich bin ich gar kein so besonders abenteuerlicher Typ. Aber als ich vor zwei Jahren zufällig diesen netten Typen während meines Urlaubs kennengelernt hatte, beschloss ich, mein Leben komplett zu ändern. Das war ganz schön aufregend. Ich musste so viel erledigen! Visum, Zeugnisse übersetzen lassen, Wohnung auflösen...\n\nDer Anfang in einem neuen Land ist allerdings ganz schön schwierig. Ich kannte niemanden außer David, musste mir Arbeit suchen und eine Arbeitserlaubnis zu bekommen war schwieriger, als ich gedacht hatte. Ich hatte ziemlich großes Heimweh. Aber ich habe nicht aufgegeben und zum Glück irgendwann eine Stelle als Grafikerin gefunden.",
    glossary: { "auswandern": "emigrate", "auflösen": "dissolve/terminate", "Heimweh": "homesickness" },
    vocabulary: [
      { word: "auswandern", gender: "none", meaning: "to emigrate", example: "Sie ist letztes Jahr nach Australien ausgewandert." },
      { word: "das Heimweh", gender: "das", meaning: "homesickness", example: "Ella hatte am Anfang großes Heimweh." },
      { word: "die Arbeitserlaubnis", gender: "die", meaning: "work permit", example: "Es war schwer, eine Arbeitserlaubnis zu bekommen." }
    ],
    grammarPoint: {
      title: "Angaben im Mittelfeld",
      explanation: "Die Reihenfolge folgt oft: temporal (Wann?) - kausal (Warum?) - modal (Wie?) - lokal (Wo?). Kurz: tekamolo.",
      examples: ["Ich bin letztes Jahr aus Liebe ziemlich spontan nach Australien ausgewandert."]
    },
    listeningScript: "Ella berichtet von ihren ersten Monaten in Sydney und der Herausforderung, eine Wohnung zu finden.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Wortstellung (WB S.10)", instruction: "Wählen Sie die richtige Position für die Pronomen.", question: "Maria hat ein Visum beantragt. Das Konsulat hat ...", options: ["ihr es dann zugeschickt", "es ihr dann zugeschickt", "dann es ihr zugeschickt"], solution: "es ihr dann zugeschickt" },
      { type: "multiple-choice", title: "Tekamolo (WB S.10)", instruction: "Welche Reihenfolge ist korrekt?", question: "Wir sind geflogen: (zu Ella / letzten Monat / ganz spontan)", options: ["Wir sind letzten Monat ganz spontan zu Ella geflogen.", "Wir sind zu Ella letzten Monat ganz spontan geflogen.", "Wir sind ganz spontan letzten Monat zu Ella geflogen."], solution: "Wir sind letzten Monat ganz spontan zu Ella geflogen." },
      { type: "writing", title: "Textproduktion", instruction: "Können Sie sich vorstellen, selbst auszuwandern? Wohin würden Sie gehen? Welche Schwierigkeiten könnten auftreten? (Lehrbuch S. 23)", solution: "Individuell" }
    ]
  },
  "1.2": {
    readingText: "Unsere Muttersprache - Ein Stück Heimat\nDie Schweiz war von Anfang an ein vielsprachiges, multikulturelles Land, in dem mehrere Muttersprachen gesprochen werden, denn die Schweiz ist eine 'Eidgenossenschaft': Das bedeutet ein Zusammenschluss von inzwischen 26 Kantonen. Die einzelnen Kantone sind politisch sehr selbstständig und haben z.B. jeweils ein eigenes Parlament und auch unterschiedliche Amtssprachen. Schon im 17. Jahrhundert wurde jemand, der innerhalb der Schweiz reiste, schnell mit einer anderen Sprache konfrontiert. Die Verwaltungsprache war aber Deutsch. Nachdem sich das Land um französisch- und italienischsprachige Gebiete vergrößert hatte, bekamen diese Sprachen dieselbe Bedeutung. 1848 wurden alle drei als Amtssprachen anerkannt, 1938 kam Rätoromanisch dazu.",
    glossary: { "die Eidgenossenschaft": "confederation", "der Kanton": "canton", "Amtssprache": "official language" },
    vocabulary: [
      { word: "vielsprachig", gender: "none", meaning: "multilingual", example: "Die Schweiz ist ein vielsprachiges Land." },
      { word: "der Wandel", gender: "der", meaning: "change/transformation", example: "In letzter Zeit kann man hier einen Wandel beobachten." }
    ],
    grammarPoint: {
      title: "Vergleichssätze",
      explanation: "Vergleichen Sie Zustände. Bei Gleichheit nutzt man 'wie', bei Ungleichheit 'als'.",
      examples: ["Deutsch ist in der Schweiz verbreiteter als Italienisch.", "Er spricht genauso gut Französisch wie Deutsch."]
    },
    listeningScript: "Ein Beitrag über die Sprachvielfalt in der Schweiz und die Rolle des Englischen im Berufsleben.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Inhalt (LB S.12)", instruction: "Wählen Sie die richtige Aussage zum Text.", question: "Was ist der Grund für die Vielsprachigkeit der Schweiz?", options: ["Der Zusammenschluss von 26 Kantonen", "Wegen der vielen Touristen", "Weil es nur eine Regierung gibt"], solution: "Der Zusammenschluss von 26 Kantonen" },
      { type: "writing", title: "Forumsbeitrag", instruction: "Schreiben Sie einen Forumsbeitrag: Welche Sprachen braucht man wann und wozu in Ihrem Land? Welche Erfahrungen haben Sie beim Sprachenlernen gemacht? (LB S. 13)", solution: "Individuell" }
    ]
  },
  "2.1": {
    readingText: "Gesten sagen mehr als tausend Worte...\nEinen Fachtext zum Thema 'Nonverbale Kommunikation' verstehen.\n\nKörpersprache sagt oft mehr als tausend Worte. Mimik, Gestik und die Körperhaltung sind entscheidende Faktoren der Kommunikation. Forscher haben herausgefunden, dass nur ein kleiner Teil unserer Botschaft über das gesprochene Wort vermittelt wird. Der Rest wird nonverbal transportiert. In verschiedenen Kulturen können die gleichen Signale jedoch unterschiedliche Bedeutungen haben. Ein Nicken bedeutet nicht überall 'Ja'. Wer professionell kommunizieren will, muss lernen, auch auf die Zwischentöne zu achten.",
    glossary: { "die Gestik": "gestures", "die Mimik": "facial expressions", "nonverbal": "non-verbal" },
    vocabulary: [
      { word: "verraten", gender: "none", meaning: "to betray/reveal", example: "Menschen verraten ihre Emotionen oft unbewusst." },
      { word: "wahrnehmen", gender: "none", meaning: "to perceive", example: "Wir nehmen Körpersignale instinktiv wahr." }
    ],
    grammarPoint: {
      title: "Vergleichssätze mit als und wie",
      explanation: "Nebensätze mit als und wie drücken einen Vergleich aus. Sie hängen von einem Adjektiv ab.",
      examples: [
        "Wir achten instinktiv viel mehr auf die Körpersprache, als wir meinen.",
        "Botschaften nehmen wir so schnell wahr, wie wir gesprochene Sprache aufnehmen."
      ]
    },
    listeningScript: "Ein Experte spricht über die häufigsten Missverständnisse in der Körpersprache.",
    homeworkTasks: [
      { type: "multiple-choice", title: "Vergleiche (WB S.25)", instruction: "Wählen Sie 'als' oder 'wie'.", question: "Die Körpersprache spielt eine größere Rolle, ... ich gedacht habe.", options: ["wie", "als"], solution: "als" },
      { type: "multiple-choice", title: "Je... desto (WB S.25)", instruction: "Verbinden Sie die Sätze.", question: "Man liest viel. Der Wortschatz wird groß.", options: ["Je viel man liest, desto großer wird der Wortschatz.", "Je mehr man liest, desto größer wird der Wortschatz."], solution: "Je mehr man liest, desto größer wird der Wortschatz." }
    ]
  }
};
