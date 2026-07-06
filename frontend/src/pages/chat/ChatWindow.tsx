/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCheck,
  File,
  Frown,
  Heart,
  Image,
  Laugh,
  Loader2,
  MapPin,
  Menu,
  MoreHorizontal,
  Paperclip,
  Send,
  Star,
  ThumbsUp,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { toast } from 'sonner';
import { Sidebar } from '../../components/layouts/sidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import api from '../../lib/api';

// ============================================
// TYPES
// ============================================

interface Message {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'LOCATION' | 'SYSTEM' | 'FILE';
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profileImage?: string;
  };
  reactions?: Reaction[];
}

interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
}

interface ChatRoom {
  id: string;
  name?: string;
  isGroup: boolean;
  emergencyId?: string;
  members: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      profileImage?: string;
    };
  }[];
  emergency?: {
    id: string;
    title: string;
  };
}

// ============================================
// SOCKET SETUP
// ============================================

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// ============================================
// REACTION EMOJIS
// ============================================

const REACTION_EMOJIS = [
  { emoji: '👍', label: 'Thumbs Up', icon: ThumbsUp },
  { emoji: '❤️', label: 'Heart', icon: Heart },
  { emoji: '😂', label: 'Laugh', icon: Laugh },
  { emoji: '😮', label: 'Wow', icon: Star },
  { emoji: '😢', label: 'Sad', icon: Frown },
];

