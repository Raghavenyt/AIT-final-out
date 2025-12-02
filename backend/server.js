const express = require("express");
const cors = require("cors");
const path = require("path");
const { url } = require("inspector");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "..", "public")));

// --- In-memory data (demo) ---
const categories = [
  { id: "content",      title: "Content Writing", desc: "Write articles, blogs, and copy." },
  { id: "coding",       title: "Coding Tools",    desc: "Code assistants, copilot style." },
  { id: "image",        title: "Image Editing",   desc: "Generate and edit images." },
  { id: "audio",        title: "Audio & Music",   desc: "Audio tools & speech." },
  { id: "research",     title: "Research AI",     desc: "Summarizers & analysts." },
  { id: "productivity", title: "Productivity",    desc: "Automation & task helpers." }

];

let tools = [
  // content
  {
    id: "chatgpt",
    categoryId: "content",
    name: "ChatGPT",
    short: "Conversational writing & ideas",
    price: "Free",
    url: "https://chat.openai.com"
  },
  {
    "id": "copyai",
    "categoryId": "content",
    "name": "Copy.ai",
    "short": "Marketing copy & social content",
    "price": "Free",
    "url": "https://www.copy.ai"
  },
  {
    "id": "writesonic",
    "categoryId": "content",
    "name": "Writesonic",
    "short": "Blogs, ads & content generation",
    "price": "Free",
    "url": "https://writesonic.com"
  },
  {
    "id": "wordtune",
    "categoryId": "content",
    "name": "Wordtune",
    "short": "Rewrite, improve and polish text",
    "price": "Free",
    "url": "https://www.wordtune.com"
  },
  {
    "id": "quillbot",
    "categoryId": "content",
    "name": "QuillBot",
    "short": "Paraphrasing & grammar correction",
    "price": "Free",
    "url": "https://quillbot.com"
  },
  {
    "id": "rytr",
    "categoryId": "content",
    "name": "Rytr",
    "short": "Fast short-form content generator",
    "price": "Free",
    "url": "https://rytr.me"
  },
  {
    "id": "smartcat",
    "categoryId": "content",
    "name": "Smartcat",
    "short": "Translation + multilingual content",
    "price": "Free",
    "url": "https://www.smartcat.com"
  },

  // coding
   {
    "id": "codeium",
    "categoryId": "coding",
    "name": "Codeium",
    "short": "Free AI code completion & suggestions",
    "price": "Free",
    "url": "https://codeium.com"
  },
  {
    "id": "codegeex",
    "categoryId": "coding",
    "name": "CodeGeeX",
    "short": "Open-source multilingual code generation",
    "price": "Free",
    "url": "https://github.com/THUDM/CodeGeeX"
  },
  {
    "id": "tabby",
    "categoryId": "coding",
    "name": "Tabby",
    "short": "Self-hosted coding assistant & autocomplete",
    "price": "Free",
    "url": "https://github.com/TabbyML/tabby"
  },
  {
    "id": "codet5",
    "categoryId": "coding",
    "name": "CodeT5",
    "short": "Open-source model for code understanding & generation",
    "price": "Free",
    "url": "https://github.com/salesforce/CodeT5"
  },
  {
    "id": "codebert",
    "categoryId": "coding",
    "name": "CodeBERT",
    "short": "AI model for code search and documentation",
    "price": "Free",
    "url": "https://github.com/microsoft/CodeBERT"
  },
  {
    "id": "whisperer",
    "categoryId": "coding",
    "name": "Amazon CodeWhisperer",
    "short": "AI code suggestion tool with free tier",
    "price": "Free",
    "url": "https://aws.amazon.com/codewhisperer"
  },
  {
    "id": "huggingface",
    "categoryId": "coding",
    "name": "HuggingFace Code Models",
    "short": "Open-source transformers for code tasks",
    "price": "Free",
    "url": "https://huggingface.co/models"
  },

  {
    id: "tabnine",
    categoryId: "coding",
    name: "Tabnine",
    short: "AI code completion",
    price: "Freemium",
    url: "https://www.tabnine.com"
  },

  // image

  {
    "id": "stable_diffusion",
    "categoryId": "image",
    "name": "Stable Diffusion",
    "short": "Open-source text-to-image model; highly customizable",
    "price": "Free",
    "url": "https://stability.ai"
  },
  {
    "id": "deepai_text2img",
    "categoryId": "image",
    "name": "DeepAI Text2Image",
    "short": "Simple free online text-to-image generation",
    "price": "Free",
    "url": "https://deepai.org/machine-learning-model/text2img"
  },
  {
    "id": "mage_space",
    "categoryId": "image",
    "name": "Mage.space",
    "short": "AI image & video generator — free, fast, and unlimited",
    "price": "Free",
    "url": "https://mage.space"
  },
  {
    "id": "runway_ml",
    "categoryId": "image",
    "name": "Runway ML",
    "short": "Text-to-video or image-to-video generation, beginner-friendly",
    "price": "Free",
    "url": "https://runwayml.com"
  },
  {
    "id": "pixverse",
    "categoryId": "image",
    "name": "PixVerse",
    "short": "Budget-friendly AI video generator — good for quick clips & social media",
    "price": "Free",
    "url": "https://pixverse.ai"
  },
  {
    "id": "skyreels_v1",
    "categoryId": "image",
    "name": "SkyReels V1",
    "short": "Open-source video generation model (text-to-video / image-to-video)",
    "price": "Free",
    "url": "https://github.com/skyreels/skyreels"
  },
  {
    "id": "waver",
    "categoryId": "image",
    "name": "Waver",
    "short": "Unified image & video generation model (text-to-video, image-to-video, text-to-image)",
    "price": "Free",
    "url": "https://github.com/FoundationVision/Waver"
  },
  {
    "id": "step_video_ti2v",
    "categoryId": "image",
    "name": "Step-Video-TI2V",
    "short": "State-of-the-art open model for text/image to video generation",
    "price": "Free",
    "url": "https://github.com/stepfun-ai/Step-Video-TI2V"
  },

  // audio
  {
    "id": "suno",
    "categoryId": "audio",
    "name": "Suno",
    "short": "AI music & song generator (instrumentals + vocals) — free tier available",
    "price": "Free",
    "url": "https://suno.com"
  },
  {
    "id": "diffrhythm",
    "categoryId": "audio",
    "name": "DiffRhythm",
    "short": "Open-source music generation model (vocals + instruments, full songs)",
    "price": "Free",
    "url": "https://github.com/…/DiffRhythm"
  },
  {
    "id": "yue_ai",
    "categoryId": "audio",
    "name": "YuE (Yue AI)",
    "short": "Lyrics-to-song / full-song generation model, open-source",
    "price": "Free",
    "url": "https://github.com/multimodal-art-projection/YuE"
  },
  {
    "id": "musicgen",
    "categoryId": "audio",
    "name": "MusicGen",
    "short": "Open-source model for generating music from text prompts",
    "price": "Free",
    "url": "https://huggingface.co/models/musicgen"
  },
  {
    "id": "udio",
    "categoryId": "audio",
    "name": "Udio",
    "short": "Generative text-to-music model (free beta available)",
    "price": "Free",
    "url": "https://www.udio.com"
  },
  {
    "id": "beatoven",
    "categoryId": "audio",
    "name": "Beatoven.ai",
    "short": "AI background-music / soundtrack generator — free tier available",
    "price": "Free",
    "url": "https://beatoven.ai"
  },
  {
    "id": "mubert",
    "categoryId": "audio",
    "name": "Mubert",
    "short": "AI-generated royalty-free music generation for creators",
    "price": "Free",
    "url": "https://mubert.com"
  },
  {
    "id": "soundverse",
    "categoryId": "audio",
    "name": "Soundverse AI",
    "short": "Free AI music generator with voice & instrument support",
    "price": "Free",
    "url": "https://soundverse.ai"
  },

  // research
  {
    "id": "bart_large_cnn",
    "categoryId": "research",
    "name": "BART (facebook/bart-large-cnn)",
    "short": "Strong open-source abstractive summarization model",
    "price": "Free",
    "url": "https://huggingface.co/facebook/bart-large-cnn"
  },
  {
    "id": "t5_small_summarization",
    "categoryId": "research",
    "name": "T5 (small) Summarization",
    "short": "Lightweight text-to-text transformer for summarizing documents",
    "price": "Free",
    "url": "https://huggingface.co/Falconsai/text_summarization"
  },
  {
    "id": "sumy",
    "categoryId": "research",
    "name": "Sumy",
    "short": "Classic extractive summarization library (LSA, LexRank, etc.)",
    "price": "Free",
    "url": "https://pypi.org/project/sumy"
  },
  {
    "id": "bert_extractive_summarizer",
    "categoryId": "research",
    "name": "BERT Extractive Summarizer",
    "short": "Use BERT embeddings to extract key sentences from text",
    "price": "Free",
    "url": "https://github.com/dmmiller612/bert-extractive-summarizer"
  },
  {
    "id": "smeval",
    "categoryId": "research",
    "name": "SumEval",
    "short": "Open framework for summarization & evaluation, supports multiple languages",
    "price": "Free",
    "url": "https://github.com/your-repo-for-sumeval"
  },
  {
    "id": "summer_time_toolkit",
    "categoryId": "research",
    "name": "SummerTime",
    "short": "Toolkit for multi-document & query-based summarization for non-experts",
    "price": "Free",
    "url": "https://github.com/Yale-LILY/SummerTime"
  },
  {
    "id": "open_text_summarizer",
    "categoryId": "research",
    "name": "Open Text Summarizer",
    "short": "Simple free web-based summarizer for plain text / web pages",
    "price": "Free",
    "url": "http://www.splitbrain.org/services/ots"
  },
  {
    "id": "quillbot_summarizer",
    "categoryId": "research",
    "name": "QuillBot Summarizer",
    "short": "Easy free online summarization for articles, documents",
    "price": "Free/Paid",
    "url": "https://quillbot.com/summarize"
  },
  {
    "id": "tldr_this",
    "categoryId": "research",
    "name": "TLDR This",
    "short": "Online AI summarizer for articles and webpages",
    "price": "Free/Paid",
    "url": "https://tldrthis.com"
  },

  // productivity
  {
    id: "zapier",
    categoryId: "productivity",
    name: "Zapier AI",
    short: "Automate tasks",
    price: "Freemium",
    url: "https://zapier.com"
  },
  { 
    id:"Perplexity",
    categoryId: "productivity",
    name: "Perplexity",
    short:"Summarize your shedule  ",
    price:"Free",
    url: "https://www.perplexity.ai"

  },
  {
    id:"n8n",
    categories:"productivity",
    name:"n8n",
    short:"Open source workflow & automation builder (drag & drop, no-code)",
    price:"Free",
    url:"https://n8n.io"
   
  },
  {
    "id": "activepieces",
    "categoryId": "productivity",
    "name": "Activepieces",
    "short": "No-code, open-source workflow automation (Zapier-style)",
    "price": "Free",
    "url": "https://activepieces.com"
  },
  {
    "id": "make",
    "categoryId": "productivity",
    "name": "Make",
    "short": "Visual automation builder — link apps, automate tasks, add AI steps",
    "price": "Free/Paid",
    "url": "https://www.make.com"
  },

  {
    "id": "leon",
    "categoryId": "productivity",
    "name": "Leon",
    "short": "Open-source personal assistant for automating tasks on your server/desktop",
    "price": "Free",
    "url": "https://getleon.ai"
  },
  {
    "id": "botpress",
    "categoryId": "productivity",
    "name": "Botpress (AI Agents)",
    "short": "Free AI-agent framework to build automation or chatbot workflows",
    "price": "Free",
    "url": "https://botpress.com"
  },
  {
    "id": "ui_vision_rpa",
    "categoryId": "productivity",
    "name": "Ui.Vision RPA",
    "short": "Free web-automation and RPA tool — web scraping, form filling, task automation",
    "price": "Free",
    "url": "https://ui.vision"
  }


];

