import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kxndcjzntrthwwnookgt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bmRjanpudHJ0aHd3bm9va2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNDkzNTEsImV4cCI6MjA5MDYyNTM1MX0.C53PPJ4Rv2NNG6Rqo0mockj0f942PNXLxkljKKiHHno";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
