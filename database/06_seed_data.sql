-- ============================================
-- ASAAN DIGITAL - SEED DATA
-- ADBMS Project - Spring 2026
-- ============================================
-- Purpose: Sample data for development and testing
-- Content: Real Pakistani digital literacy scenarios
-- ============================================

-- Clear existing data (optional - comment out in production)
-- TRUNCATE TABLE query_logs, keywords, intents, tutorial_steps, tutorials, categories CASCADE;

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
-- WhatsApp Tutorials
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

-- Digital Payments
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

-- Government Services
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

-- Social Media
(4, 'How to Create Facebook Account', 'فیس بک اکاؤنٹ کیسے بنائیں',
 'Create your Facebook account with mobile number',
 'موبائل نمبر سے فیسبک اکاؤنٹ بنائیں', 1, 10,
 '{"tags": ["facebook", "social-media", "account"]}'),

(4, 'How to Upload Video on YouTube', 'یوٹیوب پر ویڈیو کیسے اپ لوڈ کریں',
 'Upload your first video to YouTube from mobile',
 'موبائل سے یوٹیوب پر اپنی پہلی ویڈیو اپ لوڈ کریں', 2, 12,
 '{"tags": ["youtube", "video", "upload"]}'),

-- Phone Basics
(5, 'How to Set Alarm on Phone', 'فون پر الارم کیسے لگائیں',
 'Set daily alarms and reminders on your smartphone',
 'اسمارٹ فون پر روزانہ کے الارم اور ریمائنڈر لگائیں', 1, 3,
 '{"tags": ["alarm", "basics", "reminder"]}'),

(5, 'How to Save Contact Number', 'فون میں نمبر کیسے محفوظ کریں',
 'Save new contacts in your phone address book',
 'اپنی فون بک میں نئے نمبر محفوظ کریں', 1, 2,
 '{"tags": ["contacts", "basics", "phone"]}');

-- ============================================
-- 3. TUTORIAL STEPS
-- ============================================

-- WhatsApp Location Tutorial Steps (ID: 2)
INSERT INTO tutorial_steps (tutorial_id, step_number, instruction_urdu, instruction_english, image_url) VALUES
(2, 1, 'واٹس ایپ کھولیں', 'Open WhatsApp', '/images/whatsapp/open.jpg'),
(2, 2, 'جس شخص کو لوکیشن بھیجنی ہے اس کی چیٹ کھولیں', 'Open the chat of the person you want to share location with', '/images/whatsapp/chat.jpg'),
(2, 3, 'نیچے 📎 (اٹیچ) کے بٹن پر کلک کریں', 'Tap on the 📎 (attach) button at the bottom', '/images/whatsapp/attach.jpg'),
(2, 4, 'لوکیشن کے آپشن پر کلک کریں', 'Tap on the Location option', '/images/whatsapp/location-option.jpg'),
(2, 5, 'Send your current location پر کلک کریں', 'Tap on "Send your current location"', '/images/whatsapp/send-location.jpg');

-- JazzCash Account Tutorial Steps (ID: 4)
INSERT INTO tutorial_steps (tutorial_id, step_number, instruction_urdu, instruction_english) VALUES
(4, 1, 'گوگل پلے اسٹور یا ایپ اسٹور سے جاز کیش ایپ ڈاؤن لوڈ کریں', 'Download JazzCash app from Google Play Store or App Store'),
(4, 2, 'ایپ کھولیں اور "Register" پر کلک کریں', 'Open app and tap on "Register"'),
(4, 3, 'اپنا موبائل نمبر درج کریں', 'Enter your mobile number'),
(4, 4, 'ایس ایم ایس کے ذریعے آنے والا کوڈ درج کریں', 'Enter the code received via SMS'),
(4, 5, 'اپنا نام اور شناختی کارڈ نمبر درج کریں', 'Enter your name and CNIC number'),
(4, 6, 'ایم پن (5 ہندسوں کا پاسورڈ) بنائیں', 'Create an MPIN (5-digit password)'),
(4, 7, 'اکاؤنٹ بنانے کا عمل مکمل ہوگیا!', 'Account creation completed!');

-- CNIC Application Tutorial Steps (ID: 7)
INSERT INTO tutorial_steps (tutorial_id, step_number, instruction_urdu, instruction_english) VALUES
(7, 1, 'NADRA کی آفیشل ویب سائٹ pakidentity.gov.pk پر جائیں', 'Go to NADRA official website pakidentity.gov.pk'),
(7, 2, '"Apply for CNIC" کے بٹن پر کلک کریں', 'Click on "Apply for CNIC" button'),
(7, 3, 'اپنا موبائل نمبر اور ای میل درج کریں', 'Enter your mobile number and email'),
(7, 4, 'فارم میں مطلوبہ معلومات بھریں', 'Fill in the required information in the form'),
(7, 5, 'مطلوبہ دستاویزات کی سکین کاپی اپ لوڈ کریں', 'Upload scanned copies of required documents'),
(7, 6, 'ادائیگی کا طریقہ منتخب کریں اور فیس جمع کروائیں', 'Select payment method and pay the fee'),
(7, 7, 'اپائنٹمنٹ کی تاریخ اور وقت منتخب کریں', 'Select appointment date and time'),
(7, 8, 'درخواست جمع کروائیں اور ٹریکنگ نمبر محفوظ کرلیں', 'Submit application and save tracking number');

