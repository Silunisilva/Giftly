"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  RefreshCw,
  Gift,
  HelpCircle,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { RecommendationMatch } from "@/types";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  recommendations?: RecommendationMatch[];
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: "Hello! I'm your Giftly Discovery Assistant. Tell me who you are shopping for, the occasion, their interests, or your budget (e.g. *“I need a birthday gift for my girlfriend under LKR 5,000, she loves skincare and flowers”*), and I'll find matching items from verified Sri Lankan shops!"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Birthday gift for my sister around 4000 who likes cute stationery and sweets",
    "Luxury wellness spa gift set for mom's birthday under 8000",
    "Romantic anniversary surprise flowers for girlfriend under 5000",
    "Gourmet coffee and leather gift for my boyfriend"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/gift-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();

      if (json.success) {
        const assistantMsg: Message = {
          id: `ast-${Date.now()}`,
          sender: "assistant",
          text: json.data.aiMessage,
          recommendations: json.data.recommendations,
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "assistant",
            text: "I couldn't process that query right now. Please try again or rephrase your request!"
          }
        ]);
      }
    } catch (err) {
      console.error("AI chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 fill-rose-500" />
          <span>Intelligent Gift Assistant</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Conversational Gift Finder
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Describe the person in your own words. We search our database of real Sri Lankan shops to give you reasoned suggestions.
        </p>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-subtle space-y-6 min-h-[450px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "assistant" && (
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div className={`space-y-4 max-w-[85%] ${msg.sender === "user" ? "text-right" : ""}`}>
              <div
                className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-stone-900 text-white rounded-br-none ml-auto"
                    : "bg-stone-50 text-stone-800 rounded-tl-none border border-stone-100"
                }`}
              >
                {msg.text}
              </div>

              {/* Render Matching Products if Assistant response returned recommendations */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="space-y-3 pt-2 text-left">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    Verified Database Matches:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {msg.recommendations.slice(0, 4).map((match) => (
                      <ProductCard
                        key={match.product.id}
                        product={match.product}
                        matchScore={match.score}
                        matchReason={match.reasons[0]}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="w-9 h-9 rounded-2xl bg-stone-200 text-stone-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-rose-600 font-semibold p-4 bg-rose-50/50 rounded-2xl max-w-xs animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AI is finding top gifts from local shops...</span>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-stone-400 block">Example prompt ideas:</span>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-xs bg-white hover:bg-rose-50 hover:text-rose-700 text-stone-600 px-3 py-1.5 rounded-full border border-stone-200 transition-all text-left shadow-2xs"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative bg-white rounded-3xl border border-stone-200 shadow-card p-2 focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-100 transition-all flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI: 'I need a birthday gift for my sister around 4000 who likes skincare'..."
          className="w-full pl-4 pr-2 py-2 text-xs sm:text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs rounded-2xl shadow-sm hover:opacity-95 transition-opacity disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      <DisclaimerBanner />
    </div>
  );
}
