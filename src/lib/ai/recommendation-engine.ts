import { Product, RecommendationMatch } from "@/types";
import { db } from "@/lib/db";

export interface ParsedGiftQuery {
  recipient?: string;
  occasion?: string;
  targetBudget?: number;
  minBudget?: number;
  maxBudget?: number;
  interests: string[];
  giftStyles: string[];
  rawKeywords: string[];
}

// ---------------------------
// Natural Language Extractor
// ---------------------------
export function parseNaturalLanguageQuery(query: string): ParsedGiftQuery {
  const q = query.toLowerCase();

  // 1. Budget extraction (e.g. "under 5000", "under lkr 5,000", "around 5000", "5000 to 10000", "budget 5k")
  let targetBudget: number | undefined = undefined;
  let minBudget: number | undefined = undefined;
  let maxBudget: number | undefined = undefined;

  const kMatch = q.match(/under\s*(\d+)k/i) || q.match(/below\s*(\d+)k/i) || q.match(/around\s*(\d+)k/i);
  if (kMatch) {
    targetBudget = parseInt(kMatch[1], 10) * 1000;
    maxBudget = targetBudget;
  }

  const rangeMatch = q.match(/(\d+[\d,]*)\s*(?:to|-)\s*(\d+[\d,]*)/);
  if (rangeMatch) {
    minBudget = parseInt(rangeMatch[1].replace(/,/g, ""), 10);
    maxBudget = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
    targetBudget = maxBudget;
  } else {
    const underMatch = q.match(/(?:under|below|less than|within|around|budget of|max)\s*(?:lkr|rs\.?|rs)?\s*(\d+[\d,]*)/i);
    if (underMatch) {
      targetBudget = parseInt(underMatch[1].replace(/,/g, ""), 10);
      maxBudget = targetBudget;
    }
  }

  // 2. Recipient extraction
  const recipients = [
    "girlfriend", "boyfriend", "wife", "husband", "mom", "mother", "dad", "father",
    "sister", "brother", "friend", "bestie", "colleague", "boss", "couple", "baby", "child"
  ];
  let foundRecipient: string | undefined;
  for (const r of recipients) {
    if (new RegExp(`\\b${r}\\b`, "i").test(q)) {
      foundRecipient = r === "mother" ? "Mom" : r === "father" ? "Dad" : r.charAt(0).toUpperCase() + r.slice(1);
      break;
    }
  }

  // 3. Occasion extraction
  const occasions = [
    { name: "Birthday", keywords: ["birthday", "bday", "born"] },
    { name: "Anniversary", keywords: ["anniversary", "years together"] },
    { name: "Valentine's Day", keywords: ["valentine", "valentines", "vday"] },
    { name: "Graduation", keywords: ["graduation", "grad", "graduated", "convocation"] },
    { name: "Mother's Day", keywords: ["mother's day", "mothers day"] },
    { name: "Father's Day", keywords: ["father's day", "fathers day"] },
    { name: "Wedding", keywords: ["wedding", "marriage", "bride", "groom"] },
    { name: "Housewarming", keywords: ["housewarming", "new home", "apartment"] },
    { name: "Thank You", keywords: ["thank you", "thanks", "appreciation"] },
    { name: "Get Well Soon", keywords: ["get well", "sick", "hospital", "recovery"] },
  ];
  let foundOccasion: string | undefined;
  for (const occ of occasions) {
    if (occ.keywords.some(k => q.includes(k))) {
      foundOccasion = occ.name;
      break;
    }
  }

  // 4. Interests
  const possibleInterests = [
    "flowers", "roses", "skincare", "beauty", "spa", "ayurveda", "chocolate", "chocolates",
    "cake", "sweets", "coffee", "tea", "perfume", "fragrance", "scent", "candle", "candles",
    "jewellery", "jewelry", "plants", "succulents", "stationery", "journal", "leather",
    "handloom", "ceramics", "pottery", "books", "art", "photography", "tech"
  ];
  const foundInterests: string[] = [];
  for (const interest of possibleInterests) {
    if (q.includes(interest)) {
      foundInterests.push(interest.charAt(0).toUpperCase() + interest.slice(1));
    }
  }

  // 5. Gift Styles
  const styleKeywords = [
    { style: "Romantic", keywords: ["romantic", "love", "heart"] },
    { style: "Cute", keywords: ["cute", "adorable", "sweet", "pretty", "pastel"] },
    { style: "Useful", keywords: ["useful", "practical", "daily", "work"] },
    { style: "Luxurious", keywords: ["luxurious", "luxury", "premium", "fancy", "royal", "gold"] },
    { style: "Personalized", keywords: ["personalized", "custom", "engraved", "initial"] },
    { style: "Surprising", keywords: ["surprise", "unique", "quirky", "special"] },
  ];
  const foundStyles: string[] = [];
  for (const s of styleKeywords) {
    if (s.keywords.some(k => q.includes(k))) {
      foundStyles.push(s.style);
    }
  }

  const rawKeywords = q
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !["for", "the", "and", "under", "with", "her", "his", "around"].includes(word));

  return {
    recipient: foundRecipient,
    occasion: foundOccasion,
    targetBudget,
    minBudget,
    maxBudget,
    interests: foundInterests,
    giftStyles: foundStyles,
    rawKeywords,
  };
}

