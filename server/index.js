const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { classifyContent, summarizeContent } = require('./utils/gemini');
const { correctSpelling } = require('./utils/spellcheck');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// ─────────────────────────────────────────────────────────
// LARGE POOL of realistic trending misinformation topics
// Every API call picks a random subset + adds fresh times
// ─────────────────────────────────────────────────────────
const TRENDS_POOL = [
  // Health
  { title: "New 'Magic Juice' cures COVID-25", status: "False", category: "Health", explanation: "Clinical trials have not shown any efficacy for this substance. It's a re-branded industrial cleaner being marketed as a health product." },
  { title: "5G towers cause respiratory illness", status: "False", category: "Health", explanation: "No scientific evidence supports a link between 5G electromagnetic waves and respiratory disease. WHO and multiple peer-reviewed studies have debunked this claim." },
  { title: "Eating garlic prevents coronavirus infection", status: "False", category: "Health", explanation: "While garlic has mild antimicrobial properties, WHO has confirmed it does not prevent COVID-19 infection. This claim went viral on WhatsApp in 2020." },
  { title: "Vaccine causes autism in children", status: "False", category: "Health", explanation: "The original 1998 study by Andrew Wakefield was retracted and Wakefield lost his medical license. Multiple studies involving millions of children have found zero link between vaccines and autism." },
  { title: "Drinking bleach kills virus inside the body", status: "False", category: "Health", explanation: "Ingesting bleach or disinfectants is extremely dangerous and can cause death. The FDA and Poison Control have issued urgent warnings against this claim." },
  { title: "Microchips are being implanted through vaccines", status: "False", category: "Health", explanation: "Vaccine needles are far too small to deliver any microchip. This conspiracy theory has been debunked by multiple engineers, doctors, and fact-checking organizations." },
  { title: "Ivermectin is the real COVID cure governments are hiding", status: "False", category: "Health", explanation: "The WHO SOLIDARITY trial found no significant benefit of ivermectin for COVID-19. The FDA advises against its use for COVID treatment." },
  { title: "Alkaline water cures cancer, says new study", status: "False", category: "Health", explanation: "No peer-reviewed study supports this claim. Your body's pH is tightly regulated and cannot be meaningfully altered by drinking alkaline water. The American Cancer Society warns against unproven remedies." },
  { title: "Honey and warm water flush toxins from the body", status: "Mostly True", category: "Health", explanation: "While honey has some antioxidant properties, the body's liver and kidneys are responsible for detoxification. The concept of 'flushing toxins' with warm water is not supported by medical science." },
  
  // Politics
  { title: "Government to tax WhatsApp messages", status: "False", category: "Politics", explanation: "Official government sources have denied any such plans. This is a recurring hoax that resurfaces every few months on social media." },
  { title: "Election votes were altered by foreign hackers", status: "Partially Correct", category: "Politics", explanation: "While cybersecurity threats exist, official audits and election security agencies have confirmed no evidence of vote tallies being changed by foreign interference in recent elections." },
  { title: "New law bans all social media for minors", status: "Partially Correct", category: "Politics", explanation: "While some countries are considering age verification policies, no blanket ban on social media for minors has been enacted. The viral post misrepresents a proposed regulation." },
  { title: "AI can now predict earthquakes with 100% accuracy", status: "Misleading", category: "Politics", explanation: "While AI models have improved seismic prediction, no system achieves 100% accuracy. The original research paper was misquoted by several viral social media posts." },
  { title: "Government secretly surveilling all citizens via phone cameras", status: "False", category: "Politics", explanation: "Mass surveillance of this nature would require enormous infrastructure and is not technically feasible at scale. While privacy concerns are valid, this specific claim is unsubstantiated." },
  { title: "Mars colony announced for 2027 by NASA", status: "False", category: "Politics", explanation: "NASA has not announced a crewed Mars mission for 2027. Current timelines estimate the late 2030s-2040s. This appears to be a misquote of a research paper about Mars habitat testing." },
  { title: "National currency to be replaced by cryptocurrency", status: "False", category: "Politics", explanation: "No country's central bank has announced plans to fully replace fiat currency with cryptocurrency. Some are exploring CBDCs (Central Bank Digital Currencies) which are fundamentally different." },
  
  // Scams & Fraud
  { title: "Free iPhone 16 Giveaway Scam", status: "False", category: "Scams", explanation: "Phishing links are being circulated to steal user credentials. No such giveaway exists — Apple has confirmed it is fraudulent." },
  { title: "Bank account hacked if you answer unknown calls", status: "False", category: "Scams", explanation: "Simply answering a phone call cannot grant access to your bank account. This hoax exploits fear to discourage people from answering legitimate calls." },
  { title: "Win ₹50 lakh by sharing this post to 20 groups", status: "False", category: "Scams", explanation: "This is a classic chain message scam. No legitimate company distributes money through WhatsApp forwards. These messages are designed to collect personal data." },
  { title: "Job offer from Google paying $500/hour for typing", status: "False", category: "Scams", explanation: "Google does not hire through random messages or social media posts. This is a phishing scheme to steal personal information and banking details." },
  { title: "SBI/HDFC customers must update KYC via this link or account frozen", status: "False", category: "Scams", explanation: "Banks never send KYC update links via SMS or WhatsApp. RBI has warned customers to visit branches directly or use official apps for KYC updates." },
  { title: "Netflix giving free subscription for sharing survey", status: "False", category: "Scams", explanation: "Netflix has confirmed these survey links are phishing attempts. The company never distributes free subscriptions through third-party surveys or social media chains." },
  { title: "Electricity bill not paid — power cut in 24 hours (scam SMS)", status: "False", category: "Scams", explanation: "Power companies do not threaten disconnection via SMS with payment links. This is a phishing scam. Always verify through official electricity board websites or helplines." },
  { title: "Crypto investment doubling money guaranteed in 48 hours", status: "False", category: "Scams", explanation: "Any guaranteed return investment is a Ponzi scheme. SEBI and RBI have repeatedly warned against such claims. Legitimate investments never guarantee returns." },
  
  // Technology
  { title: "AI chatbots are becoming sentient and self-aware", status: "Partially Correct", category: "Health", explanation: "Current AI systems, including large language models, are sophisticated pattern-matching tools but do not possess consciousness or sentience. Leading AI researchers including Yann LeCun have clarified this distinction." },
  { title: "Charging phone overnight destroys the battery permanently", status: "Mostly True", category: "Scams", explanation: "Modern smartphones have built-in circuits that stop charging at 100%. While keeping it plugged in long-term isn't ideal, overnight charging on occasion will not destroy your battery." },
  { title: "WiFi radiation causes brain cancer in children", status: "False", category: "Health", explanation: "WiFi uses non-ionizing radiation at power levels far below what's needed to cause tissue damage. The WHO and multiple studies have found no evidence linking WiFi to cancer." },
  { title: "Your phone is listening to conversations for ad targeting", status: "Partially Correct", category: "Politics", explanation: "While this feels true due to targeted ads, research by security firms shows phones don't actively record conversations. Ad targeting uses browsing history, location, and social graph data instead." },
  { title: "Deleting Facebook means your data is also deleted", status: "Partially Correct", category: "Politics", explanation: "Facebook retains some user data even after account deletion, including data shared by others and certain logs. GDPR provides some rights but enforcement varies by region." },
];

