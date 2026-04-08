/**
 * Spell correction utility for common misinformation-related terms.
 * Uses dictionary-based correction + Levenshtein distance for fuzzy matching.
 */

// Common misspellings → correct spelling (focused on misinformation topics)
const SPELLING_MAP = {
  // Health & Medical
  "vacine": "vaccine", "vaccin": "vaccine", "vacccine": "vaccine", "vaccinne": "vaccine",
  "vacination": "vaccination", "vacinnation": "vaccination", "vacinaton": "vaccination",
  "coronavrius": "coronavirus", "coronvirus": "coronavirus", "coranavirus": "coronavirus",
  "coronaviurs": "coronavirus", "corono": "corona", "cornaviurs": "coronavirus",
  "covid": "COVID", "covid19": "COVID-19", "covid-19": "COVID-19", "covd": "COVID",
  "pandimic": "pandemic", "pandamic": "pandemic", "pandmic": "pandemic",
  "hydroxychloroquin": "hydroxychloroquine", "hydroxychloroqune": "hydroxychloroquine",
  "ivermectn": "ivermectin", "ivermctin": "ivermectin", "ivrmectin": "ivermectin",
  "cancr": "cancer", "caner": "cancer", "canser": "cancer",
  "helth": "health", "heatlh": "health", "helath": "health",
  "medcine": "medicine", "medicne": "medicine", "medecine": "medicine",
  "diease": "disease", "desease": "disease", "diseas": "disease", "diseese": "disease",
  "symtoms": "symptoms", "symtpoms": "symptoms", "symptons": "symptoms",
  "infertlity": "infertility", "infertilty": "infertility",
  "aurism": "autism", "autisim": "autism", "autizm": "autism",
  "mircoship": "microchip", "microchp": "microchip", "micrchip": "microchip",

  // Technology
  "5g": "5G", "technolgy": "technology", "tehcnology": "technology",
  "radiaton": "radiation", "radation": "radiation", "radiaion": "radiation",
  "artifical": "artificial", "artficial": "artificial",
  "inteligence": "intelligence", "intellgence": "intelligence", "intlligence": "intelligence",

  // Politics & Government
  "goverment": "government", "governmnet": "government", "govenrment": "government",
  "govermnent": "government", "govnment": "government", "goverent": "government",
  "politcs": "politics", "poltics": "politics", "politcis": "politics",
  "conspracy": "conspiracy", "consipracy": "conspiracy", "conspiray": "conspiracy",
  "conspircy": "conspiracy", "conspirasy": "conspiracy",
  "elction": "election", "electon": "election", "elecion": "election",
  "presedent": "president", "presidnet": "president", "presient": "president",

  // Common action words
  "dangerus": "dangerous", "dangrous": "dangerous", "dangreous": "dangerous",
  "spreadin": "spreading", "spredding": "spreading", "spreeding": "spreading",
  "causin": "causing", "causeing": "causing",
  "prooved": "proved", "provn": "proven", "provenn": "proven",
  "guarantteed": "guaranteed", "guarenteed": "guaranteed", "gauranteed": "guaranteed",
  "immeditly": "immediately", "immediatly": "immediately", "imediately": "immediately",
  "scientsts": "scientists", "sceintists": "scientists", "scintists": "scientists",
  "reserch": "research", "reasearch": "research", "reaserch": "research",
  "informaton": "information", "infomation": "information", "infromation": "information",
  "evidnce": "evidence", "evidance": "evidence", "evedence": "evidence",

  // Scams & Fraud related
  "geniune": "genuine", "geniuine": "genuine",
  "freee": "free", "fre": "free",
  "lottrey": "lottery", "loterry": "lottery", "lotary": "lottery",
  "scaam": "scam", "skam": "scam",
  "hackd": "hacked", "hackked": "hacked",
  "pishing": "phishing", "phising": "phishing", "fishng": "phishing",

  // Climate
  "climte": "climate", "climat": "climate", "climtae": "climate",
  "globel": "global", "gloabl": "global",
  "warmng": "warming", "warmign": "warming",

  // Common words
  "becuase": "because", "becasue": "because", "becase": "because",
  "belive": "believe", "beleive": "believe", "beleve": "believe",
  "recieve": "receive", "receve": "receive",
  "definetly": "definitely", "definately": "definitely", "definitly": "definitely",
  "occured": "occurred", "occured": "occurred",
  "seperate": "separate", "seprate": "separate",
  "suprise": "surprise", "surprize": "surprise",
  "thier": "their", "ther": "their",
  "poeple": "people", "peopel": "people", "pepole": "people",
  "mesage": "message", "messsage": "message", "messge": "message",
  "forwrd": "forward", "forword": "forward", "foward": "forward",
  "urgnt": "urgent", "urgnet": "urgent",
  "breakng": "breaking", "braking": "breaking",
  "shoked": "shocked", "shokced": "shocked",
  "miracel": "miracle", "mirale": "miracle", "miraccle": "miracle",
  "secrt": "secret", "secrete": "secret",
  "proove": "prove", "proov": "prove",
  "teh": "the", "hte": "the",
  "adn": "and", "nad": "and",
  "wth": "with", "wiht": "with", "wtih": "with",
  "wich": "which", "whcih": "which",
  "thsi": "this", "tihs": "this",
  "taht": "that", "htat": "that",
  "form": "from",  // context-dependent, skip this
  "cures": "cures", "cuers": "cures", "curs": "cures",
  "twoers": "towers", "towrs": "towers", "twers": "towers",
  "viurs": "virus", "vrius": "virus", "vrus": "virus", "viris": "virus",
};

