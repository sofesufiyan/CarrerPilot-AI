import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Paperclip, User, Plus, MessageSquare } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
}

const SUGGESTIONS = [
  'How do I transition to a senior role?',
  'What skills should I learn next?',
  'Review my career roadmap',
  'How to negotiate a remote salary?',
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'ai',
    content:
      "Hi Mohammed! I'm your Career AI copilot. I can help with career planning, resume tips, interview prep, and skill development. What's on your mind today?",
  },
];

const AI_RESPONSES = [
  "Great question! Based on your current skill profile, I'd recommend focusing on three areas: system design fundamentals, leadership communication, and deep React performance optimization. Would you like me to create a detailed plan for any of these?",
  "Here's what I think: the transition to senior roles is less about coding speed and more about architectural thinking and mentorship. Let me suggest a 90-day roadmap that builds those muscles. Shall I add it to your roadmap?",
  "Looking at your profile, you're in a strong position. Your React and TypeScript skills are solid. To close the gap to senior level, I'd prioritize: 1) Distributed systems basics, 2) Cross-team collaboration patterns, 3) Technical writing. Want me to break any of these down?",
];

export function CareerAI() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation list */}
      <div className="hidden xl:flex flex-col w-72 border-r border-ink-200/70 bg-white shrink-0">
        <div className="p-4 border-b border-ink-200/70">
          <button className="btn-primary w-full">
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Recent</p>
          {[
            { title: 'How to transition to senior dev?', active: true },
            { title: 'Salary negotiation for remote roles', active: false },
            { title: 'Best certifications for 2026', active: false },
            { title: 'Switching from frontend to fullstack', active: false },
            { title: 'System design prep plan', active: false },
          ].map((c, i) => (
            <button
              key={i}
              className={`nav-item w-full text-left ${c.active ? 'nav-item-active' : ''}`}
            >
              <MessageSquare className="w-4 h-4 text-ink-400" />
              <span className="text-sm truncate">{c.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-ink-50/50">
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${
                    msg.role === 'ai'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                      : 'bg-gradient-to-br from-accent-400 to-accent-600'
                  }`}
                >
                  {msg.role === 'ai' ? (
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                  ) : (
                    <User className="w-4.5 h-4.5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'ai'
                      ? 'bg-white border border-ink-200/70 shadow-soft text-ink-700 rounded-tl-sm'
                      : 'bg-primary-600 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="bg-white border border-ink-200/70 shadow-soft rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary-400 animate-bounce-dot"
                      style={{ animationDelay: `${i * 160}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !isTyping && (
          <div className="px-4 sm:px-6 pb-3">
            <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="badge bg-white border border-ink-200 text-ink-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50/50 transition-all py-2 px-3"
                >
                  <Sparkles className="w-3 h-3 text-primary-400" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 sm:px-6 py-4 border-t border-ink-200/70 bg-white">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-end gap-2 rounded-2xl border border-ink-200 bg-ink-50 p-2 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all"
            >
              <button type="button" className="btn-ghost p-2" aria-label="Attach file">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your Career AI anything..."
                className="flex-1 bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400 px-2 py-2"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn-primary px-3.5 py-2.5"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[11px] text-ink-400 text-center mt-2">
              Career AI can make mistakes. Verify important career decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
