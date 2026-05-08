-- ============================================
-- ASAAN DIGITAL - SEED DATA (EXPANDED)
-- ADBMS Project - Spring 2026
-- ============================================

-- Clear existing data
TRUNCATE TABLE query_logs, featured_content, tutorial_dependencies, user_progress, keywords, intents, tutorial_steps, tutorials, categories RESTART IDENTITY CASCADE;

-- ============================================
-- 1. CATEGORIES
-- ============================================
INSERT INTO categories (name_english, name_urdu, icon_class, display_order) VALUES
('WhatsApp', 'واٹس ایپ', 'fab fa-whatsapp', 1),
('Digital Payments', 'ڈیجیٹل ادائیگی', 'fas fa-money-bill', 2),
('Government Services', 'سرکاری خدمات', 'fas fa-building', 3),
('Social Media', 'سوشل میڈیا', 'fas fa-users', 4),
('Phone Basics', 'فون کی بنیادی باتیں', 'fas fa-mobile-alt', 5),
('Email & Internet', 'ای میل اور انٹرنیٹ', 'fas fa-envelope', 6),
('Online Safety', 'آن لائن سیفٹی', 'fas fa-shield-alt', 7),
('Job Applications', 'نوکری کی درخواستیں', 'fas fa-briefcase', 8);

-- ============================================
-- 2. TUTORIALS
-- ============================================
INSERT INTO tutorials (category_id, title_english, title_urdu, description_english, description_urdu, difficulty_level, estimated_time_minutes, metadata) VALUES

-- ============ WhatsApp (category 1) ============
(1, 'How to Send WhatsApp Message', 'واٹس ایپ پر میسج کیسے بھیجیں',
 'Learn to send text messages on WhatsApp',
 'واٹس ایپ پر ٹیکسٹ میسج بھیجنا سیکھیں', 1, 3,
 '{"tags": ["whatsapp", "messaging", "beginner"]}'),

(1, 'How to Send Location on WhatsApp', 'واٹس ایپ پر لوکیشن کیسے بھیجیں',
 'Share your current location or any place with contacts',
 'واٹس ایپ پر اپنی موجودہ لوکیشن یا کوئی بھی جگہ شیئر کریں', 2, 4,
 '{"tags": ["whatsapp", "location", "sharing"]}'),

(1, 'How to Make WhatsApp Video Call', 'واٹس ایپ پر ویڈیو کال کیسے کریں',
 'Make free video calls to friends and family',
 'واٹس ایپ پر دوستوں اور فیملی کو مفت ویڈیو کال کریں', 1, 3,
 '{"tags": ["whatsapp", "video-call", "communication"]}'),

(1, 'How to Send Voice Message on WhatsApp', 'واٹس ایپ پر وائس میسج کیسے بھیجیں',
 'Record and send voice notes to your contacts',
 'اپنے رابطوں کو وائس نوٹ ریکارڈ کر کے بھیجیں', 1, 3,
 '{"tags": ["whatsapp", "voice", "audio"]}'),

(1, 'How to Create WhatsApp Group', 'واٹس ایپ گروپ کیسے بنائیں',
 'Create a group chat and add multiple contacts',
 'گروپ چیٹ بنائیں اور متعدد رابطے شامل کریں', 2, 5,
 '{"tags": ["whatsapp", "group", "chat"]}'),

(1, 'How to Block Someone on WhatsApp', 'واٹس ایپ پر کسی کو بلاک کیسے کریں',
 'Block unwanted contacts on WhatsApp',
 'واٹس ایپ پر ناپسندیدہ رابطوں کو بلاک کریں', 1, 3,
 '{"tags": ["whatsapp", "block", "privacy"]}'),

(1, 'How to Send WhatsApp Photos', 'واٹس ایپ پر تصویریں کیسے بھیجیں',
 'Send photos and images through WhatsApp',
 'واٹس ایپ کے ذریعے تصاویر اور تصویریں بھیجیں', 1, 3,
 '{"tags": ["whatsapp", "photos", "images"]}'),

(1, 'How to Download WhatsApp Status', 'واٹس ایپ اسٹیٹس کیسے ڈاؤن لوڈ کریں',
 'Save WhatsApp status photos and videos',
 'واٹس ایپ اسٹیٹس کی تصاویر اور ویڈیوز محفوظ کریں', 2, 4,
 '{"tags": ["whatsapp", "status", "download"]}'),

(1, 'How to Use WhatsApp Web', 'واٹس ایپ ویب کیسے استعمال کریں',
 'Use WhatsApp on your computer browser',
 'اپنے کمپیوٹر براؤزر پر واٹس ایپ استعمال کریں', 2, 6,
 '{"tags": ["whatsapp", "web", "computer"]}'),

(1, 'How to Update WhatsApp', 'واٹس ایپ اپ ڈیٹ کیسے کریں',
 'Update WhatsApp to the latest version',
 'واٹس ایپ کو تازہ ترین ورژن پر اپ ڈیٹ کریں', 1, 4,
 '{"tags": ["whatsapp", "update", "settings"]}'),

(1, 'How to Change WhatsApp Profile Picture', 'واٹس ایپ پروفائل تصویر کیسے بدلیں',
 'Set or update your WhatsApp profile photo',
 'اپنی واٹس ایپ پروفائل فوٹو سیٹ یا اپ ڈیٹ کریں', 1, 3,
 '{"tags": ["whatsapp", "profile", "photo"]}'),

-- ============ Digital Payments (category 2) ============
(2, 'How to Create JazzCash Account', 'جاز کیش اکاؤنٹ کیسے بنائیں',
 'Step by step guide to create JazzCash mobile account',
 'جاز کیش موبائل اکاؤنٹ بنانے کا مکمل طریقہ', 2, 10,
 '{"tags": ["jazzcash", "mobile-wallet", "account"]}'),

(2, 'How to Send Money via Easypaisa', 'ایزی پیسہ سے پیسے کیسے بھیجیں',
 'Transfer money to any bank account or mobile wallet',
 'ایزی پیسہ سے کسی بھی بینک اکاؤنٹ یا موبائل والیٹ میں پیسے بھیجیں', 2, 8,
 '{"tags": ["easypaisa", "money-transfer", "payments"]}'),

(2, 'How to Pay Electricity Bill Online', 'بجلی کا بل آن لائن کیسے ادا کریں',
 'Pay your electricity bill using JazzCash or Easypaisa',
 'جاز کیش یا ایزی پیسہ سے بجلی کا بل ادا کریں', 2, 6,
 '{"tags": ["bill-payment", "electricity", "online"]}'),

