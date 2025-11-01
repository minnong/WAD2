import React, { useState } from 'react';
import { generateContent } from '../services/gemini';

const GeminiExample: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await generateContent(prompt);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-5 md:px-8 md:py-8 max-w-2xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold">Gemini API Example</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          minHeight: '100px',
          fontFamily: 'monospace',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <button
        onClick={handleGenerateContent}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>

      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
          }}
        >
          Error: {error}
        </div>
      )}

      {response && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
};

export default GeminiExample;
