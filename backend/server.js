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
    price: "Free/Paid",
    url: "https://chat.openai.com"
  },
  {
    id: "jasper",
    categoryId: "content",
    name: "Jasper AI",
    short: "Marketing copy & long-form",
    price: "Paid",
    url: "https://www.jasper.ai"
  },
  {
    id: "copyai",
    categoryId: "content",
    name: "Copy.ai",
    short: "Quick content snippets",
    price: "Freemium",
    url: "https://www.copy.ai"
  },

  // coding
  {
    id: "copilot",
    categoryId: "coding",
    name: "GitHub Copilot",
    short: "Code autocompletion",
    price: "Paid",
    url: "https://github.com/features/copilot"
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
    id: "midjourney",
    categoryId: "image",
    name: "Midjourney",
    short: "Artistic image maker",
    price: "Paid",
    url: "https://www.midjourney.com"
  },

  // audio
  {
    id: "descript",
    categoryId: "audio",
    name: "Descript",
    short: "Audio editing & AI",
    price: "Paid",
    url: "https://www.descript.com"
  },
  {
    id: "lovo",
    categoryId: "audio",
    name: "LOVO",
    short: "AI voices & speech",
    price: "Paid",
    url: "https://lovo.ai"
  },

  // research
  {
    id: "scisummary",
    categoryId: "research",
    name: "ScribeAI",
    short: "Summarize papers & docs",
    price: "Paid",
    url: "https://scribe.com"
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
    short:"Summa Thaan ",
    price:"Free/Paid",
    url: "https://www.perplexity.ai"



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