-- ============================================
-- 4. INTENTS
-- ============================================
INSERT INTO intents (tutorial_id, intent_name, description) VALUES
-- WhatsApp Location Intent
(2, 'share_whatsapp_location', 'User wants to share location on WhatsApp'),
(2, 'send_whatsapp_location', 'User wants to send their current location via WhatsApp'),
(2, 'whatsapp_location_guide', 'User needs help with WhatsApp location feature'),

-- JazzCash Account Intent
(4, 'create_jazzcash_account', 'User wants to create new JazzCash account'),
(4, 'jazzcash_registration', 'User needs help with JazzCash registration'),
(4, 'open_jazzcash_account', 'User wants to open JazzCash mobile account'),

-- CNIC Intent
(7, 'apply_cnic_online', 'User wants to apply for CNIC online'),
(7, 'nadra_cnic_application', 'User needs help with NADRA CNIC application'),
(7, 'new_cnic_apply', 'User wants to apply for new CNIC card'),

-- Bill Payment Intent
(6, 'pay_electricity_bill', 'User wants to pay electricity bill online'),
(6, 'bill_payment_online', 'User needs help with online bill payment'),
(6, 'bijli_bill_online', 'User wants to pay bijli bill online');

-- ============================================
-- 5. KEYWORDS (Multilingual)
-- ============================================
INSERT INTO keywords (intent_id, keyword, language, weight) VALUES
-- WhatsApp Location Keywords
(1, 'whatsapp location', 'english', 1.0),
(1, 'share location whatsapp', 'english', 0.9),
(1, 'whatsapp par location kaise bhejein', 'roman_urdu', 1.0),
(1, 'whatsapp location send karna', 'roman_urdu', 0.9),
(1, 'واٹس ایپ لوکیشن', 'urdu', 1.0),
(1, 'لوکیشن بھیجنا', 'urdu', 0.8),

-- JazzCash Account Keywords
(4, 'jazzcash account', 'english', 1.0),
(4, 'create jazzcash', 'english', 0.9),
(4, 'jazzcash account kaise banaye', 'roman_urdu', 1.0),
(4, 'jazzcash register', 'roman_urdu', 0.9),
(4, 'جاز کیش اکاؤنٹ', 'urdu', 1.0),
(4, 'جاز کیش کھاتہ', 'urdu', 0.8),

-- CNIC Keywords
(7, 'cnic online apply', 'english', 1.0),
(7, 'nadra cnic application', 'english', 0.9),
(7, 'cnic online kaise banaye', 'roman_urdu', 1.0),
(7, 'nadra cnic apply online', 'roman_urdu', 0.9),
(7, 'شناختی کارڈ آن لائن', 'urdu', 1.0),
(7, 'نادرا شناختی کارڈ', 'urdu', 0.9),

-- Bill Payment Keywords
(10, 'electricity bill online', 'english', 1.0),
(10, 'pay bill online', 'english', 0.9),
(10, 'bijli ka bill online kaise pay karein', 'roman_urdu', 1.0),
(10, 'online bill payment pakistan', 'roman_urdu', 0.9),
(10, 'بجلی کا بل آن لائن', 'urdu', 1.0),
(10, 'آن لائن بل ادائیگی', 'urdu', 0.9);

-- ============================================
-- 6. TUTORIAL DEPENDENCIES (Prerequisites)
-- ============================================
INSERT INTO tutorial_dependencies (tutorial_id, prerequisite_id, is_mandatory) VALUES
-- Need basic WhatsApp before location sharing
(2, 1, true),  -- Location sharing requires basic WhatsApp messaging
(3, 1, true),  -- Video call requires basic messaging

-- JazzCash payments require account
(5, 4, true),  -- Send money requires JazzCash account
(6, 4, true);  -- Bill payment requires JazzCash account

-- ============================================
-- 7. FEATURED CONTENT
-- ============================================
INSERT INTO featured_content (tutorial_id, feature_type, display_order, metadata) VALUES
(2, 'trending', 1, '{"reason": "Most searched this week"}'),
(4, 'recommended', 1, '{"reason": "Essential for digital payments"}'),
(7, 'hero', 1, '{"reason": "Important government service"}'),
(1, 'new', 1, '{"reason": "Recently added tutorial"}');

-- ============================================
-- 8. SAMPLE QUERY LOGS (For testing)
-- ============================================
INSERT INTO query_logs (session_id, query_text, matched_intent_id, matched_tutorial_id, confidence_score, query_status, response_time_ms) VALUES
(uuid_generate_v4(), 'whatsapp location send karna', 1, 2, 0.85, 'SUCCESS', 45),
(uuid_generate_v4(), 'jazzcash account kaise banaye', 4, 4, 0.92, 'SUCCESS', 38),
(uuid_generate_v4(), 'cnic online', 7, 7, 0.78, 'SUCCESS', 52),
(uuid_generate_v4(), 'bijli bill online', 10, 6, 0.88, 'SUCCESS', 41),
(uuid_generate_v4(), 'how to make video call', 3, 3, 0.65, 'LOW_CONFIDENCE', 67),
(uuid_generate_v4(), 'facebook password change', NULL, NULL, NULL, 'FAILED', 89);

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