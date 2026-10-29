import type { ChannelId, FulfillmentStatus, Order, OrderItem, PaymentStatus } from "@/lib/types";
import { products } from "./products";
import { daysAgo, hoursAgo } from "./clock";

function item(productId: string, quantity: number): OrderItem {
  const product = products.find((p) => p.id === productId);
  if (!product) throw new Error(`Unknown product ${productId}`);
  return {
    productId,
    name: product.name,
    sku: product.sku,
    quantity,
    unitPrice: product.price,
  };
}

interface Seed {
  number: number;
  contactId: string;
  channel: ChannelId;
  createdAt: string;
  items: OrderItem[];
  shipping: number;
  discount?: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress: string;
  trackingNumber?: string;
  note?: string;
}

const seeds: Seed[] = [
  {
    number: 1048,
    contactId: "ct_ayesha",
    channel: "messenger",
    createdAt: hoursAgo(3),
    items: [item("pr_kurti_indigo", 2), item("pr_earrings_jhumka", 1)],
    shipping: 60,
    paymentStatus: "paid",
    paymentMethod: "bKash",
    fulfillmentStatus: "processing",
    shippingAddress: "House 12, Road 7, Dhanmondi, Dhaka 1205",
  },
  {
    number: 1047,
    contactId: "ct_rahim",
    channel: "whatsapp",
    createdAt: daysAgo(3, 120),
    items: [item("pr_panjabi_linen", 1)],
    shipping: 120,
    paymentStatus: "cod",
    paymentMethod: "Cash on delivery",
    fulfillmentStatus: "shipped",
    shippingAddress: "Flat 3B, CDA Avenue, Agrabad, Chattogram 4100",
    trackingNumber: "PTH-88214503",
    note: "Customer reports delay — courier hub in Chattogram.",
  },
  {
    number: 1046,
    contactId: "ct_nusrat",
    channel: "whatsapp",
    createdAt: daysAgo(1, 60),
    items: [item("pr_kurti_mint", 6), item("pr_scarf_silk", 4), item("pr_bag_jute", 5)],
    shipping: 0,
    discount: 2500,
    paymentStatus: "paid",
    paymentMethod: "Bank transfer",
    fulfillmentStatus: "processing",
    shippingAddress: "Shop 21, Sector 7, Uttara, Dhaka 1230",
    note: "Wholesale order — 10% boutique discount applied.",
  },
  {
    number: 1045,
    contactId: "ct_maliha",
    channel: "instagram",
    createdAt: daysAgo(2, 300),
    items: [item("pr_serum_vitc", 1), item("pr_cream_aloe", 1)],
    shipping: 60,
    paymentStatus: "paid",
    paymentMethod: "Card",
    fulfillmentStatus: "delivered",
    shippingAddress: "Road 41, Gulshan 2, Dhaka 1212",
    trackingNumber: "PTH-88190277",
  },
  {
    number: 1044,
    contactId: "ct_shakil",
    channel: "messenger",
    createdAt: daysAgo(5, 200),
    items: [item("pr_tee_organic", 2)],
    shipping: 120,
    paymentStatus: "refunded",
    paymentMethod: "bKash",
    fulfillmentStatus: "returned",
    shippingAddress: "Zindabazar, Sylhet 3100",
    note: "Wrong size delivered — refund requested.",
  },
  {
    number: 1043,
    contactId: "ct_tahmid",
    channel: "instagram",
    createdAt: daysAgo(4, 30),
    items: [item("pr_candle_sandal", 2), item("pr_scarf_silk", 1)],
    shipping: 60,
    paymentStatus: "paid",
    paymentMethod: "Nagad",
    fulfillmentStatus: "delivered",
    shippingAddress: "Section 10, Mirpur, Dhaka 1216",
    trackingNumber: "PTH-88177120",
    note: "Gift wrap requested.",
  },
  {
    number: 1042,
    contactId: "ct_arif",
    channel: "messenger",
    createdAt: daysAgo(6, 400),
    items: [item("pr_mug_ceramic", 2), item("pr_candle_sandal", 1)],
    shipping: 120,
    paymentStatus: "paid",
    paymentMethod: "bKash",
    fulfillmentStatus: "delivered",
    shippingAddress: "Shaheb Bazar, Rajshahi 6100",
    trackingNumber: "PTH-88150931",
    note: "One mug arrived cracked — replacement under review.",
  },
  {
    number: 1041,
    contactId: "ct_kamal",
    channel: "whatsapp",
    createdAt: daysAgo(7, 100),
    items: [item("pr_panjabi_linen", 2)],
    shipping: 100,
    paymentStatus: "pending",
    paymentMethod: "Cash on delivery",
    fulfillmentStatus: "unfulfilled",
    shippingAddress: "Chashara, Narayanganj 1400",
  },
  {
    number: 1040,
    contactId: "ct_farzana",
    channel: "instagram",
    createdAt: daysAgo(8, 250),
    items: [item("pr_saree_jamdani", 1), item("pr_lipstick_matte", 2)],
    shipping: 0,
    paymentStatus: "paid",
    paymentMethod: "Card",
    fulfillmentStatus: "delivered",
    shippingAddress: "Block D, Bashundhara R/A, Dhaka 1229",
    trackingNumber: "PTH-88102244",
  },
  {
    number: 1039,
    contactId: "ct_sumaiya",
    channel: "messenger",
    createdAt: daysAgo(9, 30),
    items: [item("pr_cream_aloe", 1)],
    shipping: 120,
    paymentStatus: "failed",
    paymentMethod: "Card",
    fulfillmentStatus: "cancelled",
    shippingAddress: "Kandirpar, Cumilla 3500",
  },
  {
    number: 1038,
    contactId: "ct_lamia",
    channel: "whatsapp",
    createdAt: daysAgo(10, 90),
    items: [item("pr_bag_jute", 1), item("pr_earrings_jhumka", 2)],
    shipping: 60,
    paymentStatus: "paid",
    paymentMethod: "bKash",
    fulfillmentStatus: "delivered",
    shippingAddress: "Road 11, Banani, Dhaka 1213",
    trackingNumber: "PTH-88077810",
  },
  {
    number: 1037,
    contactId: "ct_tania",
    channel: "instagram",
    createdAt: daysAgo(12, 500),
    items: [item("pr_serum_vitc", 2)],
    shipping: 60,
    paymentStatus: "cod",
    paymentMethod: "Cash on delivery",
    fulfillmentStatus: "shipped",
    shippingAddress: "Tajmahal Road, Mohammadpur, Dhaka 1207",
    trackingNumber: "PTH-88051992",
  },
];

export const orders: Order[] = seeds.map((seed) => {
  const subtotal = seed.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discount = seed.discount ?? 0;
  return {
    ...seed,
    id: `or_${seed.number}`,
    number: `#NK-${seed.number}`,
    subtotal,
    discount,
    total: subtotal + seed.shipping - discount,
  };
});