// ============================================
// MESSAGE BUBBLE WITH REACTIONS
// ============================================
const MessageBubble = ({ 
  message, 
  isOwn,
  onReaction,
  currentUserId 
}: { 
  message: Message; 
  isOwn: boolean;
  onReaction: (messageId: string, emoji: string) => void;
  currentUserId: string;
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  const getTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFileIcon = (url?: string) => {
    if (!url) return <File className="w-6 h-6" />;
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return <Image className="w-6 h-6" />;
    if (url.match(/\.(pdf)$/i)) return <File className="w-6 h-6 text-error" />;
    if (url.match(/\.(doc|docx)$/i)) return <File className="w-6 h-6 text-primary" />;
    return <File className="w-6 h-6" />;
  };

  const getFileName = (url?: string) => {
    if (!url) return 'File';
    return url.split('/').pop() || 'File';
  };

  // Group reactions by emoji
  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = { count: 0, users: [] };
    }
    acc[reaction.emoji].count += 1;
    acc[reaction.emoji].users.push(reaction.userId);
    return acc;
  }, {} as Record<string, { count: number; users: string[] }>) || {};

  // Check if current user reacted with specific emoji
  const hasUserReacted = (emoji: string) => {
    return message.reactions?.some(
      (r) => r.userId === currentUserId && r.emoji === emoji
    ) || false;
  };

  // Handle reaction click
  const handleReactionClick = async (emoji: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (isReacting) return;
    setIsReacting(true);
    try {
      await onReaction(message.id, emoji);
    } finally {
      setIsReacting(false);
      setShowReactions(false);
    }
  };

  // Toggle reaction popup
  const toggleReactionPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowReactions(!showReactions);
  };

  // Check if reactions exist
  const hasReactions = Object.keys(groupedReactions).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} relative group`}
    >
      {/* SENDER NAME */}
      <span className={`text-[10px] font-medium mb-0.5 ${isOwn ? 'text-primary-light/80' : 'text-text-secondary'}`}>
        {message.sender?.name || 'Unknown User'}
      </span>

      {/* MESSAGE WRAPPER */}
      <div className="relative inline-block">
        {/* MESSAGE BUBBLE */}
        <div
          className={`max-w-[75%] rounded-2xl p-3 ${
            isOwn
              ? 'bg-gradient-to-br from-primary to-primary-dark text-white'
              : 'bg-white/70 backdrop-blur-sm border border-white/30 text-text-primary'
          } ${hasReactions ? 'pb-6' : ''}`}
        >
          {/* TEXT MESSAGE */}
          {message.type === 'TEXT' && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          )}

          {/* IMAGE MESSAGE */}
          {message.type === 'IMAGE' && message.mediaUrl && (
            <div className="space-y-1.5">
              <img
                src={message.mediaUrl}
                alt="Shared image"
                className="rounded-lg max-w-full max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.mediaUrl, '_blank')}
              />
              {message.content && message.content !== '📎 Image' && (
                <p className="text-sm whitespace-pre-wrap break-words text-white/90">
                  {message.content}
                </p>
              )}
            </div>
          )}

          {/* FILE MESSAGE */}
          {message.type === 'FILE' && message.mediaUrl && (
            <a
              href={message.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isOwn ? 'bg-white/10' : 'bg-sand-light/50'} border ${isOwn ? 'border-white/10' : 'border-white/30'}`}>
                <div className={`w-10 h-10 rounded-lg ${isOwn ? 'bg-white/20' : 'bg-primary/10'} flex items-center justify-center`}>
                  {getFileIcon(message.mediaUrl)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{getFileName(message.mediaUrl)}</p>
                  <p className="text-xs opacity-70">Click to download</p>
                </div>
              </div>
            </a>
          )}

          {/* LOCATION MESSAGE */}
          {message.type === 'LOCATION' && message.mediaUrl && (
            <a
              href={message.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isOwn ? 'bg-white/10' : 'bg-sand-light/50'} border ${isOwn ? 'border-white/10' : 'border-white/30'}`}>
                <MapPin className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">{message.content}</p>
                  <p className="text-xs opacity-70">Open in Google Maps</p>
                </div>
              </div>
            </a>
          )}

          {/* SYSTEM MESSAGE */}
          {message.type === 'SYSTEM' && (
            <p className="text-sm italic opacity-70 text-center">{message.content}</p>
          )}

          {/* TIME & READ STATUS */}
          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isOwn ? 'text-white/70' : 'text-text-tertiary'}`}>
            <span>{getTime(message.createdAt)}</span>
            {isOwn && (
              <span>
                {message.isRead ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </span>
            )}
          </div>

          {/* ✅ REACTIONS DISPLAY - BOTTOM LEFT CORNER (INSIDE BUBBLE) */}
          {hasReactions && (
            <div className="absolute -bottom-3 left-2 flex flex-wrap gap-0.5 z-5">
              {Object.entries(groupedReactions).map(([emoji, { count, users }]) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={(e) => handleReactionClick(emoji, e)}
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] transition-all shadow-sm ${
                    users.includes(currentUserId)
                      ? 'bg-primary/20 border border-primary/30 text-primary'
                      : 'bg-white/90 border border-white/50 hover:bg-white'
                  }`}
                >
                  <span className="text-[10px]">{emoji}</span>
                  <span className="font-medium text-[9px]">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ✅ REACTION BUTTON - BOTTOM LEFT CORNER OF BUBBLE */}
        <button
          type="button"
          onClick={toggleReactionPopup}
          className={`absolute -bottom-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 backdrop-blur-sm border border-white/50 rounded-full p-1 shadow-lg hover:bg-sand-light/80 hover:scale-110 z-10`}
          aria-label="Add reaction"
        >
          <span className="text-xs leading-none">😊</span>
        </button>

        {/* REACTION PICKER POPUP */}
        {showReactions && (
          <>
            {/* Backdrop click to close */}
            <div 
              className="fixed inset-0 z-20" 
              onClick={(e) => {
                e.stopPropagation();
                setShowReactions(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute z-30 bottom-8 left-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-1.5 flex gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {REACTION_EMOJIS.map(({ emoji, label }) => {
                const isActive = hasUserReacted(emoji);
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={(e) => handleReactionClick(emoji, e)}
                    disabled={isReacting}
                    className={`p-1.5 rounded-xl transition-all text-lg hover:bg-sand-light/50 ${
                      isActive ? 'bg-primary/20 scale-110' : ''
                    } ${isReacting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={label}
                  >
                    <span className="text-xl leading-none">{emoji}</span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// CHAT WINDOW PAGE
// ============================================

export const ChatWindow = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [fileUploading, setFileUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [pendingTempId, setPendingTempId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);
  
  // ✅ For tracking new messages (to prevent scroll on reaction)
  const lastMessageId = useRef<string | null>(null);

  // Get current user
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  // ========== CHECK VALID ROOM ID ==========
  const isValidRoomId = roomId && roomId !== 'chat' && roomId !== 'undefined' && roomId.length > 5;

  // ========== SOCKET SETUP ==========
  useEffect(() => {
    if (!isValidRoomId || !currentUser) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join-room', { roomId, userId: currentUser.id });
    });

    socket.on('new-message', (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;

        if (pendingTempId) {
          const tempIndex = prev.findIndex(
            (m) => 
              m.id === pendingTempId || 
              (m.id.startsWith('temp-') && m.content === message.content && m.sender.id === message.sender.id)
          );

          if (tempIndex !== -1) {
            const updated = [...prev];
            updated[tempIndex] = { ...message, id: message.id };
            setPendingTempId(null);
            return updated;
          }
        }

        const tempIndex = prev.findIndex(
          (m) => 
            m.id.startsWith('temp-') && 
            m.content === message.content && 
            m.sender.id === message.sender.id &&
            m.type === message.type
        );

        if (tempIndex !== -1) {
          const updated = [...prev];
          updated[tempIndex] = { ...message, id: message.id };
          return updated;
        }

        return [...prev, message];
      });
    });

    // Socket event for real-time reactions
    socket.on('reaction-updated', ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, reactions } : msg
        )
      );
    });

    socket.on('user-typing', ({ userId, isTyping: typing }) => {
      if (typing) {
        setTypingUsers((prev) => {
          if (!prev.includes(userId)) return [...prev, userId];
          return prev;
        });
      } else {
        setTypingUsers((prev) => prev.filter((id) => id !== userId));
      }
    });

    socket.on('user-online', ({ userId }) => {
      setOnlineUsers((prev) => {
        if (!prev.includes(userId)) return [...prev, userId];
        return prev;
      });
    });

    socket.on('user-offline', ({ userId }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    socket.on('online-users', (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      isMounted.current = false;
      socket.disconnect();
    };
  }, [roomId, currentUser, isValidRoomId, pendingTempId]);

  // ========== FETCH CHAT ROOM ==========
  const fetchChatRoom = async () => {
    if (!isValidRoomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/chat/rooms/${roomId}`);
      if (response.data.success) {
        setRoom(response.data.data);
      } else {
        toast.error('Chat room not found');
        navigate('/chat');
      }
    } catch (error: any) {
      console.error('Fetch chat room error:', error);
      if (error.response?.status === 404) {
        toast.error('Chat room not found');
        navigate('/chat');
      }
    } finally {
      setLoading(false);
    }
  };

  // ========== FETCH MESSAGES ==========
  const fetchMessages = async () => {
    if (!isValidRoomId) return;
    try {
      const response = await api.get(`/chat/rooms/${roomId}/messages`);
      if (response.data.success) {
        // Fetch reactions for each message
        const messagesWithReactions = await Promise.all(
          response.data.data.map(async (msg: Message) => {
            try {
              const reactionRes = await api.get(`/chat/messages/${msg.id}/reactions`);
              return {
                ...msg,
                reactions: reactionRes.data.data || [],
              };
            } catch {
              return { ...msg, reactions: [] };
            }
          })
        );
        setMessages(messagesWithReactions);
        
        // Update last message ID for scroll tracking
        if (messagesWithReactions.length > 0) {
          lastMessageId.current = messagesWithReactions[messagesWithReactions.length - 1].id;
        }
      }
    } catch (error: any) {
      console.error('Fetch messages error:', error);
    }
  };

  // ========== FETCH REACTIONS FOR A SINGLE MESSAGE ==========
  const fetchReactionsForMessage = async (messageId: string) => {
    try {
      const response = await api.get(`/chat/messages/${messageId}/reactions`);
      return response.data.data || [];
    } catch (error) {
      console.error('Fetch reactions error:', error);
      return [];
    }
  };

  // ========== HANDLE REACTION ==========
  const handleReaction = async (messageId: string, emoji: string) => {
    if (!currentUser) return;

    try {
      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          
          const existingReactions = msg.reactions || [];
          const existingIndex = existingReactions.findIndex(
            (r) => r.userId === currentUser.id && r.emoji === emoji
          );

          let newReactions;
          if (existingIndex !== -1) {
            // Remove reaction if same emoji
            newReactions = existingReactions.filter((_, i) => i !== existingIndex);
          } else {
            // Check if user reacted with different emoji
            const userReactionIndex = existingReactions.findIndex(
              (r) => r.userId === currentUser.id
            );
            // eslint-disable-next-line prefer-const
            let updatedReactions = [...existingReactions];
            if (userReactionIndex !== -1) {
              // Remove old reaction
              updatedReactions.splice(userReactionIndex, 1);
            }
            // Add new reaction (optimistic)
            newReactions = [
              ...updatedReactions,
              {
                id: `temp-${Date.now()}`,
                emoji,
                userId: currentUser.id,
                user: {
                  id: currentUser.id,
                  name: currentUser.name,
                },
              },
            ];
          }
          return { ...msg, reactions: newReactions };
        })
      );

      // API call
      const response = await api.post(`/chat/messages/${messageId}/reaction`, { emoji });
      
      if (response.data.success) {
        // Update with actual data from server
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, reactions: response.data.data } : msg
          )
        );

        // Emit socket event for real-time update
        if (socketRef.current) {
          socketRef.current.emit('reaction', {
            roomId,
            messageId,
            emoji,
            userId: currentUser.id,
          });
        }
      }
    } catch (error: any) {
      console.error('Reaction error:', error);
      toast.error(error.response?.data?.message || 'Failed to add reaction');
      // Revert by fetching latest reactions
      const reactions = await fetchReactionsForMessage(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, reactions } : msg
        )
      );
    }
  };

  // ========== INITIAL FETCH ==========
  useEffect(() => {
    if (!isValidRoomId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      navigate('/chat');
      return;
    }

    fetchChatRoom();
    fetchMessages();

    const interval = setInterval(() => {
      if (isValidRoomId && isMounted.current) {
        fetchMessages();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [roomId]);

  // ========== ✅ SCROLL TO BOTTOM - ONLY FOR NEW MESSAGES ==========
  useEffect(() => {
    if (messages.length === 0) return;
    
    const latestMessage = messages[messages.length - 1];
    
    // Only scroll if it's a new message (not reaction update)
    if (latestMessage.id !== lastMessageId.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      lastMessageId.current = latestMessage.id;
    }
  }, [messages]);

  // ========== SEND MESSAGE ==========
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !roomId || !currentUser) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      id: tempId,
      content,
      type: 'TEXT' as const,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        profileImage: currentUser.profileImage,
      },
      reactions: [],
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      if (socketRef.current) {
        socketRef.current.emit('send-message', {
          roomId,
          senderId: currentUser.id,
          content,
          type: 'TEXT',
        });
      } else {
        await api.post('/chat/messages', {
          roomId,
          content,
          type: 'TEXT',
        });
        await fetchMessages();
      }
    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  // ========== TYPING INDICATOR ==========
  const handleTyping = (isTyping: boolean) => {
    if (!roomId || !currentUser) return;
    socketRef.current?.emit('typing', {
      roomId,
      userId: currentUser.id,
      isTyping,
    });
  };

  // ========== HANDLE FILE SELECTION ==========
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // ========== UPLOAD FILE ==========
  const handleFileUpload = async () => {
    if (!selectedFile || !roomId || !currentUser) return;

    setFileUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('roomId', roomId);
    formData.append('caption', selectedFile.name);

    const isImage = selectedFile.type.startsWith('image/');
    const tempId = `temp-${Date.now()}`;
    
    setPendingTempId(tempId);

    const tempMessage = {
      id: tempId,
      content: isImage ? '📎 Image' : selectedFile.name,
      type: isImage ? 'IMAGE' : 'FILE' as const,
      mediaUrl: filePreview || '',
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        profileImage: currentUser.profileImage,
      },
      reactions: [],
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await api.post('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('File uploaded successfully!');
        setSelectedFile(null);
        setFilePreview(null);
      } else {
        toast.error('Failed to upload file');
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setPendingTempId(null);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setPendingTempId(null);
    } finally {
      setFileUploading(false);
    }
  };

  // ========== SEND LOCATION ==========
  const sendLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    toast.info('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
          id: tempId,
          content: '📍 My Location',
          type: 'LOCATION' as const,
          mediaUrl: locationUrl,
          isRead: false,
          createdAt: new Date().toISOString(),
          sender: {
            id: currentUser.id,
            name: currentUser.name,
            profileImage: currentUser.profileImage,
          },
          reactions: [],
        };
        setMessages((prev) => [...prev, tempMessage]);

        try {
          if (socketRef.current) {
            socketRef.current.emit('send-message', {
              roomId,
              senderId: currentUser.id,
              content: '📍 My Location',
              type: 'LOCATION',
              mediaUrl: locationUrl,
            });
          }
        } catch (error: any) {
          toast.error('Failed to send location');
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          console.error('Send location error:', error);
        }
      },
      () => toast.error('Unable to get location'),
      { enableHighAccuracy: true }
    );
  };

  // ========== GET ROOM NAME ==========
  const getRoomName = () => {
    if (!room) return 'Chat';
    if (room.name) return room.name;
    if (room.emergency) return `🚨 ${room.emergency.title}`;
    const otherMembers = room.members.filter((m) => m.userId !== currentUser?.id);
    if (otherMembers.length === 1) {
      return otherMembers[0].user.name;
    }
    return `${otherMembers.length} participants`;
  };

  const getOnlineStatus = () => {
    if (!room) return '';
    const otherMembers = room.members.filter((m) => m.userId !== currentUser?.id);
    const online = otherMembers.filter((m) => onlineUsers.includes(m.userId));
    if (online.length === 0) return 'Offline';
    return `${online.length} online`;
  };

  // ========== INVALID ROOM ID ==========
  if (!isValidRoomId && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary">Invalid Chat</h2>
          <p className="text-text-secondary mt-2">Please select a valid chat room.</p>
          <Link to="/dashboard">
            <Button className="mt-4 bg-primary text-white">Back to Chats</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-secondary mt-4">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Chat"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-hidden h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl m-3 md:m-4 p-3 shadow-lg shadow-primary/5 border border-white/30 flex items-center justify-between gap-4 sticky top-3 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-xl hover:bg-sand-light/50"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
            <Link to="/chat" className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Link>
            <div>
              <h1 className="text-base font-semibold text-text-primary">
                {getRoomName()}
              </h1>
              <p className="text-xs text-text-tertiary flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${onlineUsers.length > 0 ? 'bg-success' : 'bg-text-tertiary'}`} />
                {getOnlineStatus()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {room?.emergency && (
              <Link to={`/emergencies/${room.emergency.id}`}>
                <Badge className="bg-error/10 text-error border-error/20 text-[10px] cursor-pointer hover:bg-error/20">
                  <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                  {room.emergency.title.slice(0, 15)}...
                </Badge>
              </Link>
            )}
            <button className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-2">
          <div className="space-y-2 py-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-text-tertiary">
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender.id === currentUser?.id}
                  onReaction={handleReaction}
                  currentUserId={currentUser?.id}
                />
              ))
            )}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="px-3 md:px-4 pb-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/30 flex items-center gap-3">
              {filePreview ? (
                <img src={filePreview} alt="Preview" className="w-14 h-14 rounded-lg object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <File className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{selectedFile.name}</p>
                <p className="text-xs text-text-tertiary">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button
                onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                className="p-1.5 rounded-xl hover:bg-sand-light/50 transition-colors"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={handleFileUpload}
                disabled={fileUploading}
                className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {fileUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
              </button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-3 md:p-4 bg-white/50 backdrop-blur-md border-t border-white/20">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl hover:bg-sand-light/50 transition-colors text-text-secondary"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl hover:bg-sand-light/50 transition-colors text-text-secondary"
              title="Upload image"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={sendLocation}
              className="p-2 rounded-xl hover:bg-sand-light/50 transition-colors text-text-secondary"
              title="Share location"
            >
              <MapPin className="w-5 h-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onFocus={() => handleTyping(true)}
              onBlur={() => handleTyping(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-tertiary/60"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              className="p-2.5 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};