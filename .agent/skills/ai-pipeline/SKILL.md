---
name: ai-pipeline
description: "Gemini SDK and Prompt Engineering Standards."
---

## 1. Gemini 2.0 Integration

Use `@google/generative-ai` with **Gemini 2.0 Flash** for most BrainBox operations (Refine/Analyze).

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
```

## 2. Controlled Generation (JSON Mode)

Always use Schema-driven generation for structured data like mindmaps or library items.

```typescript
const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: brainBoxItemSchema, // Zod-like schema
  },
});
```

## 3. Mandatory Security & Performance

- **Isolation**: System instructions must be set via `systemInstruction` prop, never concatenated with user text.
- **Context Caching**: For large datasets (MindGraph analysis), use Gemini context caching to reduce latency and cost.
- **Safety**: Apply `HARM_CATEGORY_HARASSMENT` etc. thresholds according to Privacy Policy.
