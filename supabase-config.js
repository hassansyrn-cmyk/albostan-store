
// ملف: supabase-config.js

// 1. رابط مشروعك (Project URL)
const SUPABASE_URL = 'https://essjjrirzthhdujizoas.supabase.co';

// 2. مفتاح الواجهة الأمامية (anon public key)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzc2pqcmlyenRoaGR1aml6b2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTU3ODAsImV4cCI6MjA5Nzg5MTc4MH0.H-m33ZmSjv2ZrEIK2gpCg55a-xJ4ox0w4OCOraO2oQE';

// تهيئة الاتصال بـ Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
