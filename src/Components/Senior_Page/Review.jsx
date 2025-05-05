

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaComment, FaHistory, FaPlus, FaUser, FaSpinner, FaRobot } from 'react-icons/fa';
import { format } from 'date-fns';
// Removed: import axios from 'axios'; - No longer needed as fetch is used and scraping call removed

// --- Enhanced Formatting Function ---
// Renders text with basic Markdown-like formatting (headings, lists, bold, italic, code blocks, links)
const formatResponse = (text) => {
  if (!text) return null;

  // 1. Split into lines for processing lists and headings
  const lines = text.split('\n');
  const elements = [];
  let currentListType = null; // 'ul' or 'ol'
  let listItems = [];

  // Helper to process and add accumulated list items to elements
  const processList = () => {
    if (listItems.length > 0) {
      const ListTag = currentListType;
      elements.push(
        <ListTag key={`list-${elements.length}`} className={`list-inside ${currentListType === 'ol' ? 'list-decimal' : 'list-disc'} pl-6 my-2`}>
          {listItems.map((item, index) => (
            // Use dangerouslySetInnerHTML for inline formatting within list items
            <li key={index} dangerouslySetInnerHTML={{ __html: formatInline(item) }}></li>
          ))}
        </ListTag>
      );
      listItems = [];
      currentListType = null;
    }
  };

  // Helper for inline formatting (bold, italic, links)
  const formatInline = (line) => {
    // Basic Link Detection (must run first to avoid messing up URLs)
    line = line.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
    // Bold (**text**)
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic (*text*)
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return line;
  };

  // Regex for code blocks (```code```)
  const codeBlockRegex = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  // Process text segment by segment, separating code blocks
  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Process text *before* the code block
    const textBefore = text.substring(lastIndex, match.index);
    if (textBefore.trim()) {
      // Process each line for headings, lists, or paragraphs
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

    // Process the code block itself
    processList(); // Finalize any pending list before the code block
    const codeContent = match[1].trim(); // Get content inside ```
    elements.push(
      <pre key={`code-${elements.length}`} className="bg-gray-800 text-gray-100 p-3 rounded-lg my-3 overflow-x-auto text-sm font-mono">
        <code>{codeContent}</code>
      </pre>
    );

    lastIndex = codeBlockRegex.lastIndex; // Update position for next search
  }

  // Process any remaining text *after* the last code block
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

  // Return the array of JSX elements, or fallback to plain text if no formatting was applied
  return elements.length > 0 ? elements : <p>{text}</p>;
};