(2, 'How to Load Mobile Balance via JazzCash', 'جاز کیش سے موبائل بیلنس کیسے لوڈ کریں',
 'Recharge any mobile network using JazzCash',
 'جاز کیش کے ذریعے کسی بھی موبائل نیٹ ورک کو ری چارج کریں', 1, 5,
 '{"tags": ["jazzcash", "recharge", "balance"]}'),

(2, 'How to Pay Gas Bill Online', 'گیس کا بل آن لائن کیسے ادا کریں',
 'Pay SNGPL or SSGC gas bill online',
 'آن لائن SNGPL یا SSGC گیس بل ادا کریں', 2, 6,
 '{"tags": ["gas-bill", "sngpl", "online-payment"]}'),

(2, 'How to Check JazzCash Balance', 'جاز کیش بیلنس کیسے چیک کریں',
 'Check your JazzCash wallet balance',
 'اپنا جاز کیش والیٹ بیلنس چیک کریں', 1, 2,
 '{"tags": ["jazzcash", "balance", "check"]}'),

(2, 'How to Withdraw Cash from Easypaisa', 'ایزی پیسہ سے نقد رقم کیسے نکالیں',
 'Withdraw cash from any Easypaisa agent or ATM',
 'کسی بھی ایزی پیسہ ایجنٹ یا اے ٹی ایم سے نقد رقم نکالیں', 2, 8,
 '{"tags": ["easypaisa", "cash-withdrawal", "atm"]}'),

(2, 'How to Pay Internet Bill Online', 'انٹرنیٹ بل آن لائن کیسے ادا کریں',
 'Pay your broadband or DSL internet bill online',
 'اپنا براڈ بینڈ یا ڈی ایس ایل انٹرنیٹ بل آن لائن ادا کریں', 2, 5,
 '{"tags": ["internet-bill", "ptcl", "online-payment"]}'),

(2, 'How to Open Meezan Bank Account Online', 'میزان بینک اکاؤنٹ آن لائن کیسے کھولیں',
 'Open a Meezan Islamic bank account from your phone',
 'اپنے فون سے میزان اسلامی بینک اکاؤنٹ کھولیں', 3, 15,
 '{"tags": ["meezan", "bank", "account"]}'),

(2, 'How to Pay School Fees Online', 'اسکول فیس آن لائن کیسے ادا کریں',
 'Pay school or college fees through mobile banking',
 'موبائل بینکنگ کے ذریعے اسکول یا کالج کی فیس ادا کریں', 2, 7,
 '{"tags": ["school-fees", "education", "online-payment"]}'),

(2, 'How to Use HBL Mobile App', 'ایچ بی ایل موبائل ایپ کیسے استعمال کریں',
 'Complete guide to HBL mobile banking app',
 'ایچ بی ایل موبائل بینکنگ ایپ کا مکمل گائیڈ', 3, 12,
 '{"tags": ["hbl", "mobile-banking", "app"]}'),

-- ============ Government Services (category 3) ============
(3, 'How to Apply for CNIC Online', 'شناختی کارڈ کے لیے آن لائن درخواست کیسے دیں',
 'Complete guide to apply for Computerized National Identity Card',
 'کمپیوٹرائزڈ قومی شناختی کارڈ کے لیے آن لائن درخواست دینے کا مکمل طریقہ', 3, 20,
 '{"tags": ["nadra", "cnic", "identity"]}'),

(3, 'How to Check FBR Tax Status', 'ایف بی آر ٹیکس اسٹیٹس کیسے چیک کریں',
 'Check your tax filing status on FBR Iris portal',
 'ایف بی آر آئرس پورٹل پر اپنی ٹیکس فائلنگ اسٹیٹس چیک کریں', 4, 12,
 '{"tags": ["fbr", "tax", "iris"]}'),

(3, 'How to Apply for Passport Online', 'پاسپورٹ کے لیے آن لائن درخواست کیسے دیں',
 'Complete online passport application process',
 'آن لائن پاسپورٹ درخواست کا مکمل عمل', 3, 25,
 '{"tags": ["passport", "dgip", "travel"]}'),

(3, 'How to Track CNIC Application Status', 'شناختی کارڈ درخواست کا اسٹیٹس کیسے چیک کریں',
 'Track your CNIC application status online via NADRA',
 'نادرا کے ذریعے اپنی شناختی کارڈ درخواست کا آن لائن اسٹیٹس ٹریک کریں', 2, 5,
 '{"tags": ["nadra", "cnic", "tracking"]}'),

(3, 'How to Register for Voter ID', 'ووٹر آئی ڈی کے لیے رجسٹریشن کیسے کریں',
 'Register as a voter on ECP website',
 'ای سی پی ویب سائٹ پر ووٹر کے طور پر رجسٹر کریں', 3, 15,
 '{"tags": ["ecp", "voter", "election"]}'),

(3, 'How to Pay Property Tax Online', 'پراپرٹی ٹیکس آن لائن کیسے ادا کریں',
 'Pay your property tax through Punjab e-Pay portal',
 'پنجاب ای پے پورٹل کے ذریعے اپنا پراپرٹی ٹیکس ادا کریں', 3, 10,
 '{"tags": ["property-tax", "punjab", "epay"]}'),

(3, 'How to Apply for Domicile Certificate', 'ڈومیسائل سرٹیفکیٹ کے لیے درخواست کیسے دیں',
 'Apply for domicile certificate at your district office',
 'اپنے ضلعی دفتر میں ڈومیسائل سرٹیفکیٹ کے لیے درخواست دیں', 3, 20,
 '{"tags": ["domicile", "certificate", "government"]}'),

(3, 'How to Check Pension Status Online', 'پنشن اسٹیٹس آن لائن کیسے چیک کریں',
 'Check your government pension status through AGPR portal',
 'اے جی پی آر پورٹل کے ذریعے اپنی سرکاری پنشن اسٹیٹس چیک کریں', 3, 8,
 '{"tags": ["pension", "agpr", "government"]}'),

(3, 'How to Register Business with SECP', 'SECP کے ساتھ کاروبار کیسے رجسٹر کریں',
 'Register your company or business with SECP online',
 'آن لائن SECP کے ساتھ اپنی کمپنی یا کاروبار رجسٹر کریں', 4, 30,
 '{"tags": ["secp", "business", "registration"]}'),

