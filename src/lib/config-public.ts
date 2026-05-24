export const SUPABASE_URL = "https://guqqtaqukycyvqlzylvi.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cXF0YXF1a3ljeXZxbHp5bHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODc5MDAsImV4cCI6MjA5NDk2MzkwMH0.lxwRXUu11Kb4iNp2AGs9sZq5tCZ0gXIkqbikd50hsAg";

export const STRIPE_PUBLISHABLE_KEY = "pk_test_ChwbeGph8uKXKHAhslaOllF7";

export const STRIPE_PRICES = {
  hebdo: "price_1TaLRhFOphkl83ugT4c6gg9V",
  mensuel: "price_1TaLTMFOphkl83ug53MBxbjT",
  trimestriel: "price_1TaLUvFOphkl83ugH9cZKbcB",
} as const;

export const ALLOWED_PRICES = Object.values(STRIPE_PRICES);

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://i23.ca";
