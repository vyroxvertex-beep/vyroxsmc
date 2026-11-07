import React, { useState } from 'react';
import { DiscussionPost, DiscussionComment, UserProfile, AppRole } from '../../types';
import { 
  ChevronLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Flag, 
  Send, 
  Check, 
  ShieldCheck, 
  Maximize2, 
  X, 
  Tag, 
  Clock, 
  Eye, 
  CornerDownRight, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface DiscussionDetailViewProps {
  post: DiscussionPost;
  user: UserProfile;
  currentRole: AppRole;
  relatedPosts: DiscussionPost[];
  onBack: () => void;
  onLikePost: (postId: string) => void;
  onDislikePost: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onSharePost: (post: DiscussionPost) => void;
  onEditPost: (post: DiscussionPost) => void;
  onDeletePost: (postId: string) => void;
  onAddComment: (postId: string, content: string, replyToCommentId?: string, replyToAuthorName?: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onOpenReport: (post: DiscussionPost) => void;
  onSelectPost: (postId: string) => void;
}

export const DiscussionDetailView: React.FC<DiscussionDetailViewProps> = ({
  post,
  user,
  currentRole,
  relatedPosts,
  onBack,
  onLikePost,
  onDislikePost,
  onToggleBookmark,
  onSharePost,
  onEditPost,
  onDeletePost,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onOpenReport,
  onSelectPost
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; authorName: string } | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAuthor = post.authorId === user.id || currentRole !== 'student';

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(
      post.id,
      commentText.trim(),
      replyingTo?.commentId,
      replyingTo?.authorName
    );

    setCommentText('');
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Breadcrumbs & Back */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="touch-target px-3 py-1.5 rounded-xl bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8] flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#E5A82B]" />
          <span>Back to Discussions Feed</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="bg-[#1E2A4A] text-[#8FB0FF] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#8FB0FF]/30 font-bold">
            {post.category}
          </span>
          {post.symbol && (
            <span className="bg-[#3A2D0C] text-[#E5A82B] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#E5A82B]/30 font-bold">
              {post.symbol}
            </span>
          )}
        </div>
      </div>

      {/* Main Discussion Post Container */}
      <article className="bg-[#1A2133] border border-[#26304A] rounded-2xl overflow-hidden shadow-xl space-y-0">
        {/* Post Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#16213A] to-[#1A2133] border-b border-[#26304A]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Author Profile */}
            <div className="flex items-center gap-3.5">
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#E5A82B]/50 shrink-0 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm sm:text-base text-[#F2F4F8]">
                    {post.authorName}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    post.authorBadge === 'Mentor'
                      ? 'bg-[#3A2D0C] text-[#E5A82B] border-[#E5A82B]/40'
                      : post.authorBadge === 'Pro Trader'
                      ? 'bg-[#1E2A4A] text-[#8FB0FF] border-[#8FB0FF]/40'
                      : 'bg-[#16382C] text-[#3DDC97] border-[#3DDC97]/40'
                  }`}>
                    {post.authorBadge.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#9AA6BD] font-mono mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.createdAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {post.views} views
                  </span>
                </div>
              </div>
            </div>

            {/* Author & Admin Controls */}
            <div className="flex items-center gap-2">
              {isAuthor && (
                <>
                  <button
                    onClick={() => onEditPost(post)}
                    className="touch-target px-3 py-1.5 rounded-lg bg-[#212B42] hover:bg-[#26304A] text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8] flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="touch-target px-3 py-1.5 rounded-lg bg-[#3A1717] hover:bg-[#4D1E1E] text-xs font-semibold text-[#FF6B6B] flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </>
              )}

              <button
                onClick={() => onOpenReport(post)}
                className="touch-target p-2 rounded-lg bg-[#212B42] hover:bg-[#26304A] text-[#9AA6BD] hover:text-[#FF6B6B] transition-colors"
                title="Report Post"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#F2F4F8] mt-4 leading-snug">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {post.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono bg-[#0B0F17] text-[#9AA6BD] border border-[#26304A] px-2.5 py-0.5 rounded-md"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="text-xs sm:text-sm text-[#F2F4F8] leading-relaxed whitespace-pre-wrap font-sans space-y-3">
            {post.content}
          </div>

          {/* Attached Chart Image & Lightbox Trigger */}
          {post.chartImageUrl && (
            <div className="pt-2">
              <div 
                onClick={() => setLightboxOpen(true)}
                className="relative rounded-2xl overflow-hidden border border-[#26304A] bg-[#0B0F17] group cursor-pointer shadow-lg"
              >
                <img
                  src={post.chartImageUrl}
                  alt={post.chartCaption || 'Trading chart analysis'}
                  className="w-full max-h-[500px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white p-2 rounded-xl group-hover:bg-[#E5A82B] group-hover:text-[#0B0F17] transition-all touch-target shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {post.chartCaption && (
                  <div className="p-3 bg-[#0B0F17]/95 border-t border-[#26304A] text-xs font-mono text-[#9AA6BD] flex items-center justify-between">
                    <span>{post.chartCaption}</span>
                    <span className="text-[#E5A82B] text-[10px] font-sans font-semibold">Click to expand chart ↗</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interaction Bar: Likes, Dislikes, Bookmark, Share */}
          <div className="pt-4 border-t border-[#26304A] flex flex-wrap items-center justify-between gap-3">
            {/* Reaction buttons */}
            <div className="flex items-center gap-2">
              {/* Like */}
              <button
                onClick={() => onLikePost(post.id)}
                className={`touch-target px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  post.userVote === 'like'
                    ? 'bg-[#16382C] text-[#3DDC97] border border-[#3DDC97]/40 shadow-sm font-bold'
                    : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${post.userVote === 'like' ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={() => onDislikePost(post.id)}
                className={`touch-target px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  post.userVote === 'dislike'
                    ? 'bg-[#3A1717] text-[#FF6B6B] border border-[#FF6B6B]/40 shadow-sm font-bold'
                    : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                }`}
              >
                <ThumbsDown className={`w-4 h-4 ${post.userVote === 'dislike' ? 'fill-current' : ''}`} />
                <span>{post.dislikes}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() => onToggleBookmark(post.id)}
                className={`touch-target px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  post.isBookmarked
                    ? 'bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/40 font-bold'
                    : 'bg-[#0B0F17] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                <span>{post.isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>

            {/* Share */}
            <button
              onClick={() => onSharePost(post)}
              className="touch-target px-4 py-2 rounded-xl bg-[#0B0F17] hover:bg-[#212B42] border border-[#26304A] text-xs font-semibold text-[#9AA6BD] hover:text-[#E5A82B] flex items-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Discussion</span>
            </button>
          </div>
        </div>
      </article>

      {/* Lightbox Modal */}
      {lightboxOpen && post.chartImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#E5A82B] p-2 touch-target"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={post.chartImageUrl}
              alt={post.title}
              className="max-h-[85vh] w-auto object-contain rounded-xl border border-[#26304A]"
            />
            {post.chartCaption && (
              <div className="mt-3 text-xs font-mono text-[#F2F4F8] bg-[#0F1522] px-4 py-1.5 rounded-full border border-[#26304A]">
                {post.chartCaption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A2133] border border-[#FF6B6B]/40 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#3A1717] border border-[#FF6B6B]/40 flex items-center justify-center mx-auto text-[#FF6B6B]">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F2F4F8]">Delete Discussion?</h3>
              <p className="text-xs text-[#9AA6BD]">
                This action cannot be undone. All attached replies will also be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA6BD] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePost(post.id);
                  setShowDeleteConfirm(false);
                }}
                className="touch-target px-5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E05252] text-white font-bold text-xs shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <section aria-labelledby="comments-heading" className="bg-[#1A2133] border border-[#26304A] rounded-2xl p-5 sm:p-6 space-y-6 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#E5A82B]" />
            <h2 id="comments-heading" className="text-base font-bold text-[#F2F4F8]">
              Community Replies & Trade Discussions ({post.comments?.length || 0})
            </h2>
          </div>
        </div>

        {/* Add Comment Input Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          {replyingTo && (
            <div className="p-2 rounded-lg bg-[#0F1522] border border-[#E5A82B]/30 flex items-center justify-between text-xs text-[#E5A82B]">
              <span className="flex items-center gap-1.5 font-mono">
                <CornerDownRight className="w-3.5 h-3.5" />
                Replying to <strong>@{replyingTo.authorName}</strong>
              </span>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-[#9AA6BD] hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-[#26304A] shrink-0 mt-1"
            />
            <div className="flex-1 space-y-2">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  replyingTo 
                    ? `Reply to @${replyingTo.authorName}...` 
                    : 'Share your perspective on this market structure or ask a clarifying question...'
                }
                className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] focus:ring-1 focus:ring-[#E5A82B] rounded-xl p-3 text-xs sm:text-sm text-[#F2F4F8] placeholder-[#9AA6BD]/50 outline-none resize-none leading-relaxed"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#9AA6BD] hidden sm:inline-block">
                  SEBI rule: share technical structural views only.
                </span>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="touch-target px-5 py-2 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] disabled:opacity-40 text-[#0B0F17] font-bold text-xs flex items-center gap-2 shadow-md transition-all ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Reply</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments Stream */}
        <div className="space-y-4 pt-2">
          {(!post.comments || post.comments.length === 0) ? (
            <div className="py-8 text-center text-xs text-[#9AA6BD]">
              No replies yet. Be the first trader to share your thoughts on this analysis!
            </div>
          ) : (
            post.comments.map((comment) => {
              const isCommentAuthor = comment.authorId === user.id || currentRole !== 'student';
              const isNested = Boolean(comment.replyToCommentId);

              return (
                <div
                  key={comment.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isNested
                      ? 'ml-6 sm:ml-10 bg-[#16213A]/50 border-[#26304A]/60'
                      : 'bg-[#0B0F17] border-[#26304A]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-8 h-8 rounded-full object-cover border border-[#26304A] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#F2F4F8]">
                            {comment.authorName}
                          </span>
                          {comment.authorBadge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#3A2D0C] text-[#E5A82B] border border-[#E5A82B]/30 font-bold">
                              {comment.authorBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#9AA6BD] font-mono">
                          {comment.createdAt}
                        </span>
                      </div>
                    </div>

                    {isCommentAuthor && (
                      <button
                        onClick={() => onDeleteComment(post.id, comment.id)}
                        className="text-[#9AA6BD] hover:text-[#FF6B6B] p-1 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {comment.replyToAuthorName && (
                    <div className="mt-2 text-[11px] font-mono text-[#E5A82B] flex items-center gap-1">
                      <CornerDownRight className="w-3 h-3" />
                      <span>Replying to @{comment.replyToAuthorName}</span>
                    </div>
                  )}

                  <p className="mt-2 text-xs text-[#F2F4F8] leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-[11px] text-[#9AA6BD]">
                    <button
                      onClick={() => onLikeComment(post.id, comment.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        comment.likedByUser ? 'text-[#3DDC97] font-bold' : 'hover:text-[#F2F4F8]'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{comment.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => setReplyingTo({ commentId: comment.id, authorName: comment.authorName })}
                      className="hover:text-[#E5A82B] flex items-center gap-1 transition-colors font-semibold"
                    >
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Related Discussions in Category */}
      {relatedPosts.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 id="related-heading" className="text-sm font-bold text-[#F2F4F8]">
              More in {post.category}
            </h3>
            <span className="text-xs text-[#E5A82B] font-mono">Institutional Feed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.slice(0, 2).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectPost(rel.id)}
                className="p-4 rounded-xl bg-[#1A2133] hover:bg-[#212B42] border border-[#26304A] hover:border-[#E5A82B]/40 cursor-pointer transition-all space-y-2 group shadow-sm"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA6BD]">
                  <span className="text-[#8FB0FF]">{rel.category}</span>
                  {rel.symbol && <span className="text-[#E5A82B]">{rel.symbol}</span>}
                </div>
                <h4 className="text-xs font-bold text-[#F2F4F8] group-hover:text-[#E5A82B] transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-[#9AA6BD] pt-1">
                  <span>by {rel.authorName}</span>
                  <span>{rel.likes} likes • {rel.commentsCount} replies</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
