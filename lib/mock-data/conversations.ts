import type {
  ChannelId,
  Conversation,
  ConversationPriority,
  ConversationStatus,
  ConversationTopic,
  DeliveryStatus,
  Message,
  MessageAttachment,
  MessageAuthorType,
} from "@/lib/types";
import { minutesAgo } from "./clock";

type MessageSeed = [
  author: MessageAuthorType,
  body: string,
  minutesAgo: number,
  extra?: {
    authorId?: string;
    status?: DeliveryStatus;
    note?: boolean;
    attachment?: MessageAttachment;
  },
];

interface ConversationSeed {
  id: string;
  contactId: string;
  channel: ChannelId;
  status: ConversationStatus;
  priority?: ConversationPriority;
  topic: ConversationTopic;
  assigneeId: string | null;
  unreadCount: number;
  aiHandled: boolean;
  messages: MessageSeed[];
}

const seeds: ConversationSeed[] = [
  {
    id: "cv_1001",
    contactId: "ct_ayesha",
    channel: "messenger",
    status: "open",
    topic: "availability",
    assigneeId: "tm_nadia",
    unreadCount: 2,
    aiHandled: false,
    messages: [
      ["customer", "Hi! Is the Indigo Block-Print Kurti available in size M?", 38],
      [
        "ai",
        "Hi Ayesha! Yes — the Indigo Block-Print Kurti is in stock in size M. It's ৳1,850 right now (usually ৳2,200). Would you like me to reserve one for you?",
        37,
        { status: "read" },
      ],
      ["customer", "Great. Can I get 2 pieces? One for my sister.", 30],
      [
        "agent",
        "Of course! I've noted 2 × size M. Should we deliver to your Dhanmondi address as usual?",
        24,
        { authorId: "tm_nadia", status: "read" },
      ],
      ["agent", "VIP customer — offer free delivery on this order.", 23, { authorId: "tm_nadia", note: true }],
      ["customer", "Yes same address please. Evening delivery hole bhalo hoy 🙏", 6],
      ["customer", "Also do you have matching earrings?", 4],
    ],
  },
  {
    id: "cv_1002",
    contactId: "ct_rahim",
    channel: "whatsapp",
    status: "open",
    priority: "high",
    topic: "order_tracking",
    assigneeId: "tm_farhana",
    unreadCount: 1,
    aiHandled: false,
    messages: [
      ["customer", "Assalamu alaikum. Amar order #NK-1047 ekhono pai nai. 3 din hoye gelo.", 95],
      [
        "ai",
        "Walaikum assalam Rahim bhai! Apnar order #NK-1047 shipped hoyeche — tracking number PTH-88214503. Courier hub e ektu delay dekhacche. Ami ekjon teammate ke janacchi.",
        94,
        { status: "read" },
      ],
      ["system", "AI handed off to Farhana Akter · reason: delivery delay", 94],
      [
        "agent",
        "Rahim bhai, ami courier er sathe kotha bolchi. Aj shondhar moddhe update dicchi, insha'Allah.",
        70,
        { authorId: "tm_farhana", status: "read" },
      ],
      ["customer", "Thik ache, kintu kalke amar dorkar chilo panjabi ta. Please taratari korben.", 12],
    ],
  },
  {
    id: "cv_1003",
    contactId: "ct_maliha",
    channel: "instagram",
    status: "open",
    topic: "product_question",
    assigneeId: null,
    unreadCount: 1,
    aiHandled: true,
    messages: [
      ["customer", "Is the Vitamin C serum okay for sensitive skin?", 32],
      [
        "ai",
        "Great question! Our Vitamin C Brightening Serum is 15% — some sensitive skin types may feel a light tingle. We'd suggest patch testing first, or pairing it with the fragrance-free Aloe Calm Night Cream at night.",
        31,
        { status: "read" },
      ],
      ["customer", "How long does one bottle last?", 27],
      [
        "ai",
        "With 3–4 drops each morning, a 30ml bottle usually lasts around 6–8 weeks.",
        26,
        { status: "delivered" },
      ],
      ["customer", "Okay and what's the price for both together?", 26],
    ],
  },
  {
    id: "cv_1004",
    contactId: "ct_shakil",
    channel: "messenger",
    status: "pending",
    priority: "high",
    topic: "refund",
    assigneeId: "tm_tanvir",
    unreadCount: 0,
    aiHandled: false,
    messages: [
      ["customer", "I received the wrong size tee. I want a refund, not exchange.", 300],
      [
        "ai",
        "Sorry about that, Shakil! I've passed this to our team so they can process your refund request.",
        299,
        { status: "read" },
      ],
      [
        "agent",
        "Hi Shakil, apologies for the mix-up. Our courier will pick up the item tomorrow. The refund goes back to your bKash within 3–5 working days after pickup.",
        240,
        { authorId: "tm_tanvir", status: "read" },
      ],
      ["customer", "Okay. Please confirm when the refund is sent.", 230],
      ["agent", "Pickup scheduled. Waiting for warehouse confirmation before refund.", 60, { authorId: "tm_tanvir", note: true }],
      [
        "agent",
        "Quick update: pickup is done ✅ We'll confirm as soon as the refund is processed.",
        48,
        { authorId: "tm_tanvir", status: "delivered" },
      ],
    ],
  },
  {
    id: "cv_1005",
    contactId: "ct_emily",
    channel: "webchat",
    status: "open",
    topic: "delivery",
    assigneeId: null,
    unreadCount: 3,
    aiHandled: true,
    messages: [
      ["customer", "Hello, do you ship to London?", 100],
      [
        "ai",
        "Hi Emily! International shipping isn't live yet, but we're collecting interest for the UK. Would you like a teammate to check a one-off shipping quote for you?",
        99,
        { status: "read" },
      ],
      ["customer", "Yes please, I'd like the Jamdani saree.", 92],
      ["customer", "How much would shipping roughly cost?", 91],
      ["customer", "And how long would it take?", 90],
    ],
  },
  {
    id: "cv_1006",
    contactId: "ct_tahmid",
    channel: "instagram",
    status: "resolved",
    topic: "pricing",
    assigneeId: "tm_sadia",
    unreadCount: 0,
    aiHandled: true,
    messages: [
      ["customer", "silk scarf er dam koto? gift wrap kora jabe?", 160],
      [
        "ai",
        "Printed Silk Scarf er dam ৳1,350. Haan, gift wrap kora jay — ৳50 extra. Card e message likhe dite chaile bolun!",
        159,
        { status: "read" },
      ],
      ["customer", "Perfect, 1 ta nibo. Card e likhben 'Happy Birthday Apu'", 140],
      [
        "agent",
        "Done! Order confirm kore link pathiye dilam. Thank you Tahmid 🎁",
        125,
        { authorId: "tm_sadia", status: "read" },
      ],
      ["customer", "Thanks!", 120],
    ],
  },
  {
    id: "cv_1007",
    contactId: "ct_nusrat",
    channel: "whatsapp",
    status: "open",
    topic: "pricing",
    assigneeId: "tm_nadia",
    unreadCount: 0,
    aiHandled: false,
    messages: [
      ["customer", "Next month er jonno 20 ta kurti lagbe. Wholesale price ki same thakbe?", 220],
      [
        "agent",
        "Nusrat apu, 20 pcs er upore 12% discount dite parbo. Mint ar Indigo dutoi mix korte parben.",
        200,
        { authorId: "tm_nadia", status: "read" },
      ],
      ["customer", "Sounds good. Catalog ta pathan please.", 190],
      [
        "agent",
        "Catalog attached. Size breakdown ta pathale invoice ready kore dibo.",
        180,
        { authorId: "tm_nadia", status: "read", attachment: { name: "Nokshi-Wholesale-Nov.pdf", kind: "file", size: "2.4 MB" } },
      ],
    ],
  },
  {
    id: "cv_1008",
    contactId: "ct_arif",
    channel: "messenger",
    status: "open",
    priority: "high",
    topic: "complaint",
    assigneeId: "tm_imran",
    unreadCount: 1,
    aiHandled: false,
    messages: [
      ["customer", "আমার অর্ডারের একটা মগ ভাঙা অবস্থায় এসেছে। এটা খুবই হতাশাজনক।", 330],
      [
        "ai",
        "আমরা আন্তরিকভাবে দুঃখিত, আরিফ ভাই। ভাঙা মগের একটা ছবি পাঠাবেন? আমাদের টিমের একজন এখনই বিষয়টি দেখছেন।",
        329,
        { status: "read" },
      ],
      ["system", "AI handed off to Imran Chowdhury · reason: complaint detected", 329],
      [
        "customer",
        "ছবি দিলাম।",
        320,
        { attachment: { name: "broken-mug.jpg", kind: "image", size: "1.1 MB" } },
      ],
      [
        "agent",
        "ধন্যবাদ ছবির জন্য। আমরা বিনামূল্যে নতুন মগ পাঠিয়ে দেব। আগামী ২ দিনের মধ্যে পৌঁছে যাবে।",
        290,
        { authorId: "tm_imran", status: "read" },
      ],
      ["customer", "ঠিক আছে, কিন্তু প্যাকেজিং আরও ভালো করবেন প্লিজ।", 285],
    ],
  },
  {
    id: "cv_1009",
    contactId: "ct_priya",
    channel: "instagram",
    status: "resolved",
    topic: "availability",
    assigneeId: null,
    unreadCount: 0,
    aiHandled: true,
    messages: [
      ["customer", "Organic cotton tee kobe restock hobe?", 1210],
      [
        "ai",
        "Organic Cotton Tee ekhon out of stock. Next restock November er prothom shoptahe expected. Restock hole apnake janabo?",
        1209,
        { status: "read" },
      ],
      ["customer", "Haan please janaben.", 1200],
      ["ai", "Done! Restock alert set kora holo ✅", 1199, { status: "read" }],
    ],
  },
  {
    id: "cv_1010",
    contactId: "ct_kamal",
    channel: "whatsapp",
    status: "pending",
    topic: "delivery",
    assigneeId: "tm_farhana",
    unreadCount: 0,
    aiHandled: false,
    messages: [
      ["customer", "Narayanganj e delivery charge koto? COD hobe?", 1580],
      [
        "ai",
        "Narayanganj e delivery charge ৳100, ar haan Cash on Delivery available. Delivery 2–3 working days lagbe.",
        1579,
        { status: "read" },
      ],
      ["customer", "Order #NK-1041 ta confirm korechi. Kobe pathaben?", 1560],
      [
        "agent",
        "Kamal bhai, linen panjabi ta warehouse e packing hocche. Kal dispatch hobe.",
        1500,
        { authorId: "tm_farhana", status: "delivered" },
      ],
    ],
  },
  {
    id: "cv_1011",
    contactId: "ct_sumaiya",
    channel: "messenger",
    status: "resolved",
    topic: "order_tracking",
    assigneeId: null,
    unreadCount: 0,
    aiHandled: true,
    messages: [
      ["customer", "My payment failed but money was deducted from card?", 1840],
      [
        "ai",
        "Sorry for the worry, Sumaiya! Order #NK-1039 shows the payment as failed, so the hold on your card is usually released by your bank within 3–7 days.",
        1839,
        { status: "read" },
      ],
      ["customer", "Okay thank you. I'll order again with bKash.", 1830],
    ],
  },
  {
    id: "cv_1012",
    contactId: "ct_daniel",
    channel: "webchat",
    status: "open",
    topic: "pricing",
    assigneeId: "tm_tanvir",
    unreadCount: 0,
    aiHandled: false,
    messages: [
      ["customer", "Hi, I run a pop-up store. Do you offer wholesale pricing on silk scarves?", 2940],
      [
        "ai",
        "Hi Daniel! Wholesale pricing is available from 15 pieces. I'll connect you with our operations lead for a quote.",
        2939,
        { status: "read" },
      ],
      [
        "agent",
        "Hi Daniel — Tanvir here. For 30+ scarves we can do ৳1,050 per piece before shipping. Could you share your delivery address and timeline?",
        2900,
        { authorId: "tm_tanvir", status: "read" },
      ],
    ],
  },
  {
    id: "cv_1013",
    contactId: "ct_farzana",
    channel: "instagram",
    status: "resolved",
    topic: "product_question",
    assigneeId: "tm_sadia",
    unreadCount: 0,
    aiHandled: false,
    messages: [
      ["customer", "Rosewood lipstick ta ki transfer-proof?", 4500],
      [
        "agent",
        "Hi Farzana! It's long-wear and mostly transfer-resistant after it sets for a minute. Perfect for events 💄",
        4470,
        { authorId: "tm_sadia", status: "read" },
      ],
      ["customer", "Love it. I'll post a review this weekend!", 4460],
    ],
  },
  {
    id: "cv_1014",
    contactId: "ct_lamia",
    channel: "whatsapp",
    status: "resolved",
    topic: "delivery",
    assigneeId: null,
    unreadCount: 0,
    aiHandled: true,
    messages: [
      ["customer", "Banani te same-day delivery possible?", 5850],
      [
        "ai",
        "Haan! Dhaka city te dupur 12 tar age order korle same-day delivery possible, charge ৳120.",
        5849,
        { status: "read" },
      ],
      ["customer", "Great, thanks!", 5840],
    ],
  },
];

