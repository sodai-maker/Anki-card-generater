import React from 'react';

interface WordInputProps {
  word: string;
  onWordChange: (word: string) => void;
  onGenerate: () => void;
}

const WordInput: React.FC<WordInputProps> = ({ word, onWordChange, onGenerate }) => {

  return (
    <div>
      <input
        type="text"
        value={word}
        onChange={(e) => onWordChange(e.target.value)}
        placeholder="Input a word"
      />
      <button onClick={onGenerate}>Generate</button>
    </div>
  );
};

export default WordInput;
