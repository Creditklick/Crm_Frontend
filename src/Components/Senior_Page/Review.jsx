



















import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaComment, FaHistory, FaPlus, FaUser, FaSpinner, FaRobot } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';

// --- Enhanced Formatting Function ---
const formatResponse = (text) => {
  if (!text) return null;

  // 1. Split into lines for processing lists and headings
  const lines = text.split('\n');
  const elements = [];
  let currentListType = null; // 'ul' or 'ol'
  let listItems = [];

  const processList = () => {
    if (listItems.length > 0) {
      const ListTag = currentListType;
      elements.push(
        <ListTag key={`list-${elements.length}`} className={`list-inside ${currentListType === 'ol' ? 'list-decimal' : 'list-disc'} pl-6 my-2`}>
          {listItems.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: formatInline(item) }}></li>
          ))}
        </ListTag>
      );
      listItems = [];
      currentListType = null;
    }
  };

  // Regex for inline formatting (must be applied carefully)
  const formatInline = (line) => {
    // Basic Link Detection (must run first to avoid messing up URLs)
    line = line.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
    // Bold (**text**)
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic (*text*)
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return line;
  };

  // Regex for code blocks
  const codeBlockRegex = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Process text before the code block
    const textBefore = text.substring(lastIndex, match.index);
    if (textBefore.trim()) {
        // Process lines within this non-code block part
        textBefore.split('\n').forEach((line, lineIndex) => {
            line = line.trim();
             if (line.startsWith('# ')) { processList(); elements.push(<h1 key={`h1-${elements.length}-${lineIndex}`} className="text-2xl font-bold my-3" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }}></h1>); }
             else if (line.startsWith('## ')) { processList(); elements.push(<h2 key={`h2-${elements.length}-${lineIndex}`} className="text-xl font-bold my-3" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(3)) }}></h2>); }
             else if (line.startsWith('### ')) { processList(); elements.push(<h3 key={`h3-${elements.length}-${lineIndex}`} className="text-lg font-bold my-2" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(4)) }}></h3>); }
             else if (line.startsWith('* ') || line.startsWith('- ')) { if (currentListType !== 'ul') { processList(); currentListType = 'ul'; } listItems.push(line.substring(2)); }
             else if (/^\d+\.\s/.test(line)) { if (currentListType !== 'ol') { processList(); currentListType = 'ol'; } listItems.push(line.replace(/^\d+\.\s/, '')); }
             else { processList(); if (line) elements.push(<p key={`p-${elements.length}-${lineIndex}`} className="mb-2" dangerouslySetInnerHTML={{ __html: formatInline(line) }}></p>); }
        });
    }

    // Process the code block
    processList(); // Ensure any pending list is processed before the code block
    const codeContent = match[1].trim(); // Get content inside ```
    elements.push(
      <pre key={`code-${elements.length}`} className="bg-gray-800 text-gray-100 p-3 rounded-lg my-3 overflow-x-auto text-sm font-mono">
        <code>{codeContent}</code>
      </pre>
    );

    lastIndex = codeBlockRegex.lastIndex;
  }

   // Process any remaining text after the last code block
  const textAfter = text.substring(lastIndex);
   if (textAfter.trim()) {
       textAfter.split('\n').forEach((line, lineIndex) => {
         line = line.trim();
         if (line.startsWith('# ')) { processList(); elements.push(<h1 key={`h1-end-${lineIndex}`} className="text-2xl font-bold my-3" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }}></h1>); }
         else if (line.startsWith('## ')) { processList(); elements.push(<h2 key={`h2-end-${lineIndex}`} className="text-xl font-bold my-3" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(3)) }}></h2>); }
         else if (line.startsWith('### ')) { processList(); elements.push(<h3 key={`h3-end-${lineIndex}`} className="text-lg font-bold my-2" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(4)) }}></h3>); }
         else if (line.startsWith('* ') || line.startsWith('- ')) { if (currentListType !== 'ul') { processList(); currentListType = 'ul'; } listItems.push(line.substring(2)); }
         else if (/^\d+\.\s/.test(line)) { if (currentListType !== 'ol') { processList(); currentListType = 'ol'; } listItems.push(line.replace(/^\d+\.\s/, '')); }
         else { processList(); if (line) elements.push(<p key={`p-end-${lineIndex}`} className="mb-2" dangerouslySetInnerHTML={{ __html: formatInline(line) }}></p>); }
       });
   }


  // Process any remaining list items after the loop
  processList();

  return elements.length > 0 ? elements : <p>{text}</p>; // Fallback for plain text
};


