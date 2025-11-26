import { useState, useRef, useEffect } from "preact/hooks";
import { Message } from "../types";
import Markdown from 'markdown-to-jsx';
import { Send, Sparkles, Zap, Battery, Shield, HelpCircle, Car, Info, User, Bot, ChevronDown, ChevronRight } from 'lucide-preact';

const MAX_MESSAGES = 10;
const MAX_QUESTION_LENGTH = 200;

const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);

  useEffect(() => {
    index.current = 0;
    setDisplayedText("");

    // Calculate speed based on length to keep total time reasonable
    // Short: 20ms, Medium: 10ms, Long: 5ms, Very Long: 2ms
    let speed = 20;
    if (text.length > 500) speed = 2;
    else if (text.length > 200) speed = 5;
    else if (text.length > 100) speed = 10;

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index.current < text.length) {
          // For very long texts, add multiple characters per tick to keep up
          const charsToAdd = text.length > 1000 ? 3 : 1;
          const nextChars = text.slice(index.current, index.current + charsToAdd);
          index.current += charsToAdd;
          return prev + nextChars;
        } else {
          clearInterval(intervalId);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [text]);

  return <Markdown options={{ forceBlock: true }}>{displayedText}</Markdown>;
};

const INSPIRATION_CATEGORIES = [
  {
    title: "General",
    icon: <Info className="w-5 h-5 text-blue-500" />,
    questions: [
      { label: "Tell me about...", prompt: "what is an electric vehicle?" },
      { label: "What is an EV?", prompt: "what is an electric vehicle?" },
      { label: "What are the benefits of EVs?", prompt: "what are the benefits of electric vehicles?" },
      { label: "What are the disadvantages of EVs?", prompt: "What are the disadvantages of electric vehicles?" },
      { label: "What does it feel like driving an EV?", prompt: "what does it feel like driving an electric vehicle?" }
    ]
  },
  {
    title: "Charging",
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    questions: [
      { label: "How do I charge an EV?", prompt: "How do I charge an EV?" },
      { label: "How long does it take to fully recharge?", prompt: "How long does it take to fully recharge an EV?" },
      { label: "What equipment do I need?", prompt: "What equipment do I need to charge an electric vehicle?" },
      { label: "What type of charging cable do I need?", prompt: "What type of charging cable do I need to charge my electric vehicle?" },
      { label: "Is the cable protected from theft?", prompt: "Is the vehicle and charge cable protected from theft during charging?" },
      { label: "Is a home charger included?", prompt: "Is a home charger included in the price of a vehicle?" },
      { label: "Can I charge at any public station?", prompt: "Can I charge my EV at any public charging station?" },
      { label: "Tethered vs Untethered home charger?", prompt: "Does a home charger come tethered or untethered?" },
      { label: "What is timed-charging?", prompt: "What is a timed-charging-feature?" },
      { label: "Who installs home chargers?", prompt: "What companies provide home charging installations?" },
      { label: "How much does it cost to charge?", prompt: "How much does it cost to charge an electric vehicle?" },
      { label: "Why rapid charge only to 80%?", prompt: "Why can I only rapid charge an electric vehicle to 80% instead of 100%?" },
      { label: "What if the battery runs out?", prompt: "If a battery runs out of charge, what will happen to the car?" },
      { label: "What is Level 1/2/3 charging?", prompt: "What is Level 1, Level 2, and Level 3 charging?" }
    ]
  },
  {
    title: "Technical",
    icon: <Car className="w-5 h-5 text-green-500" />,
    questions: [
      { label: "What is the range of an EV?", prompt: "What is the range of an electric vehicle?" },
      { label: "What is Range Anxiety?", prompt: "What is Range Anxiety?" },
      { label: "Will I have enough range?", prompt: "Will my electric vehicle have enough range for my journey?" },
      { label: "What affects EV range?", prompt: "What factors affect the range of an Electric Vehicle?" },
      { label: "What is regenerative braking?", prompt: "What is regenerative braking?" },
      { label: "What is one-pedal driving?", prompt: "What is one-pedal driving?" },
      { label: "Do all EVs have one-pedal driving?", prompt: "Do all EVs have one-pedal driving?" },
      { label: "Handling vs ICE vehicles?", prompt: "How does the EV handling compare to a conventional ICE vehicle?" },
      { label: "How does it warm up without an engine?", prompt: "Without an engine, how does an electric vehicle warm up the interior?" },
      { label: "Does every EV have a heat pump?", prompt: "Does every EV come with a heat pump?" },
      { label: "Cabin pre-conditioning?", prompt: "Does every EV have cabin pre-warming/cooling or pre-conditioning?" },
      { label: "Battery warming/cooling?", prompt: "Does every EV have battery warming/cooling?" },
      { label: "Li-ion vs LFP batteries?", prompt: "What is the difference between Li-ion and LFP batteries?" },
      { label: "Can EVs tow?", prompt: "Can electric vehicles tow at all?" },
      { label: "Are EVs harder to maintain?", prompt: "Are EVs more difficult to maintain?" }
    ]
  },
  {
    title: "Safety",
    icon: <Shield className="w-5 h-5 text-red-500" />,
    questions: [
      { label: "Are Electric Vehicles safe?", prompt: "Are Electric Vehicles safe?" },
      { label: "What happens in a flood?", prompt: "What happens if the electric vehicle is caught in a flood?" },
      { label: "Can I charge in the rain?", prompt: "Can I charge an electric vehicle outdoors in the rain?" }
    ]
  },
  {
    title: "Other",
    icon: <HelpCircle className="w-5 h-5 text-purple-500" />,
    questions: [
      { label: "What does ICE stand for?", prompt: "What does ICE stand for, in the context of electric vehicles?" },
      { label: "What is BEV?", prompt: "What does BEV stand for, in the context of electric vehicles?" },
      { label: "What warranty do I get?", prompt: "What warranty do I get on an electric vehicle?" },
      { label: "What is that droning noise?", prompt: "What is the external droning noise when driving an electric vehicle slowly, what is the vehicle audio alert systems?" },
      { label: "What is SoC?", prompt: "What is SoC, state-of-charge, in the context of electric vehicles?" },
      { label: "What is V2G, V2H, V2L?", prompt: "What does V2G, V2H and V2L stand for, in the context of electric vehicles?" }
    ]
  }
];

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([0]));
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (index: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, showSuggestions]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const question = { role: "user" as const, content: text };
    setMessages(prev => [...prev, question]);
    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, question].slice(-MAX_MESSAGES)),
      });

      if (!response.ok) {
        let errorMessage = `Server responded with ${response.status}`;
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.details) errorMessage = errorData.details;
          else if (errorData.error) errorMessage = errorData.error;
        } catch {
          errorMessage += `: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const text = await response.text();
      let reply: Message;
      try {
        reply = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON response:", text);
        throw new Error("Invalid response from server");
      }

      const answer = {
        role: "assistant" as const,
        content: reply.content,
      };

      setMessages(prev => [...prev, answer]);
    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message || "Sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: JSX.TargetedEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background shadow-xl border-x border-border">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">EV Life Chat</h1>
            <p className="text-xs text-muted-foreground font-medium">Your AI Guide to Electric Vehicles</p>
          </div>
        </div>
        <div className="text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded-full font-medium">
          Beta
        </div>
      </header>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth" ref={chatWindowRef}>
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome to EV Life Chat
              </h2>
              <p className="text-muted-foreground text-lg">
                I can help you understand everything about Electric Vehicles.
                <br /> Choose a topic below to get started, or enter your own question
              </p>
            </div>

            <div className="space-y-6">
              {INSPIRATION_CATEGORIES.map((category, idx) => (
                <div key={idx} className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <button
                    onClick={() => toggleCategory(idx)}
                    className="flex items-center gap-2 w-full text-left hover:opacity-70 transition-opacity"
                  >
                    {expandedCategories.has(idx) ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                    {category.icon}
                    <h3 className="font-semibold text-foreground">{category.title}</h3>
                  </button>
                  {expandedCategories.has(idx) && (
                    <div className="flex flex-wrap gap-2 ml-7 animate-in fade-in slide-in-from-top-2 duration-300">
                      {category.questions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => sendMessage(q.prompt)}
                          disabled={loading}
                          className="text-sm bg-secondary/50 hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-full transition-colors duration-200 text-left"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex w-full items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in-up`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}

                <div
                  className={`flex max-w-[80%] sm:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm ${m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border border-border text-card-foreground rounded-bl-none"
                    }`}
                >
                  <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert' : ''}`}>
                    {m.role === 'assistant' && i === messages.length - 1 && !loading ? (
                      <Typewriter text={m.content} />
                    ) : (
                      <Markdown options={{ forceBlock: true }}>{m.content}</Markdown>
                    )}
                  </div>
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-end gap-2 animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto relative">
          {showSuggestions && (
            <div className="absolute bottom-full left-0 right-0 mb-4 bg-card border border-border rounded-xl shadow-xl p-4 animate-in slide-in-from-bottom-2 fade-in duration-200 z-20 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Suggested Topics</h3>
                <button onClick={() => setShowSuggestions(false)} className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {INSPIRATION_CATEGORIES.map((category, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                      {category.icon}
                      {category.title}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.questions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => sendMessage(q.prompt)}
                          disabled={loading}
                          className="text-xs bg-secondary/50 hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full transition-colors duration-200 text-left"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="relative flex items-center shadow-sm rounded-full bg-background ring-1 ring-border focus-within:ring-2 focus-within:ring-ring transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={`p-3 ml-1 rounded-full text-muted-foreground bg-primary/5 hover:text-primary hover:bg-primary/10 transition-colors ${showSuggestions ? 'text-primary bg-primary/10' : ''}`}
              title="Get inspiration"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <input
              id="question"
              className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-base placeholder:text-muted-foreground"
              placeholder="Ask anything about EVs..."
              type="text"
              value={input}
              onInput={(e) => setInput((e.target as any)?.value ?? "")}
              maxLength={MAX_QUESTION_LENGTH}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 mr-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-muted-foreground mt-3">
            AI can make mistakes. Please verify important information.
          </p>
          <p className="text-center text-xs text-muted-foreground results-container">
            Made with &hearts; in <a href="http://madewithlove.in/sydney/" target="_blank" rel="noreferrer">Sydney</a>, Australia.<br />
            &copy; 2023 - <span id="fYear"><noscript>2025</noscript></span>
            <script>document.getElementById("fYear").innerText = new Date().getFullYear();</script> <a href="https://electricvehicle.life">🅴🆅 Life</a> is not part of or affiliated with <a href="https://status.openai.com" target="_blank" rel="noreferrer">OpenAI</a>.<br />
            Open for <a href="https://forms.gle/qEHsmXPGLuV7Dnfr8" target="_blank" rel="noreferrer">sponsorship</a>! Buy me <a href="https://ko-fi.com/halans" target="_blank" rel="noreferrer">a coffee</a>?
            <br />&nbsp;
          </p>
        </div>
      </div>
    </div>
  );
};
