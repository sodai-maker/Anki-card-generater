import express, { Request, Response } from 'express';
import cors from 'cors';

import { generateDefinition, generateImage, addToAnki } from './services/apiService'; // apiServiceの実装に依存
import { log } from 'console';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { word } = req.body;

    if (!word) {
        res.status(400).json({ error: '単語が必要です' });
        return ;
    }

    const definition = await generateDefinition(word);
    // const imageUrl = await generateImage(word);

    // console.log(imageUrl);
  

    // ★ ダミーデータで返す
    // const dummyDefinition = `${word} is a sample definition for development.`;
    
    // 将来のOpenAIレスポンスに似せて返す
    res.json({ word, definition: definition });
    return;

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'OpenAI API request failed' });
    return;
  }
});

// Anki にカードを追加
app.post('/add', async (req: Request, res: Response): Promise<void> => {
  try {
    const { word, definition, imageUrl } = req.body;
    if (!word || !definition) {
      res.status(400).json({ error: 'wordとdefinitionの両方が必要です' });
      return ;
    }

    const result = await addToAnki(word, definition, imageUrl);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Anki追加エラー:', error);
    res.status(500).json({ error: 'Ankiへの追加に失敗しました' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
