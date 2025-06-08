// src/services/apiService.ts
import { OpenAI } from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDefinition(word: string): Promise<string> {
  const prompt = `You are an English teacher. Explain the meaning of the word "${word}" in simple English, in 1-2 sentences.`;

  const chatCompletion = await openai.chat.completions.create({
    // model: 'gpt-3.5-turbo',
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const definition = chatCompletion.choices[0].message.content?.trim() || '';
  return definition;
}

export async function generateImage(word: string): Promise<string | undefined> {
  const prompt = `A simple illustration of an ${word}, centered on white background, cartoon style, no text`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '512x512',
    response_format: 'url' // or 'b64_json' if you want to embed
  });
  const imageUrl = response.data?.[0]?.url;

  return response.data?.[0].url; // URLを返す（Base64が必要なら .b64_json にする）
}


// Anki関連の関数もここに書けます
export async function addToAnki(word: string, definition: string, imageUrl: string): Promise<string> {
  if (!word.trim() || !definition.trim()) {
    throw new Error('Word or definition is empty');
  }
  const payload = {
    action: 'addNote',
    version: 6,
    params: {
      note: {
        deckName: 'English words::youtube', // ここを任意のデッキ名に変更可
        modelName: 'Basic',
        fields: {
          word: word,
          meaning: definition,
          image: `<img src="${imageUrl}">`, 
        },
        options: {
          allowDuplicate: false
        },
        tags: ['toeic']
      }
    }
  };
  try {
    const response = await axios.post('http://localhost:8765', payload);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error('AnkiConnectへの追加失敗:', error);
    throw error;
  }
  return `Card with word "${word}" and definition "${definition}" added to Anki.`;
}
