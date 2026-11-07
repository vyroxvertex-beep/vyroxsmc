import React, { useState, useEffect, useMemo } from 'react';
import { 
  DiscussionCategory, 
  DiscussionPost, 
  DiscussionComment, 
  UserProfile, 
  AppRole 
} from '../../types';
import { DISCUSSION_CATEGORIES, INITIAL_DISCUSSIONS } from '../../data/mockData';
import { CreateDiscussionModal } from './CreateDiscussionModal';
import { DiscussionDetailView } from './DiscussionDetailView';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Share2, 
  Flag, 
  Pin, 
  Check, 
  Sparkles, 
  Layers, 
  Flame, 
  Clock, 
  Eye, 
  CheckCircle2, 
  X, 
  RotateCcw,
  BarChart2,
  Users,
  Compass
} from 'lucide-react';

interface TradingDiscussionsViewProps {
  user: UserProfile;
  currentRole: AppRole;
  onOpenMentorshipChat?: () => void;
}

type FeedFilter = 'latest' | 'popular' | 'most_commented' | 'trending' | 'my_posts' | 'saved';

const LOCAL_STORAGE_KEY = 'vyrox_community_discussions_v1';

const POPULAR_SYMBOLS = ['ALL', 'XAUUSD', 'US30', 'GBPUSD', 'EURUSD', 'BTCUSD', 'BANKNIFTY'];

