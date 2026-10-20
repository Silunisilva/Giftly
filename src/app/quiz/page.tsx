"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Gift,
  Heart,
  RefreshCw,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { RecommendationMatch } from "@/types";
import { formatLKR } from "@/lib/utils";

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Quiz Form state
  const [recipient, setRecipient] = useState("Girlfriend");
  const [occasion, setOccasion] = useState("Birthday");
  const [budget, setBudget] = useState(5000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Flowers", "Skincare"]);
  const [giftStyle, setGiftStyle] = useState("Romantic");

  // Results state
  const [result, setResult] = useState<{
    giftStyleTitle: string;
    giftStyleDescription: string;
    recommendations: RecommendationMatch[];
  } | null>(null);

  const recipientOptions = [
    { name: "Girlfriend", emoji: "❤️" },
    { name: "Boyfriend", emoji: "⚡" },
    { name: "Mom", emoji: "💐" },
    { name: "Dad", emoji: "👔" },
    { name: "Sister", emoji: "🌸" },
    { name: "Best Friend", emoji: "👯" },
    { name: "Wife", emoji: "💍" },
    { name: "Husband", emoji: "👑" },
    { name: "Colleague", emoji: "💼" },
    { name: "Child", emoji: "🧸" },
  ];

  const occasionOptions = [
    { name: "Birthday", icon: "🎂" },
    { name: "Anniversary", icon: "💍" },
    { name: "Graduation", icon: "🎓" },
    { name: "Valentine's Day", icon: "💖" },
    { name: "Mother's Day", icon: "💐" },
    { name: "Father's Day", icon: "👔" },
    { name: "Wedding", icon: "👰" },
    { name: "Housewarming", icon: "🏡" },
    { name: "Just Because", icon: "✨" },
  ];

  const interestOptions = [
    "Flowers", "Skincare", "Chocolates", "Coffee & Tea", "Cakes", "Perfumes",
    "Jewellery", "Plants", "Stationery", "Books", "Handlooms & Crafts", "Self Care"
  ];

  const styleOptions = [
    { style: "Romantic", desc: "Heartfelt, passionate, memorable", icon: "❤️" },
    { style: "Cute", desc: "Pastel, delightful, aesthetic", icon: "✨" },
    { style: "Useful", desc: "Practical everyday essentials", icon: "☕" },
    { style: "Luxurious", desc: "Premium, royal ayurveda, gemstones", icon: "💎" },
    { style: "Personalized", desc: "Custom initials & keepsakes", icon: "🏷️" },
    { style: "Surprising", desc: "Fun, unique & unexpected", icon: "🎉" },
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter(i => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleCalculateRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          occasion,
          budget,
          interests: selectedInterests,
          giftStyle,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
        setStep(6); // Step 6 = Results
      }
    } catch (err) {
      console.error("Error generating quiz picks:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Quiz Progress & Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full text-xs font-bold text-rose-700">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Interactive Gift Matcher</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          &ldquo;I have no idea what to buy 😭&rdquo;
        </h1>
        <p className="text-stone-500 text-sm max-w-lg mx-auto">
          Answer 5 quick questions and our recommendation engine will discover the ideal gift archetype and matching verified shops!
        </p>

        {/* Progress Bar (if in steps 1 to 5) */}
        {step <= 5 && (
          <div className="max-w-xs mx-auto pt-4 space-y-1.5">
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-bold text-stone-400">Step {step} of 5</span>
          </div>
        )}
      </div>

      {/* STEP 1: Recipient */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-subtle space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Question 1</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Who are you shopping for?</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {recipientOptions.map((opt) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => setRecipient(opt.name)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  recipient === opt.name
                    ? "bg-rose-50 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-200 shadow-sm"
                    : "bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-xs font-semibold">{opt.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Occasion</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Occasion */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-subtle space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Question 2</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">What is the special occasion?</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {occasionOptions.map((opt) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => setOccasion(opt.name)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  occasion === opt.name
                    ? "bg-rose-50 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-200 shadow-sm"
                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-xs font-semibold">{opt.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-xs text-stone-500 hover:text-stone-900 font-semibold"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Budget */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-subtle space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Question 3</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">What is your approximate budget?</h2>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[3000, 5000, 8000, 15000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBudget(preset)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  budget === preset
                    ? "bg-rose-50 border-rose-500 text-rose-900 font-extrabold shadow-sm ring-2 ring-rose-200"
                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50 font-medium"
                }`}
              >
                <span className="text-xs block text-stone-400">Around</span>
                <span className="text-sm font-bold">{formatLKR(preset)}</span>
              </button>
            ))}
          </div>

          {/* Slider for custom value */}
          <div className="p-4 bg-stone-50 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-700">Custom Budget Target:</span>
              <span className="text-base font-extrabold text-rose-600">{formatLKR(budget)}</span>
            </div>
            <input
              type="range"
              min={1500}
              max={25000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 text-xs text-stone-500 hover:text-stone-900 font-semibold"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Interests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Interests */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-subtle space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Question 4</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">What are they interested in?</h2>
            <p className="text-xs text-stone-400">Select one or more topics they enjoy:</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {interestOptions.map((item) => {
              const isSelected = selectedInterests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-4 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {item} {isSelected && "✓"}
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2.5 text-xs text-stone-500 hover:text-stone-900 font-semibold"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <span>Next: Preferred Style</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Gift Style */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-subtle space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Final Question</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">What overall gift vibe do you prefer?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {styleOptions.map((opt) => (
              <button
                key={opt.style}
                type="button"
                onClick={() => setGiftStyle(opt.style)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  giftStyle === opt.style
                    ? "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-200 shadow-sm"
                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                <span className="text-2xl mt-0.5">{opt.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{opt.style}</h4>
                  <p className="text-xs text-stone-500">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2.5 text-xs text-stone-500 hover:text-stone-900 font-semibold"
            >
              &larr; Back
            </button>
            <button
              disabled={loading}
              onClick={handleCalculateRecommendations}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-200 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Matching with Shops..." : "Generate Personalized Gifts"}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: RESULTS */}
      {step === 6 && result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Persona Style Result Banner */}
          <div className="bg-gradient-to-tr from-rose-900 via-stone-900 to-rose-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Calculated Archetype</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {result.giftStyleTitle}
              </h2>
              <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
                {result.giftStyleDescription}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-xs text-stone-300">
                <span className="bg-white/10 px-2.5 py-1 rounded-full">For {recipient}</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-full">{occasion}</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-full">Budget: {formatLKR(budget)}</span>
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center gap-1.5 flex-shrink-0 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>

          {/* Top Recommendations Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Tailored Selections</span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Top Matching Gifts from Verified Shops
                </h3>
              </div>
              <Link
                href="/gifts"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>Browse All Gifts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.recommendations.map((match) => (
                <ProductCard
                  key={match.product.id}
                  product={match.product}
                  matchScore={match.score}
                  matchReason={match.reasons[0]}
                />
              ))}
            </div>
          </div>

          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
}
