import {
    ChevronRight,
    MessageCircle,
    Plus,
    Search
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Navbar } from '../../components/layouts/Navbar';
import { Sidebar } from '../../components/layouts/sidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import api from '../../lib/api';

// ============================================
// TYPES
// ============================================

interface ChatRoom {
  id: string;
  name?: string;
  isGroup: boolean;
  emergencyId?: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    sender: {
      name: string;
    };
  };
  lastMessageAt?: string;
  unreadCount: number;
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
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CHAT LIST PAGE
// ============================================

export const ChatList = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // ========== FETCH CHAT ROOMS ==========
const fetchChatRooms = async () => {
  setLoading(true);
  try {
    const response = await api.get('/chat/rooms');
    console.log('Chat rooms response:', response.data);
    if (response.data.success) {
      setRooms(response.data.data);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Fetch chat rooms error:', error);
    toast.error('Failed to load chats');
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChatRooms();
  }, []);

  // ========== FILTER ROOMS ==========
  const filteredRooms = rooms.filter((room) =>
    room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.emergency?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ========== GET TIME ==========
  const getTime = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  // ========== GET ROOM NAME ==========
  const getRoomName = (room: ChatRoom) => {
    if (room.name) return room.name;
    if (room.emergency) return `🚨 ${room.emergency.title}`;
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const otherMembers = room.members.filter(
      (m) => m.userId !== currentUser?.id
    );
    if (otherMembers.length === 1) {
      return otherMembers[0].user.name;
    }
    return `${otherMembers.length} participants`;
  };

  // ========== GET AVATAR ==========
  const getAvatar = (room: ChatRoom) => {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const otherMembers = room.members.filter(
      (m) => m.userId !== currentUser?.id
    );
    if (otherMembers.length === 1) {
      return otherMembers[0].user.name.charAt(0).toUpperCase();
    }
    return room.isGroup ? '👥' : '💬';
  };

  // ========== NAVIGATE TO CHAT ==========
  const handleChatClick = (roomId: string) => {
    console.log('Navigating to chat:', roomId);
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Chat"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Navbar
          title="Chat"
          subtitle="Real-time communication"
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className="p-3 md:p-4 pb-8">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
              <p className="text-sm text-text-tertiary">
                {rooms.length} conversations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/30">
                <Search className="w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent p-0 h-7 text-sm w-32 lg:w-48 focus:outline-none placeholder:text-text-tertiary/60"
                />
              </div>
              <Button className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-1.5" />
                New Chat
              </Button>
            </div>
          </div>

          {/* Chat List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/30 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-sand-light/50" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-sand-light/50 rounded-lg" />
                      <div className="h-3 w-48 bg-sand-light/50 rounded-lg mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center border border-white/30">
              <MessageCircle className="w-16 h-16 text-text-tertiary/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary">
                No Chats Yet
              </h3>
              <p className="text-sm text-text-tertiary mt-1">
                Start a new conversation or wait for someone to message you.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleChatClick(room.id)}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {getAvatar(room)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-text-primary truncate">
                          {getRoomName(room)}
                        </h4>
                        <span className="text-xs text-text-tertiary flex-shrink-0">
                          {getTime(room.lastMessage?.createdAt || room.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        {/* ✅ FIX: Use lastMessage.content */}
                        <p className="text-sm text-text-secondary truncate">
                          {room.lastMessage?.content || 'No messages yet'}
                        </p>
                        {room.unreadCount > 0 && (
                          <Badge className="bg-error text-white border-error text-[10px] flex-shrink-0">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};