export const TradingDiscussionsView: React.FC<TradingDiscussionsViewProps> = ({
  user,
  currentRole,
  onOpenMentorshipChat
}) => {
  // Load discussions from localStorage or fallback
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading discussions from localStorage:', e);
    }
    return INITIAL_DISCUSSIONS;
  });

  // Save to localStorage whenever discussions change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(discussions));
    } catch (e) {
      console.error('Error saving discussions to localStorage:', e);
    }
  }, [discussions]);

  // Navigation & UI States
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<DiscussionPost | null>(null);
  const [reportingPost, setReportingPost] = useState<DiscussionPost | null>(null);
  const [reportReason, setReportReason] = useState<string>('spam');
  const [reportNote, setReportNote] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeFeedFilter, setActiveFeedFilter] = useState<FeedFilter>('latest');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('ALL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Find currently opened post
  const currentOpenPost = useMemo(() => {
    if (!selectedPostId) return null;
    return discussions.find(d => d.id === selectedPostId) || null;
  }, [selectedPostId, discussions]);

  // Related posts for current detail view
  const relatedPosts = useMemo(() => {
    if (!currentOpenPost) return [];
    return discussions
      .filter(d => d.id !== currentOpenPost.id && d.category === currentOpenPost.category)
      .slice(0, 4);
  }, [currentOpenPost, discussions]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: discussions.length };
    DISCUSSION_CATEGORIES.forEach(cat => {
      counts[cat] = 0;
    });
    discussions.forEach(d => {
      if (counts[d.category] !== undefined) {
        counts[d.category]++;
      }
    });
    return counts;
  }, [discussions]);

  // Filtered & Sorted Feed
  const filteredDiscussions = useMemo(() => {
    return discussions.filter(post => {
      // Category filter
      if (selectedCategory !== 'ALL' && post.category !== selectedCategory) {
        return false;
      }

      // Symbol filter
      if (selectedSymbol !== 'ALL') {
        if (!post.symbol || !post.symbol.toUpperCase().includes(selectedSymbol.toUpperCase())) {
          return false;
        }
      }

      // Feed Filter tabs
      if (activeFeedFilter === 'my_posts' && post.authorId !== user.id) {
        return false;
      }
      if (activeFeedFilter === 'saved' && !post.isBookmarked) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = post.title.toLowerCase().includes(q);
        const inContent = post.content.toLowerCase().includes(q);
        const inSymbol = post.symbol ? post.symbol.toLowerCase().includes(q) : false;
        const inTags = post.tags.some(t => t.toLowerCase().includes(q));
        const inAuthor = post.authorName.toLowerCase().includes(q);
        if (!inTitle && !inContent && !inSymbol && !inTags && !inAuthor) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Pinned posts always stay on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (activeFeedFilter === 'popular') {
        return b.likes - a.likes;
      }
      if (activeFeedFilter === 'most_commented') {
        return b.commentsCount - a.commentsCount;
      }
      if (activeFeedFilter === 'trending') {
        const scoreA = a.likes * 3 + a.commentsCount * 5 + a.views * 0.1;
        const scoreB = b.likes * 3 + b.commentsCount * 5 + b.views * 0.1;
        return scoreB - scoreA;
      }
      // Default: Latest
      return b.id.localeCompare(a.id);
    });
  }, [discussions, selectedCategory, selectedSymbol, activeFeedFilter, searchQuery, user.id]);

  // Action: Create or Update Post
  const handleSavePost = (data: {
    title: string;
    content: string;
    category: DiscussionCategory;
    symbol?: string;
    tags: string[];
    chartImageUrl?: string;
    chartCaption?: string;
  }) => {
    if (editingPost) {
      // Edit mode
      setDiscussions(prev => prev.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            ...data,
            updatedAt: 'Just now'
          };
        }
        return p;
      }));
      setEditingPost(null);
      showToast('Discussion updated successfully.');
    } else {
      // New post
      const newPost: DiscussionPost = {
        id: `disc_${Date.now()}`,
        title: data.title,
        content: data.content,
        category: data.category,
        symbol: data.symbol,
        tags: data.tags,
        chartImageUrl: data.chartImageUrl,
        chartCaption: data.chartCaption,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatarUrl,
        authorBadge: currentRole === 'student' ? 'Verified Student' : 'Admin',
        createdAt: 'Just now',
        likes: 1,
        dislikes: 0,
        userVote: 'like',
        isBookmarked: false,
        views: 1,
        commentsCount: 0,
        comments: [],
        isPinned: false
      };

      setDiscussions(prev => [newPost, ...prev]);
      showToast('Discussion published to the community feed!');
    }
    setShowCreateModal(false);
  };

  // Action: Delete Post
  const handleDeletePost = (postId: string) => {
    setDiscussions(prev => prev.filter(p => p.id !== postId));
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    }
    showToast('Discussion deleted.');
  };

  // Action: Like / Remove Like on Post
  const handleLikePost = (postId: string) => {
    setDiscussions(prev => prev.map(p => {
      if (p.id === postId) {
        if (p.userVote === 'like') {
          return { ...p, likes: Math.max(0, p.likes - 1), userVote: null };
        } else if (p.userVote === 'dislike') {
          return { 
            ...p, 
            likes: p.likes + 1, 
            dislikes: Math.max(0, p.dislikes - 1), 
            userVote: 'like' 
          };
        } else {
          return { ...p, likes: p.likes + 1, userVote: 'like' };
        }
      }
      return p;
    }));
  };

  // Action: Dislike / Remove Dislike on Post
  const handleDislikePost = (postId: string) => {
    setDiscussions(prev => prev.map(p => {
      if (p.id === postId) {
        if (p.userVote === 'dislike') {
          return { ...p, dislikes: Math.max(0, p.dislikes - 1), userVote: null };
        } else if (p.userVote === 'like') {
          return { 
            ...p, 
            dislikes: p.dislikes + 1, 
            likes: Math.max(0, p.likes - 1), 
            userVote: 'dislike' 
          };
        } else {
          return { ...p, dislikes: p.dislikes + 1, userVote: 'dislike' };
        }
      }
      return p;
    }));
  };

  // Action: Bookmark Toggle
  const handleToggleBookmark = (postId: string) => {
    setDiscussions(prev => prev.map(p => {
      if (p.id === postId) {
        const nextState = !p.isBookmarked;
        showToast(nextState ? 'Saved to Bookmarks.' : 'Removed from Bookmarks.');
        return { ...p, isBookmarked: nextState };
      }
      return p;
    }));
  };

  // Action: Share
  const handleSharePost = (post: DiscussionPost) => {
    const shareText = `Check out "${post.title}" on VYROX Trading Community`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/community?post=${post.id}`);
      showToast('Discussion link copied to clipboard!');
    } else {
      showToast('Shared: ' + shareText);
    }
  };

  // Action: Add Comment
  const handleAddComment = (
    postId: string,
    content: string,
    replyToCommentId?: string,
    replyToAuthorName?: string
  ) => {
    const newComment: DiscussionComment = {
      id: `comm_${Date.now()}`,
      discussionId: postId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatarUrl,
      authorBadge: currentRole === 'student' ? 'Verified Student' : 'Admin',
      content,
      createdAt: 'Just now',
      likes: 0,
      likedByUser: false,
      replyToCommentId,
      replyToAuthorName
    };

    setDiscussions(prev => prev.map(p => {
      if (p.id === postId) {
        const nextComments = [...(p.comments || []), newComment];
        return {
          ...p,
          comments: nextComments,
          commentsCount: nextComments.length
        };
      }
      return p;
    }));

    showToast('Reply published.');
  };

  // Action: Like Comment
  const handleLikeComment = (postId: string, commentId: string) => {
    setDiscussions(prev => prev.map(p => {
      if (p.id === postId) {
        const nextComments = p.comments.map(c => {
          if (c.id === commentId) {
            const isLiked = Boolean(c.likedByUser);
            return {
              ...c,
              likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
              likedByUser: !isLiked
            };
          }
          return c;
        });
        return { ...p, comments: nextComments };
      }
      return p;
    }));
  };

  // Action: Delete Comment
  const handleDeleteComment = (postId: string, commentId: string) => {
    setDiscussions(prev => prev.map(p => {
      if (p.id === postId) {
        const nextComments = p.comments.filter(c => c.id !== commentId);
        return {
          ...p,
          comments: nextComments,
          commentsCount: nextComments.length
        };
      }
      return p;
    }));
    showToast('Comment deleted.');
  };

  // Action: Submit Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPost) return;

    showToast(`Post reported to academy moderators for "${reportReason}". Thank you.`);
    setReportingPost(null);
    setReportNote('');
  };

  // Reset to sample data
  const handleResetData = () => {
    if (window.confirm('Reset discussions feed back to verified academy defaults?')) {
      setDiscussions(INITIAL_DISCUSSIONS);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      showToast('Discussions reset to default curriculum state.');
    }
  };

  // RENDER DETAIL VIEW IF POST SELECTED
  if (currentOpenPost) {
    return (
      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 bg-[#1A2133] border border-[#E5A82B] text-xs font-semibold text-[#F2F4F8] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3DDC97]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <DiscussionDetailView
          post={currentOpenPost}
          user={user}
          currentRole={currentRole}
          relatedPosts={relatedPosts}
          onBack={() => setSelectedPostId(null)}
          onLikePost={handleLikePost}
          onDislikePost={handleDislikePost}
          onToggleBookmark={handleToggleBookmark}
          onSharePost={handleSharePost}
          onEditPost={(post) => {
            setEditingPost(post);
            setShowCreateModal(true);
          }}
          onDeletePost={handleDeletePost}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onDeleteComment={handleDeleteComment}
          onOpenReport={(post) => setReportingPost(post)}
          onSelectPost={(pId) => {
            setSelectedPostId(pId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Edit Modal (reuses CreateDiscussionModal with initialPost) */}
        {showCreateModal && (
          <CreateDiscussionModal
            user={user}
            initialPost={editingPost}
            onClose={() => {
              setShowCreateModal(false);
              setEditingPost(null);
            }}
            onSubmit={handleSavePost}
          />
        )}

        {/* Report Modal */}
        {reportingPost && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
                <div className="flex items-center gap-2 text-[#FF6B6B]">
                  <Flag className="w-4 h-4" />
                  <h3 className="text-sm font-bold text-[#F2F4F8]">Report Discussion</h3>
                </div>
                <button
                  onClick={() => setReportingPost(null)}
                  className="text-[#9AA6BD] hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-[#26304A] rounded-xl px-3 py-2 text-xs text-[#F2F4F8] outline-none"
                  >
                    <option value="spam">Unsolicited Promotion or Spam</option>
                    <option value="signals">Direct Buy/Sell Signals (Violates SEBI Rules)</option>
                    <option value="offensive">Disrespectful or Inappropriate Conduct</option>
                    <option value="offtopic">Non-Trading / Unrelated Content</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F4F8]">Additional Details (Optional)</label>
                  <textarea
                    rows={3}
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Provide context for academy moderators..."
                    className="w-full bg-[#0B0F17] border border-[#26304A] rounded-xl p-2.5 text-xs text-[#F2F4F8] outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingPost(null)}
                    className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA6BD]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="touch-target px-5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E05252] text-white font-bold text-xs"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN DISCUSSIONS FEED VIEW
  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#1A2133] border border-[#E5A82B] text-xs font-semibold text-[#F2F4F8] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3DDC97]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#16213A] via-[#1A2133] to-[#0F1522] border border-[#26304A] p-5 sm:p-7 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5A82B]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#E5A82B]/20 text-[#E5A82B] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#E5A82B]/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A82B] animate-pulse" />
                INSTITUTIONAL TRADING DISCUSSIONS
              </span>
              <span className="text-[10px] text-[#9AA6BD] font-mono">
                12 Specialised SMC Categories
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#F2F4F8] tracking-tight">
              Trading Discussions Community
            </h1>

            <p className="text-xs sm:text-sm text-[#9AA6BD] leading-relaxed">
              Connect with verified SMC traders, share chart markups, dissect liquidity sweeps, 
              compare execution models, and master institutional order flow together.
            </p>
          </div>

          {/* Quick CTAs */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {onOpenMentorshipChat && (
              <button
                onClick={onOpenMentorshipChat}
                className="touch-target px-4 py-2.5 rounded-xl bg-[#0F1522] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#8FB0FF] flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>1-on-1 Mentorship</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingPost(null);
                setShowCreateModal(true);
              }}
              className="touch-target px-5 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#E5A82B]/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Start Discussion</span>
            </button>
          </div>
        </div>

        {/* Live Metrics strip */}
        <div className="mt-6 pt-5 border-t border-[#26304A]/70 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Total Discussions</span>
            <span className="text-lg font-bold text-[#F2F4F8]">{discussions.length} Threads</span>
          </div>

          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Community Replies</span>
            <span className="text-lg font-bold text-[#3DDC97]">
              {discussions.reduce((acc, d) => acc + (d.commentsCount || 0), 0)} Verified
            </span>
          </div>

          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Active Categories</span>
            <span className="text-lg font-bold text-[#8FB0FF]">12 Focus Areas</span>
          </div>

          <div className="bg-[#0B0F17]/60 p-3 rounded-xl border border-[#26304A]/60">
            <span className="text-[10px] font-mono text-[#9AA6BD] uppercase block">Compliance Rule</span>
            <span className="text-lg font-bold text-[#E5A82B]">SEBI Strict</span>
          </div>
        </div>
      </div>

      {/* 12 Categories Horizontal Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#9AA6BD] px-1">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#F2F4F8]">
            <Layers className="w-3.5 h-3.5 text-[#E5A82B]" />
            DISCUSSIONS BY CATEGORY ({DISCUSSION_CATEGORIES.length})
          </span>
          {selectedCategory !== 'ALL' && (
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="text-[#E5A82B] hover:underline text-[11px] flex items-center gap-1 font-mono"
            >
              Reset to All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {/* ALL tab */}
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`touch-target px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
              selectedCategory === 'ALL'
                ? 'bg-[#E5A82B] text-[#0B0F17] font-bold shadow-md shadow-[#E5A82B]/20'
                : 'bg-[#1A2133] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
            }`}
          >
            <span>All Categories</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'ALL' ? 'bg-[#0B0F17] text-[#E5A82B]' : 'bg-[#0B0F17] text-[#9AA6BD]'
            }`}>
              {categoryCounts['ALL'] || 0}
            </span>
          </button>

          {/* 12 Specific Categories */}
          {DISCUSSION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`touch-target px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#E5A82B] text-[#0B0F17] font-bold shadow-md shadow-[#E5A82B]/20'
                    : 'bg-[#1A2133] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-[#0B0F17] text-[#E5A82B]' : 'bg-[#0B0F17] text-[#9AA6BD]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Feed Tabs, Search & Symbol Chips */}
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-4 space-y-3.5 shadow-md">
        {/* Top line: Feed Filter Tabs + Search Input */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFeedFilter('latest')}
              className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                activeFeedFilter === 'latest'
                  ? 'bg-[#26304A] text-[#F2F4F8] font-bold border border-[#E5A82B]/30'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#E5A82B]" />
              <span>Latest</span>
            </button>

            <button
              onClick={() => setActiveFeedFilter('popular')}
              className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                activeFeedFilter === 'popular'
                  ? 'bg-[#26304A] text-[#F2F4F8] font-bold border border-[#E5A82B]/30'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 text-[#3DDC97]" />
              <span>Most Popular</span>
            </button>

            <button
              onClick={() => setActiveFeedFilter('most_commented')}
              className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                activeFeedFilter === 'most_commented'
                  ? 'bg-[#26304A] text-[#F2F4F8] font-bold border border-[#E5A82B]/30'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#8FB0FF]" />
              <span>Most Commented</span>
            </button>

            <button
              onClick={() => setActiveFeedFilter('trending')}
              className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                activeFeedFilter === 'trending'
                  ? 'bg-[#26304A] text-[#F2F4F8] font-bold border border-[#E5A82B]/30'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#FF9F43]" />
              <span>Trending</span>
            </button>

            <div className="h-4 w-px bg-[#26304A] mx-1 shrink-0" />

            <button
              onClick={() => setActiveFeedFilter('my_posts')}
              className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                activeFeedFilter === 'my_posts'
                  ? 'bg-[#26304A] text-[#F2F4F8] font-bold border border-[#E5A82B]/30'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <span>My Discussions</span>
            </button>

            <button
              onClick={() => setActiveFeedFilter('saved')}
              className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                activeFeedFilter === 'saved'
                  ? 'bg-[#26304A] text-[#F2F4F8] font-bold border border-[#E5A82B]/30'
                  : 'text-[#9AA6BD] hover:text-[#F2F4F8]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#E5A82B]" />
              <span>Saved</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[300px]">
            <Search className="w-4 h-4 text-[#9AA6BD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search setups, tags, symbols..."
              className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl pl-9 pr-8 py-2 text-xs text-[#F2F4F8] placeholder-[#9AA6BD]/50 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA6BD] hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Second line: Symbol Filter Chips */}
        <div className="pt-2 border-t border-[#26304A]/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-mono uppercase text-[#9AA6BD] shrink-0 font-semibold">
            Instruments:
          </span>
          {POPULAR_SYMBOLS.map((sym) => (
            <button
              key={sym}
              onClick={() => setSelectedSymbol(sym)}
              className={`touch-target text-[10px] font-mono px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                selectedSymbol === sym
                  ? 'bg-[#E5A82B] text-[#0B0F17] font-bold'
                  : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
              }`}
            >
              {sym === 'ALL' ? 'All Pairs' : sym}
            </button>
          ))}

          {(selectedSymbol !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSymbol('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-[10px] text-[#FF6B6B] hover:underline ml-auto shrink-0 font-mono"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Discussions Feed List */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-10 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#0B0F17] border border-[#26304A] flex items-center justify-center mx-auto text-[#9AA6BD]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#F2F4F8]">
                No Discussions Found
              </h3>
              <p className="text-xs text-[#9AA6BD] max-w-md mx-auto">
                No trading discussions match your current search, symbol, or category filters.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSymbol('ALL');
                  setSearchQuery('');
                  setActiveFeedFilter('latest');
                }}
                className="touch-target px-4 py-2 rounded-xl bg-[#212B42] text-xs font-semibold text-[#9AA6BD] hover:text-white"
              >
                Reset Filters
              </button>
              <button
                onClick={() => {
                  setEditingPost(null);
                  setShowCreateModal(true);
                }}
                className="touch-target px-5 py-2 rounded-xl bg-[#E5A82B] text-[#0B0F17] font-bold text-xs shadow-md"
              >
                Create First Discussion
              </button>
            </div>
          </div>
        ) : (
          filteredDiscussions.map((post) => {
            const isAuthor = post.authorId === user.id || currentRole !== 'student';

            return (
              <article
                key={post.id}
                className={`bg-[#1A2133] hover:bg-[#1E273C] border rounded-2xl transition-all shadow-md group ${
                  post.isPinned
                    ? 'border-[#E5A82B]/60 bg-gradient-to-r from-[#1E273C] to-[#1A2133]'
                    : 'border-[#26304A] hover:border-[#26304A]/90'
                }`}
              >
                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Card Header: Author info, Pinned pill, Category, Symbol */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-[#26304A] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-[#F2F4F8]">
                            {post.authorName}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            post.authorBadge === 'Mentor'
                              ? 'bg-[#3A2D0C] text-[#E5A82B] border-[#E5A82B]/40'
                              : post.authorBadge === 'Pro Trader'
                              ? 'bg-[#1E2A4A] text-[#8FB0FF] border-[#8FB0FF]/40'
                              : 'bg-[#16382C] text-[#3DDC97] border-[#3DDC97]/40'
                          }`}>
                            {post.authorBadge.toUpperCase()}
                          </span>
                          {post.isPinned && (
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E5A82B] text-[#0B0F17] flex items-center gap-1 shadow-sm">
                              <Pin className="w-2.5 h-2.5 fill-current" />
                              PINNED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#9AA6BD] font-mono mt-0.5">
                          <span>{post.createdAt}</span>
                          <span>•</span>
                          <span>{post.views} views</span>
                        </div>
                      </div>
                    </div>

                    {/* Category & Symbol Chips */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      <span className="bg-[#1E2A4A] text-[#8FB0FF] text-[10px] font-mono px-2 py-0.5 rounded-md border border-[#8FB0FF]/30 font-semibold">
                        {post.category}
                      </span>
                      {post.symbol && (
                        <span className="bg-[#3A2D0C] text-[#E5A82B] text-[10px] font-mono px-2 py-0.5 rounded-md border border-[#E5A82B]/30 font-bold">
                          {post.symbol}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Discussion Title & Content Preview */}
                  <div
                    onClick={() => setSelectedPostId(post.id)}
                    className="cursor-pointer space-y-2 group"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#9AA6BD] line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Attached Chart Thumbnail Preview */}
                  {post.chartImageUrl && (
                    <div 
                      onClick={() => setSelectedPostId(post.id)}
                      className="cursor-pointer relative rounded-xl overflow-hidden border border-[#26304A] max-h-48 bg-[#0B0F17]"
                    >
                      <img
                        src={post.chartImageUrl}
                        alt={post.chartCaption || 'Chart thumbnail'}
                        className="w-full h-48 object-cover group-hover:scale-[1.01] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[11px] font-mono text-[#F2F4F8] truncate">
                          {post.chartCaption || 'Click to view full chart markup'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-[#0B0F17] text-[#9AA6BD] border border-[#26304A] px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar: Reactions, Comments, Bookmark, Share */}
                  <div className="pt-3 border-t border-[#26304A] flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {/* Like */}
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`touch-target px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          post.userVote === 'like'
                            ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/40 font-bold'
                            : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                        }`}
                        title="Agree / Upvote"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${post.userVote === 'like' ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      {/* Dislike */}
                      <button
                        onClick={() => handleDislikePost(post.id)}
                        className={`touch-target px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          post.userVote === 'dislike'
                            ? 'bg-[#3A1717] text-[#FF6B6B] border border-[#FF6B6B]/40 font-bold'
                            : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                        }`}
                        title="Disagree / Downvote"
                      >
                        <ThumbsDown className={`w-3.5 h-3.5 ${post.userVote === 'dislike' ? 'fill-current' : ''}`} />
                        <span>{post.dislikes}</span>
                      </button>

                      {/* Comments */}
                      <button
                        onClick={() => setSelectedPostId(post.id)}
                        className="touch-target px-3 py-1.5 rounded-lg bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#8FB0FF]" />
                        <span>{post.commentsCount} replies</span>
                      </button>

                      {/* Bookmark */}
                      <button
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`touch-target p-1.5 rounded-lg text-xs transition-colors ${
                          post.isBookmarked
                            ? 'bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/40'
                            : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                        }`}
                        title={post.isBookmarked ? 'Remove Bookmark' : 'Save Discussion'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSharePost(post)}
                        className="touch-target p-1.5 rounded-lg bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#E5A82B] border border-[#26304A] transition-colors"
                        title="Share link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedPostId(post.id)}
                        className="touch-target px-3 py-1.5 rounded-lg bg-[#212B42] hover:bg-[#E5A82B] hover:text-[#0B0F17] text-xs font-bold text-[#F2F4F8] transition-all flex items-center gap-1 shadow-sm"
                      >
                        <span>Open Thread</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Footer Info & Reset Demo Data */}
      <div className="pt-6 border-t border-[#26304A] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9AA6BD]">
        <span>
          VYROX Institutional Trading Community • SEBI Educational Policy Enforced
        </span>
        <button
          onClick={handleResetData}
          className="touch-target text-[10px] font-mono text-[#9AA6BD] hover:text-[#E5A82B] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Sample Discussions</span>
        </button>
      </div>

      {/* Create / Edit Discussion Modal */}
      {showCreateModal && (
        <CreateDiscussionModal
          user={user}
          initialPost={editingPost}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPost(null);
          }}
          onSubmit={handleSavePost}
        />
      )}

      {/* Report Modal */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
              <div className="flex items-center gap-2 text-[#FF6B6B]">
                <Flag className="w-4 h-4" />
                <h3 className="text-sm font-bold text-[#F2F4F8]">Report Discussion</h3>
              </div>
              <button
                onClick={() => setReportingPost(null)}
                className="text-[#9AA6BD] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8]">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-[#26304A] rounded-xl px-3 py-2 text-xs text-[#F2F4F8] outline-none"
                >
                  <option value="spam">Unsolicited Promotion or Spam</option>
                  <option value="signals">Direct Buy/Sell Signals (Violates SEBI Rules)</option>
                  <option value="offensive">Disrespectful or Inappropriate Conduct</option>
                  <option value="offtopic">Non-Trading / Unrelated Content</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F4F8]">Additional Details (Optional)</label>
                <textarea
                  rows={3}
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Provide context for academy moderators..."
                  className="w-full bg-[#0B0F17] border border-[#26304A] rounded-xl p-2.5 text-xs text-[#F2F4F8] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingPost(null)}
                  className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA6BD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E05252] text-white font-bold text-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
