import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../../types';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Flag, 
  RefreshCw, 
  Check, 
  X, 
  Users, 
  MessageSquare,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

interface CommunityChatViewProps {
  user: UserProfile;
  initialMessages: ChatMessage[];
  defaultRoom?: 'mentorship' | 'general' | 'batch_smc' | 'doubts';
}

export const CommunityChatView: React.FC<CommunityChatViewProps> = ({
  user,
  initialMessages,
  defaultRoom = 'mentorship'
}) => {
  const [activeRoom, setActiveRoom] = useState<'mentorship' | 'general' | 'batch_smc' | 'doubts'>(defaultRoom);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: 'image' | 'pdf'; url: string } | null>(null);
  const [isMentorTyping, setIsMentorTyping] = useState(false);
  const [reportModalMessage, setReportModalMessage] = useState<ChatMessage | null>(null);
  const [reportReason, setReportReason] = useState<'spam' | 'financial_tip' | 'inappropriate' | 'solicitation'>('financial_tip');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on room change or new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeRoom, isMentorTyping]);

  const currentRoomMessages = messages.filter(m => m.roomId === activeRoom);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      roomId: activeRoom,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'student',
      senderAvatar: user.avatarUrl,
      text: inputText.trim(),
      timestamp: 'Just now',
      attachment: attachedFile || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    const sentText = inputText;
    setInputText('');
    setAttachedFile(null);

    // If student sends message in mentorship, simulate realistic mentor Rahul response
    if (activeRoom === 'mentorship') {
      setIsMentorTyping(true);
      setTimeout(() => {
        setIsMentorTyping(false);
        const mentorReply: ChatMessage = {
          id: `msg_rep_${Date.now()}`,
          roomId: 'mentorship',
          senderId: 'usr_mentor_rahul',
          senderName: 'Rahul (Senior SMC Mentor)',
          senderRole: 'mentor',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          text: sentText.toLowerCase().includes('order block') || sentText.toLowerCase().includes('ob')
            ? "Looking at that structure, always check if the high that formed the Order Block swept previous liquidity. If yes, and displacement followed with an imbalance (FVG), it is a high-probability mitigation zone!"
            : "Received your query, Arun. Remember that in institutional trading, patience at Key Equilibrium levels is 80% of edge. Let's review this trade in Saturday's live breakdown session.",
          timestamp: 'Just now'
        };
        setMessages(prev => [...prev, mentorReply]);
      }, 1800);
    }
  };

  const handleAttachMockFile = (type: 'image' | 'pdf') => {
    if (type === 'image') {
      setAttachedFile({
        name: 'EURUSD_15m_Structure_Markup.png',
        size: '1.8 MB',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'
      });
    } else {
      setAttachedFile({
        name: 'Weekly_Trade_Journal_Arun.pdf',
        size: '3.4 MB',
        type: 'pdf',
        url: '#'
      });
    }
  };

  const handleReportSubmit = () => {
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportModalMessage(null);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-140px)] min-h-[580px] pb-14 md:pb-2">
      {/* Channels & Rooms Sidebar */}
      <div className="lg:col-span-4 bg-[#1A2133] border border-[#26304A] rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-md">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#E5A82B] tracking-wider font-bold">
              ACADEMY CHANNELS
            </span>
            <h2 className="text-base font-bold text-[#F2F4F8] mt-0.5">
              Mentorship & Rooms
            </h2>
          </div>

          <div className="space-y-1.5">
            {/* Room 1: 1-on-1 Mentorship */}
            <button
              onClick={() => setActiveRoom('mentorship')}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between touch-target ${
                activeRoom === 'mentorship'
                  ? 'bg-[#0F1522] border-l-4 border-[#E5A82B] text-[#E5A82B] shadow-sm font-semibold'
                  : 'hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#E5A82B]/20 border border-[#E5A82B]/50 flex items-center justify-center font-bold text-xs text-[#E5A82B]">
                    RM
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#3DDC97] border-2 border-[#1A2133]" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5 text-[#F2F4F8]">
                    <span>Rahul (Senior Mentor)</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3DDC97]" />
                  </div>
                  <span className="text-[11px] text-[#9AA6BD]">1-on-1 Private Channel</span>
                </div>
              </div>
              <span className="text-[10px] bg-[#E5A82B] text-[#0B0F17] font-bold px-1.5 py-0.5 rounded-full font-mono">
                1
              </span>
            </button>

            {/* Room 2: General Trading Discussions */}
            <button
              onClick={() => setActiveRoom('general')}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between touch-target ${
                activeRoom === 'general'
                  ? 'bg-[#0F1522] border-l-4 border-[#E5A82B] text-[#E5A82B] shadow-sm font-semibold'
                  : 'hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#26304A] flex items-center justify-center text-[#9AA6BD]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F2F4F8]">
                    Trading Discussions
                  </div>
                  <span className="text-[11px] text-[#9AA6BD]">Institutional Community</span>
                </div>
              </div>
              <span className="text-[10px] text-[#3DDC97] font-mono">Live</span>
            </button>

            {/* Room 3: SMC Foundations Batch */}
            <button
              onClick={() => setActiveRoom('batch_smc')}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between touch-target ${
                activeRoom === 'batch_smc'
                  ? 'bg-[#0F1522] border-l-4 border-[#E5A82B] text-[#E5A82B] shadow-sm font-semibold'
                  : 'hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1E2A4A] flex items-center justify-center text-[#8FB0FF]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F2F4F8]">
                    SMC Batch 24
                  </div>
                  <span className="text-[11px] text-[#9AA6BD]">Enrolled Peer Group</span>
                </div>
              </div>
              <span className="text-[10px] text-[#9AA6BD] font-mono">248 online</span>
            </button>

            {/* Room 4: Doubt Sessions */}
            <button
              onClick={() => setActiveRoom('doubts')}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between touch-target ${
                activeRoom === 'doubts'
                  ? 'bg-[#0F1522] border-l-4 border-[#E5A82B] text-[#E5A82B] shadow-sm font-semibold'
                  : 'hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#3A2D0C] flex items-center justify-center text-[#E5A82B]">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F2F4F8]">
                    Weekly Doubt Q&A
                  </div>
                  <span className="text-[11px] text-[#9AA6BD]">Live Chart Breakdown</span>
                </div>
              </div>
              <span className="text-[10px] text-[#E5A82B] font-mono">Sat 7PM</span>
            </button>
          </div>
        </div>

        {/* Live Support / Mentor availability note */}
        <div className="p-3 bg-[#0F1522] rounded-xl border border-[#26304A] space-y-1 text-xs">
          <span className="text-[10px] font-mono text-[#3DDC97] flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#3DDC97] animate-pulse" /> MENTOR ONLINE
          </span>
          <p className="text-[11px] text-[#9AA6BD]">
            Rahul reviews chart markups between 10:00 AM - 07:00 PM IST. Max file attachment: 10MB.
          </p>
        </div>
      </div>

      {/* Main Chat Conversation View */}
      <div className="lg:col-span-8 bg-[#1A2133] border border-[#26304A] rounded-2xl flex flex-col justify-between overflow-hidden shadow-md">
        {/* Chat Room Top Bar */}
        <div className="p-4 bg-[#0F1522] border-b border-[#26304A] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5A82B]/20 border border-[#E5A82B]/50 flex items-center justify-center font-bold text-xs text-[#E5A82B]">
              {activeRoom === 'mentorship' ? 'RM' : 'TR'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F2F4F8] flex items-center gap-2">
                {activeRoom === 'mentorship' && 'Private Mentorship: Rahul'}
                {activeRoom === 'general' && 'Trading Discussions Community'}
                {activeRoom === 'batch_smc' && 'SMC Foundations Batch 24'}
                {activeRoom === 'doubts' && 'Doubt Sessions & Weekly Chart Clinic'}
              </h3>
              <span className="text-[11px] text-[#9AA6BD] font-mono">
                {activeRoom === 'mentorship' ? 'End-to-end institutional encrypted channel' : '248 Active Students'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#3DDC97] bg-[#16382C] px-2 py-0.5 rounded font-mono text-[10px]">
              Active Feed
            </span>
          </div>
        </div>

        {/* Pinned SEBI & Community Guidelines Banner (Prominent in all group rooms) */}
        {activeRoom !== 'mentorship' && (
          <div className="bg-[#3A2D0C]/80 border-b border-[#E5A82B]/40 px-4 py-2 flex items-center justify-between text-xs text-[#E5A82B] gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#E5A82B]" />
              <span className="text-[11px]">
                <strong>Academy Rule & SEBI Compliance:</strong> Share structural SMC chart analysis only. Direct buy/sell tips, calls, and investment solicitations are strictly prohibited and result in permanent ban.
              </span>
            </div>
          </div>
        )}

        {/* Messages Stream Container */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {currentRoomMessages.map((msg) => {
            const isMe = msg.senderId === user.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#26304A]"
                />

                <div className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                  {/* Sender Name & Role */}
                  <div className="flex items-center gap-2 text-[11px] text-[#9AA6BD]">
                    <span className="font-semibold text-[#F2F4F8]">{msg.senderName}</span>
                    {msg.senderRole === 'mentor' && (
                      <span className="bg-[#3A2D0C] text-[#E5A82B] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-[#E5A82B]/30">
                        MENTOR
                      </span>
                    )}
                    <span>•</span>
                    <span className="font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all ${
                      isMe
                        ? 'bg-[#E5A82B] text-[#0B0F17] font-medium rounded-tr-xs'
                        : 'bg-[#0F1522] text-[#F2F4F8] border border-[#26304A] rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Attachment preview if present */}
                    {msg.attachment && (
                      <div className="mt-2.5 pt-2 border-t border-black/10 sm:border-[#26304A]">
                        {msg.attachment.type === 'image' ? (
                          <div className="rounded-lg overflow-hidden border border-[#26304A] max-w-sm">
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name}
                              className="w-full h-40 object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                            <div className="p-1.5 bg-black/60 text-[10px] text-white flex justify-between font-mono">
                              <span>{msg.attachment.name}</span>
                              <span>{msg.attachment.size}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-[#1A2133] border border-[#26304A] flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#E5A82B]" />
                              <div>
                                <span className="font-bold text-[#F2F4F8] block">{msg.attachment.name}</span>
                                <span className="text-[10px] text-[#9AA6BD]">{msg.attachment.size}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  {!isMe && (
                    <div className="flex items-center gap-3 pt-0.5 text-[10px] text-[#9AA6BD]">
                      <button className="hover:text-[#E5A82B] flex items-center gap-1 transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful</span>
                      </button>
                      <button
                        onClick={() => setReportModalMessage(msg)}
                        className="hover:text-[#FF6B6B] flex items-center gap-1 transition-colors"
                      >
                        <Flag className="w-3 h-3" />
                        <span>Report</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Mentor Typing Indicator */}
          {isMentorTyping && (
            <div className="flex items-center gap-2 text-xs text-[#E5A82B] font-mono bg-[#0F1522] p-2.5 rounded-xl border border-[#26304A] w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Mentor Rahul is typing institutional analysis...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <div className="p-3 sm:p-4 bg-[#0F1522] border-t border-[#26304A] space-y-2">
          {/* File attachment preview pill */}
          {attachedFile && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A2133] border border-[#E5A82B]/40 text-xs text-[#F2F4F8]">
              <div className="flex items-center gap-2">
                {attachedFile.type === 'image' ? <ImageIcon className="w-4 h-4 text-[#E5A82B]" /> : <FileText className="w-4 h-4 text-[#8FB0FF]" />}
                <span className="font-mono text-xs">{attachedFile.name}</span>
                <span className="text-[10px] text-[#9AA6BD]">({attachedFile.size})</span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-[#9AA6BD] hover:text-[#FF6B6B] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Attachment Buttons */}
            <button
              type="button"
              onClick={() => handleAttachMockFile('image')}
              className="touch-target p-2 rounded-xl bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-[#9AA6BD] hover:text-[#E5A82B] transition-colors"
              title="Attach Chart Screenshot"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleAttachMockFile('pdf')}
              className="touch-target p-2 rounded-xl bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-[#9AA6BD] hover:text-[#8FB0FF] transition-colors hidden sm:flex"
              title="Attach Trade Journal PDF"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeRoom === 'mentorship'
                  ? 'Message Mentor Rahul or ask about your order block markup...'
                  : 'Share structural SMC market analysis (No financial signals)...'
              }
              className="flex-1 bg-[#1A2133] border border-[#26304A] focus:border-[#E5A82B] focus:ring-1 focus:ring-[#E5A82B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F2F4F8] placeholder-[#9AA6BD]/60 outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !attachedFile}
              className="touch-target px-4 sm:px-5 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] disabled:opacity-40 disabled:hover:bg-[#E5A82B] text-[#0B0F17] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Moderation Report Modal */}
      {reportModalMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2133] border border-[#FF6B6B]/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
              <div className="flex items-center gap-2 text-[#FF6B6B] font-bold text-sm">
                <Flag className="w-4 h-4" />
                <span>Report Inappropriate Content</span>
              </div>
              <button onClick={() => setReportModalMessage(null)} className="text-[#9AA6BD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 bg-[#16382C] border border-[#3DDC97]/40 rounded-xl text-center space-y-2">
                <Check className="w-8 h-8 text-[#3DDC97] mx-auto" />
                <h4 className="text-sm font-bold text-[#F2F4F8]">Report Submitted</h4>
                <p className="text-xs text-[#9AA6BD]">
                  Our moderation desk reviews all reported content within 15 minutes as per SEBI academy guidelines.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#26304A] text-xs text-[#9AA6BD] italic">
                  "{reportModalMessage.text}"
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#F2F4F8] block">Select Reason:</label>
                  {[
                    { id: 'financial_tip', label: 'Unsolicited Financial Buy/Sell Tip (SEBI violation)' },
                    { id: 'spam', label: 'Spam / External Promotion' },
                    { id: 'solicitation', label: 'Soliciting Money / VIP Groups' },
                    { id: 'inappropriate', label: 'Abusive or Inappropriate Behavior' }
                  ].map((r) => (
                    <label key={r.id} className="flex items-center gap-2 text-xs text-[#9AA6BD] cursor-pointer p-2 hover:bg-[#0F1522] rounded-lg">
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reportReason === r.id}
                        onChange={() => setReportReason(r.id as any)}
                        className="text-[#E5A82B] focus:ring-[#E5A82B]"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#26304A]">
                  <button
                    onClick={() => setReportModalMessage(null)}
                    className="touch-target px-4 py-2 text-xs text-[#9AA6BD] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    className="touch-target px-5 py-2 bg-[#FF6B6B] hover:bg-[#E05252] text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