function buildMessages(conversationId: string, items: MessageSeed[]): Message[] {
  return items.map(([authorType, body, ago, extra], index) => ({
    id: `${conversationId}_m${index + 1}`,
    conversationId,
    authorType,
    body,
    createdAt: minutesAgo(ago),
    authorId: extra?.authorId,
    status: authorType === "agent" || authorType === "ai" ? (extra?.status ?? "delivered") : undefined,
    isInternalNote: extra?.note,
    attachment: extra?.attachment,
  }));
}

export const conversations: Conversation[] = seeds.map((seed) => {
  const messages = buildMessages(seed.id, seed.messages);
  return {
    id: seed.id,
    contactId: seed.contactId,
    channel: seed.channel,
    status: seed.status,
    priority: seed.priority ?? "normal",
    topic: seed.topic,
    assigneeId: seed.assigneeId,
    unreadCount: seed.unreadCount,
    aiHandled: seed.aiHandled,
    lastMessageAt: messages[messages.length - 1]?.createdAt ?? minutesAgo(0),
    messages,
  };
});

/** Canned replies used by the "AI suggestion" button — no AI API is called. */
export const AI_SUGGESTIONS: Record<ConversationTopic, string[]> = {
  availability: [
    "Yes, it's in stock! We also have matching Oxidised Silver Jhumka earrings (৳890) that pair beautifully with this kurti. Shall I add a pair to your order?",
  ],
  order_tracking: [
    "Thanks for your patience! I've checked with our courier — your parcel is at the local hub and is scheduled for delivery by tomorrow evening. I'll share the rider's number as soon as it's assigned.",
  ],
  product_question: [
    "Together, the Vitamin C Serum (৳1,450) and Aloe Calm Night Cream (৳980) come to ৳2,430. Since you're ordering both, I can apply free delivery inside Dhaka. Would you like me to create the order?",
  ],
  refund: [
    "Your refund has been approved and sent to your bKash account. It should reflect within 3–5 working days. Sorry again for the inconvenience!",
  ],
  delivery: [
    "We don't ship internationally by default yet, but for the Jamdani saree we can arrange a courier to London. Estimated shipping is ৳3,800 and delivery takes 7–10 business days. Want me to prepare a quote?",
  ],
  pricing: [
    "Happy to help! For 20+ pieces we offer 12% off, and delivery is free for wholesale orders inside Dhaka. Shall I prepare an invoice?",
  ],
  complaint: [
    "We're really sorry about this experience. A replacement is on its way at no extra cost, and we've added extra protective packaging for all fragile items going forward. Thank you for letting us know.",
  ],
};
