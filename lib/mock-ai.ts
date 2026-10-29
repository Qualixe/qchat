/**
 * MOCK AI RESPONDER — predefined, keyword-matched replies used by the AI
 * Assistant preview and test chat. No AI model or external API is called.
 */
import type { AiAssistantConfig, Language } from "@/lib/types";

type Intent = "delivery" | "price" | "returns" | "availability" | "complaint" | "refund" | "greeting" | "fallback";
type ResolvedLanguage = Exclude<Language, "auto">;

const INTENT_KEYWORDS: [Intent, RegExp][] = [
  ["complaint", /(broken|damaged|bad|worst|angry|disappoint|ভাঙা|খারাপ|baje|kharap)/i],
  ["refund", /(refund|money back|ferot|ফেরত)/i],
  ["delivery", /(deliver|shipping|courier|charge|ডেলিভারি|delivery)/i],
  ["returns", /(return|exchange|change size|বদল)/i],
  ["availability", /(available|stock|size|ache|আছে)/i],
  ["price", /(price|cost|dam|koto|দাম|কত)/i],
  ["greeting", /^(hi|hello|hey|assalamu|salam|হাই|হ্যালো)/i],
];

const RESPONSES: Record<Intent, Record<ResolvedLanguage, string[]>> = {
  delivery: {
    en: ["Delivery is ৳60 inside Dhaka and ৳120 outside Dhaka.", "Orders above ৳5,000 ship free, and most arrive within 1–2 days in Dhaka."],
    bn: ["ঢাকার ভেতরে ডেলিভারি চার্জ ৳৬০ এবং ঢাকার বাইরে ৳১২০।", "৳৫,০০০ এর বেশি অর্ডারে ডেলিভারি ফ্রি, ঢাকায় সাধারণত ১–২ দিনে পৌঁছে যায়।"],
    banglish: ["Dhaka r moddhe delivery charge ৳60, Dhaka r baire ৳120.", "৳5,000 er upore order hole delivery free, Dhaka te 1–2 din lage."],
  },
  price: {
    en: ["Our Indigo Block-Print Kurti is ৳1,850 right now (down from ৳2,200).", "Prices for every item are shown in the catalog, and I can share a quick comparison if you like."],
    bn: ["ইন্ডিগো ব্লক-প্রিন্ট কুর্তির দাম এখন ৳১,৮৫০ (আগে ছিল ৳২,২০০)।", "চাইলে আমি অন্য পণ্যের দামও জানাতে পারি।"],
    banglish: ["Indigo Block-Print Kurti er dam ekhon ৳1,850 (age chilo ৳2,200).", "Chaile onno product er dam o janate pari."],
  },
  returns: {
    en: ["You can exchange or return items within 7 days of delivery.", "Items need to be unused with tags attached — I can start an exchange for you right now."],
    bn: ["ডেলিভারির ৭ দিনের মধ্যে পণ্য বদল বা ফেরত দেওয়া যায়।", "পণ্যটি অব্যবহৃত ও ট্যাগসহ থাকতে হবে — চাইলে এখনই এক্সচেঞ্জ শুরু করে দিতে পারি।"],
    banglish: ["Delivery r 7 diner moddhe exchange ba return kora jay.", "Product unused ar tag shoho thakte hobe — chaile ekhoni exchange start kore dite pari."],
  },
  availability: {
    en: ["Yes, that item is in stock in sizes S–XL.", "Would you like me to reserve one for you while you decide?"],
    bn: ["হ্যাঁ, পণ্যটি S–XL সাইজে স্টকে আছে।", "চাইলে আপনার জন্য একটি রিজার্ভ করে রাখতে পারি।"],
    banglish: ["Haan, product ta S–XL size e stock e ache.", "Chaile apnar jonno ekta reserve kore rakhte pari."],
  },
  complaint: {
    en: ["I'm really sorry about this experience.", "Could you share a photo so we can arrange a replacement right away?"],
    bn: ["এই অভিজ্ঞতার জন্য আমরা আন্তরিকভাবে দুঃখিত।", "একটা ছবি পাঠালে আমরা এখনই রিপ্লেসমেন্টের ব্যবস্থা করব।"],
    banglish: ["Ei experience er jonno amra sotti dukkhito.", "Ekta chobi pathale amra ekhoni replacement er bebostha korbo."],
  },
  refund: {
    en: ["Refunds are processed within 3–5 working days after the item is picked up.", "The amount goes back to your original payment method."],
    bn: ["পণ্য পিকআপের পর ৩–৫ কর্মদিবসের মধ্যে রিফান্ড দেওয়া হয়।", "টাকা আপনার আগের পেমেন্ট মাধ্যমে ফেরত যাবে।"],
    banglish: ["Product pickup er por 3–5 working days er moddhe refund deya hoy.", "Taka apnar age payment method e ferot jabe."],
  },
  greeting: {
    en: ["How can I help you today?", "I can answer questions about products, prices, delivery, and orders."],
    bn: ["আজ কীভাবে সাহায্য করতে পারি?", "পণ্য, দাম, ডেলিভারি বা অর্ডার নিয়ে যেকোনো প্রশ্ন করুন।"],
    banglish: ["Aj kivabe help korte pari?", "Product, dam, delivery ba order niye je kono proshno korun."],
  },
  fallback: {
    en: ["Thanks for your message!", "Let me check that for you — could you share a little more detail?"],
    bn: ["আপনার মেসেজের জন্য ধন্যবাদ!", "একটু বিস্তারিত জানালে আমি দেখে জানাচ্ছি।"],
    banglish: ["Message er jonno dhonnobad!", "Ektu details janale ami dekhe janacchi."],
  },
};

