import React, { useState } from "react";
import axios from 'axios';
import WordInput from "./components/WordInput";
import DefinitionDisplay from "./components/DefinitionDisplay";

const App: React.FC = () => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const port = 3001; // 環境変数からポートを取得、デフォルトは3000

  console.log(port);
  
  const handleWordChange = (newWord: string) => {
    setWord(newWord);
  };

  const handleGenerate = async () => {
    if (!word) {
      setError("単語を入力してください");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`http://localhost:${port}/generate`, { word });
      setDefinition(response.data.definition);
    } catch (err) {
      setError("APIエラーが発生しました!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToAnki = async () => {
    console.log("Ankiに追加:", word, definition);
    
    try {
      const response = await axios.post(`http://localhost:${port}/add`, {
        word,
        definition,
      });
      alert('Ankiに追加されました！');
    } catch (error) {
      console.error('Anki追加エラー:', error);
      alert('Ankiへの追加に失敗しました。');
    }
  };
  
  const handleCancel = () => {
    setDefinition("");
  };
  
  return (
    <div>
      <h1>Meaning Generater</h1>
      <WordInput
        word={word}
        onWordChange={handleWordChange}
        onGenerate={handleGenerate}
      />
      {loading && <p>generating...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {definition && 
        <DefinitionDisplay 
          definition={definition} 
          onAdd={handleAddToAnki}
          onCancel={handleCancel}
        />
      }
    </div>
  );
};

export default App;