// ----------------------------------------------------
// Recommendation Scoring Engine
// Budget: 30%, Occasion: 20%, Recipient: 20%, Interest: 20%, Style/Category: 10%
// ----------------------------------------------------
export function calculateProductMatchScore(product: Product, parsed: ParsedGiftQuery): RecommendationMatch {
  let budgetScore = 0;
  let occasionScore = 0;
  let recipientScore = 0;
  let interestScore = 0;
  let categoryScore = 0;
  const reasons: string[] = [];

  // 1. Budget Match (Max 30 pts)
  if (parsed.maxBudget !== undefined) {
    if (product.price <= parsed.maxBudget) {
      if (product.price >= parsed.maxBudget * 0.6) {
        budgetScore = 30; // perfect sweet spot
        reasons.push(`Priced at LKR ${product.price.toLocaleString()}, fitting right within your LKR ${parsed.maxBudget.toLocaleString()} budget`);
      } else {
        budgetScore = 24; // well under budget
        reasons.push(`Great value at LKR ${product.price.toLocaleString()} (comfortably below your LKR ${parsed.maxBudget.toLocaleString()} budget)`);
      }
    } else if (product.price <= parsed.maxBudget * 1.15) {
      budgetScore = 15; // slightly over by 15%
    } else {
      budgetScore = 5;
    }
  } else {
    budgetScore = 25; // neutral full baseline
  }

  // 2. Recipient Match (Max 20 pts)
  if (parsed.recipient) {
    const isDirectMatch = product.recipientTypes.some(r => r.toLowerCase() === parsed.recipient!.toLowerCase());
    if (isDirectMatch) {
      recipientScore = 20;
      reasons.push(`Specially suited and trending for ${parsed.recipient}s`);
    } else {
      recipientScore = 8;
    }
  } else {
    recipientScore = 15;
  }

  // 3. Occasion Match (Max 20 pts)
  if (parsed.occasion) {
    const isDirectOccasion = product.occasions.some(o => o.toLowerCase() === parsed.occasion!.toLowerCase());
    if (isDirectOccasion) {
      occasionScore = 20;
      reasons.push(`Perfect for ${parsed.occasion} celebrations`);
    } else {
      occasionScore = 8;
    }
  } else {
    occasionScore = 15;
  }

  // 4. Interest / Keyword Match (Max 20 pts)
  const productSearchable = [
    product.name,
    product.description,
    product.category,
    ...product.tags,
    ...product.interests,
  ].join(" ").toLowerCase();

  let interestHits = 0;
  if (parsed.interests.length > 0) {
    for (const interest of parsed.interests) {
      if (productSearchable.includes(interest.toLowerCase())) {
        interestHits++;
      }
    }
    const ratio = interestHits / parsed.interests.length;
    interestScore = Math.min(20, Math.round(ratio * 20));
    if (interestHits > 0) {
      reasons.push(`Matches interest in ${parsed.interests.slice(0, 2).join(" & ")}`);
    }
  } else {
    // Check raw keywords
    let keywordHits = 0;
    for (const kw of parsed.rawKeywords) {
      if (productSearchable.includes(kw)) {
        keywordHits++;
      }
    }
    interestScore = Math.min(20, keywordHits * 6);
  }

  // 5. Gift Style Match (Max 10 pts)
  if (parsed.giftStyles.length > 0) {
    const styleHits = parsed.giftStyles.filter(s =>
      product.giftTypes.some(gt => gt.toLowerCase() === s.toLowerCase())
    ).length;
    if (styleHits > 0) {
      categoryScore = 10;
      reasons.push(`Matches the requested ${parsed.giftStyles.join("/")} style`);
    } else {
      categoryScore = 4;
    }
  } else {
    categoryScore = 8;
  }

  // Total percentage capped at 98% (realistic recommendation score)
  const rawTotal = budgetScore + recipientScore + occasionScore + interestScore + categoryScore;
  const score = Math.min(98, Math.max(45, rawTotal));

  // Fallback reason if empty
  if (reasons.length === 0) {
    reasons.push("Matches curated gift category and top customer popularity");
  }

  return {
    product,
    score,
    breakdown: {
      budget: budgetScore,
      occasion: occasionScore,
      recipient: recipientScore,
      interest: interestScore,
      category: categoryScore,
    },
    reasons,
  };
}