(3, 'How to Apply for Birth Certificate Online', 'پیدائشی سرٹیفکیٹ کے لیے آن لائن درخواست کیسے دیں',
 'Apply for birth certificate via NADRA online portal',
 'نادرا آن لائن پورٹل کے ذریعے پیدائشی سرٹیفکیٹ کے لیے درخواست دیں', 2, 15,
 '{"tags": ["birth-certificate", "nadra", "registration"]}'),

(3, 'How to File Income Tax Return Online', 'آن لائن انکم ٹیکس ریٹرن کیسے فائل کریں',
 'File your annual income tax return on FBR Iris',
 'ایف بی آر آئرس پر اپنا سالانہ انکم ٹیکس ریٹرن فائل کریں', 4, 45,
 '{"tags": ["income-tax", "fbr", "iris"]}'),

-- ============ Social Media (category 4) ============
(4, 'How to Create Facebook Account', 'فیس بک اکاؤنٹ کیسے بنائیں',
 'Create your Facebook account with mobile number',
 'موبائل نمبر سے فیسبک اکاؤنٹ بنائیں', 1, 10,
 '{"tags": ["facebook", "social-media", "account"]}'),

(4, 'How to Upload Video on YouTube', 'یوٹیوب پر ویڈیو کیسے اپ لوڈ کریں',
 'Upload your first video to YouTube from mobile',
 'موبائل سے یوٹیوب پر اپنی پہلی ویڈیو اپ لوڈ کریں', 2, 12,
 '{"tags": ["youtube", "video", "upload"]}'),

(4, 'How to Create Instagram Account', 'انسٹاگرام اکاؤنٹ کیسے بنائیں',
 'Set up your Instagram profile and start sharing photos',
 'اپنی انسٹاگرام پروفائل سیٹ اپ کریں اور تصویریں شیئر کرنا شروع کریں', 1, 8,
 '{"tags": ["instagram", "social-media", "account"]}'),

(4, 'How to Change Facebook Password', 'فیس بک پاسورڈ کیسے بدلیں',
 'Reset or change your Facebook account password',
 'اپنا فیس بک اکاؤنٹ پاسورڈ ری سیٹ یا تبدیل کریں', 2, 5,
 '{"tags": ["facebook", "password", "security"]}'),

(4, 'How to Go Live on Facebook', 'فیس بک پر لائیو کیسے آئیں',
 'Start a Facebook Live video broadcast from your phone',
 'اپنے فون سے فیس بک لائیو ویڈیو براڈکاسٹ شروع کریں', 2, 8,
 '{"tags": ["facebook", "live", "video"]}'),

(4, 'How to Create YouTube Channel', 'یوٹیوب چینل کیسے بنائیں',
 'Create and set up your own YouTube channel',
 'اپنا خود کا یوٹیوب چینل بنائیں اور سیٹ اپ کریں', 2, 15,
 '{"tags": ["youtube", "channel", "creator"]}'),

(4, 'How to Use TikTok Safely', 'ٹک ٹاک محفوظ طریقے سے کیسے استعمال کریں',
 'Use TikTok with privacy and safety settings enabled',
 'پرائیویسی اور سیفٹی سیٹنگز کے ساتھ ٹک ٹاک استعمال کریں', 2, 10,
 '{"tags": ["tiktok", "safety", "privacy"]}'),

(4, 'How to Report Fake Facebook Profile', 'جعلی فیس بک پروفائل کیسے رپورٹ کریں',
 'Report a fake or impersonating Facebook account',
 'جعلی یا نقل کرنے والے فیس بک اکاؤنٹ کی رپورٹ کریں', 2, 5,
 '{"tags": ["facebook", "report", "fake"]}'),

(4, 'How to Earn Money from YouTube', 'یوٹیوب سے پیسے کیسے کمائیں',
 'Enable monetization on your YouTube channel',
 'اپنے یوٹیوب چینل پر مونیٹائزیشن فعال کریں', 3, 20,
 '{"tags": ["youtube", "monetization", "earning"]}'),

(4, 'How to Create Facebook Page for Business', 'کاروبار کے لیے فیس بک پیج کیسے بنائیں',
 'Create a professional Facebook page for your business',
 'اپنے کاروبار کے لیے ایک پیشہ ورانہ فیس بک پیج بنائیں', 2, 15,
 '{"tags": ["facebook", "business", "page"]}'),

(4, 'How to Use LinkedIn for Job Search', 'نوکری تلاش کے لیے لنکڈ ان کیسے استعمال کریں',
 'Set up LinkedIn profile and search for jobs in Pakistan',
 'لنکڈ ان پروفائل سیٹ اپ کریں اور پاکستان میں نوکریاں تلاش کریں', 3, 20,
 '{"tags": ["linkedin", "job-search", "professional"]}'),

-- ============ Phone Basics (category 5) ============
(5, 'How to Set Alarm on Phone', 'فون پر الارم کیسے لگائیں',
 'Set daily alarms and reminders on your smartphone',
 'اسمارٹ فون پر روزانہ کے الارم اور ریمائنڈر لگائیں', 1, 3,
 '{"tags": ["alarm", "basics", "reminder"]}'),

(5, 'How to Save Contact Number', 'فون میں نمبر کیسے محفوظ کریں',
 'Save new contacts in your phone address book',
 'اپنی فون بک میں نئے نمبر محفوظ کریں', 1, 2,
 '{"tags": ["contacts", "basics", "phone"]}'),

(5, 'How to Take Screenshot on Android', 'اینڈرائیڈ پر اسکرین شاٹ کیسے لیں',
 'Capture your phone screen using buttons or gestures',
 'بٹنز یا اشاروں کا استعمال کرتے ہوئے اپنی فون اسکرین کیپچر کریں', 1, 2,
 '{"tags": ["screenshot", "android", "basics"]}'),

(5, 'How to Increase Phone Storage', 'فون اسٹوریج کیسے بڑھائیں',
 'Free up space on your Android phone',
 'اپنے اینڈرائیڈ فون پر جگہ خالی کریں', 2, 8,
 '{"tags": ["storage", "android", "memory"]}'),

(5, 'How to Connect Phone to WiFi', 'فون کو وائی فائی سے کیسے جوڑیں',
 'Connect your smartphone to a WiFi network',
 'اپنے اسمارٹ فون کو وائی فائی نیٹ ورک سے جوڑیں', 1, 3,
 '{"tags": ["wifi", "internet", "connection"]}'),

(5, 'How to Transfer Photos to Computer', 'تصاویر کمپیوٹر میں کیسے منتقل کریں',
 'Transfer photos from phone to PC via USB cable',
 'USB کیبل کے ذریعے فون سے پی سی میں تصاویر منتقل کریں', 2, 8,
 '{"tags": ["photos", "transfer", "computer"]}'),

