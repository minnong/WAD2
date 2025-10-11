import { useState } from 'react';
import { Send } from 'lucide-react';

export default function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey there 👋 How can I help you with ShareLah today?' },
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // show user message immediately
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
        const response = await fetch('/api/faq-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: input }),
        });

        const data = await response.json();

        if (data.reply) {
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        } else {
            throw new Error('No reply from API');
        }
        } catch (error) {
        console.error('Chatbot error:', error);
        setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: "Sorry 😅 I couldn't connect to the chatbot server." },
        ]);
        }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
      >
        💬 Chat
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white dark:bg-gray-900 shadow-xl rounded-2xl flex flex-col overflow-hidden border border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <h3 className="font-semibold">ShareLah Assistant</h3>
            <button onClick={toggleChat} className="text-white">✖</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] ${
                  msg.role === 'user'
                    ? 'ml-auto bg-blue-500 text-white'
                    : 'mr-auto bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex border-t border-gray-200 dark:border-gray-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your question..."
              className="flex-1 p-3 bg-transparent outline-none text-gray-800 dark:text-gray-100"
            />
            <button
              onClick={sendMessage}
              className="px-4 text-blue-500 hover:text-blue-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
