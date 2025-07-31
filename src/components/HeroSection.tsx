import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Bot, User, Minimize2, Maximize2, Mail, Send, X } from "lucide-react";

// EmailJS Integration
const EMAILJS_SERVICE_ID = 'service_sxomsgo';
const EMAILJS_TEMPLATE_ID = 'template_yvugfha';
const EMAILJS_PUBLIC_KEY = 'FrLU-uqF0H1AxM0cI';



// TypeScript declaration for EmailJS
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void;
      send: (serviceId: string, templateId: string, templateParams: any) => Promise<any>;
    };
  }
}

// Load EmailJS script - Fixed URL
const loadEmailJS = () => {
  return new Promise((resolve, reject) => {
    if (window.emailjs) {
      resolve(window.emailjs);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
        resolve(window.emailjs);
      } else {
        reject(new Error('EmailJS failed to load'));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// ChatBot Types and Component
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserInfo {
  email?: string;
  name?: string;
  company?: string;
  requirements?: string;
}

interface ChatBotProps {
  // apiKey?: string; // <-- ΔΙΕΓΡΑΨΕ αυτή τη γραμμή
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  botName?: string;
  welcomeMessage?: string;

}const ChatBot: React.FC<ChatBotProps> = ({
  // apiKey = '', // <-- ΔΙΕΓΡΑΨΕ αυτή τη γραμμή
  position = 'bottom-right',
  primaryColor = '#2559f2',
  botName = 'Alexander Ai Agent',
  welcomeMessage = 'Hello! I\'m your SigmaLabs AI assistant. I can help you with questions about our web development, mobile apps, AI integration, and cybersecurity services. How can I assist you today?'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isCollectingInfo, setIsCollectingInfo] = useState(false);
  const [emailJSLoaded, setEmailJSLoaded] = useState(false);
  const [pendingEmailSend, setPendingEmailSend] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  

  // Add custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-slow {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.02); opacity: 1; }
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
      .animate-float {
        animation: float 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Load EmailJS on component mount
  useEffect(() => {
    loadEmailJS()
      .then(() => {
        setEmailJSLoaded(true);
        console.log('EmailJS loaded successfully');
      })
      .catch((error) => {
        console.error('Failed to load EmailJS:', error);
        setError('Email service is not available at the moment.');
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Auto-send email when we have enough info and it's pending
  useEffect(() => {
    if (pendingEmailSend && userInfo.email && emailJSLoaded && !isLoading) {
      handleSendEmailAuto();
    }
  }, [pendingEmailSend, userInfo.email, emailJSLoaded, isLoading]);

  // Email sending function using EmailJS
  const sendEmailToSigmaLabs = async (userInfo: UserInfo, conversationHistory: Message[]) => {
    if (!emailJSLoaded) {
      throw new Error('Email service is not available');
    }

    try {
      const conversationText = conversationHistory
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');

      const templateParams = {
        to_email: 'spiros@sigmalabs.gr',
        to_name: 'SigmaLabs Team',
        from_name: userInfo.name || 'Website Visitor',
        from_email: userInfo.email || 'no-email@provided.com',
        company: userInfo.company || 'Not specified',
        requirements: userInfo.requirements || 'Not specified',
        conversation: conversationText,
        timestamp: new Date().toLocaleString(),
        subject: `New Inquiry from ${userInfo.name || 'Website Visitor'} - SigmaLabs Chatbot`,
        reply_to: userInfo.email || 'no-reply@sigmalabs.gr'
      };

      console.log('Sending email with params:', templateParams);

      const response = await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  // Enhanced response generation with info collection
  const generateResponse = async (userMessage: string, onUpdate: (partial: string) => void): Promise<string> => {
  // Δεν χρειάζεται πια API key check!
  
  const shouldCollectInfo = userMessage.toLowerCase().includes('contact') || 
                           userMessage.toLowerCase().includes('quote') ||
                           userMessage.toLowerCase().includes('project') ||
                           userMessage.toLowerCase().includes('help with') ||
                           isCollectingInfo;

  const systemPrompt = `You are ${botName}, a helpful AI assistant for SigmaLabs Technologies. Our email is contact@sigmalabs.gr 

You are knowledgeable about web development, mobile applications, AI integration, cybersecurity, and enterprise IT solutions. Be friendly, professional, and concise in your responses.

If asked about SigmaLabs, mention that they craft high-performance web and mobile applications, integrate AI-driven intelligence, and deliver enterprise-grade IT solutions across Europe.

IMPORTANT: If a user expresses interest in services, wants a quote, needs help with a project, or wants to be contacted, you should:
1. First ask for their name if not provided
2. Then ask for their email address
3. Ask about their company (optional)
4. Ask about their specific requirements or project details
5. Once you have their email and basic info, IMMEDIATELY send their inquiry to the SigmaLabs team

Use the special command "COLLECT_USER_INFO" when you want to trigger the information collection process.
Use the special command "SEND_EMAIL_NOW" when you have collected sufficient user information and want to send the email immediately.

Current user info collected: ${JSON.stringify(userInfo)}

When you say you will send an inquiry to the team, you MUST include SEND_EMAIL_NOW in your response so the email gets sent automatically.

Do not answer questions that are not related to SigmaLabs Technologies or its services.`;

  // Καλεί το δικό σου API endpoint
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      systemPrompt: systemPrompt
    }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullMessage = '';

  if (!reader) {
    throw new Error('Response body is not readable');
  }

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        
        if (data === '[DONE]') {
          // Check for special commands
          if (fullMessage.includes('COLLECT_USER_INFO')) {
            setIsCollectingInfo(true);
            fullMessage = fullMessage.replace('COLLECT_USER_INFO', '').trim();
          }
          
          if (fullMessage.includes('SEND_EMAIL_NOW')) {
            setPendingEmailSend(true);
            fullMessage = fullMessage.replace('SEND_EMAIL_NOW', '').trim();
          }
          
          return fullMessage;
        }

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          
          if (content) {
            fullMessage += content;
            onUpdate(fullMessage);
            
            await new Promise(resolve => setTimeout(resolve, 20));
          }
        } catch (e) {
          continue;
        }
      }
    }
  }

  return fullMessage || 'I apologize, but I couldn\'t generate a response. Please try again.';
};

  // Extract user information from messages
  const extractUserInfo = (message: string) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = message.match(emailRegex);
    
    if (emailMatch) {
      setUserInfo(prev => ({ ...prev, email: emailMatch[0] }));
    }

    // Simple name extraction (you might want to improve this)
    if (message.toLowerCase().includes('my name is') || message.toLowerCase().includes('i am') || message.toLowerCase().includes("i'm")) {
      const words = message.split(' ');
      const nameIndex = words.findIndex(word => 
        word.toLowerCase() === 'is' || word.toLowerCase() === 'am'
      );
      if (nameIndex > -1 && words[nameIndex + 1]) {
        setUserInfo(prev => ({ ...prev, name: words[nameIndex + 1].replace(/[.,]/g, '') }));
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Extract user info from the message
    extractUserInfo(inputMessage);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    const assistantMessageId = (Date.now() + 1).toString();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, initialAssistantMessage]);

    try {
      await generateResponse(userMessage.content, (partialResponse) => {
        setMessages(prev => {
          const updated = [...prev];
          const lastMessageIndex = updated.length - 1;
          if (updated[lastMessageIndex]?.id === assistantMessageId) {
            updated[lastMessageIndex] = {
              ...updated[lastMessageIndex],
              content: partialResponse
                .replace('COLLECT_USER_INFO', '')
                .replace('SEND_EMAIL_NOW', '')
                .trim()
            };
          }
          return updated;
        });
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      setMessages(prev => {
        const updated = [...prev];
        const lastMessageIndex = updated.length - 1;
        if (updated[lastMessageIndex]?.id === assistantMessageId) {
          updated[lastMessageIndex] = {
            ...updated[lastMessageIndex],
            content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.'
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmailAuto = async () => {
    if (!userInfo.email) {
      // If no email, show the form instead
      setShowEmailForm(true);
      setPendingEmailSend(false);
      return;
    }

    if (!emailJSLoaded) {
      setError('Email service is not available. Please try again later.');
      setPendingEmailSend(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendEmailToSigmaLabs(userInfo, messages);
      
      const confirmationMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Perfect! I've sent your inquiry to the SigmaLabs team at spiros@sigmalabs.gr. They'll get back to you at ${userInfo.email} within 24 hours. Is there anything else I can help you with?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      setShowEmailForm(false);
      setIsCollectingInfo(false);
      setPendingEmailSend(false);
      
    } catch (error) {
      console.error('Email sending failed:', error);
      setError('Failed to send email. Please try again or contact us directly at contact@sigmalabs.gr');
      setPendingEmailSend(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!userInfo.email) {
      setError('Please provide your email address first.');
      return;
    }

    if (!emailJSLoaded) {
      setError('Email service is not available. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendEmailToSigmaLabs(userInfo, messages);
      
      const confirmationMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Perfect! I've sent your inquiry to the SigmaLabs team at spiros@sigmalabs.gr. They'll get back to you at ${userInfo.email} within 24 hours. Is there anything else I can help you with?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      setShowEmailForm(false);
      setIsCollectingInfo(false);
      
    } catch (error) {
      console.error('Email sending failed:', error);
      setError('Failed to send email. Please try again or contact us directly at contact@sigmalabs.gr');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  if (!isOpen) {
    return (
      <div className={`fixed ${positionClasses} z-50`}>
        {/* Speech Bubble */}
        <div className="absolute bottom-20 right-0 mb-2 mr-2 group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-bounce">
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-3 max-w-[200px]" 
               style={{ 
                 background: 'rgba(255, 255, 255, 0.95)',
                 backdropFilter: 'blur(10px)'
               }}>
            <p className="text-sm text-gray-700 font-medium">
              👋 Hi! I can help you with SigmaLabs services. 
              <span className="text-blue-600 font-semibold">Let's chat!</span>
            </p>
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 right-4 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </div>
        </div>

        {/* Main Chat Button */}
        <div className="group">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white text-gray-700 rounded-full p-2 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-100"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}25 100%)`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <img
              src="https://sigmalabs.gr/photo/104.jpg"
              alt="Chat with us"
              className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </button>
          
          {/* Compact speech bubble */}
          <div className="absolute bottom-16 right-2 opacity-90 hover:opacity-100 transition-all duration-300 animate-float">
  <div
    className="relative bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 w-[200px]"
    style={{
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}
  >
    <p className="text-sm text-gray-800 font-medium text-center break-words">
      👋 AI Agent here, Let's chat!
    </p>
    {/* Speech bubble tail */}
    <div className="absolute bottom-0 right-4 transform translate-y-full">
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
    </div>
  </div>
</div>

        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 rounded-t-2xl text-white"
          style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{botName}</h3>
              <p className="text-xs opacity-80">
                {isLoading ? 'Typing...' : emailJSLoaded ? 'Online' : 'Loading...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px]">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'ml-2' : 'mr-2'
                    }`} style={{
                      backgroundColor: message.role === 'user' ? primaryColor : '#f3f4f6'
                    }}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`px-4 py-2 rounded-xl ${
                          message.role === 'user'
                            ? 'text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                        style={{
                          backgroundColor: message.role === 'user' ? primaryColor : undefined
                        }}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                          {message.role === 'assistant' && isLoading && index === messages.length - 1 && (
                            <span className="inline-block w-2 h-4 bg-gray-500 ml-1 animate-pulse"></span>
                          )}
                        </p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Email Form */}
              {showEmailForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span className="font-semibold text-sm">Send to SigmaLabs Team</span>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Your email address *"
                      value={userInfo.email || ''}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={userInfo.name || ''}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Company (optional)"
                      value={userInfo.company || ''}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Brief description of your requirements"
                      value={userInfo.requirements || ''}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, requirements: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSendEmail}
                      disabled={!userInfo.email || isLoading || !emailJSLoaded}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{isLoading ? 'Sending...' : 'Send to Team'}</span>
                    </button>
                    <button
                      onClick={() => setShowEmailForm(false)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs">
                    {error}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-400"
                  style={{
                    minHeight: '44px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    color: '#1f2937',
                    backgroundColor: isLoading ? '#f9fafb' : '#ffffff'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 rounded-xl text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ 
                    backgroundColor: primaryColor,
                    minWidth: '44px',
                    minHeight: '44px'
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main HeroSection component - KEEPING YOUR ORIGINAL BACKGROUND AND STYLING
export const HeroSection = () => {
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
  const el = document.getElementById("cta-section");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
  

  return (
    <>
      <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-brand-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-brand-accent/20 rounded-full blur-3xl"></div>
               
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-16 sm:pt-20 pb-8">
          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
            Unlock Your Growth with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI‑Powered
            </span>
            , Web & Mobile Solutions
          </h1>
                   
          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Nearshore software development: AI & ML — GDPR‑compliant, scalable, and secure.
          </p>
                   
          {/* CTA Section */}
          <div className="mb-8 sm:mb-12 px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-6 sm:mb-8 leading-tight">
              Ready to Transform Your Business? Book Your Free 30' Consultation
            </h2>
                       
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              
              <Button 
  variant="gradient" 
  size="lg" 
  onClick={handleGetStarted}
  className="w-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold"
>
  Schedule a Call <ArrowRight className="ml-2 w-5 h-5" />
</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ChatBot Component with EXACT original configuration */}
      <ChatBot
       
        position="bottom-right"
        primaryColor="#2559f2"
        botName="Alexander Ai Agent"
        welcomeMessage="Hello! I'm your SigmaLabs AI assistant. I can help you with questions about our web development, mobile apps, AI integration, and cybersecurity services. How can I assist you today?"
      />
    </>
  );
};