(5, 'How to Clear Phone Cache', 'فون کیش کیسے صاف کریں',
 'Clear cache to speed up your Android phone',
 'اپنے اینڈرائیڈ فون کو تیز کرنے کے لیے کیش صاف کریں', 2, 5,
 '{"tags": ["cache", "android", "performance"]}'),

(5, 'How to Set Ringtone on Android', 'اینڈرائیڈ پر رنگ ٹون کیسے سیٹ کریں',
 'Change or set a custom ringtone on Android',
 'اینڈرائیڈ پر کسٹم رنگ ٹون تبدیل کریں یا سیٹ کریں', 1, 4,
 '{"tags": ["ringtone", "android", "settings"]}'),

(5, 'How to Backup Phone Data', 'فون ڈیٹا بیک اپ کیسے کریں',
 'Back up your phone contacts and photos to Google',
 'اپنے فون کے رابطے اور تصاویر گوگل پر بیک اپ کریں', 2, 10,
 '{"tags": ["backup", "google", "data"]}'),

(5, 'How to Use Google Maps for Navigation', 'نیویگیشن کے لیے گوگل میپس کیسے استعمال کریں',
 'Find locations and get directions using Google Maps',
 'گوگل میپس کا استعمال کرتے ہوئے مقامات تلاش کریں اور سمت حاصل کریں', 1, 6,
 '{"tags": ["google-maps", "navigation", "directions"]}'),

(5, 'How to Install App from Play Store', 'پلے اسٹور سے ایپ کیسے انسٹال کریں',
 'Download and install apps from Google Play Store',
 'گوگل پلے اسٹور سے ایپس ڈاؤن لوڈ اور انسٹال کریں', 1, 4,
 '{"tags": ["play-store", "app", "install"]}'),

-- ============ Email & Internet (category 6) ============
(6, 'How to Create Gmail Account', 'جی میل اکاؤنٹ کیسے بنائیں',
 'Create a new Google Gmail email account',
 'نیا گوگل جی میل ای میل اکاؤنٹ بنائیں', 1, 10,
 '{"tags": ["gmail", "email", "google"]}'),

(6, 'How to Send Email on Gmail', 'جی میل پر ای میل کیسے بھیجیں',
 'Compose and send emails using Gmail',
 'جی میل کا استعمال کرتے ہوئے ای میل لکھیں اور بھیجیں', 1, 5,
 '{"tags": ["gmail", "email", "send"]}'),

(6, 'How to Attach File in Email', 'ای میل میں فائل کیسے منسلک کریں',
 'Attach documents or photos to your email',
 'اپنی ای میل میں دستاویزات یا تصاویر منسلک کریں', 2, 5,
 '{"tags": ["email", "attachment", "file"]}'),

(6, 'How to Use Google Drive', 'گوگل ڈرائیو کیسے استعمال کریں',
 'Store and share files using Google Drive',
 'گوگل ڈرائیو کا استعمال کرتے ہوئے فائلیں اسٹور اور شیئر کریں', 2, 10,
 '{"tags": ["google-drive", "storage", "files"]}'),

(6, 'How to Use Google Search Effectively', 'گوگل سرچ مؤثر طریقے سے کیسے استعمال کریں',
 'Search tips and tricks to find information faster',
 'معلومات تیزی سے تلاش کرنے کے لیے سرچ ٹپس اور ٹرکس', 1, 8,
 '{"tags": ["google", "search", "internet"]}'),

(6, 'How to Reset Forgotten Email Password', 'بھولا ہوا ای میل پاسورڈ کیسے ری سیٹ کریں',
 'Recover access to your Gmail account',
 'اپنے جی میل اکاؤنٹ تک رسائی دوبارہ حاصل کریں', 2, 8,
 '{"tags": ["gmail", "password-reset", "recovery"]}'),

(6, 'How to Use Zoom for Video Meetings', 'ویڈیو میٹنگ کے لیے زوم کیسے استعمال کریں',
 'Join and host video meetings using Zoom',
 'زوم کا استعمال کرتے ہوئے ویڈیو میٹنگز میں شامل ہوں اور ہوسٹ کریں', 2, 10,
 '{"tags": ["zoom", "video-meeting", "online"]}'),

(6, 'How to Download YouTube Videos', 'یوٹیوب ویڈیوز کیسے ڈاؤن لوڈ کریں',
 'Download YouTube videos for offline viewing',
 'آف لائن دیکھنے کے لیے یوٹیوب ویڈیوز ڈاؤن لوڈ کریں', 2, 6,
 '{"tags": ["youtube", "download", "offline"]}'),

(6, 'How to Use Google Translate', 'گوگل ٹرانسلیٹ کیسے استعمال کریں',
 'Translate text between Urdu, English and other languages',
 'اردو، انگریزی اور دیگر زبانوں کے درمیان متن ترجمہ کریں', 1, 5,
 '{"tags": ["google-translate", "translation", "urdu"]}'),

(6, 'How to Use Microsoft Word on Phone', 'فون پر مائیکروسافٹ ورڈ کیسے استعمال کریں',
 'Create and edit documents using Microsoft Word mobile',
 'مائیکروسافٹ ورڈ موبائل کا استعمال کرتے ہوئے دستاویزات بنائیں اور ترمیم کریں', 2, 10,
 '{"tags": ["microsoft-word", "documents", "mobile"]}'),

(6, 'How to Video Call on Google Meet', 'گوگل میٹ پر ویڈیو کال کیسے کریں',
 'Make video calls using Google Meet app',
 'گوگل میٹ ایپ کا استعمال کرتے ہوئے ویڈیو کالز کریں', 1, 7,
 '{"tags": ["google-meet", "video-call", "online"]}'),

-- ============ Online Safety (category 7) ============
(7, 'How to Identify Online Scams', 'آن لائن دھوکہ دہی کیسے پہچانیں',
 'Recognize and avoid common online scams in Pakistan',
 'پاکستان میں عام آن لائن دھوکہ دہی کو پہچانیں اور اس سے بچیں', 2, 10,
 '{"tags": ["scam", "fraud", "safety"]}'),

(7, 'How to Create Strong Password', 'مضبوط پاسورڈ کیسے بنائیں',
 'Create secure passwords to protect your accounts',
 'اپنے اکاؤنٹس کی حفاظت کے لیے محفوظ پاسورڈ بنائیں', 1, 5,
 '{"tags": ["password", "security", "safety"]}'),

