import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  console.log('Google GenAI successfully initialized.');
} else {
  console.log('Warning: GEMINI_API_KEY not found in environment, AI Craving Helper will run in simulation mode.');
}

// 🍔 API: Recommend food based on mood and choices using Gemini
app.post('/api/cravings', async (req, res) => {
  const { mood, diet, spice, hungerLevel } = req.body;

  if (!mood) {
    return res.status(400).json({ error: 'Please convey your current craving mood!' });
  }

  // Fallback simulator if API key is not set
  if (!ai) {
    // Generate a satisfying simulated recommendations to avoid crashing the app
    const recommendations = [
      {
        slogan: "Sizzling Satisfaction Unleashed!",
        recommendedItems: ["Double Smash Burger", "Loaded Cheese & Bacon Fries", "Decadent Chocolate Malt Shake"],
        explanation: `Since you are feeling "${mood}" and craving food that matches ${spice === 'spicy' ? 'high fire' : 'rich savory textures'}, the double smash burger edges coupled with loaded fries is the ultimate ticket to culinary bliss.`,
        discountCode: "CRAVE-SIMULATION-15",
        discountPercent: 15
      },
      {
        slogan: "Fiery Volcano Fire-Feast!",
        recommendedItems: ["Volcano Lava Inferno", "Loaded Cheese & Bacon Fries", "Craft Strawberry Lemonade"],
        explanation: `Feeling "${mood}" means you require dynamic spicy flavor! Our Ghost Pepper and Serrano mix delivers intense endorphin-boosting heat paired with strawberry coolness.`,
        discountCode: "VOLCANO-SIM-20",
        discountPercent: 20
      }
    ];
    const chosen = (spice === 'spicy' || mood.toLowerCase().includes('spicy') || mood.toLowerCase().includes('hot')) ? recommendations[1] : recommendations[0];
    return res.json(chosen);
  }

  try {
    const prompt = `Design a personalized, high-converting food recommendation combo for a burger customer.
Here is what the customer told us:
- Current Mood / Craving: "${mood}"
- Dietary preference: "${diet}" (e.g., standard, vegetarian)
- Spice preference: "${spice}" (e.g., standard, spicy)
- Hunger Level: "${hungerLevel}" (e.g., snacking, very hungry, feast)

Make sure to recommend items only from our official menu:
1. Double Smash Burger ($11.99, signature)
2. Crispy Bird Burger ($10.99)
3. Volcano Lava Inferno ($12.49, spicy ghost pepper)
4. Green Paradise Veggie ($11.49, vegetarian)
5. Loaded Cheese & Bacon Fries ($7.99, hot savory side)
6. Truffle garlic & Romano Fries ($6.99, delicate gourmet side)
7. Craft Strawberry Lemonade ($3.99)
8. Decadent Chocolate Malt Shake ($5.99)
9. The Ultimate Crave Combo ($18.99, best bargain combo including double burger + loaded fries + drink)
10. Spicy Inferno Fire-Feast ($19.49, volcano burger + loaded fries + lemonade)

Output the recommendations strictly as a JSON object matching this schema:
{
  "slogan": "A bold dynamic slogan tailored to their mood (e.g. Sizzle and Conquer!)",
  "recommendedItems": ["Exact Name of Item 1", "Exact Name of Item 2"],
  "explanation": "An appetite-triggering, highly persuasive 2-sentence explanation of why these exact ingredients answer their specific mood and hunger level.",
  "discountCode": "CRAVEAIDN-15",
  "discountPercent": 15
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { type: Type.STRING },
            recommendedItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            explanation: { type: Type.STRING },
            discountCode: { type: Type.STRING },
            discountPercent: { type: Type.INTEGER }
          },
          required: ["slogan", "recommendedItems", "explanation", "discountCode", "discountPercent"]
        }
      }
    });

    const text = response.text || "{}";
    const recommendedData = JSON.parse(text);
    return res.json(recommendedData);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Faux pas behind the grill! The AI is cooking up something else. Please select from our menu directly.' });
  }
});

// Configure Vite or Serve SPA Static Files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite middleware registered.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static files from dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server successfully running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
