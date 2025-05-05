import { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { RotateCw, Send, History, X } from 'lucide-react';

const GeminiChat = () => {
  const [prompt, setPrompt] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('geminiChatHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setChatHistory(history);
      if (history.length > 0) setActiveChat(history[history.length - 1].id);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('geminiChatHistory', JSON.stringify(chatHistory));
    scrollToBottom();
    Prism.highlightAll();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chatHistory.length + 1}`,
      messages: [],
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, newChat]);
    setActiveChat(newChat.id);
    setShowHistory(false);
  };

  const formatResponse = (text) => {
    return text.split('```').map((part, index) => {
      if (index % 2 === 1) {
        const [lang, ...code] = part.split('\n');
        return (
          <pre key={index} className="!mt-4 !mb-6">
            <code className={`language-${lang.trim() || 'javascript'}`}>
              {code.join('\n')}
            </code>
          </pre>
        );
      }
      return part.split('\n').map((line, i) => (
        <p key={`${index}-${i}`} className="mb-2">
          {line}
        </p>
      ));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      // Update chat history
      const updatedHistory = chatHistory.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, {
              role: 'user',
              content: prompt,
              timestamp: new Date().toISOString()
            }]
          };
        }
        return chat;
      });
      setChatHistory(updatedHistory);

      // Get AI response
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBAJXBYNLTWYcG5PRp1jUpNxgs1GzD1lTk`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const aiResponse = data.candidates[0]?.content.parts[0]?.text || 'No response found';

      // Update chat history with AI response
      const finalHistory = updatedHistory.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, {
              role: 'assistant',
              content: aiResponse,
              timestamp: new Date().toISOString()
            }]
          };
        }
        return chat;
      });

      setChatHistory(finalHistory);
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Failed to fetch response');
      // Remove failed message
      const cleanedHistory = chatHistory.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: chat.messages.filter(msg => msg.role !== 'user' || msg.content !== prompt)
          };
        }
        return chat;
      });
      setChatHistory(cleanedHistory);
    } finally {
      setLoading(false);
    }
  };

  const currentChat = chatHistory.find(chat => chat.id === activeChat)?.messages || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8 h-screen flex">
        {/* History Sidebar */}
        <div className={`w-64 mr-4 transition-transform ${showHistory ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chat History</h2>
              <button 
                onClick={() => setShowHistory(false)}
                className="lg:hidden p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={createNewChat}
              className="w-full mb-4 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              New Chat +
            </button>
            <div className="space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
              {chatHistory.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat.id);
                    setShowHistory(false);
                  }}
                  className={`p-2 rounded cursor-pointer ${activeChat === chat.id ? 'bg-blue-600/30' : 'hover:bg-gray-700/50'}`}
                >
                  <div className="text-sm truncate">{chat.title}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="lg:hidden p-2 hover:bg-gray-700 rounded"
            >
              <History className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CodeChat AI
            </h1>
            <div className="lg:hidden w-6" /> {/* Spacer for alignment */}
          </header>

          <div className="flex-1 overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-lg shadow-xl">
            <div className="h-full overflow-y-auto p-4 space-y-6">
              {currentChat.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-600/20 border border-blue-600/30'
                        : 'bg-gray-700/50 border border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">
                        {message.role === 'user' ? 'You' : 'Gemini'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      {message.role === 'assistant' 
                        ? formatResponse(message.content)
                        : message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask for code or explanations..."
                className="w-full px-6 py-4 rounded-xl bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400/30 backdrop-blur-lg text-gray-100 placeholder-gray-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              >
                {loading ? (
                  <RotateCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">
                ⚠️ Error: {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;