/**
 * Levenshtein distance between two strings
 */
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

/**
 * Try to find a close match in our dictionary using Levenshtein distance
 */
function fuzzyMatch(word) {
  const lower = word.toLowerCase();
  
  // Direct dictionary hit
  if (SPELLING_MAP[lower]) {
    return SPELLING_MAP[lower];
  }

  // Fuzzy match: for words >= 4 chars, find closest dictionary key within distance 2
  if (lower.length >= 4) {
    let bestMatch = null;
    let bestDist = Infinity;
    
    // Also check against dictionary VALUES (correct words)
    const allCorrectWords = [...new Set(Object.values(SPELLING_MAP))];
    
    for (const correctWord of allCorrectWords) {
      if (Math.abs(correctWord.length - lower.length) > 2) continue; // skip if lengths differ too much
      const dist = levenshtein(lower, correctWord.toLowerCase());
      const threshold = correctWord.length <= 5 ? 1 : 2; // stricter for short words
      if (dist <= threshold && dist < bestDist && dist > 0) {
        bestDist = dist;
        bestMatch = correctWord;
      }
    }
    
    if (bestMatch) return bestMatch;
  }

  return null; // no correction needed
}

/**
 * Correct spelling in a full text string.
 * Returns { corrected, original, changed, corrections[] }
 */
function correctSpelling(text) {
  const words = text.split(/(\s+|[,.!?;:'"()\[\]{}])/); // split preserving spaces and punctuation
  const corrections = [];
  let changed = false;

  const correctedWords = words.map(word => {
    // Skip whitespace, punctuation, numbers, very short words
    if (/^[\s,.!?;:'"()\[\]{}]+$/.test(word) || /^\d+$/.test(word) || word.length < 2) {
      return word;
    }

    const correction = fuzzyMatch(word);
    if (correction && correction.toLowerCase() !== word.toLowerCase()) {
      corrections.push({ original: word, corrected: correction });
      changed = true;
      // Preserve original casing style
      if (word === word.toUpperCase() && word.length > 1) {
        return correction.toUpperCase();
      }
      if (word[0] === word[0].toUpperCase()) {
        return correction.charAt(0).toUpperCase() + correction.slice(1);
      }
      return correction;
    }
    return word;
  });

  return {
    original: text,
    corrected: correctedWords.join(''),
    changed,
    corrections
  };
}

module.exports = { correctSpelling };