// Popularity levels to assign randomly
const POPULARITY_LEVELS = ["Low", "Medium", "High", "Very High", "Trending 🔥"];

// Time labels to make it feel fresh
const TIME_LABELS = [
  "Just now", "2 min ago", "5 min ago", "12 min ago", "30 min ago",
  "1 hour ago", "2 hours ago", "3 hours ago", "5 hours ago", "Today",
];

/**
 * Shuffle array randomly (Fisher-Yates)
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Get a fresh random batch of trending topics
 */
function getRandomTrends(count = 6) {
  const shuffled = shuffle(TRENDS_POOL);
  const selected = shuffled.slice(0, count);
  return selected.map((item, i) => ({
    id: i + 1,
    ...item,
    popularity: POPULARITY_LEVELS[Math.floor(Math.random() * POPULARITY_LEVELS.length)],
    timeAgo: TIME_LABELS[i] || TIME_LABELS[TIME_LABELS.length - 1],
    shares: Math.floor(Math.random() * 50000) + 500,
  }));
}

// Mock Database
const mockDb = {
  reports: [],
};

// Routes
app.get('/', (req, res) => {
  res.send('Misinformation Detection API is running...');
});

// API Endpoints — DYNAMIC trends
app.get('/api/trends', (req, res) => {
  const trends = getRandomTrends(6);
  res.json(trends);
});

app.post('/api/report', (req, res) => {
  const { title, content, type } = req.body;
  const newReport = {
    id: mockDb.reports.length + 1,
    title,
    content,
    type,
    status: 'Pending',
    createdAt: new Date()
  };
  mockDb.reports.push(newReport);
  res.status(201).json({ message: 'Report submitted successfully', report: newReport });
});

app.post('/api/check', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });
    const analysis = await classifyContent(content);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: "Classification failed" });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });
    const summary = await summarizeContent(content);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Summarization failed" });
  }
});

app.post('/api/autocorrect', (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });
    const result = correctSpelling(content);
    res.json(result);
  } catch (error) {
    console.error('Autocorrect error:', error);
    res.status(500).json({ error: "Autocorrect failed" });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
