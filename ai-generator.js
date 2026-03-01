/**
 * ARK Games AI Generator
 * Uses Groq API to generate CrossFit workouts
 */

// API key is loaded from localStorage (set via admin settings)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey() {
  // Check localStorage first (set via admin settings)
  const stored = localStorage.getItem('ark_groq_api_key');
  if (stored) return stored;
  
  // Fallback to window config
  return window.ARK_GROQ_KEY || null;
}

// Allow setting API key from UI
export function setApiKey(key) {
  localStorage.setItem('ark_groq_api_key', key);
}

export function hasApiKey() {
  return !!getApiKey();
}

/**
 * Generate WODs for a competition or season
 * @param {Object} options
 * @param {number} options.count - Number of WODs to generate
 * @param {string} options.type - 'gara' or 'season'
 * @param {string} options.style - Style preference (e.g., 'CrossFit classico', 'funzionale', 'forza')
 * @param {string[]} options.categories - Categories to generate scalings for (e.g., ['RX', 'Scaled', 'Beginner'])
 * @param {string} options.difficulty - Overall difficulty ('beginner', 'intermediate', 'advanced', 'mixed')
 * @param {string} options.equipment - Available equipment ('full', 'minimal', 'bodyweight')
 * @param {number} options.duration - Average duration in minutes
 * @returns {Promise<Array>} Array of generated WODs
 */
export async function generateWods(options) {
  const {
    count = 3,
    type = 'gara',
    style = 'CrossFit classico',
    categories = ['RX', 'Scaled'],
    difficulty = 'intermediate',
    equipment = 'full',
    duration = 12
  } = options;

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API Key Groq non configurata. Inseriscila nelle impostazioni.');
  }

  const systemPrompt = `Sei un esperto programmatore CrossFit. Genera workout originali, bilanciati e sicuri.
Rispondi SOLO con JSON valido, senza markdown o commenti.

Regole:
- Ogni WOD deve avere movimenti diversi dagli altri
- Bilancia push/pull, upper/lower body
- Time cap realistici (${duration-3} - ${duration+5} minuti)
- Includi scalature per TUTTE le categorie richieste
- Usa nomi creativi per i WOD

Formato JSON richiesto per ogni WOD:
{
  "name": "Nome WOD",
  "type": "fortime" | "amrap" | "emom" | "chipper",
  "timeCapSec": numero,
  "description": "Descrizione breve",
  "movements": [
    { "name": "movimento", "reps": "21-15-9" o "15" }
  ],
  "scalings": {
    "RX": { "notes": "peso/modifiche RX" },
    "Scaled": { "notes": "peso/modifiche Scaled" },
    "Beginner": { "notes": "peso/modifiche Beginner" }
  }
}`;

  const userPrompt = `Genera ${count} WOD per una ${type === 'season' ? 'season CrossFit di lunga durata' : 'gara CrossFit singola'}.

Specifiche:
- Stile: ${style}
- Categorie da scalare: ${categories.join(', ')}
- Difficoltà: ${difficulty}
- Attrezzatura: ${equipment === 'full' ? 'Completa (bilancieri, KB, box, pull-up bar, rower, etc.)' : equipment === 'minimal' ? 'Minima (KB, DB, box)' : 'Solo corpo libero'}
- Durata media: ${duration} minuti per WOD

${type === 'season' ? `Per una season, crea WOD progressivi:
- Primi WOD più semplici
- Aumenta complessità gradualmente
- Mix di tipi (For Time, AMRAP, EMOM, Chipper)
- Numera i WOD da 1 a ${count}` : `Per una gara singola:
- WOD vari che testino diverse capacità
- Almeno 1 For Time, 1 AMRAP se count >= 3`}

Rispondi con un array JSON di ${count} WOD.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from AI');
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content;
    if (content.includes('```')) {
      jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    const wods = JSON.parse(jsonStr);
    
    // Add IDs and week numbers for seasons
    return wods.map((wod, index) => ({
      ...wod,
      id: `wod_${Date.now()}_${index}`,
      weekNumber: type === 'season' ? index + 1 : undefined,
      order: index + 1,
      generatedAt: Date.now()
    }));

  } catch (error) {
    console.error('AI Generation error:', error);
    throw error;
  }
}

/**
 * Generate a single WOD with specific parameters
 */
export async function generateSingleWod(options) {
  const wods = await generateWods({ ...options, count: 1 });
  return wods[0];
}

/**
 * Regenerate scalings for an existing WOD
 */
export async function regenerateScalings(wod, categories) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API Key Groq non configurata.');
  }

  const prompt = `Per questo WOD CrossFit, genera scalature appropriate per le categorie: ${categories.join(', ')}

WOD: ${wod.name}
Tipo: ${wod.type}
Movimenti: ${wod.movements?.map(m => `${m.name}: ${m.reps}`).join(', ')}

Rispondi con un oggetto JSON "scalings" che contiene le modifiche per ogni categoria.
Per ogni categoria specifica: pesi, modifiche ai movimenti, rep scheme se diverso.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Sei un esperto programmatore CrossFit. Rispondi SOLO con JSON valido.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (content.includes('```')) {
      content = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Scaling generation error:', error);
    throw error;
  }
}

// Export for use in HTML pages
window.AIGenerator = {
  generateWods,
  generateSingleWod,
  regenerateScalings,
  setApiKey,
  hasApiKey
};