const Review = () => {
  const [activeChat, setActiveChat] = useState(null); // ID of the currently viewed chat
  const [chatHistory, setChatHistory] = useState([]); // Array of all chat objects
  const [newMessage, setNewMessage] = useState(''); // Content of the input field
  const [loading, setLoading] = useState(false); // Indicates if waiting for API response
  const [error, setError] = useState(null); // Stores API or processing errors
  const chatEndRef = useRef(null); // Ref for scrolling to the bottom of the chat

  // --- IMPORTANT SECURITY WARNING ---
  // NEVER embed API keys directly in your frontend code like this.
  // This key is exposed to anyone visiting your website.
  // Use a backend server or serverless function to handle API calls securely.
  // Replace 'YOUR_GEMINI_API_KEY' with your actual key ONLY for local testing
  // if absolutely necessary, but ideally fetch from backend/env var.
  const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // <--- Replace or use environment variable
  // Removed: const getscrapdata = '...' - Scraping URL is no longer needed
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDBVXJhcidMg1VvRv1VPWKoDSpTr7OAejs`; // Using 1.5 Flash, ensure key matches model

  // Load chat history from localStorage on component mount
  useEffect(() => {
    try {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          // Basic validation to ensure it's an array
          if (Array.isArray(history)) {
              setChatHistory(history);
              // If history exists and no chat is active, activate the most recent one
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
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    // Avoid saving the initial empty state before history is loaded
    if (chatHistory.length > 0 || localStorage.getItem('chatHistory')) {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Scroll to the bottom of the chat messages when history or active chat changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeChat]); // Dependency on chatHistory and activeChat

  // Creates a new chat session
  const createNewChat = () => {
    const newChatId = Date.now(); // Simple unique ID based on timestamp
    const newChat = {
      id: newChatId,
      title: `Chat ${chatHistory.length + 1}`, // Simple title
      messages: [{ // Start with a greeting from the assistant
        id: Date.now() + 1, // Ensure unique message ID
        text: 'Hello! How can I assist you today?',
        sender: 'admin', // 'admin' represents the AI
        timestamp: new Date().toISOString()
      }],
      timestamp: new Date().toISOString() // Timestamp for the chat creation
    };
    setChatHistory(prev => [newChat, ...prev]); // Add the new chat to the beginning of the history
    setActiveChat(newChatId); // Set the new chat as active
    setError(null); // Clear any previous errors shown
  };

  // Function to handle the API call to Gemini (removed scraping logic)
  const handleApiResponse = async (promptText) => {
    // Removed: const token = localStorage.getItem('token'); - No longer needed
    // Removed: Scraping API call (axios.post to trigger-scrape)
    // Removed: contextPrompt construction that included scrapedData

    // Prepare the request body for the Gemini API
    const contents = [{
        role: 'user',
        parts: [{ text: promptText }] // Send only the user's prompt
    }];

    try {
      const response = await fetch(API_URL, { // Use the defined API_URL with the key
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }) // Send the structured contents
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to get error details from response
          console.error("API Error Response:", errorData);
          // Construct a more informative error message
          throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorData.error?.message || 'Unknown API error'}`);
      }

      const data = await response.json();

      // Extract the response text from the Gemini API structure
      // Check candidates[0].content.parts[0].text
      const candidate = data.candidates?.[0];
      const responseText = candidate?.content?.parts?.[0]?.text;

      if (!responseText) {
          console.warn("API Response structure unexpected or empty text:", data);
          return 'Sorry, I received an empty response.'; // Provide a fallback message
      }
      return responseText; // Return the generated text

    } catch (error) {
        console.error('API Call Failed:', error);
        // Re-throw the error so it can be caught by handleSubmit and displayed to the user
        throw error;
    }
  };

  // Handles the submission of a new message from the user
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission page reload
    const trimmedMessage = newMessage.trim();
    // Don't submit if message is empty, loading, or no chat is active
    if (!trimmedMessage || loading || !activeChat) return;

    setLoading(true); // Set loading state to true
    setError(null); // Clear previous errors

    // Create the user's message object
    const userMessage = {
      id: Date.now(),
      text: trimmedMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Immediately update the chat history with the user's message for responsiveness
    setChatHistory(prev => prev.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));
    setNewMessage(''); // Clear the input field

    try {
      // Call the API function to get the AI's response
      const aiResponseText = await handleApiResponse(trimmedMessage);

      // Create the AI's message object
      const aiMessage = {
        id: Date.now() + 1, // Ensure unique ID
        text: aiResponseText,
        sender: 'admin', // AI sender
        timestamp: new Date().toISOString()
      };

      // Update the chat history with the AI's response
      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      ));
    } catch (apiError) {
      // If the API call fails, display an error message in the chat
      setError(`Error: ${apiError.message}`); // Also set the error state for potential display elsewhere
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${apiError.message}`, // Show the error in the chat stream
        sender: 'system_error', // Use a distinct sender for error messages
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      ));
    } finally {
      // Ensure loading state is turned off regardless of success or failure
      setLoading(false);
    }
  };

  // Get messages for the currently active chat, or an empty array if none is active
  const currentChatMessages = chatHistory.find(chat => chat.id === activeChat)?.messages || [];

  return (
    // Main container with gradient background and layout settings
    <div
      style={{ background: `linear-gradient(135deg, #fbcfe8 0%, #fef3c7 30%, #fbbf24 70%, #f9a8d4 100%)` }} // Softer gradient
      className="min-h-screen mt-10 flex flex-col pt-20 pb-4 px-2 sm:px-4 md:px-8" // Padding and flex setup
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow"> {/* Grid layout for history and chat */}

        {/* Chat History Section (Sidebar) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} // Animation
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg flex flex-col h-[calc(100vh-10rem)] max-h-[700px]" // Styling and fixed height
        >
          {/* History Header */}
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

          {/* Scrollable List of Chats */}
          <div className="overflow-y-auto p-3 space-y-2 flex-grow">
            {chatHistory.length === 0 && (
              <p className="text-center text-gray-500 italic p-4">No chats yet. Start a new one!</p>
            )}
            {chatHistory.map(chat => (
              <motion.div
                key={chat.id}
                layout // Animate layout changes (e.g., when a new chat is added)
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} // Hover effect
                className={`p-3 rounded-lg cursor-pointer border-2 transition-colors duration-200 ${
                  activeChat === chat.id
                    ? 'bg-purple-100/70 border-purple-500 shadow-inner' // Style for active chat
                    : 'bg-white/30 border-transparent hover:border-purple-300' // Style for inactive chat
                }`}
                onClick={() => setActiveChat(chat.id)} // Set chat as active on click
              >
                <p className="font-medium text-gray-800 truncate text-sm">{chat.title}</p> {/* Chat title (truncated) */}
                <p className="text-xs text-gray-600">
                  {format(new Date(chat.timestamp), 'MMM dd, h:mm a')} {/* Chat timestamp */}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Chat Section (Main Area) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Animation
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3 bg-white/60 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg flex flex-col h-[calc(100vh-10rem)] max-h-[700px]" // Styling, span 3 columns on large screens, fixed height
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-purple-200/50 shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center text-purple-700">
              <FaComment className="mr-2" />
              {/* Display the title of the active chat, or a placeholder */}
              {activeChat ? chatHistory.find(c => c.id === activeChat)?.title : 'Select a Chat'}
            </h2>
          </div>

          {/* Scrollable Chat Message Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            <AnimatePresence> {/* Animates messages entering/exiting */}
              {/* Placeholder messages for empty or unselected chats */}
              {currentChatMessages.length === 0 && activeChat && (
                <p className="text-center text-gray-500 italic pt-10">Send a message to start the conversation!</p>
              )}
              {currentChatMessages.length === 0 && !activeChat && (
                <p className="text-center text-gray-500 italic pt-10">Select a chat from the history or start a new one.</p>
              )}
              {/* Render each message */}
              {currentChatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  layout // Animate position changes
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start' // Align user messages right, others left
                  }`}
                >
                  {/* AI Avatar (only for 'admin' sender) */}
                  {message.sender === 'admin' && (
                    <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 shrink-0 mb-5">
                      <FaRobot size={14}/>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none' // User message style
                      : message.sender === 'system_error'
                      ? 'bg-red-100 text-red-700 rounded-bl-none' // Error message style
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none' // AI message style
                  }`}>
                    {/* Message Content */}
                    <div className="text-sm leading-relaxed message-content">
                      {/* Use formatResponse for AI messages, simple display for errors/user */}
                      {message.sender === 'admin'
                        ? formatResponse(message.text)
                        : message.sender === 'system_error'
                        ? <span className="font-semibold">{message.text}</span> // Display error plainly
                        : message.text // Display user text plainly
                      }
                    </div>
                    {/* Timestamp */}
                    <div className={`text-xs mt-1.5 text-right ${
                      message.sender === 'user' ? 'text-purple-200/80' : 'text-gray-400'
                    }`}>
                      {format(new Date(message.timestamp), 'h:mm a')}
                    </div>
                  </div>

                  {/* User Avatar */}
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
            {/* Empty div to ensure scrolling to the very bottom */}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-purple-200/50 shrink-0">
            {/* Error Display Area (above input) */}
            {error && !loading && ( // Show error only if not currently loading
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 p-2 bg-red-100 text-red-700 text-xs rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}
            {/* Message Input Form */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={activeChat ? "Type your message..." : "Select or start a chat"}
                className="flex-1 p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 disabled:bg-gray-100"
                disabled={loading || !activeChat} // Disable input while loading or if no chat is active
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim() || !activeChat} // Disable button if loading, message empty, or no chat active
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                {/* Show spinner when loading, otherwise show send icon */}
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
