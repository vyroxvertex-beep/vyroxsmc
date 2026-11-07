import React, { useState, useRef } from 'react';
import { DiscussionCategory, DiscussionPost, UserProfile } from '../../types';
import { DISCUSSION_CATEGORIES } from '../../data/mockData';
import { 
  X, 
  Image as ImageIcon, 
  Tag, 
  TrendingUp, 
  AlertCircle, 
  Upload, 
  Check, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface CreateDiscussionModalProps {
  user: UserProfile;
  initialPost?: DiscussionPost | null; // For editing existing post
  onClose: () => void;
  onSubmit: (postData: {
    title: string;
    content: string;
    category: DiscussionCategory;
    symbol?: string;
    tags: string[];
    chartImageUrl?: string;
    chartCaption?: string;
  }) => void;
}

const COMMON_SYMBOLS = ['US30', 'XAUUSD', 'GBPUSD', 'EURUSD', 'BTCUSD', 'BANKNIFTY', 'NAS100'];

const PRESET_CHART_TEMPLATES = [
  {
    name: 'London Liquidity Sweep (15m)',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Order Block Displacement (4H)',
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Fair Value Gap Mitigation',
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80'
  }
];

export const CreateDiscussionModal: React.FC<CreateDiscussionModalProps> = ({
  user,
  initialPost,
  onClose,
  onSubmit
}) => {
  const isEditing = Boolean(initialPost);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialPost?.title || '');
  const [category, setCategory] = useState<DiscussionCategory>(
    initialPost?.category || 'Chart Analysis'
  );
  const [symbol, setSymbol] = useState(initialPost?.symbol || 'XAUUSD');
  const [content, setContent] = useState(initialPost?.content || '');
  const [tagsInput, setTagsInput] = useState(initialPost?.tags?.join(', ') || 'BOS, CHoCH, OrderBlock');
  const [chartImageUrl, setChartImageUrl] = useState<string | undefined>(initialPost?.chartImageUrl);
  const [chartCaption, setChartCaption] = useState(initialPost?.chartCaption || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Image size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setChartImageUrl(uploadEvent.target?.result as string);
      setValidationError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (title.trim().length < 5) {
      setValidationError('Discussion title must be at least 5 characters long.');
      return;
    }

    if (content.trim().length < 20) {
      setValidationError('Please provide a detailed description (minimum 20 characters) explaining your setup or thesis.');
      return;
    }

    const processedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      symbol: symbol.trim().toUpperCase() || undefined,
      tags: processedTags.length > 0 ? processedTags : ['TradingDiscussion'],
      chartImageUrl,
      chartCaption: chartCaption.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#1A2133] border border-[#26304A] rounded-2xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl space-y-0">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0F1522] border-b border-[#26304A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5A82B]/20 border border-[#E5A82B]/50 flex items-center justify-center text-[#E5A82B]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F2F4F8]">
                {isEditing ? 'Edit Trading Discussion' : 'Start a Trading Discussion'}
              </h3>
              <span className="text-[11px] text-[#9AA6BD] font-mono">
                Post to VYROX Institutional Community
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#9AA6BD] hover:text-white p-1 rounded-lg hover:bg-[#212B42] touch-target transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {validationError && (
            <div className="p-3 bg-[#3A1717] border border-[#FF6B6B]/40 rounded-xl text-xs text-[#FF6B6B] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F2F4F8] flex items-center justify-between">
              <span>Discussion Title *</span>
              <span className="text-[10px] text-[#9AA6BD] font-mono">{title.length}/120</span>
            </label>
            <input
              type="text"
              maxLength={120}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. XAUUSD 15M London Sweep + Bullish CHoCH Confirmation (1:4.8 RR)"
              className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] focus:ring-1 focus:ring-[#E5A82B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F2F4F8] placeholder-[#9AA6BD]/50 outline-none"
            />
          </div>

          {/* Category & Symbol Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F2F4F8]">
                Discussion Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DiscussionCategory)}
                className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-3 py-2.5 text-xs text-[#F2F4F8] outline-none"
              >
                {DISCUSSION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F2F4F8]">
                Trading Symbol (Instrument)
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. US30, XAUUSD, EURUSD"
                className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl px-4 py-2.5 text-xs text-[#F2F4F8] font-mono outline-none"
              />
              {/* Quick symbol chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {COMMON_SYMBOLS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSymbol(s)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                      symbol === s
                        ? 'bg-[#E5A82B] text-[#0B0F17] font-bold'
                        : 'bg-[#0F1522] text-[#9AA6BD] hover:text-[#F2F4F8] border border-[#26304A]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F2F4F8] flex items-center justify-between">
              <span>Detailed Analysis & Trade Thesis *</span>
              <span className="text-[10px] text-[#9AA6BD]">Markdown supported</span>
            </label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detail your market structure, high-timeframe context, liquidity pools, entry trigger (BOS/CHoCH/FVG), risk:reward ratio, and invalidation criteria..."
              className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] focus:ring-1 focus:ring-[#E5A82B] rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-[#F2F4F8] placeholder-[#9AA6BD]/50 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Chart Screenshot Attachment */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-[#F2F4F8] flex items-center justify-between">
              <span>Attach Chart Screenshot</span>
              <span className="text-[10px] text-[#9AA6BD]">PNG, JPG, or WEBP up to 10MB</span>
            </label>

            {chartImageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-[#26304A] bg-[#0B0F17] p-2 space-y-2">
                <div className="relative max-h-56 overflow-hidden rounded-lg">
                  <img
                    src={chartImageUrl}
                    alt="Chart attachment preview"
                    className="w-full h-auto object-cover max-h-56 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setChartImageUrl(undefined)}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-[#FF6B6B] text-white p-1.5 rounded-lg transition-colors touch-target"
                    title="Remove chart"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={chartCaption}
                  onChange={(e) => setChartCaption(e.target.value)}
                  placeholder="Add a chart caption (e.g. 15m Liquidity grab and mitigation)..."
                  className="w-full bg-[#1A2133] border border-[#26304A] rounded-lg px-3 py-1.5 text-xs text-[#F2F4F8] outline-none"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#26304A] hover:border-[#E5A82B]/60 bg-[#0B0F17] rounded-xl p-4 text-center cursor-pointer transition-colors group"
                >
                  <Upload className="w-6 h-6 text-[#9AA6BD] group-hover:text-[#E5A82B] mx-auto mb-1 transition-colors" />
                  <span className="text-xs text-[#F2F4F8] font-semibold block">
                    Click to upload chart screenshot from device
                  </span>
                  <span className="text-[10px] text-[#9AA6BD]">
                    Or choose one of the verified institutional templates below
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Preset templates */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-[#9AA6BD] shrink-0 font-mono">PRESETS:</span>
                  {PRESET_CHART_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setChartImageUrl(tmpl.url);
                        setChartCaption(tmpl.name);
                      }}
                      className="text-[10px] bg-[#0F1522] hover:bg-[#212B42] text-[#9AA6BD] hover:text-[#E5A82B] border border-[#26304A] px-2.5 py-1 rounded-lg shrink-0 transition-colors"
                    >
                      + {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F2F4F8] flex items-center justify-between">
              <span>Tags (Comma separated)</span>
              <span className="text-[10px] text-[#9AA6BD]">e.g. BOS, FVG, LondonSweep, US30</span>
            </label>
            <div className="relative">
              <Tag className="w-3.5 h-3.5 text-[#9AA6BD] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="BOS, CHoCH, OrderBlock, JudasSwing"
                className="w-full bg-[#0B0F17] border border-[#26304A] focus:border-[#E5A82B] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F2F4F8] outline-none font-mono"
              />
            </div>
          </div>

          {/* SEBI Compliance Reminder Notice */}
          <div className="p-3 bg-[#0F1522] rounded-xl border border-[#26304A] text-[11px] text-[#9AA6BD] space-y-1">
            <span className="text-[#E5A82B] font-bold block">
              SEBI Educational Compliance Policy:
            </span>
            <p>
              Share structural market analysis only. Do not provide direct buy/sell investment advice, signal calls, or target price guarantees.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#26304A]">
            <button
              type="button"
              onClick={onClose}
              className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA6BD] hover:text-[#F2F4F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="touch-target px-6 py-2.5 rounded-xl bg-[#E5A82B] hover:bg-[#C48D17] text-[#0B0F17] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#E5A82B]/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Discussion'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
