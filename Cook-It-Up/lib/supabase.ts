import { AppState } from "react-native";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iwnhxngbmecmlijetool.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3bmh4bmdibWVjbWxpamV0b29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxNzE3MDcsImV4cCI6MjA0NTc0NzcwN30._BEy4ZULq3YQKpwAs6cZCJ398ELf0PGmLjFKE8FFdoQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});