// ----------------------------------------------------
// Main Recommendation Search Function
// ----------------------------------------------------
export function findGiftRecommendations(
  query: string,
  explicitParams?: {
    recipient?: string;
    occasion?: string;
    budget?: number;
    interests?: string[];
    giftStyle?: string;
  }
): RecommendationMatch[] {
  const parsed = parseNaturalLanguageQuery(query);

  if (explicitParams?.recipient) parsed.recipient = explicitParams.recipient;
  if (explicitParams?.occasion) parsed.occasion = explicitParams.occasion;
  if (explicitParams?.budget) {
    parsed.targetBudget = explicitParams.budget;
    parsed.maxBudget = explicitParams.budget;
  }
  if (explicitParams?.interests && explicitParams.interests.length > 0) {
    parsed.interests = Array.from(new Set([...parsed.interests, ...explicitParams.interests]));
  }
  if (explicitParams?.giftStyle) {
    parsed.giftStyles = Array.from(new Set([...parsed.giftStyles, explicitParams.giftStyle]));
  }

  // Get all active products from Pure Node DB
  const { products } = db.getProducts({ limit: 100 });

  // Score all products
  const scored = products.map(p => calculateProductMatchScore(p, parsed));

  // Sort by highest match score
  scored.sort((a, b) => b.score - a.score);

  return scored;
}

// ----------------------------------------------------
// "I Don't Know What to Buy" Quiz Engine
// ----------------------------------------------------
export interface QuizAnswers {
  recipient: string;
  occasion: string;
  budget: number;
  interests: string[];
  giftStyle: string;
}

export function generateQuizRecommendations(answers: QuizAnswers): {
  giftStyleTitle: string;
  giftStyleDescription: string;
  recommendations: RecommendationMatch[];
} {
  const query = `${answers.occasion} gift for ${answers.recipient} under ${answers.budget} ${answers.interests.join(" ")} ${answers.giftStyle}`;

  const results = findGiftRecommendations(query, {
    recipient: answers.recipient,
    occasion: answers.occasion,
    budget: answers.budget,
    interests: answers.interests,
    giftStyle: answers.giftStyle,
  });

  // Determine Persona Title
  let giftStyleTitle = "Thoughtful & Curated";
  let giftStyleDescription = "A well-balanced selection combining utility with heartfelt emotional warmth.";

  if (answers.giftStyle === "Romantic") {
    giftStyleTitle = "Thoughtful + Romantic ❤️";
    giftStyleDescription = "Gifts that speak to the heart, celebrate your bond, and create unforgettable memories together.";
  } else if (answers.giftStyle === "Cute") {
    giftStyleTitle = "Playful + Aesthetic ✨";
    giftStyleDescription = "Charming, pastel, delightful surprises that bring instant smiles and elevate their daily space.";
  } else if (answers.giftStyle === "Luxurious") {
    giftStyleTitle = "Regal + Indulgent 💎";
    giftStyleDescription = "Finely crafted, opulent treasures made with premium Ceylon botanical elements and timeless materials.";
  } else if (answers.giftStyle === "Useful") {
    giftStyleTitle = "Functional + Refined ☕";
    giftStyleDescription = "Practical daily essentials and artisanal craftsmanship they will reach for every single day.";
  } else if (answers.giftStyle === "Personalized") {
    giftStyleTitle = "Unique + Sentimental 🏷️";
    giftStyleDescription = "Customized treasures carrying personal initials, dates, and bespoke memories crafted just for them.";
  }

  return {
    giftStyleTitle,
    giftStyleDescription,
    recommendations: results.slice(0, 6),
  };
}
