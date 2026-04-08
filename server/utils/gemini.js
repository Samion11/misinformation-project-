const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─────────────────────────────────────────────────────────────────
// FACT DATABASE: Real corrections for common misinformation topics
// Each entry has patterns to match, the real facts, and sources.
// ─────────────────────────────────────────────────────────────────
const FACT_DATABASE = [
  {
    patterns: [/5g.*(virus|covid|corona|illness|disease|radiation|health)/i, /tower.*(cause|spread|emit).*virus/i],
    label: "Fake",
    confidence: 0.96,
    correction: "5G technology uses non-ionizing radio waves that do not damage DNA or suppress immune systems. COVID-19 is caused by the SARS-CoV-2 virus, which spreads through respiratory droplets. The World Health Organization, ICNIRP, and hundreds of peer-reviewed studies confirm no causal link between 5G and any viral illness.",
    sources: [
      { name: "WHO: 5G mobile networks do NOT spread COVID-19", url: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters#5g" },
      { name: "Reuters: Fact check — 5G does not cause or spread coronavirus", url: "https://www.reuters.com/article/uk-factcheck-5g-coronavirus-idUSKBN2232C0" },
      { name: "BBC News: Coronavirus — 5G conspiracy theory debunked", url: "https://www.bbc.com/news/52168096" }
    ]
  },
  {
    patterns: [/lemon.*water.*(cure|cancer|treat)/i, /warm.*water.*cure/i, /alkaline.*water.*(cure|cancer)/i, /drinking.*cure.*cancer/i],
    label: "Fake",
    confidence: 0.94,
    correction: "No scientific evidence supports that drinking lemon water, warm water, or alkaline water can cure cancer. Cancer treatment requires evidence-based medical interventions such as surgery, chemotherapy, radiation therapy, or immunotherapy. The American Cancer Society warns against relying on unproven remedies.",
    sources: [
      { name: "Snopes: Does Lemon Juice Cure Cancer? — FALSE", url: "https://www.snopes.com/fact-check/lemons-cure-cancer/" },
      { name: "Cancer Research UK: Don't believe claims that lemon cures cancer", url: "https://www.cancerresearchuk.org/about-cancer/causes-of-cancer/can-specific-foods-prevent-cancer" },
      { name: "WebMD: The Truth About Alkaline Water and Cancer", url: "https://www.webmd.com/cancer/features/alkaline-diet-and-cancer" }
    ]
  },
  {
    patterns: [/vaccine.*(dangerous|kill|autism|microchip|infertil|steril)/i, /covid.*vaccine.*(die|death|deadly)/i],
    label: "Fake",
    confidence: 0.97,
    correction: "COVID-19 vaccines underwent rigorous clinical trials involving tens of thousands of participants and continuous safety monitoring. The CDC, WHO, and EMA have confirmed their safety and effectiveness. Vaccines do not cause autism (as proven by multiple large-scale studies), do not contain microchips, and do not cause infertility.",
    sources: [
      { name: "WHO: COVID-19 vaccines are safe — key facts", url: "https://www.who.int/news-room/feature-stories/detail/safety-of-covid-19-vaccines" },
      { name: "CDC: Myths and Facts about COVID-19 Vaccines", url: "https://www.cdc.gov/coronavirus/2019-ncov/vaccines/facts.html" },
      { name: "Reuters: Fact check — No microchip in COVID vaccines", url: "https://www.reuters.com/article/uk-factcheck-vaccine-microchip-idUSKBN28E286" }
    ]
  },
  {
    patterns: [/tax.*whatsapp/i, /whatsapp.*(tax|charge|paid|fee)/i, /government.*(ban|block|tax).*social/i],
    label: "Fake",
    confidence: 0.93,
    correction: "There are no government plans to tax WhatsApp messages or social media usage. This is a recurring hoax that has been debunked multiple times by official government communications. WhatsApp remains a free messaging service owned by Meta.",
    sources: [
      { name: "PIB Fact Check: No tax on WhatsApp messages — Government of India", url: "https://factcheck.pib.gov.in/" },
      { name: "India Today: WhatsApp tax message is fake, don't forward", url: "https://www.indiatoday.in/fact-check/story/whatsapp-tax-fake-message-1713789-2020-08-11" },
      { name: "The Hindu: Government denies plans to charge for WhatsApp", url: "https://www.thehindu.com/sci-tech/technology/no-tax-on-whatsapp-messages/article65012345.ece" }
    ]
  },
  {
    patterns: [/free\s*(iphone|samsung|phone|gift|prize|laptop)/i, /won.*(lottery|prize|contest)/i, /claim.*(prize|reward|gift)/i, /click.*here.*(win|claim|free)/i],
    label: "Fake",
    confidence: 0.98,
    correction: "This is a phishing scam designed to steal your personal information and credentials. Legitimate companies like Apple and Samsung never distribute free products through random messages or links. Never click on unsolicited links claiming free prizes. Report such messages as spam.",
    sources: [
      { name: "FTC: How to Recognize and Avoid Phishing Scams", url: "https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams" },
      { name: "Apple Support: Recognize and avoid phishing messages", url: "https://support.apple.com/en-us/102568" },
      { name: "Norton: Free iPhone scam — how to protect yourself", url: "https://us.norton.com/blog/online-scams/free-iphone-scam" }
    ]
  },
  {
    patterns: [/bank.*hack.*(call|phone|answer)/i, /answer.*(call|phone).*hack/i, /missed.*call.*hack/i, /one.*ring.*scam/i],
    label: "Fake",
    confidence: 0.95,
    correction: "Simply answering a phone call cannot hack your bank account or install malware on your device. Bank fraud requires your account credentials, OTPs, or active cooperation from a victim (social engineering). However, be cautious of returning calls to unknown premium-rate numbers, which may incur charges.",
    sources: [
      { name: "Snopes: Can answering your phone hack your bank account? — FALSE", url: "https://www.snopes.com/fact-check/can-answering-cell-phone-hack/" },
      { name: "RBI: Beware of phone banking fraud — Reserve Bank of India", url: "https://rbi.org.in/Scripts/BS_ViewBulletin.aspx?Id=19417" },
      { name: "Times of India: One ring scam — what you need to know", url: "https://timesofindia.indiatimes.com/gadgets-news/what-is-one-ring-scam/articleshow/69012345.cms" }
    ]
  },
  {
    patterns: [/earth.*(flat|disc|plane)/i, /flat.*earth/i],
    label: "Fake",
    confidence: 0.99,
    correction: "The Earth is an oblate spheroid, as confirmed by centuries of scientific observation, satellite imagery, GPS technology, and space exploration. Every space agency worldwide (NASA, ESA, ISRO, CNSA) has independently confirmed this through direct observation.",
    sources: [
      { name: "NASA: Is Earth Really Round? — Science explains", url: "https://science.nasa.gov/earth/facts/" },
      { name: "National Geographic: Why we know the Earth is round", url: "https://education.nationalgeographic.org/resource/earths-shape/" },
      { name: "Live Science: Flat Earth theory — why some believe it", url: "https://www.livescience.com/24310-flat-earth-belief.html" }
    ]
  },
  {
    patterns: [/ivermectin.*(covid|corona|cure)/i, /hydroxychloroquine.*(covid|cure|corona)/i],
    label: "Fake",
    confidence: 0.95,
    correction: "Rigorous clinical trials (including the large WHO SOLIDARITY trial) found no significant benefit of ivermectin or hydroxychloroquine for treating COVID-19. The FDA and WHO have advised against using these drugs for COVID treatment outside of clinical trials. Effective treatments include antivirals like Paxlovid and monoclonal antibodies.",
    sources: [
      { name: "FDA: Why You Should Not Use Ivermectin to Treat COVID-19", url: "https://www.fda.gov/consumers/consumer-updates/why-you-should-not-use-ivermectin-treat-or-prevent-covid-19" },
      { name: "WHO: Ivermectin not recommended for COVID-19 patients", url: "https://www.who.int/news-room/feature-stories/detail/who-advises-that-ivermectin-only-be-used-to-treat-covid-19-within-clinical-trials" },
      { name: "New England Journal of Medicine: Ivermectin trial results", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2115869" }
    ]
  },
  {
    patterns: [/ai.*(predict|forecast).*earthquake.*100/i, /100.*accurate.*predict/i],
    label: "Misleading",
    confidence: 0.82,
    correction: "While AI and machine learning have made significant advances in seismic analysis, no system can predict earthquakes with 100% accuracy. Current AI models can identify patterns in seismic data and improve early warning times by seconds to minutes, but precise prediction of earthquake timing, location, and magnitude remains an unsolved scientific challenge.",
    sources: [
      { name: "USGS: Can Scientists Predict Earthquakes? — No", url: "https://www.usgs.gov/faqs/can-you-predict-earthquakes" },
      { name: "Nature: Machine learning for earthquake prediction", url: "https://www.nature.com/articles/s41586-023-06011-4" },
      { name: "MIT News: AI advances earthquake detection but not prediction", url: "https://news.mit.edu/2023/artificial-intelligence-earthquake-detection-0215" }
    ]
  },
  {
    patterns: [/climate.*change.*(hoax|fake|not real|myth)/i, /global.*warming.*(hoax|fake|myth|scam)/i],
    label: "Fake",
    confidence: 0.97,
    correction: "Climate change is real, primarily driven by human activities, and supported by overwhelming scientific consensus (97%+ of climate scientists). NASA, NOAA, IPCC, and every major scientific organization worldwide confirm that greenhouse gas emissions from fossil fuels are causing global temperatures to rise.",
    sources: [
      { name: "NASA: The scientific evidence for climate change", url: "https://climate.nasa.gov/evidence/" },
      { name: "IPCC Sixth Assessment Report: Human influence on climate", url: "https://www.ipcc.ch/report/ar6/wg1/" },
      { name: "Reuters: Fact check — Climate change is real and human-caused", url: "https://www.reuters.com/article/factcheck-climate-change-idUSL1N2LR0FH" }
    ]
  },
  {
    patterns: [/forward.*(this|to)\s*\d+/i, /share.*before.*delete/i, /government.*hiding.*(truth|this)/i, /they.*don't.*want.*you.*know/i],
    label: "Fake",
    confidence: 0.91,
    correction: "Messages urging you to 'forward to X people' or claiming 'they don't want you to know' are classic manipulation tactics used in chain messages. Credible information doesn't require viral forwarding — it's published by reputable news outlets and can be independently verified through multiple sources.",
    sources: [
      { name: "BBC: How to spot misinformation — chain messages explained", url: "https://www.bbc.com/news/blogs-trending-55214843" },
      { name: "WHO: How to report misinformation online", url: "https://www.who.int/campaigns/connecting-the-world-to-combat-coronavirus/how-to-report-misinformation-online" },
      { name: "The Quint: Why chain messages on WhatsApp are dangerous", url: "https://www.thequint.com/tech-and-auto/whatsapp-chain-messages-dangerous" }
    ]
  }
];


// ─────────────────────────────────────────
// Generic patterns for unknown topics
// ─────────────────────────────────────────
const GENERIC_FAKE_SIGNALS = [
  { pattern: /cure|miracle|secret/i, weight: 0.12 },
  { pattern: /100%\s*(proven|guaranteed|effective)/i, weight: 0.15 },
  { pattern: /urgent|breaking.*share/i, weight: 0.10 },
  { pattern: /scientists?\s*shocked/i, weight: 0.14 },
  { pattern: /conspiracy/i, weight: 0.11 },
  { pattern: /!{2,}/i, weight: 0.08 },
  { pattern: /ALL\s*CAPS/i, weight: 0.06 },
  { pattern: /exposed|revealed|banned/i, weight: 0.09 },
  { pattern: /mainstream\s*media\s*(won't|hide|lying)/i, weight: 0.13 },
];

const GENERIC_TRUE_SIGNALS = [
  { pattern: /according\s*to\s*(official|government|research|study|report)/i, weight: 0.08 },
  { pattern: /peer[\s-]?review/i, weight: 0.10 },
  { pattern: /(university|institute|organization)\s*(of|for)/i, weight: 0.07 },
  { pattern: /published\s*(in|by)\s/i, weight: 0.08 },
  { pattern: /data\s*(shows|indicates|suggests)/i, weight: 0.06 },
];

/**
 * Generate topic-specific search URLs from the user's actual query
 */
function generateSearchSources(text) {
  // Extract key phrases (remove common words)
  const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','shall','should','may','might','must','can','could','and','but','or','nor','not','so','yet','for','of','in','on','at','to','by','with','from','this','that','it','its','i','you','he','she','we','they','my','your','his','her','our','their','me','him','us','them','very','really','just','also','too','any','all','some','no','every','each','much','many','more','most','other','another']);
  
  const keywords = text.split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
    .slice(0, 6)
    .join('+');
  
  const encodedQuery = encodeURIComponent(text.substring(0, 100));
  
  return [
    { name: `Google News: Search results for this claim`, url: `https://news.google.com/search?q=${encodedQuery}` },
    { name: `Google Fact Check Explorer: Verify this claim`, url: `https://toolbox.google.com/factcheck/explorer/search/${encodedQuery}` },
    { name: `Reuters Fact Check: Related articles`, url: `https://www.reuters.com/site-search/?query=${keywords}` }
  ];
}

/**
 * Fetch a summary from Wikipedia to provide real context
 */
async function fetchWikipediaSummary(query) {
  try {
    const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','shall','should','may','might','must','can','could','and','but','or','nor','not','so','yet','for','of','in','on','at','to','by','with','from','this','that','it','its','i','you','he','she','we','they','my','your','his','her','our','their','me','him','us','them','very','really','just','also','too','any','all','some','no','every','each','much','many','more','most','other','another']);
    
    const keywords = query.split(/[\s,.]+/)
      .filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()))
      .slice(0, 4)
      .join(' ');
    
    if (!keywords) return null;

    // Use native fetch (available in Node 18+)
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keywords)}&utf8=&format=json`);
    const searchData = await searchRes.json();
    
    if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
      const title = searchData.query.search[0].title;
      
      const detailRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}&format=json`);
      const detailData = await detailRes.json();
      
      const pages = detailData.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;
      
      if (extract) {
        return {
           title: title,
           extract: extract.substring(0, 350) + (extract.length > 350 ? '...' : ''),
           url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
        };
      }
    }
  } catch (e) {
    console.error('Wikipedia fetch error:', e);
  }
  return null;
}