const Review = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null); // Ref for scrolling

  // --- IMPORTANT SECURITY WARNING ---
  // NEVER embed API keys directly in your frontend code like this.
  // This key is exposed to anyone visiting your website.
  // Use a backend server or serverless function to handle API calls securely.
  const getscrapdata = 'https://crm-backend-msk3.onrender.com/searchapp/admin/trigger-scrape'; // Replace with your actual key ONLY for local testing if absolutely necessary, but ideally fetch from backend/env var
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBAJXBYNLTWYcG5PRp1jUpNxgs1GzD1lTk`;

  // Load chat history from localStorage
  useEffect(() => {
    try {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          // Basic validation
          if (Array.isArray(history)) {
             setChatHistory(history);
             if (history.length > 0 && !activeChat) {
                 setActiveChat(history[0].id);
             }
          } else {
              console.error("Invalid chat history format in localStorage");
              localStorage.removeItem('chatHistory'); // Clear invalid data
          }
        }
    } catch (parseError) {
        console.error("Failed to parse chat history from localStorage:", parseError);
        localStorage.removeItem('chatHistory'); // Clear corrupted data
    }
  }, []); // Run only once on mount

  // Save chat history to localStorage
  useEffect(() => {
    // Avoid saving initial empty state if history was loaded
    if (chatHistory.length > 0 || localStorage.getItem('chatHistory')) {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Scroll to bottom of chat messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeChat]); // Scroll when history or active chat changes

  const createNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: `Chat ${chatHistory.length + 1}`, // Simple title
      messages: [{
        id: Date.now() + 1, // Ensure unique ID
        text: 'Hello! How can I assist you today?',
        sender: 'admin',
        timestamp: new Date().toISOString()
      }],
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [newChat, ...prev]); // Add to the beginning
    setActiveChat(newChatId);
    setError(null); // Clear any previous errors
  };

  // const handleApiResponse = async (promptText, currentChatMessages) => {
  //   // Prepare conversation history for context (optional but often better)
  //    const contents = [
  //       // You might want to add previous messages for context, e.g.:
  //       // ...currentChatMessages.map(msg => ({
  //       //   role: msg.sender === 'user' ? 'user' : 'model',
  //       //   parts: [{ text: msg.text }]
  //       // })),
  //       { role: 'user', parts: [{ text: promptText }] }
  //     ];


  //   try {
    
  //     const token = localStorage.getItem('token');
  //     const scraptwebsitedata = await axios.post(getscrapdata,{
  //          headers : {
  //                'Content-Type' : 'application/json',
  //                'Autherization' : `Bearer ${token}`
  //          }
  //     });



  //     const response = await fetch(API_URL, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ contents }) // Use 'contents' structure
  //     });

  //     if (!response.ok) {
  //         const errorData = await response.json().catch(() => ({})); // Try to get error details
  //         console.error("API Error Response:", errorData);
  //         throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
  //     }

  //     const data = await response.json();

  //     // Check the response structure carefully based on Gemini API docs
  //     const candidate = data.candidates?.[0];
  //     const responseText = candidate?.content?.parts?.[0]?.text;

  //     if (!responseText) {
  //       console.warn("API Response structure unexpected or empty:", data);
  //       return 'Sorry, I could not process that.';
  //     }
  //     return responseText;

  //   } catch (error) {
  //     console.error('API Call Failed:', error);
  //     throw error; // Re-throw to be caught by handleSubmit
  //   }
  // };

  const handleApiResponse = async (promptText) => {
    try {
      const token = localStorage.getItem('token');
      
      // Step 1: Trigger web scraping
      const scrapeResponse = await axios.post('https://crm-backend-msk3.onrender.com/searchapp/admin/trigger-scrape');
       console.log("data is ",scrapeResponse.data.data);
      if (!scrapeResponse.data.success) {
        throw new Error('Scraping failed: ' + scrapeResponse.data.message);
      }

      // Step 2: Process scraped data
      const scrapedData = scrapeResponse.data.data;

      console.log("actaul data is ",scrapedData)
      
      // Step 3: Combine scraped data with user prompt
      const contextPrompt = `
        Scraped Website Data:
        ${JSON.stringify(scrapedData, null, 2)}
        
        User Question: ${promptText}
        
        Please provide a detailed response based on the scraped data above.
      `;

      // Step 4: Send to Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: contextPrompt }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response found';

    } catch (error) {
      console.error('API Call Failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || loading || !activeChat) return;

    setLoading(true);
    setError(null);

    const userMessage = {
      id: Date.now(),
      text: trimmedMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => prev.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));
    setNewMessage('');

    try {
      const aiResponse = await handleApiResponse(trimmedMessage);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'admin',
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      ));
    } catch (apiError) {
      setError(`Error: ${apiError.message}`);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${apiError.message}`,
        sender: 'system_error',
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, errorMessage] }
        : chat
      ));
    } finally {
      setLoading(false);
    }
  };





  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const trimmedMessage = newMessage.trim();
  //   if (!trimmedMessage || loading || !activeChat) return;

  //   setLoading(true);
  //   setError(null);

  //   const userMessage = {
  //     id: Date.now(),
  //     text: trimmedMessage,
  //     sender: 'user',
  //     timestamp: new Date().toISOString()
  //   };

  //   // Update state immediately for better UX
  //   setChatHistory(prev => prev.map(chat =>
  //     chat.id === activeChat
  //       ? { ...chat, messages: [...chat.messages, userMessage] }
  //       : chat
  //   ));
  //   setNewMessage(''); // Clear input field immediately

  //   // Find the current chat to potentially pass history context
  //   const currentChatForApi = chatHistory.find(chat => chat.id === activeChat);

  //   try {
  //     const aiResponse = await handleApiResponse(trimmedMessage, currentChatForApi?.messages || []);

  //     const aiMessage = {
  //       id: Date.now() + 1, // Ensure unique ID
  //       text: aiResponse,
  //       sender: 'admin',
  //       timestamp: new Date().toISOString()
  //     };

  //     setChatHistory(prev => prev.map(chat =>
  //       chat.id === activeChat
  //         ? { ...chat, messages: [...chat.messages, aiMessage] }
  //         : chat
  //     ));
  //   } catch (apiError) {
  //       setError(`Failed to get response: ${apiError.message}`);
  //       // Optionally remove the user message if the API call failed,
  //       // or add an error indicator to the message. Let's keep it for context.
  //       // setChatHistory(prev => prev.map(chat =>
  //       //   chat.id === activeChat
  //       //     ? { ...chat, messages: chat.messages.filter(msg => msg.id !== userMessage.id) }
  //       //     : chat
  //       // ));
  //       // Add an error message from the system instead
  //        const errorMessage = {
  //            id: Date.now() + 1,
  //            text: `Error: Could not get response. ${apiError.message}`,
  //            sender: 'system_error', // Use a distinct sender type
  //            timestamp: new Date().toISOString()
  //        };
  //        setChatHistory(prev => prev.map(chat =>
  //           chat.id === activeChat
  //           ? { ...chat, messages: [...chat.messages, errorMessage] }
  //           : chat
  //        ));
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const currentChatMessages = chatHistory.find(chat => chat.id === activeChat)?.messages || [];

  return (
    // Refined gradient and layout padding
    <div
      style={{ background: `linear-gradient(135deg, #fbcfe8 0%, #fef3c7 30%, #fbbf24 70%, #f9a8d4 100%)` }} // Softer, more cohesive gradient
      className="min-h-screen mt-10 flex flex-col pt-20 pb-4 px-2 sm:px-4 md:px-8" // Use flex-col for full height potential
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow"> {/* Changed to 4 columns */}

        {/* Chat History Section (Takes 1 column) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg flex flex-col h-[calc(100vh-10rem)] max-h-[700px]" // Fixed height, flex column
        >
          <div className="p-4 border-b border-purple-200/50 flex justify-between items-center shrink-0">
            <h2 className="text-lg font-semibold flex items-center text-purple-800">
              <FaHistory className="mr-2" /> History
            </h2>
            <button
              onClick={createNewChat}
              title="Start New Chat"
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              <FaPlus />
            </button>
          </div>

          {/* Scrollable History List */}
          <div className="overflow-y-auto p-3 space-y-2 flex-grow">
            {chatHistory.length === 0 && (
                <p className="text-center text-gray-500 italic p-4">No chats yet. Start a new one!</p>
            )}
            {chatHistory.map(chat => (
              <motion.div
                key={chat.id}
                layout // Animate layout changes
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                className={`p-3 rounded-lg cursor-pointer border-2 transition-colors duration-200 ${
                  activeChat === chat.id
                    ? 'bg-purple-100/70 border-purple-500 shadow-inner'
                    : 'bg-white/30 border-transparent hover:border-purple-300'
                }`}
                onClick={() => setActiveChat(chat.id)}
              >
                <p className="font-medium text-gray-800 truncate text-sm">{chat.title}</p> {/* Truncate long titles */}
                <p className="text-xs text-gray-600">
                  {format(new Date(chat.timestamp), 'MMM dd, h:mm a')}
                </p>
                {/* Optional: Show message count */}
                 {/* <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded mt-1 inline-block">
                     {chat.messages.length} msg
                 </span> */}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Chat Section (Takes 3 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3 bg-white/60 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg flex flex-col h-[calc(100vh-10rem)] max-h-[700px]" // Fixed height, flex column
        >
          <div className="p-4 border-b border-purple-200/50 shrink-0">
             <h2 className="text-lg sm:text-xl font-semibold flex items-center text-purple-700">
                 <FaComment className="mr-2" />
                 {activeChat ? chatHistory.find(c => c.id === activeChat)?.title : 'Select a Chat'}
             </h2>
          </div>

          {/* Scrollable Chat Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {currentChatMessages.length === 0 && activeChat && (
                  <p className="text-center text-gray-500 italic pt-10">Send a message to start the conversation!</p>
              )}
               {currentChatMessages.length === 0 && !activeChat && (
                  <p className="text-center text-gray-500 italic pt-10">Select a chat from the history or start a new one.</p>
              )}
              {currentChatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  layout // Animate layout changes
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                    {/* Optional Avatar */}
                    {message.sender !== 'user' && message.sender !== 'system_error' && (
                        <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 shrink-0 mb-5">
                            <FaRobot size={14}/>
                        </div>
                    )}

                  <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : message.sender === 'system_error'
                      ? 'bg-red-100 text-red-700 rounded-bl-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}>
                    {/* Render formatted message */}
                    <div className="text-sm leading-relaxed message-content">
                        {message.sender === 'admin'
                            ? formatResponse(message.text)
                            : message.sender === 'system_error'
                            ? <span className="font-semibold">{message.text}</span> // Simple display for system errors
                            : message.text // Plain text for user
                        }
                    </div>
                    <div className={`text-xs mt-1.5 text-right ${
                      message.sender === 'user' ? 'text-purple-200/80' : 'text-gray-400'
                    }`}>
                      {format(new Date(message.timestamp), 'h:mm a')}
                    </div>
                  </div>
                     {/* Optional Avatar for User */}
                    {message.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shrink-0 mb-5">
                            <FaUser size={14}/>
                        </div>
                    )}
                </motion.div>
              ))}
            </AnimatePresence>
            {/* Loading Indicator */}
            {loading && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-end gap-2"
              >
                  <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                     <FaRobot size={14}/>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none inline-flex items-center">
                    <FaSpinner className="animate-spin text-purple-600" />
                    <span className="ml-2 text-xs text-gray-500 italic">Thinking...</span>
                  </div>
              </motion.div>
            )}
            {/* Element to scroll to */}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-purple-200/50 shrink-0">
             {/* Error Display */}
             {error && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 p-2 bg-red-100 text-red-700 text-xs rounded-lg text-center"
                >
                  {error}
                </motion.div>
              )}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={activeChat ? "Type your message..." : "Select or start a chat"}
                className="flex-1 p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 disabled:bg-gray-100"
                disabled={loading || !activeChat} // Disable if loading or no active chat
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim() || !activeChat} // Disable if loading, empty, or no chat active
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" size={18}/>
                ) : (
                  <FaPaperPlane size={18}/>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Review;

// // Add some global CSS or use Tailwind's @layer base if needed for message content styling:
// /*
// In your global CSS (e.g., index.css or App.css):

// .message-content h1 { @apply text-2xl font-bold my-3; }
// .message-content h2 { @apply text-xl font-bold my-3; }
// .message-content h3 { @apply text-lg font-bold my-2; }
// .message-content ul { @apply list-disc list-inside pl-4 my-2; }
// .message-content ol { @apply list-decimal list-inside pl-4 my-2; }
// .message-content li { @apply mb-1; }
// .message-content p { @apply mb-2; }
// .message-content a { @apply text-blue-600 hover:underline; }
// .message-content pre { @apply bg-gray-800 text-gray-100 p-3 rounded-lg my-3 overflow-x-auto text-sm font-mono; }
// .message-content code { font-family: monospace; } // Ensure code tag uses monospace
// .message-content strong { @apply font-semibold; }
// .message-content em { @apply italic; }

// */





































// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaPaperPlane, FaComment, FaHistory, FaPlus, FaUser, FaSpinner, FaRobot, FaSync } from 'react-icons/fa';
// import { format } from 'date-fns';
// import axios from 'axios';

// // ---------------------- Helper Functions ----------------------
// const formatResponse = (text) => {
//   if (!text) return null;

//   // 1. Split into lines for processing lists and headings
//   const lines = text.split('\n');
//   const elements = [];
//   let currentListType = null; // 'ul' or 'ol'
//   let listItems = [];

//   const processList = () => {
//     if (listItems.length > 0) {
//       const ListTag = currentListType;
//       elements.push(
//         <ListTag key={`list-${elements.length}`} className={`list-inside ${currentListType === 'ol' ? 'list-decimal' : 'list-disc'} pl-6 my-2`}>
//           {listItems.map((item, index) => (
//             <li key={index} dangerouslySetInnerHTML={{ __html: formatInline(item) }}></li>
//           ))}
//         </ListTag>
//       );
//       listItems = [];
//       currentListType = null;
//     }
//   };

//   // Regex for inline formatting (must be applied carefully)
//   const formatInline = (line) => {
//     // Basic Link Detection (must run first to avoid messing up URLs)
//     line = line.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
//     // Bold (**text**)
//     line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//     // Italic (*text*)
//     line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
//     return line;
//   };

//   // Regex for code blocks
//   const codeBlockRegex = /```([\s\S]*?)```/g;
//   let lastIndex = 0;
//   let match;

//   while ((match = codeBlockRegex.exec(text)) !== null) {
//     // Process text before the code block
//     const textBefore = text.substring(lastIndex, match.index);
//     if (textBefore.trim()) {
//         // Process lines within this non-code block part
//         textBefore.split('\n').forEach((line, lineIndex) => {
//             line = line.trim();
//              if (line.startsWith('# ')) { processList(); elements.push(<h1 key={`h1-${elements.length}-${lineIndex}`} className="text-2xl font-bold my-3" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }}></h1>); }
//              else if (line.startsWith('## ')) { processList(); elements.push(<h2 key={`h2-${elements.length}-${lineIndex}`} className="text-xl font-bold my-3" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(3)) }}></h2>); }
//              else if (line.startsWith('### ')) { processList(); elements.push(<h3 key={`h3-${elements.length}-${lineIndex}`} className="text-lg font-bold my-2" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(4)) }}></h3>); }
//              else if (line.startsWith('* ') || line.startsWith('- ')) { if (currentListType !== 'ul') { processList(); currentListType = 'ul'; } listItems.push(line.substring(2)); }
//              else if (/^\d+\.\s/.test(line)) { if (currentListType !== 'ol') { processList(); currentListType = 'ol'; } listItems.push(line.replace(/^\d+\.\s/, '')); }
//              else { processList(); if (line) elements.push(<p key={`p-${elements.length}-${lineIndex}`} className="mb-2" dangerouslySetInnerHTML={{ __html: formatInline(line) }}></p>); }
//         });
//     }

//     // Process the code block
//     processList(); // Ensure any pending list is processed before the code block
//     const codeContent = match[1].trim(); // Get content inside ```
//     elements.push(
//       <pre key={`code-${elements.length}`} className="bg-gray-800 text-gray-100 p-3 rounded-lg my-3 overflow-x-auto text-sm font-mono">
//         <code>{codeContent}</code>
//       </pre>
//     );

//     lastIndex = codeBlockRegex.lastIndex;
//   }

//    // Process any remaining text after the last code block
//   const textAfter = text.substring(lastIndex);
//    if (textAfter.trim()) {
//        textAfter.split('\n').forEach((line, lineIndex) => {
//          line = line.trim();
//          if (line.startsWith('# ')) { processList(); elements.push(<h1 key={`h1-end-${lineIndex}`} className="text-2xl font-bold my-3" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }}></h1>); }
//          else if (line.startsWith('## ')) { processList(); elements.push(<h2 key={`h2-end-${lineIndex}`} className="text-xl font-bold my-3" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(3)) }}></h2>); }
//          else if (line.startsWith('### ')) { processList(); elements.push(<h3 key={`h3-end-${lineIndex}`} className="text-lg font-bold my-2" dangerouslySetInnerHTML={{ __html: formatInline(line.substring(4)) }}></h3>); }
//          else if (line.startsWith('* ') || line.startsWith('- ')) { if (currentListType !== 'ul') { processList(); currentListType = 'ul'; } listItems.push(line.substring(2)); }
//          else if (/^\d+\.\s/.test(line)) { if (currentListType !== 'ol') { processList(); currentListType = 'ol'; } listItems.push(line.replace(/^\d+\.\s/, '')); }
//          else { processList(); if (line) elements.push(<p key={`p-end-${lineIndex}`} className="mb-2" dangerouslySetInnerHTML={{ __html: formatInline(line) }}></p>); }
//        });
//    }


//   // Process any remaining list items after the loop
//   processList();

//   return elements.length > 0 ? elements : <p>{text}</p>; // Fallback for plain text
// };

// // ---------------------- Main Component ----------------------
// const Review = () => {
//   const [activeChat, setActiveChat] = useState(null);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState({ chat: false, scrape: false });
//   const [error, setError] = useState(null);
//   const chatEndRef = useRef(null);
//   const SCRAPE_API_URL = 'https://crm-backend-msk3.onrender.com/searchapp/admin/trigger-scrape';
//   const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBAJXBYNLTWYcG5PRp1jUpNxgs1GzD1lTk`;

//   // ---------------------- Auto-Scroll Setup ----------------------
//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({
//         behavior: 'smooth',
//         block: 'nearest'
//       });
//     }
//   }, [chatHistory, activeChat]); // Add proper dependencies

//   // ---------------------- Data Handling ----------------------
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('chatHistory');
//     if (savedHistory) {
//       try {
//         const history = JSON.parse(savedHistory);
//         setChatHistory(history);
//         if (history.length > 0) setActiveChat(history[0].id);
//       } catch (e) {
//         console.error('Chat history parse error:', e);
//         localStorage.removeItem('chatHistory');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (chatHistory.length > 0) {
//       localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
//     }
//   }, [chatHistory]);

//   // ---------------------- Improved Scraping Integration ----------------------
//   const fetchScrapedData = async () => {
//     const token  = localhost.getItem('token');
//     try {
//       setLoading(prev => ({ ...prev, scrape: true }));
//        const response = await axios.post(SCRAPE_API_URL, {}, {
//   headers: { Authorization: `Bearer ${token}` },
//   timeout: 10000,
//   validateStatus: status => status === 200
// });
      
//       return response.data.substring(0, 5000);

//     } catch (error) {
//       console.error('Scraping Error:', error);
//       const errorMsg = error.response?.status === 404 
//         ? 'Scraping endpoint not found (404)'
//         : 'Failed to fetch fresh data';
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(prev => ({ ...prev, scrape: false }));
//     }
//   };

//   // ---------------------- Enhanced AI Response Handling ----------------------
//   const getAIResponse = async (userInput) => {
//     try {
//       const scrapedData = await fetchScrapedData();
      
//       const { data } = await axios.post(
//         GEMINI_API_URL,
//         {
//           contents: [{
//             parts: [{
//               text: `Context: ${scrapedData}\nQuestion: ${userInput}\nAnswer in user's language:`
//             }]
//           }]
//         },
//         {
//           timeout: 15000,
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       return data.candidates?.[0]?.content?.parts?.[0]?.text 
//         || 'Could not generate response';

//     } catch (error) {
//       console.error('API Error:', error);
//       let message = 'Service unavailable';
      
//       if (error.response) {
//         message = `API Error: ${error.response.status} - ${error.response.data?.error || ''}`;
//       } else if (error.request) {
//         message = 'No response from server';
//       }
      
//       throw new Error(message);
//     }
//   };

//   // ---------------------- Chat Handling ----------------------
//   const createNewChat = () => {
//     const newChat = {
//       id: Date.now(),
//       title: `Chat ${chatHistory.length + 1}`,
//       messages: [{
//         id: Date.now(),
//         text: 'नमस्ते! मैं CreditKlick डेटा के साथ आपकी कैसे मदद कर सकता हूँ?',
//         sender: 'admin',
//         timestamp: new Date().toISOString()
//       }],
//       timestamp: new Date().toISOString()
//     };
//     setChatHistory(prev => [newChat, ...prev]);
//     setActiveChat(newChat.id);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const inputText = newMessage.trim();
//     if (!inputText || loading.chat) return;

//     setLoading(prev => ({ ...prev, chat: true }));
//     setError(null);

//     // Add user message
//     const userMsg = {
//       id: Date.now(),
//       text: inputText,
//       sender: 'user',
//       timestamp: new Date().toISOString()
//     };

//     setChatHistory(prev => 
//       prev.map(chat => 
//         chat.id === activeChat 
//           ? { ...chat, messages: [...chat.messages, userMsg] }
//           : chat
//       )
//     );
//     setNewMessage('');

//     try {
//       const aiResponse = await getAIResponse(inputText);
      
//       const aiMsg = {
//         id: Date.now(),
//         text: aiResponse,
//         sender: 'admin',
//         timestamp: new Date().toISOString()
//       };

//       setChatHistory(prev => 
//         prev.map(chat => 
//           chat.id === activeChat 
//             ? { ...chat, messages: [...chat.messages, aiMsg] }
//             : chat
//         )
//       );

//     } catch (error) {
//       const errorMsg = {
//         id: Date.now(),
//         text: `Error: ${error.message}`,
//         sender: 'system',
//         timestamp: new Date().toISOString()
//       };
//       setChatHistory(prev => 
//         prev.map(chat => 
//           chat.id === activeChat 
//             ? { ...chat, messages: [...chat.messages, errorMsg] }
//             : chat
//         )
//       );
//       setError(error.message);
//     } finally {
//       setLoading(prev => ({ ...prev, chat: false }));
//     }
//   };

//   // ---------------------- UI Components ----------------------
//   const currentChat = chatHistory.find(chat => chat.id === activeChat)?.messages || [];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-20 pb-8 px-4">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
//         {/* Chat History Sidebar */}
//         <motion.div 
//           className="bg-white rounded-xl shadow-lg p-4 h-[calc(100vh-10rem)] flex flex-col"
//           initial={{ x: -20 }}
//           animate={{ x: 0 }}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold flex items-center">
//               <FaHistory className="mr-2 text-purple-600" /> इतिहास
//             </h2>
//             <button
//               onClick={createNewChat}
//               className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               <FaPlus />
//             </button>
//           </div>
          
//           <div className="flex-1 overflow-y-auto space-y-2">
//             {chatHistory.map(chat => (
//               <div
//                 key={chat.id}
//                 onClick={() => setActiveChat(chat.id)}
//                 className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                   activeChat === chat.id 
//                     ? 'bg-purple-100 border-2 border-purple-500' 
//                     : 'hover:bg-gray-50'
//                 }`}
//               >
//                 <p className="font-medium truncate text-sm">{chat.title}</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {format(new Date(chat.timestamp), 'dd MMM, h:mm a')}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Main Chat Area */}
//         <div className="lg:col-span-3 bg-white rounded-xl shadow-lg flex flex-col">
//           <div className="p-4 border-b flex items-center justify-between">
//             <h2 className="text-xl font-semibold flex items-center">
//               <FaComment className="mr-2 text-purple-600" />
//               {activeChat ? chatHistory.find(c => c.id === activeChat)?.title : 'नया चैट'}
//             </h2>
//             <button
//               onClick={fetchScrapedData}
//               disabled={loading.scrape}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
//             >
//               <FaSync className={loading.scrape ? 'animate-spin' : ''} />
//               {loading.scrape ? 'डेटा ताज़ा कर रहे...' : 'डेटा अपडेट'}
//             </button>
//           </div>

//           {/* Scrollable Chat Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[500px]">
//             <AnimatePresence>
//               {currentChat.map((message) => (
//                 <motion.div
//                   key={message.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div className={`max-w-[80%] p-3 rounded-lg ${
//                     message.sender === 'user' 
//                       ? 'bg-purple-600 text-white' 
//                       : message.sender === 'system'
//                         ? 'bg-red-100 text-red-700'
//                         : 'bg-gray-100'
//                   }`}>
//                     <div className="prose max-w-none">
//                       {message.sender === 'admin' 
//                         ? formatResponse(message.text)
//                         : message.text}
//                     </div>
//                     <div className={`text-xs mt-1 ${
//                       message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
//                     }`}>
//                       {format(new Date(message.timestamp), 'h:mm a')}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//               <div ref={chatEndRef} />
//             </AnimatePresence>
//           </div>

//           {/* Input Area */}
//           <div className="p-4 border-t">
//             <form onSubmit={handleSubmit} className="flex gap-2">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="अपना संदेश टाइप करें..."
//                 className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
//                 disabled={loading.chat}
//               />
//               <button
//                 type="submit"
//                 disabled={loading.chat || !newMessage.trim()}
//                 className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {loading.chat ? (
//                   <FaSpinner className="animate-spin" />
//                 ) : (
//                   <FaPaperPlane />
//                 )}
//               </button>
//             </form>
//             {error && (
//               <p className="text-red-500 text-sm mt-2">
//                 {error.includes('404') ? (
//                   <>
//                     Server not found! Check:
//                     <ul className="list-disc pl-4 mt-1">
//                       <li>Backend server is running</li>
//                       <li>Correct API endpoint</li>
//                       <li>Network connection</li>
//                     </ul>
//                   </>
//                 ) : error}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Review;