let nextIdCounter = 1;

function generateId() {
  return "tool_" + (nextIdCounter++);
}

// --- API routes ---

// Get all categories
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

// Get tools (optionally filtered by category and/or search query)
app.get("/api/tools", (req, res) => {
  const { category, q } = req.query;
  let result = [...tools];

  if (category) {
    result = result.filter(t => t.categoryId === category);
  }

  if (q) {
    const query = q.toLowerCase();
    result = result.filter(t =>
      t.name.toLowerCase().includes(query) ||
      (t.short && t.short.toLowerCase().includes(query)) ||
      (t.price && t.price.toLowerCase().includes(query))
    );
  }

  res.json(result);
});

// Add a new tool
app.post("/api/tools", (req, res) => {
  const { categoryId, name, short, price, url } = req.body;
  if (!categoryId || !name) {
    return res.status(400).json({ error: "categoryId and name are required." });
  }
  const newTool = {
    id: generateId(),
    categoryId,
    name,
    short: short || "",
    price: price || "",
    url: url || "#"
  };
  tools.push(newTool);
  res.status(201).json(newTool);
});

// Optional: delete a tool
app.delete("/api/tools/:id", (req, res) => {
  const id = req.params.id;
  const idx = tools.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Tool not found" });
  }
  const removed = tools.splice(idx, 1)[0];
  res.json({ removed });
});

// Fallback: serve index.html for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ AIT Toolbox server running at http://localhost:${PORT}`);
});
