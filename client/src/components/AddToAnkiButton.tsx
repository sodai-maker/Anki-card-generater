// src/components/AddToAnkiButton.tsx
import React, { useState } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';


interface AddToAnkiButtonProps {
  word: string;
  definition: string;
}

const AddToAnkiButton: React.FC<AddToAnkiButtonProps> = ({ word, definition }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  dotenv.config(); 
  const port = 3001;

  const handleAddToAnki = async () => {
    setIsAdding(true);
    setMessage(null);

    try {
      const response = await axios.post(`http://localhost:${port}/add`, {
        word,
        definition,
      });

      setMessage('Ankiに追加されました！');
    } catch (error) {
      console.error('Ankiへの追加エラー:', error);
      setMessage('Ankiへの追加に失敗しました');
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setMessage('追加をキャンセルしました');
  };

  return (
    <div>
      <button onClick={handleAddToAnki} disabled={isAdding}>
        {isAdding ? '追加中...' : 'Ankiに追加'}
      </button>
      <button onClick={handleCancel} disabled={isAdding} style={{ marginLeft: '8px' }}>
        キャンセル
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddToAnkiButton;