(7, 'How to Enable Two-Factor Authentication', 'دو عنصری تصدیق کیسے فعال کریں',
 'Add extra security layer to your accounts',
 'اپنے اکاؤنٹس میں اضافی سیکیورٹی پرت شامل کریں', 2, 8,
 '{"tags": ["2fa", "security", "authentication"]}'),

(7, 'How to Protect Personal Information Online', 'آن لائن ذاتی معلومات کیسے محفوظ رکھیں',
 'Keep your personal data safe on the internet',
 'انٹرنیٹ پر اپنا ذاتی ڈیٹا محفوظ رکھیں', 2, 10,
 '{"tags": ["privacy", "data", "security"]}'),

(7, 'How to Avoid WhatsApp Scams', 'واٹس ایپ دھوکہ دہی سے کیسے بچیں',
 'Recognize and report WhatsApp fraud messages',
 'واٹس ایپ دھوکہ دہی کے پیغامات کو پہچانیں اور رپورٹ کریں', 2, 8,
 '{"tags": ["whatsapp", "scam", "fraud"]}'),

(7, 'How to Report Cybercrime in Pakistan', 'پاکستان میں سائبر کرائم کیسے رپورٹ کریں',
 'Report online crime to FIA Cybercrime Wing',
 'ایف آئی اے سائبر کرائم ونگ کو آن لائن جرائم رپورٹ کریں', 3, 12,
 '{"tags": ["fia", "cybercrime", "report"]}'),

(7, 'How to Spot Fake Online Shops', 'جعلی آن لائن شاپس کیسے پہچانیں',
 'Identify fake e-commerce websites before purchasing',
 'خریداری سے پہلے جعلی ای کامرس ویب سائٹس کی شناخت کریں', 2, 8,
 '{"tags": ["online-shopping", "fake", "scam"]}'),

(7, 'How to Secure Your WiFi Network', 'اپنا وائی فائی نیٹ ورک کیسے محفوظ کریں',
 'Set a strong password for your home WiFi router',
 'اپنے ہوم وائی فائی راؤٹر کے لیے مضبوط پاسورڈ سیٹ کریں', 2, 8,
 '{"tags": ["wifi", "security", "router"]}'),

(7, 'How to Protect Children Online', 'بچوں کو آن لائن کیسے محفوظ رکھیں',
 'Set parental controls and monitor online activity',
 'والدین کے کنٹرول سیٹ کریں اور آن لائن سرگرمی کی نگرانی کریں', 2, 12,
 '{"tags": ["parental-control", "children", "safety"]}'),

(7, 'How to Avoid Investment Scams Online', 'آن لائن سرمایہ کاری کے دھوکوں سے کیسے بچیں',
 'Recognize pyramid schemes and fake investment platforms',
 'پیرامڈ اسکیموں اور جعلی سرمایہ کاری پلیٹ فارموں کو پہچانیں', 3, 10,
 '{"tags": ["investment-scam", "fraud", "safety"]}'),

(7, 'How to Use VPN Safely', 'VPN محفوظ طریقے سے کیسے استعمال کریں',
 'Use VPN to protect your privacy online',
 'آن لائن اپنی پرائیویسی کی حفاظت کے لیے VPN استعمال کریں', 3, 10,
 '{"tags": ["vpn", "privacy", "security"]}'),

-- ============ Job Applications (category 8) ============
(8, 'How to Write CV in Urdu', 'اردو میں سی وی کیسے لکھیں',
 'Write a professional CV or resume in Urdu',
 'اردو میں پیشہ ورانہ سی وی یا ریزیومے لکھیں', 2, 20,
 '{"tags": ["cv", "resume", "urdu"]}'),

(8, 'How to Apply for Jobs on Rozee.pk', 'Rozee.pk پر نوکریوں کے لیے درخواست کیسے دیں',
 'Search and apply for jobs on Pakistan top job portal',
 'پاکستان کے اعلی جاب پورٹل پر نوکریاں تلاش کریں اور درخواست دیں', 2, 12,
 '{"tags": ["rozee", "job-portal", "application"]}'),

(8, 'How to Create Profile on Upwork', 'Upwork پر پروفائل کیسے بنائیں',
 'Set up your freelancing profile on Upwork',
 'Upwork پر اپنی فری لانسنگ پروفائل سیٹ اپ کریں', 3, 20,
 '{"tags": ["upwork", "freelancing", "profile"]}'),

(8, 'How to Apply for Government Jobs Online', 'سرکاری نوکریوں کے لیے آن لائن درخواست کیسے دیں',
 'Apply for federal and provincial government jobs online',
 'وفاقی اور صوبائی سرکاری نوکریوں کے لیے آن لائن درخواست دیں', 2, 15,
 '{"tags": ["government-job", "fpsc", "ppsc"]}'),

(8, 'How to Prepare for Online Interview', 'آن لائن انٹرویو کی تیاری کیسے کریں',
 'Tips to prepare and perform well in video interviews',
 'ویڈیو انٹرویوز میں اچھی کارکردگی کے لیے تیاری کے ٹپس', 2, 15,
 '{"tags": ["interview", "online", "preparation"]}'),

(8, 'How to Use Fiverr to Earn Money', 'Fiverr سے پیسے کمانے کے لیے کیسے استعمال کریں',
 'Create a gig and start earning on Fiverr Pakistan',
 'Fiverr پاکستان پر گیگ بنائیں اور کمانا شروع کریں', 3, 20,
 '{"tags": ["fiverr", "freelancing", "earning"]}'),

(8, 'How to Write Cover Letter in English', 'انگریزی میں کور لیٹر کیسے لکھیں',
 'Write a professional job application cover letter',
 'پیشہ ورانہ نوکری کی درخواست کا کور لیٹر لکھیں', 3, 15,
 '{"tags": ["cover-letter", "english", "job"]}'),

(8, 'How to Apply for Jobs on Indeed', 'Indeed پر نوکریوں کے لیے درخواست کیسے دیں',
 'Search and apply for jobs locally and internationally on Indeed',
 'Indeed پر مقامی اور بین الاقوامی نوکریاں تلاش کریں اور درخواست دیں', 2, 10,
 '{"tags": ["indeed", "job-search", "international"]}'),

(8, 'How to Get Freelancing Projects as Beginner', 'بطور مبتدی فری لانسنگ پروجیکٹس کیسے حاصل کریں',
 'Start your freelancing career with no experience',
 'بغیر تجربے کے اپنا فری لانسنگ کیریئر شروع کریں', 3, 25,
 '{"tags": ["freelancing", "beginner", "projects"]}'),