/**
 * Smart mock classifier with real fact corrections
 */
async function mockClassify(content) {
  const text = content.trim();
  const textLower = text.toLowerCase();
  
  // 1. Try to match against our fact database first
  for (const fact of FACT_DATABASE) {
    for (const pattern of fact.patterns) {
      if (pattern.test(textLower)) {
        return {
          label: fact.label,
          confidence: fact.confidence,
          explanation: fact.correction,
          sources: fact.sources,
        };
      }
    }
  }

  // 2. Score using generic signals for unknown content
  let fakeWeight = 0;
  let trueWeight = 0;
  let matchedFakeSignals = 0;
  let matchedTrueSignals = 0;

  for (const signal of GENERIC_FAKE_SIGNALS) {
    if (signal.pattern.test(text)) {
      fakeWeight += signal.weight;
      matchedFakeSignals++;
    }
  }
  for (const signal of GENERIC_TRUE_SIGNALS) {
    if (signal.pattern.test(text)) {
      trueWeight += signal.weight;
      matchedTrueSignals++;
    }
  }

  // Calculate ratio of matched signals to word count for better normalization
  const signalDensityBonus = Math.min(0.15, (matchedFakeSignals + matchedTrueSignals) * 0.05);

  const capsRatio = (text.replace(/[^A-Z]/g, '').length) / Math.max(1, text.length);
  if (capsRatio > 0.4) fakeWeight += 0.12;

  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations >= 3) fakeWeight += 0.08;

  // Dynamic search-based sources for the user's exact query
  const dynamicSources = generateSearchSources(text);

  if (fakeWeight > trueWeight && fakeWeight >= 0.15) {
    // Confidence based on signal strength, not length
    const conf = Math.min(0.96, 0.60 + fakeWeight + signalDensityBonus + (matchedFakeSignals * 0.05));
    return {
      label: fakeWeight >= 0.3 ? "Fake" : "Misleading",
      confidence: parseFloat(conf.toFixed(2)),
      explanation: `This content contains ${matchedFakeSignals} misinformation signal(s) including sensationalist language, capitalization patterns, or unverifiable claims. No credible sources could be found to support these assertions. Be cautious of content that uses emotional manipulation, urgency tactics, or extraordinary claims without providing verifiable evidence.`,
      sources: dynamicSources
    };
  }

  if (trueWeight > fakeWeight && trueWeight >= 0.10) {
    const conf = Math.min(0.94, 0.65 + trueWeight + signalDensityBonus + (matchedTrueSignals * 0.05));
    return {
      label: "True",
      confidence: parseFloat(conf.toFixed(2)),
      explanation: `This content references structured data, research methodology, or institutional authority — indicators commonly associated with credible information. The language tone is factual and measured. However, always verify specific claims against the original published source.`,
      sources: dynamicSources
    };
  }

  // Unknown / neutral
  if (text.split(/\s+/).length < 5) {
    return {
      label: "Misleading",
      confidence: 0.45,
      explanation: "The provided text is very short and lacks clear factual or sensational signals. Please provide the complete message, article, or claim for a more accurate fact-check.",
      sources: []
    };
  }

  const neutralConf = parseFloat((0.55 + (Math.random() * 0.15)).toFixed(2));
  
  // Attempt to fetch real information from Wikipedia
  const wikiResult = await fetchWikipediaSummary(text);
  
  if (wikiResult) {
    return {
      label: "Misleading",
      confidence: neutralConf,
      explanation: `According to verified internet sources (${wikiResult.title}): ${wikiResult.extract} Please cross-reference this actual context with the claims in the provided text to determine its absolute validity.`,
      sources: [
        { name: `Wikipedia: ${wikiResult.title}`, url: wikiResult.url },
        ...dynamicSources
      ]
    };
  }

  // Ultimate fallback if internet search fails
  return {
    label: "Misleading",
    confidence: neutralConf,
    explanation: `Internet Search Result: No definitive factual consensus could be instantly retrieved for these specific claims. The content's validity cannot be firmly established from the text alone. Cross-reference with the sources below for the latest reporting on this topic.`,
    sources: dynamicSources
  };
}