const VOICE_OPENERS: Record<AiAssistantConfig["voice"], Record<ResolvedLanguage, string>> = {
  friendly: { en: "Hi there! 😊", bn: "হ্যালো! 😊", banglish: "Hi! 😊" },
  professional: { en: "Hello, thank you for reaching out.", bn: "আসসালামু আলাইকুম, যোগাযোগের জন্য ধন্যবাদ।", banglish: "Assalamu alaikum, jogajog korar jonno dhonnobad." },
  playful: { en: "Hey hey! ✨", bn: "হেই! ✨", banglish: "Hey hey! ✨" },
  concise: { en: "", bn: "", banglish: "" },
};

const CLOSERS: Record<ResolvedLanguage, string> = {
  en: "Is there anything else I can help you with?",
  bn: "আর কিছু জানতে চাইলে বলুন।",
  banglish: "Ar kichu jante chaile bolun.",
};

export function detectLanguage(text: string): ResolvedLanguage {
  if (/[ঀ-৿]/.test(text)) return "bn";
  if (/\b(koto|ache|kobe|ki|kivabe|dam|lagbe|pabo|hobe|bhai|apu|ta)\b/i.test(text)) return "banglish";
  return "en";
}

function detectIntent(text: string): Intent {
  return INTENT_KEYWORDS.find(([, pattern]) => pattern.test(text.trim()))?.[0] ?? "fallback";
}

export interface MockAiReply {
  text: string;
  handoff: boolean;
  intent: Intent;
  language: ResolvedLanguage;
}

export function mockAiReply(question: string, config: AiAssistantConfig): MockAiReply {
  const language = config.language === "auto" ? detectLanguage(question) : config.language;
  const intent = detectIntent(question);

  const shouldHandoff =
    (intent === "complaint" && config.handoff.onComplaint) || (intent === "refund" && config.handoff.onRefundRequest);

  // FAQ answers (English) take priority when a question closely matches.
  const faq = config.faqs.find((f) => {
    const words = f.question.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
    return words.length > 0 && words.filter((w) => question.toLowerCase().includes(w)).length >= 2;
  });

  let sentences = faq ? [faq.answer] : [...RESPONSES[intent][language]];
  if (config.responseLength === "short") sentences = sentences.slice(0, 1);
  if (config.responseLength === "detailed") sentences = [...sentences, CLOSERS[language]];
  if (shouldHandoff) sentences = [...sentences.slice(0, 1), config.handoff.handoffMessage];

  const opener = VOICE_OPENERS[config.voice][language];
  const text = [opener, ...sentences].filter(Boolean).join(" ");
  return { text, handoff: shouldHandoff, intent, language };
}