(8, 'How to Use Daraz to Sell Products', 'Daraz پر مصنوعات فروخت کرنے کے لیے کیسے استعمال کریں',
 'Register as a seller and list products on Daraz',
 'Daraz پر بیچنے والے کے طور پر رجسٹر کریں اور مصنوعات درج کریں', 3, 20,
 '{"tags": ["daraz", "selling", "ecommerce"]}'),

(8, 'How to Prepare for FPSC CSS Exam Online', 'آن لائن FPSC CSS امتحان کی تیاری کیسے کریں',
 'Study resources and online preparation for CSS competitive exam',
 'CSS مسابقتی امتحان کے لیے مطالعہ کے وسائل اور آن لائن تیاری', 4, 30,
 '{"tags": ["fpsc", "css", "exam"]}');

-- ============================================
-- 3. TUTORIAL STEPS
-- ============================================

-- WhatsApp Message (ID: 1)
INSERT INTO tutorial_steps (tutorial_id, step_number, instruction_urdu, instruction_english) VALUES
(1, 1, 'واٹس ایپ ایپ کھولیں', 'Open the WhatsApp app'),
(1, 2, 'نیچے دائیں طرف سبز پینسل آئیکن پر ٹیپ کریں', 'Tap the green pencil icon at bottom right'),
(1, 3, 'وہ رابطہ منتخب کریں جسے آپ میسج بھیجنا چاہتے ہیں', 'Select the contact you want to message'),
(1, 4, 'نیچے ٹیکسٹ باکس میں اپنا میسج ٹائپ کریں', 'Type your message in the text box at the bottom'),
(1, 5, 'بھیجنے کے لیے سبز بھیجیں بٹن دبائیں', 'Press the green send button to send');

-- WhatsApp Location (ID: 2)
INSERT INTO tutorial_steps (tutorial_id, step_number, instruction_urdu, instruction_english, image_url) VALUES
(2, 1, 'واٹس ایپ کھولیں', 'Open WhatsApp', '/images/whatsapp/open.jpg'),
(2, 2, 'جس شخص کو لوکیشن بھیجنی ہے اس کی چیٹ کھولیں', 'Open the chat of the person you want to share location with', '/images/whatsapp/chat.jpg'),
(2, 3, 'نیچے 📎 (اٹیچ) کے بٹن پر کلک کریں', 'Tap on the 📎 (attach) button at the bottom', '/images/whatsapp/attach.jpg'),
(2, 4, 'لوکیشن کے آپشن پر کلک کریں', 'Tap on the Location option', '/images/whatsapp/location-option.jpg'),
(2, 5, 'Send your current location پر کلک کریں', 'Tap on "Send your current location"', '/images/whatsapp/send-location.jpg');

-- JazzCash Account (ID: 12)
INSERT INTO tutorial_steps (tutorial_id, step_number, instruction_urdu, instruction_english) VALUES
(12, 1, 'گوگل پلے اسٹور یا ایپ اسٹور سے جاز کیش ایپ ڈاؤن لوڈ کریں', 'Download JazzCash app from Google Play Store or App Store'),
(12, 2, 'ایپ کھولیں اور "Register" پر کلک کریں', 'Open app and tap on "Register"'),
(12, 3, 'اپنا موبائل نمبر درج کریں', 'Enter your mobile number'),
(12, 4, 'ایس ایم ایس کے ذریعے آنے والا کوڈ درج کریں', 'Enter the code received via SMS'),
(12, 5, 'اپنا نام اور شناختی کارڈ نمبر درج کریں', 'Enter your name and CNIC number'),
(12, 6, 'ایم پن (5 ہندسوں کا پاسورڈ) بنائیں', 'Create an MPIN (5-digit password)'),
(12, 7, 'اکاؤنٹ بنانے کا عمل مکمل ہوگیا!', 'Account creation completed!');

-- CNIC Application (ID: 23)
INSERT INTO tutorial_steps (tutorial_id, step_number, instruction_urdu, instruction_english) VALUES
(23, 1, 'NADRA کی آفیشل ویب سائٹ pakidentity.gov.pk پر جائیں', 'Go to NADRA official website pakidentity.gov.pk'),
(23, 2, '"Apply for CNIC" کے بٹن پر کلک کریں', 'Click on "Apply for CNIC" button'),
(23, 3, 'اپنا موبائل نمبر اور ای میل درج کریں', 'Enter your mobile number and email'),
(23, 4, 'فارم میں مطلوبہ معلومات بھریں', 'Fill in the required information in the form'),
(23, 5, 'مطلوبہ دستاویزات کی سکین کاپی اپ لوڈ کریں', 'Upload scanned copies of required documents'),
(23, 6, 'ادائیگی کا طریقہ منتخب کریں اور فیس جمع کروائیں', 'Select payment method and pay the fee'),
(23, 7, 'اپائنٹمنٹ کی تاریخ اور وقت منتخب کریں', 'Select appointment date and time'),
(23, 8, 'درخواست جمع کروائیں اور ٹریکنگ نمبر محفوظ کرلیں', 'Submit application and save tracking number');

-- Gmail Account (ID: 57)
INSERT INTO tutorial_steps (tutorial_id, step_number, instruction_urdu, instruction_english) VALUES
(57, 1, 'gmail.com پر جائیں یا Gmail ایپ کھولیں', 'Go to gmail.com or open Gmail app'),
(57, 2, '"Create account" پر کلک کریں', 'Click on "Create account"'),
(57, 3, 'اپنا پہلا اور آخری نام درج کریں', 'Enter your first and last name'),
(57, 4, 'اپنا ای میل ایڈریس منتخب کریں', 'Choose your email address'),
(57, 5, 'مضبوط پاسورڈ بنائیں', 'Create a strong password'),
(57, 6, 'اپنا موبائل نمبر تصدیق کے لیے درج کریں', 'Enter your mobile number for verification'),
(57, 7, 'OTP کوڈ درج کریں', 'Enter the OTP code'),
(57, 8, 'گوگل کی شرائط قبول کریں - اکاؤنٹ تیار ہے!', 'Accept Google terms - account is ready!');

