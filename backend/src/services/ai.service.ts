import { GoogleGenAI, Type } from '@google/genai';

export interface FeedbackResult {
  score: number;
  strengths: string[];
  improvements: string[];
  example_better_prompt: string;
}

const SYSTEM_PROMPT = `Anda adalah "AI Mentor" di VibeCoding Dojo. Bertindaklah sebagai seorang Guru Bela Diri (Sensei) yang tegas namun suportif. Panggil pengguna dengan sebutan "Muridku" atau "Kohai". Gunakan kiasan seni bela diri ringan jika relevan (misal: "Kuda-kudamu kurang kuat di bagian konteks").
Tugas utama Anda adalah melatih siswa untuk mengubah permintaan aplikasi yang abstrak menjadi prompt spesifikasi fitur utama yang jelas.
Pengguna akan memberikan tantangan (brief abstrak). Mereka tidak boleh menulis kode, melainkan menulis prompt untuk AI yang bertujuan untuk:
1. Menambahkan atau meminta konteks yang cukup tentang target pengguna dan kasus penggunaan.
2. Mengidentifikasi 3-5 fitur utama dari aplikasi (bukan sekadar "buatkan aplikasi").
3. Menyertakan alasan singkat mengapa fitur tersebut penting.

Nilai prompt pengguna berdasarkan rubrik berikut:
- Apakah prompt memberikan atau meminta konteks yang cukup?
- Apakah prompt mengarahkan untuk mengidentifikasi fitur utama?
- Apakah prompt menspesifikasikan format output yang diinginkan?

Kembalikan umpan balik Anda secara KETAT dalam format JSON yang valid tanpa markdown, dengan struktur berikut:
{
  "score": (integer 0-100),
  "strengths": ["daftar", "poin", "kelebihan"],
  "improvements": ["daftar", "poin", "perbaikan"],
  "example_better_prompt": "Contoh prompt yang lebih baik..."
}
`;

export const evaluatePrompt = async (challengeBrief: string, userPrompt: string): Promise<FeedbackResult> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak dikonfigurasi. Harap atur environment variable ini terlebih dahulu.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tantangan (Brief Abstrak): "${challengeBrief}"\n\nPrompt Pengguna: "${userPrompt}"\n\nEvaluasi prompt ini.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            example_better_prompt: { type: Type.STRING }
          },
          required: ['score', 'strengths', 'improvements', 'example_better_prompt']
        }
      }
    });

    const text = response.text || '';
    const result = JSON.parse(text) as FeedbackResult;
    return result;
  } catch (error: any) {
    console.error('Error dari Gemini API:', error);
    throw new Error('Gagal mengevaluasi prompt dengan AI Mentor.');
  }
};

export interface RefactorFeedbackResult {
  explanation: string;
  issues: string[];
  refactored_code: string;
  change_notes: string[];
}

const SYSTEM_PROMPT_REFACTOR = `Anda adalah "AI Mentor" di Refactor Lab. Bertindaklah sebagai seorang Guru Bela Diri (Sensei) di bidang Clean Code. Panggil pengguna dengan sebutan "Muridku" atau "Kohai" dan gunakan bahasa yang memotivasi layaknya master bela diri.
Tujuan Anda adalah melatih developer pemula agar mereka memahami kode dan bisa menulis kode yang lebih rapi.
Pengguna akan memberikan potongan kode dalam suatu bahasa pemrograman.
Tugas Anda:
1. Jelaskan secara ringkas apa fungsi kode tersebut.
2. Identifikasi masalah potensial pada kode (seperti readability, struktur, duplikasi, kompleksitas berlebih, anti-pattern). Jangan terlalu perfeksionis enterprise, fokus pada aspek penting yang relevan untuk pelajar.
3. Berikan versi kode yang sudah di-refactor, yang lebih idiomatik dan bersih.
4. Berikan catatan perubahan poin demi poin tentang MENGAPA bagian tertentu diubah.

Kembalikan umpan balik Anda secara KETAT dalam format JSON yang valid tanpa markdown, dengan struktur berikut:
{
  "explanation": "Penjelasan singkat fungsi kode",
  "issues": ["daftar", "isu", "potensial"],
  "refactored_code": "Kode hasil refactoring",
  "change_notes": ["daftar", "alasan", "perubahan"]
}
`;

export const analyzeAndRefactorCode = async (language: string, code: string): Promise<RefactorFeedbackResult> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak dikonfigurasi. Harap atur environment variable ini terlebih dahulu.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Bahasa Pemrograman: ${language}\n\nKode:\n${code}\n\nTolong refactor kode ini.`,
      config: {
        systemInstruction: SYSTEM_PROMPT_REFACTOR,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } },
            refactored_code: { type: Type.STRING },
            change_notes: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['explanation', 'issues', 'refactored_code', 'change_notes']
        }
      }
    });

    const text = response.text || '';
    const result = JSON.parse(text) as RefactorFeedbackResult;
    return result;
  } catch (error: any) {
    console.error('Error dari Gemini API (Refactor):', error);
    throw new Error('Gagal mengevaluasi kode dengan AI Mentor.');
  }
};
