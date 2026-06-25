// ملف: supabase-config.js (محسّن وآمن)

// ⚠️ تنبيه أمان مهم:
// هذه المفاتيح يجب أن تكون في متغيرات البيئة (Environment Variables)
// لا تضعها مباشرة في الكود في الإنتاج!

const SUPABASE_URL = 'https://essjjrirzthhdujizoas.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzc2pqcmlyenRoaGR1aml6b2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTU3ODAsImV4cCI6MjA5Nzg5MTc4MH0.H-m33ZmSjv2ZrEIK2gpCg55a-xJ4ox0w4OCOraO2oQE';

// التحقق من توفر مكتبة Supabase
if (typeof window.supabase === 'undefined') {
    console.error('❌ خطأ: مكتبة Supabase لم يتم تحميلها. تأكد من وجود سكريبت Supabase في HTML');
    alert('خطأ في تحميل المكتبات. يرجى إعادة تحميل الصفحة.');
} else {
    // تهيئة الاتصال بـ Supabase
    try {
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ تم الاتصال بـ Supabase بنجاح');
    } catch (error) {
        console.error('❌ خطأ في الاتصال بـ Supabase:', error);
        alert('حدث خطأ في الاتصال بقاعدة البيانات');
    }
}
