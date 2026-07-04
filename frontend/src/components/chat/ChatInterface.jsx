import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check, Send, Sparkles, MessageSquare, Plus } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "How can I transition from Web Development to AI/ML?",
  "What is the average roadmap to learn Deep Learning?",
  "How should I answer 'What is your greatest weakness' in an interview?",
  "What skills should a Data Analyst learn in 2026?",
];

const MentorMessageFormatter = ({ text }) => {
  if (!text) return null;

  let content = text.trim();
  let hasFallbackFooter = false;

  if (content.endsWith("⚡ Local Engine Active (Cloud AI Unavailable)")) {
    hasFallbackFooter = true;
    content = content.replace("⚡ Local Engine Active (Cloud AI Unavailable)", "").trim();
  } else if (content.includes("⚡ Local Engine Active")) {
    const parts = content.split("⚡ Local Engine Active");
    content = parts[0].trim();
    if (parts.length > 1) {
      hasFallbackFooter = true;
    }
  }

  return (
    <div className="prose prose-sm max-w-none text-ink-700 leading-relaxed space-y-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      {hasFallbackFooter && (
        <div className="mt-3 pt-2 border-t border-ink-100 flex items-center">
          <span className="text-[10px] font-semibold text-warning-600 bg-warning-50 px-2 py-0.5 rounded-full">
            ⚡ Local Engine Active (Cloud AI Unavailable)
          </span>
        </div>
      )}
    </div>
  );
};

const ChatInterface = ({
  messages,
  isChatEmpty,
  loading,
  askAI,
  copyToClipboard,
  copiedId,
  messagesEndRef,
  question,
  setQuestion,
  handleKeyDown
}) => {

  const handleSendClick = () => {
    if (question.trim() && !loading) {
      askAI(question);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden">
      {/* Sidebar Conversation List (Bolt UI Styling) */}
      <div className="hidden xl:flex flex-col w-72 border-r border-ink-200/70 bg-white shrink-0">
        <div className="p-4 border-b border-ink-200/70">
          <button 
            onClick={() => setQuestion('')}
            className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 bg-primary-600 text-white px-4 py-2.5 hover:bg-primary-700 active:scale-[0.98] shadow-sm hover:shadow-glow"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Recent Chats</p>
          {[
            { title: messages.length > 1 ? messages[1]?.content?.substring(0, 30) + '...' : 'Career Copilot Session', active: true },
            { title: 'Resume Review Advice', active: false },
            { title: 'System Design Study Plan', active: false },
          ].map((c, i) => (
            <button
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-600 font-medium transition-all duration-200 w-full text-left cursor-pointer ${
                c.active ? 'bg-primary-50 text-primary-700' : 'hover:bg-ink-100 hover:text-ink-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-ink-400" />
              <span className="text-sm truncate">{c.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-ink-50/50 relative h-full">
        {/* Messages Thread Container */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6 pb-24">
          <div className="max-w-3xl mx-auto space-y-6">
            {isChatEmpty ? (
              <div className="py-8 sm:py-16 text-center animate-fade-in">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 mx-auto animate-pulse-soft">
                  <Sparkles className="w-7 h-7 text-primary-600" />
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink-900 mt-6 tracking-tight">
                  Unlock Your Career Potential
                </h1>
                <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto">
                  Receive personalized learning paths, resume optimization, mock interviews, and
                  technical gap analysis driven by cooperative AI agents.
                </p>

                {/* Suggested Questions */}
                <div className="mt-10 max-w-xl mx-auto text-left">
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3 text-center">Suggested Questions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        className="card p-3 text-left text-sm text-ink-700 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200 cursor-pointer text-balance"
                        onClick={() => askAI(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 animate-fade-in ${msg.sender === "user" ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Icon Column */}
                    <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${
                      msg.sender === "ai" ? 'bg-primary-50 text-primary-600' : 'bg-ink-200 text-ink-700'
                    }`}>
                      {msg.sender === "ai" ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                    </div>

                    {/* Bubble Content */}
                    <div className="flex-1 min-w-0 max-w-[85%]">
                      <div className={`rounded-2xl p-4 border border-ink-200/70 shadow-soft bg-white ${
                        msg.sender === "user" ? 'border-primary-100 bg-primary-50/10' : ''
                      }`}>
                        {msg.sender === "ai" ? (
                          <MentorMessageFormatter text={msg.text} />
                        ) : (
                          <p className="text-sm text-ink-800 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        )}
                      </div>
                      
                      {/* Copy Action button under AI message */}
                      {msg.sender === "ai" && (
                        <div className="flex items-center justify-end mt-1.5 px-2">
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-400 hover:text-ink-600 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <><Check className="w-3.5 h-3.5 text-success-500" /> Copied!</>
                            ) : (
                              <><Copy className="w-3.5 h-3.5" /> Copy Advice</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-50 text-primary-600 shrink-0">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                    <div className="card p-4 bg-white border border-ink-200/70 shadow-soft">
                      <div className="flex gap-1.5 py-1 px-1 items-center">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink-50/90 via-ink-50/70 to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center card border border-ink-200 shadow-card bg-white p-1 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all duration-200">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Career AI anything..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none"
                disabled={loading}
              />
              <button
                onClick={handleSendClick}
                disabled={loading || !question.trim()}
                className="btn-primary w-9 h-9 p-0 flex items-center justify-center rounded-lg disabled:opacity-40 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