-- ============================================
-- 4. INTENTS
-- ============================================
INSERT INTO intents (tutorial_id, intent_name, description) VALUES
-- WhatsApp intents
(1, 'send_whatsapp_message', 'User wants to send a message on WhatsApp'),
(2, 'share_whatsapp_location', 'User wants to share location on WhatsApp'),
(2, 'send_whatsapp_location', 'User wants to send their current location via WhatsApp'),
(3, 'whatsapp_video_call', 'User wants to make a video call on WhatsApp'),
(4, 'whatsapp_voice_message', 'User wants to send voice message on WhatsApp'),
(5, 'create_whatsapp_group', 'User wants to create a WhatsApp group'),
(6, 'block_whatsapp_contact', 'User wants to block someone on WhatsApp'),

-- Digital Payments intents
(12, 'create_jazzcash_account', 'User wants to create new JazzCash account'),
(12, 'jazzcash_registration', 'User needs help with JazzCash registration'),
(13, 'send_money_easypaisa', 'User wants to send money via Easypaisa'),
(14, 'pay_electricity_bill', 'User wants to pay electricity bill online'),
(14, 'bill_payment_online', 'User needs help with online bill payment'),
(15, 'jazzcash_mobile_recharge', 'User wants to recharge mobile via JazzCash'),
(16, 'pay_gas_bill', 'User wants to pay gas bill online'),

-- Government Services intents
(23, 'apply_cnic_online', 'User wants to apply for CNIC online'),
(23, 'nadra_cnic_application', 'User needs help with NADRA CNIC application'),
(24, 'track_cnic_status', 'User wants to track CNIC application status'),
(25, 'voter_registration', 'User wants to register as voter'),
(27, 'apply_for_passport', 'User wants to apply for passport'),
(33, 'file_income_tax', 'User wants to file income tax return'),

-- Social Media intents
(34, 'create_facebook_account', 'User wants to create Facebook account'),
(35, 'upload_youtube_video', 'User wants to upload video on YouTube'),
(36, 'create_instagram_account', 'User wants to create Instagram account'),
(37, 'change_facebook_password', 'User wants to change Facebook password'),
(41, 'create_youtube_channel', 'User wants to create YouTube channel'),

-- Gmail intents
(57, 'create_gmail_account', 'User wants to create Gmail account'),
(58, 'send_email_gmail', 'User wants to send email on Gmail'),
(62, 'reset_email_password', 'User wants to reset email password'),

-- Online Safety intents
(68, 'identify_online_scam', 'User wants to identify online scams'),
(69, 'create_strong_password', 'User wants to create strong password'),
(73, 'report_cybercrime', 'User wants to report cybercrime in Pakistan'),

-- Job Applications intents
(79, 'write_cv_urdu', 'User wants to write CV in Urdu'),
(80, 'apply_rozee_jobs', 'User wants to apply for jobs on Rozee.pk'),
(83, 'apply_government_job', 'User wants to apply for government jobs');

-- ============================================
-- 5. KEYWORDS (Multilingual)
-- ============================================
INSERT INTO keywords (intent_id, keyword, language, weight) VALUES
-- WhatsApp message
(1, 'whatsapp message send', 'english', 1.0),
(1, 'whatsapp par message kaise bhejein', 'roman_urdu', 1.0),
(1, 'واٹس ایپ میسج', 'urdu', 1.0),
(1, 'message karna whatsapp', 'roman_urdu', 0.9),

-- WhatsApp Location
(2, 'whatsapp location', 'english', 1.0),
(2, 'share location whatsapp', 'english', 0.9),
(2, 'whatsapp par location kaise bhejein', 'roman_urdu', 1.0),
(2, 'whatsapp location send karna', 'roman_urdu', 0.9),
(2, 'واٹس ایپ لوکیشن', 'urdu', 1.0),
(2, 'لوکیشن بھیجنا', 'urdu', 0.8),

-- WhatsApp video call
(4, 'whatsapp video call', 'english', 1.0),
(4, 'whatsapp par video call karna', 'roman_urdu', 1.0),
(4, 'واٹس ایپ ویڈیو کال', 'urdu', 1.0),
(4, 'video call kaise karein', 'roman_urdu', 0.9),

-- WhatsApp group
(6, 'whatsapp group banana', 'roman_urdu', 1.0),
(6, 'create whatsapp group', 'english', 1.0),
(6, 'واٹس ایپ گروپ بنانا', 'urdu', 1.0),

-- JazzCash
(8, 'jazzcash account', 'english', 1.0),
(8, 'create jazzcash', 'english', 0.9),
(8, 'jazzcash account kaise banaye', 'roman_urdu', 1.0),
(8, 'jazzcash register', 'roman_urdu', 0.9),
(8, 'جاز کیش اکاؤنٹ', 'urdu', 1.0),
(8, 'جاز کیش کھاتہ', 'urdu', 0.8),

-- Easypaisa
(10, 'easypaisa money transfer', 'english', 1.0),
(10, 'easypaisa se paise kaise bhejein', 'roman_urdu', 1.0),
(10, 'ایزی پیسہ پیسے بھیجنا', 'urdu', 1.0),
(10, 'send money easypaisa', 'english', 0.9),

-- Electricity bill
(11, 'electricity bill online', 'english', 1.0),
(11, 'pay bill online', 'english', 0.9),
(11, 'bijli ka bill online kaise pay karein', 'roman_urdu', 1.0),
(11, 'online bill payment pakistan', 'roman_urdu', 0.9),
(11, 'بجلی کا بل آن لائن', 'urdu', 1.0),
(11, 'آن لائن بل ادائیگی', 'urdu', 0.9),
(11, 'bijli bill jazzcash', 'roman_urdu', 0.8),

-- CNIC
(15, 'cnic online apply', 'english', 1.0),
(15, 'nadra cnic application', 'english', 0.9),
(15, 'cnic online kaise banaye', 'roman_urdu', 1.0),
(15, 'nadra cnic apply online', 'roman_urdu', 0.9),
(15, 'شناختی کارڈ آن لائن', 'urdu', 1.0),
(15, 'نادرا شناختی کارڈ', 'urdu', 0.9),
(15, 'new cnic apply', 'english', 0.8),
(15, 'cnic banwana hai', 'roman_urdu', 0.8),

-- CNIC tracking
(16, 'cnic status check', 'english', 1.0),
(16, 'cnic application track karna', 'roman_urdu', 1.0),
(16, 'شناختی کارڈ اسٹیٹس', 'urdu', 1.0),

-- Passport
(20, 'passport online apply', 'english', 1.0),
(20, 'passport kaise banaye online', 'roman_urdu', 1.0),
(20, 'پاسپورٹ آن لائن', 'urdu', 1.0),

-- Facebook
(22, 'facebook account banana', 'roman_urdu', 1.0),
(22, 'create facebook account', 'english', 1.0),
(22, 'فیس بک اکاؤنٹ', 'urdu', 1.0),
(22, 'facebook account kaise banaye', 'roman_urdu', 0.9),

