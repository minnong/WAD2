import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LiquidGlassNav from './LiquidGlassNav';
import Footer from './Footer';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Image } from 'lucide-react';

interface Message {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'tool-request';
  toolData?: {
    toolName: string;
    toolImage: string;
    price: number;
    period: string;
  };
}

interface Chat {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

export default function ChatPage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock chat data
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      userId: 'john_doe',
      userName: 'John Doe',
      userAvatar: '👨‍🔧',
      lastMessage: 'Is the drill still available for tomorrow?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      userId: 'sarah_lim',
      userName: 'Sarah Lim',
      userAvatar: '👩‍🌾',
      lastMessage: 'Thank you for the lawn mower rental!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      userId: 'mike_roberts',
      userName: 'Mike Roberts',
      userAvatar: '📸',
      lastMessage: 'Camera is ready for pickup',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '4',
      userId: 'lisa_martin',
      userName: 'Lisa Martin',
      userAvatar: '👩‍🍳',
      lastMessage: 'Stand mixer works perfectly, thanks!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 0,
      isOnline: false
    }
  ]);

  // Mock messages data
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: 1,
        senderId: 'john_doe',
        senderName: 'John Doe',
        content: 'Hi! I\'m interested in renting your drill press.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text'
      },
      {
        id: 2,
        senderId: currentUser?.uid || 'current_user',
        senderName: currentUser?.displayName || 'You',
        content: 'Sure! It\'s available. When do you need it?',
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        type: 'text'
      },
      {
        id: 3,
        senderId: 'john_doe',
        senderName: 'John Doe',
        content: 'Is the drill still available for tomorrow?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'text'
      }
    ],
    '2': [
      {
        id: 1,
        senderId: 'sarah_lim',
        senderName: 'Sarah Lim',
        content: 'Thank you for the lawn mower rental!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'text'
      }
    ],
    '3': [
      {
        id: 1,
        senderId: 'mike_roberts',
        senderName: 'Mike Roberts',
        content: 'Camera is ready for pickup',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        type: 'text'
      }
    ],
    '4': [
      {
        id: 1,
        senderId: 'lisa_martin',
        senderName: 'Lisa Martin',
        content: 'Stand mixer works perfectly, thanks!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        type: 'text'
      }
    ]
  });

  const filteredChats = chats.filter(chat =>
    chat.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser?.uid || 'current_user',
      senderName: currentUser?.displayName || 'You',
      content: message.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    setMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <LiquidGlassNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <div className="flex h-[calc(100vh-200px)]">
          {/* Chat List Sidebar */}
          <div className={`w-80 border-r ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200/20">
              <h1 className="text-xl font-semibold mb-4">Messages</h1>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border-0 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 text-white placeholder-gray-400'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto flex-1">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 text-left transition-colors border-b border-gray-200/10 ${
                    selectedChat === chat.id
                      ? theme === 'dark'
                        ? 'bg-purple-900/20'
                        : 'bg-purple-900/10'
                      : theme === 'dark'
                      ? 'hover:bg-gray-800/60'
                      : 'hover:bg-gray-100/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-900 to-purple-600 flex items-center justify-center text-white text-xl">
                        {chat.userAvatar}
                      </div>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{chat.userName}</p>
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-purple-900 text-white text-xs rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className={`p-4 border-b flex items-center justify-between ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-900 to-purple-600 flex items-center justify-center text-white">
                        {selectedChatData?.userAvatar}
                      </div>
                      {selectedChatData?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold">{selectedChatData?.userName}</h2>
                      <p className={`text-xs ${
                        selectedChatData?.isOnline
                          ? 'text-green-500'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {selectedChatData?.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-100'
                    }`}>
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-100'
                    }`}>
                      <Video className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-100'
                    }`}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => {
                    const isCurrentUser = msg.senderId === (currentUser?.uid || 'current_user');
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            isCurrentUser
                              ? 'bg-purple-900 text-white'
                              : theme === 'dark'
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            isCurrentUser
                              ? 'text-blue-100'
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className={`p-4 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <button className={`p-2 rounded-xl transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-100'
                    }`}>
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-xl transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-100'
                    }`}>
                      <Image className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className={`w-full px-4 py-3 pr-12 rounded-2xl border-0 transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-800 text-white placeholder-gray-400'
                            : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <button className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-200'
                      }`}>
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="p-3 bg-purple-900 hover:bg-purple-950 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-2xl transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Choose a conversation from the sidebar to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}