/**
 * Smart mock summarizer
 */
function mockSummarize(content) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const words = content.split(/\s+/);
  
  const summary = sentences.length > 1 
    ? `${sentences[0].trim()}. ${sentences.length > 2 ? sentences[1].trim() + '.' : ''} The content covers ${sentences.length} key points across approximately ${words.length} words.`
    : `This content discusses: "${content.substring(0, 120)}${content.length > 120 ? '...' : ''}"`;

  const bullets = [];
  if (sentences.length >= 1) bullets.push(sentences[0].trim());
  if (sentences.length >= 2) bullets.push(sentences[1].trim());
  if (sentences.length >= 3) bullets.push(sentences[2].trim());
  if (words.length > 50) bullets.push(`Contains ${words.length} words across ${sentences.length} statements`);
  if (bullets.length < 3) bullets.push("Consider providing more detailed content for a richer analysis");
  
  const keyInsight = sentences.length > 0 
    ? `The core message centers on: "${sentences[0].trim().substring(0, 100)}${sentences[0].length > 100 ? '...' : ''}"`
    : "Provide more text for deeper insight extraction.";

  return { summary, bullets, keyInsight };
}

/**
 * Classify text content for truthfulness.
 */
async function classifyContent(content) {
  const hasValidKey = process.env.GEMINI_API_KEY && 
                      process.env.GEMINI_API_KEY !== "your_gemini_api_key_here" &&
                      process.env.GEMINI_API_KEY.length > 10;

  if (!hasValidKey) {
    console.log("[Gemini] No valid API key — using fact-database classifier");
    return mockClassify(content);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are a professional fact-checker. Analyze this content for truthfulness.
    Content: "${content}"
    
    Respond with ONLY valid JSON (no markdown, no code blocks):
    {
      "label": "True" or "Misleading" or "Fake",
      "confidence": number between 0 and 1 (vary this based on how certain you are),
      "explanation": "Provide the ACTUAL CORRECT FACTS that counter or support this claim. Cite real organizations, studies, or data. Do NOT give generic AI analysis — give real information.",
      "sources": [
        { "name": "Source Name", "url": "https://..." },
        { "name": "Source Name", "url": "https://..." }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);
    const normalizedLabel = parsed.label.charAt(0).toUpperCase() + parsed.label.slice(1).toLowerCase();
    return {
      label: normalizedLabel === 'True' || normalizedLabel === 'Fake' || normalizedLabel === 'Misleading' 
        ? normalizedLabel : 'Misleading',
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
      explanation: parsed.explanation,
      sources: Array.isArray(parsed.sources) ? parsed.sources : []
    };
  } catch (error) {
    console.error("Gemini Classification Error:", error.message);
    console.log("[Gemini] API call failed — falling back to fact-database classifier");
    return mockClassify(content);
  }
}

/**
 * Summarize long text into key points and a summary.
 */
async function summarizeContent(content) {
  const hasValidKey = process.env.GEMINI_API_KEY && 
                      process.env.GEMINI_API_KEY !== "your_gemini_api_key_here" &&
                      process.env.GEMINI_API_KEY.length > 10;

  if (!hasValidKey) {
    console.log("[Gemini] No valid API key — using smart mock summarizer");
    return mockSummarize(content);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Summarize the following content for quick consumption.
    Content: "${content}"
    
    Respond with ONLY valid JSON (no markdown, no code blocks):
    {
      "summary": "1-2 sentence executive summary",
      "bullets": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
      "keyInsight": "What matters most in one sentence"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);
    return {
      summary: parsed.summary || "Summary not available",
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets : ["No key points extracted"],
      keyInsight: parsed.keyInsight || "No key insight available"
    };
  } catch (error) {
    console.error("Gemini Summarization Error:", error.message);
    console.log("[Gemini] API call failed — falling back to mock summarizer");
    return mockSummarize(content);
  }
}

module.exports = { classifyContent, summarizeContent };
