export const TRIAL_BANNER_COPY =
  "Try 30 days of unlimited, commission-free campaigns across Paid, Affiliate, and gifted — no credit card required.";

export const BRIDGING_LINE_COPY =
  "Ready to scale? Zero-commission plans built for growing brands.";

export const FOOTER_NOTE_COPY =
  "9.9% standard commission applies to campaign spend exceeding your plan's limit.";

export const BILLING_CYCLES = {
  monthly: { id: "monthly", label: "Monthly", saveBadge: null },
  quarterly: { id: "quarterly", label: "Quarterly", saveBadge: "Save 10%" },
  yearly: { id: "yearly", label: "Yearly", saveBadge: "Save 20%" },
};

export const DEFAULT_BILLING_CYCLE = "quarterly";

export const ROW_ONE_PLANS = [
  {
    id: "payg",
    name: "Pay-As-You-Go",
    price: "$0",
    priceSuffix: "/mo",
    highlighted: false,
    features: [
      "9.9% commission on affiliate, sponsored, and UGC creator payments",
      "3 gifted collaborations per month, commission-free",
      "No monthly fee, no commitment",
    ],
  },
  {
    id: "unlimited-gifting",
    name: "Unlimited Gifting Add-On",
    price: "$99",
    priceSuffix: "/mo",
    highlighted: true,
    features: [
      "Unlimited gifted collaborations, commission-free",
      "Unlimited Shopify sales tracking",
      "Authenticated creator data, refreshed every 24 hours",
      "Access to creator social channels (Instagram, TikTok, YouTube)",
      "Affiliate, sponsored, and UGC campaigns billed at standard 9.9% PAYG rate",
    ],
  },
];

export const TIER_FEATURE_ROW_KEYS = [
  "commissionCap",
  "shopify",
  "savingsOrManaged",
  "gifting",
  "prioritySupport",
  "accountManager",
  "customContract",
  "onboardingSla",
  "customFeatures",
];

export const ROW_TWO_PLANS = [
  {
    id: "starter",
    name: "Starter",
    popular: false,
    pricing: {
      monthly: { amount: 399, billed: null },
      quarterly: { amount: 359, billed: "billed $1,077/quarter" },
      yearly: { amount: 319, billed: "billed $3,830/year" },
    },
    featureRows: {
      commissionCap:
        "$0 commission on affiliate, sponsored, and UGC payments up to $5,000/month",
      shopify: "Unlimited Shopify sales tracking",
      savingsOrManaged: "Save up to 20% vs pay-as-you-go rates",
      gifting: "Unlimited gifted collaborations, commission-free",
      prioritySupport: null,
      accountManager: null,
      customContract: null,
      onboardingSla: null,
      customFeatures: null,
    },
  },
  {
    id: "growth",
    name: "Growth",
    popular: true,
    pricing: {
      monthly: { amount: 699, billed: null },
      quarterly: { amount: 629, billed: "billed $1,887/quarter" },
      yearly: { amount: 559, billed: "billed $6,710/year" },
    },
    featureRows: {
      commissionCap:
        "$0 commission on affiliate, sponsored, and UGC payments up to $12,500/month",
      shopify: "Unlimited Shopify sales tracking",
      savingsOrManaged: "Save up to 43% vs pay-as-you-go rates",
      gifting: "Unlimited gifted collaborations, commission-free",
      prioritySupport: "Priority support",
      accountManager: null,
      customContract: null,
      onboardingSla: null,
      customFeatures: null,
    },
  },
  {
    id: "pro",
    name: "Pro",
    popular: false,
    pricing: {
      monthly: { amount: 999, billed: null },
      quarterly: { amount: 899, billed: "billed $2,697/quarter" },
      yearly: { amount: 799, billed: "billed $9,590/year" },
    },
    featureRows: {
      commissionCap:
        "$0 commission on affiliate, sponsored, and UGC payments up to $30,000/month",
      shopify: "Unlimited Shopify sales tracking",
      savingsOrManaged: "Save up to 66% vs pay-as-you-go rates",
      gifting: "Unlimited gifted collaborations, commission-free",
      prioritySupport: "Priority support",
      accountManager: "Dedicated account manager",
      customContract: null,
      onboardingSla: null,
      customFeatures: null,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    popular: false,
    isCustom: true,
    featureRows: {
      commissionCap: "Tailored commission-free limits above $30,000/month",
      shopify: "Unlimited Shopify sales tracking",
      savingsOrManaged: "Fully managed campaigns available",
      gifting: "Unlimited gifted collaborations, commission-free",
      prioritySupport: "Priority support",
      accountManager: "Dedicated account manager",
      customContract: "Custom contract terms",
      onboardingSla: "Priority onboarding and support SLA",
      customFeatures: "Custom feature requests",
    },
  },
];