-- YouTube
(23, 'youtube video upload', 'english', 1.0),
(23, 'youtube par video kaise upload karein', 'roman_urdu', 1.0),
(23, 'یوٹیوب ویڈیو اپ لوڈ', 'urdu', 1.0),

-- Gmail
(27, 'gmail account banana', 'roman_urdu', 1.0),
(27, 'create gmail account', 'english', 1.0),
(27, 'جی میل اکاؤنٹ', 'urdu', 1.0),
(27, 'email account kaise banaye', 'roman_urdu', 0.9),
(27, 'google account create', 'english', 0.8),

-- Password reset
(29, 'email password bhool gaya', 'roman_urdu', 1.0),
(29, 'forgot email password', 'english', 1.0),
(29, 'ای میل پاسورڈ بھول گیا', 'urdu', 1.0),
(29, 'gmail password reset', 'english', 0.9),

-- Online scam
(30, 'online fraud se kaise bachein', 'roman_urdu', 1.0),
(30, 'online scam pakistan', 'english', 1.0),
(30, 'آن لائن دھوکہ دہی', 'urdu', 1.0),
(30, 'internet fraud', 'english', 0.8),

-- Cybercrime report
(32, 'cybercrime report pakistan', 'english', 1.0),
(32, 'FIA cybercrime', 'english', 0.9),
(32, 'سائبر کرائم رپورٹ', 'urdu', 1.0),
(32, 'online crime report karna', 'roman_urdu', 0.9),

-- CV writing
(33, 'cv kaise likhein urdu', 'roman_urdu', 1.0),
(33, 'write cv urdu', 'english', 1.0),
(33, 'سی وی اردو', 'urdu', 1.0),
(33, 'resume banana', 'roman_urdu', 0.9),

-- Rozee jobs
(34, 'rozee pk jobs apply', 'english', 1.0),
(34, 'rozee par job apply karna', 'roman_urdu', 1.0),
(34, 'Rozee نوکری', 'urdu', 1.0),

-- Government job
(36, 'government job online apply', 'english', 1.0),
(36, 'sarkari naukri online apply', 'roman_urdu', 1.0),
(36, 'سرکاری نوکری آن لائن', 'urdu', 1.0),
(36, 'fpsc jobs apply', 'english', 0.9);

-- ============================================
-- 6. TUTORIAL DEPENDENCIES
-- ============================================
INSERT INTO tutorial_dependencies (tutorial_id, prerequisite_id, is_mandatory) VALUES
(2, 1, true),   -- Location sharing requires basic WhatsApp messaging
(3, 1, true),   -- Video call requires basic messaging
(4, 1, true),   -- Voice message requires basic messaging
(5, 1, true),   -- Group requires basic messaging
(13, 12, true), -- Send money requires JazzCash account
(14, 12, true), -- Bill payment requires JazzCash account
(15, 12, true), -- Mobile recharge requires JazzCash account
(24, 23, false),-- CNIC tracking relates to CNIC application
(58, 57, true), -- Sending email requires Gmail account
(59, 57, true); -- Attaching files requires Gmail account

-- ============================================
-- 7. FEATURED CONTENT
-- ============================================
INSERT INTO featured_content (tutorial_id, feature_type, display_order, metadata) VALUES
(2, 'trending', 1, '{"reason": "Most searched this week"}'),
(12, 'recommended', 1, '{"reason": "Essential for digital payments"}'),
(23, 'hero', 1, '{"reason": "Important government service"}'),
(1, 'new', 1, '{"reason": "Recently added tutorial"}'),
(57, 'recommended', 2, '{"reason": "Essential for online services"}'),
(68, 'trending', 2, '{"reason": "Safety awareness"}');

-- ============================================
-- 8. SAMPLE QUERY LOGS
-- ============================================
INSERT INTO query_logs (session_id, query_text, matched_intent_id, matched_tutorial_id, confidence_score, query_status, response_time_ms) VALUES
(uuid_generate_v4(), 'whatsapp location send karna', 2, 2, 0.85, 'SUCCESS', 45),
(uuid_generate_v4(), 'jazzcash account kaise banaye', 8, 12, 0.92, 'SUCCESS', 38),
(uuid_generate_v4(), 'cnic online apply', 15, 23, 0.90, 'SUCCESS', 42),
(uuid_generate_v4(), 'bijli bill online', 11, 14, 0.88, 'SUCCESS', 41),
(uuid_generate_v4(), 'how to make video call whatsapp', 4, 3, 0.82, 'SUCCESS', 55),
(uuid_generate_v4(), 'gmail account banana', 27, 57, 0.89, 'SUCCESS', 48),
(uuid_generate_v4(), 'facebook account kaise banaye', 22, 34, 0.87, 'SUCCESS', 43),
(uuid_generate_v4(), 'online fraud se kaise bachein', 30, 68, 0.75, 'SUCCESS', 67),
(uuid_generate_v4(), 'rozee par job apply', 34, 80, 0.83, 'SUCCESS', 52),
(uuid_generate_v4(), 'passport online apply', 20, 27, 0.86, 'SUCCESS', 49),
(uuid_generate_v4(), 'easypaisa se paise bhejein', 10, 13, 0.91, 'SUCCESS', 37),
(uuid_generate_v4(), 'youtube channel banana', NULL, NULL, NULL, 'FAILED', 89),
(uuid_generate_v4(), 'how to make video call', 4, 3, 0.65, 'LOW_CONFIDENCE', 67),
(uuid_generate_v4(), 'facebook password change', NULL, NULL, NULL, 'FAILED', 89),
(uuid_generate_v4(), 'sarkari naukri online', 36, 82, 0.78, 'SUCCESS', 61);

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
DECLARE
  cat_count INT;
  tut_count INT;
  step_count INT;
  intent_count INT;
  kw_count INT;
BEGIN
  SELECT COUNT(*) INTO cat_count FROM categories;
  SELECT COUNT(*) INTO tut_count FROM tutorials;
  SELECT COUNT(*) INTO step_count FROM tutorial_steps;
  SELECT COUNT(*) INTO intent_count FROM intents;
  SELECT COUNT(*) INTO kw_count FROM keywords;

  RAISE NOTICE '✅ Seed data loaded successfully!';
  RAISE NOTICE '📊 Categories: %, Tutorials: %, Steps: %, Intents: %, Keywords: %',
    cat_count, tut_count, step_count, intent_count, kw_count;
END $$;
