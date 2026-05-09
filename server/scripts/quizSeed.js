// scripts/seedQuizzes.js
require('dotenv').config();
const mongoose = require('mongoose');
const { Quiz } = require('../models/quizModel');

// Urdu questions for each tutorial category
const getUrduQuestions = (tutorialId, tutorialTitle) => {
  // WhatsApp Questions (Tutorials 1-11)
  if (tutorialId >= 1 && tutorialId <= 11) {
    return [
      {
        question_text: 'واٹس ایپ پر نیا چیٹ شروع کرنے کے لیے کون سا آئیکن دبانا ہے؟',
        options: ['کیمرہ آئیکن', 'سبز پنسل/پیغام آئیکن', 'سیٹنگز گیئر', 'تلاش بار'],
        correct_index: 1,
        explanation: 'نیا چیٹ شروع کرنے کے لیے نیچے دائیں طرف سبز آئیکن استعمال ہوتا ہے۔'
      },
      {
        question_text: 'واٹس ایپ پر پیغام ٹائپ کرنے والا باکس کہاں ہوتا ہے؟',
        options: ['بالکل اوپر', 'سیٹنگز مینو میں', 'اسکرین کے نیچے', 'پروفائل تصویر پر'],
        correct_index: 2,
        explanation: 'ٹیکسٹ ان پٹ باکس ہمیشہ چیٹ ونڈو کے نیچے ہوتا ہے۔'
      },
      {
        question_text: 'پیغام لکھنے کے بعد اسے بھیجنے کے لیے کیا کرنا ہوتا ہے؟',
        options: ['فون ہلانا', 'بھیجنے والے تیر/بٹن کو دبانا', 'ایپ بند کرنا', '5 منٹ انتظار کرنا'],
        correct_index: 1,
        explanation: 'ٹیکسٹ باکس کے آگے تیر کے نشان والا بٹن دبانے سے پیغام فوراً بھیج جاتا ہے۔'
      },
      {
        question_text: 'کیا واٹس ایپ استعمال کرنے کے لیے فون نمبر ضروری ہے؟',
        options: ['ہاں', 'نہیں', 'صرف اتوار کو', 'صرف ویڈیو کالز کے لیے'],
        correct_index: 0,
        explanation: 'واٹس ایپ اکاؤنٹس آپ کے موبائل فون نمبر سے منسلک ہوتے ہیں۔'
      },
      {
        question_text: 'واٹس ایپ پر ایک سرمئی ٹک کا کیا مطلب ہے؟',
        options: ['پیغام پڑھ لیا گیا', 'پیغام پہنچ گیا', 'پیغام کامیابی سے بھیج دیا گیا', 'پیغام ناکام ہوگیا'],
        correct_index: 2,
        explanation: 'ایک سرمئی ٹک کا مطلب ہے پیغام آپ کے فون سے نکل گیا ہے۔'
      }
    ];
  }
  
  // Digital Payments Questions (Tutorials 12-22)
  if (tutorialId >= 12 && tutorialId <= 22) {
    return [
      {
        question_text: 'موبائل والیٹ اکاؤنٹ بنانے کا پہلا قدم کیا ہے؟',
        options: ['بینک جانا', 'ایپ ڈاؤن لوڈ کرنا', 'نیا SIM خریدنا', 'کسٹمر سپورٹ کو کال کرنا'],
        correct_index: 1,
        explanation: 'رجسٹریشن شروع کرنے کا سب سے آسان طریقہ سرکاری ایپ ڈاؤن لوڈ کرنا ہے۔'
      },
      {
        question_text: 'رجسٹریشن کے لیے کون سا دستاویز نمبر ضروری ہے؟',
        options: ['پاسپورٹ', 'ڈرائیونگ لائسنس', 'CNIC نمبر', 'یوٹیلیٹی بل'],
        correct_index: 2,
        explanation: 'تصدیق کے لیے آپ کے کمپیوٹرائزڈ قومی شناختی کارڈ (CNIC) کی ضرورت ہوتی ہے۔'
      },
      {
        question_text: 'MPIN کیا ہے؟',
        options: ['ایک قسم کا SIM کارڈ', '5 ہندسوں کا خفیہ پاسورڈ', 'آپ کا صارف نام', 'ایک ای میل ایڈریس'],
        correct_index: 1,
        explanation: 'MPIN ایک خفیہ 5 ہندسوں کا کوڈ ہے جو لین دین کی اجازت دیتا ہے۔'
        },
      {
        question_text: 'تصدیقی کوڈ (OTP) کیسے ملتا ہے؟',
        options: ['ای میل کے ذریعے', 'ڈاک کے ذریعے', 'ایس ایم ایس کے ذریعے', 'واٹس ایپ کے ذریعے'],
        correct_index: 2,
        explanation: 'سروسز آپ کے رجسٹرڈ موبائل نمبر پر ایک بار کا پاس ورڈ (OTP) بھیجتی ہیں۔'
      },
      {
        question_text: 'کیا ان خدمات کو انٹرنیٹ کنکشن کے بغیر استعمال کیا جا سکتا ہے؟',
        options: ['ہاں، USSD کوڈ کے ذریعے', 'نہیں، کبھی نہیں', 'صرف بیلنس چیک کرنے کے لیے', 'صرف مخصوص نیٹ ورکس پر'],
        correct_index: 0,
        explanation: 'بہت سی سروسز USSD کوڈز پیش کرتی ہیں جو ڈیٹا کے بغیر کام کرتی ہیں۔'
      }
    ];
  }
  
  // Government Services Questions (Tutorials 23-33)
  if (tutorialId >= 23 && tutorialId <= 33) {
    return [
      {
        question_text: 'CNIC کی درخواستوں کے لیے کون سی سرکاری ویب سائٹ استعمال ہوتی ہے؟',
        options: ['facebook.com', 'pakidentity.gov.pk', 'google.com', 'nadra.org.pk'],
        correct_index: 1,
        explanation: 'پاک-آئیڈینٹی آن لائن شناختی خدمات کے لیے سرکاری NADRA پورٹل ہے۔'
      },
      {
        question_text: 'اپنی درخواست ٹریک کرنے کے لیے آپ کو کیا ملتا ہے؟',
        options: ['ایک فزیکل چابی', 'ایک ٹریکنگ نمبر', 'ایک نیا فون', 'صدر سے ای میل'],
        correct_index: 1,
        explanation: 'NADRA آپ کی شناختی کارڈ درخواست کی پیشرفت کو مانیٹر کرنے کے لیے ٹریکنگ نمبر فراہم کرتا ہے۔'
      },
      {
        question_text: 'کیا آپ کو اسکین شدہ دستاویزات اپ لوڈ کرنے کی ضرورت ہے؟',
        options: ['نہیں', 'صرف آپ کی تصویر', 'ہاں، مطلوبہ دستاویزات اسکین کی جائیں', 'صرف اگر آپ بیرون ملک ہیں'],
        correct_index: 2,
        explanation: 'تصدیق کے لیے آپ کو معاون دستاویزات کے واضح اسکین اپ لوڈ کرنے ہوں گے۔'
      },
      {
        question_text: 'فیس آن لائن کیسے ادا کی جاتی ہے؟',
        options: ['پوسٹ مین کو نقد دینا', 'کریڈٹ/ڈیبٹ کارڈ یا موبائل والیٹ', 'یہ مفت ہے', 'چیک بھیج کر'],
        correct_index: 1,
        explanation: 'آن لائن درخواستوں کے لیے کارڈز یا منسلک موبائل والیٹس کے ذریعے ڈیجیٹل ادائیگی کی ضرورت ہوتی ہے۔'
      },
      {
        question_text: 'فارم بھرنے کے بعد آخری مرحلہ کیا ہے؟',
        options: ['ایپ ڈیلیٹ کرنا', 'جمع کروانا اور ٹریکنگ ID محفوظ کرنا', 'پوری ویب سائٹ پرنٹ کرنا', 'NADRA آفس کال کرنا'],
        correct_index: 1,
        explanation: 'آپ کو درخواست جمع کروانی ہوگی اور مستقبل کے حوالے کے لیے ٹریکنگ ID رکھنی ہوگی۔'
      }
    ];
  }
  
  // Social Media Questions (Tutorials 34-44)
  if (tutorialId >= 34 && tutorialId <= 44) {
    return [
      {
        question_text: 'سوشل میڈیا اکاؤنٹ بنانے کے لیے کون سی معلومات درکار ہوتی ہیں؟',
        options: ['CNIC نمبر', 'ای میل یا فون نمبر', 'بینک اکاؤنٹ', 'گھر کا پتہ'],
        correct_index: 1,
        explanation: 'زیادہ تر سوشل میڈیا پلیٹ فارمز کو سائن اپ کرنے کے لیے ای میل ایڈریس یا فون نمبر کی ضرورت ہوتی ہے۔'
      },
      {
        question_text: 'مضبوط پاس ورڈ کیا ہوتا ہے؟',
        options: ['آپ کا نام', '123456', 'حروف، نمبرز اور علامتوں کا مرکب', 'آپ کی تاریخ پیدائش'],
        correct_index: 2,
        explanation: 'مضبوط پاس ورڈ بڑے، چھوٹے حروف، نمبرز اور خاص علامتوں کا مجموعہ استعمال کرتے ہیں۔'
      },
      {
        question_text: 'کیا آپ کو اجنبیوں کی دوستی کی درخواستیں قبول کرنی چاہئیں؟',
        options: ['ہاں، ہمیشہ', 'نہیں، صرف ان لوگوں سے جنہیں آپ جانتے ہیں', 'صرف اگر ان کے پاس تصاویر ہیں', 'صرف اگر وہ پیغام بھیجیں'],
        correct_index: 1,
        explanation: 'حفاظت کے لیے، صرف ان لوگوں سے دوستی کی درخواستیں قبول کریں جنہیں آپ حقیقی زندگی میں جانتے ہیں۔'
      },
      {
        question_text: 'دو عنصری تصدیق (2FA) کیا ہے؟',
        options: ['دو پاس ورڈ', 'اضافی حفاظتی پرت جسے کوڈ کی ضرورت ہوتی ہے', 'دو مختلف اکاؤنٹس', 'دوستوں کے ساتھ پاس ورڈ شیئر کرنا'],
        correct_index: 1,
        explanation: '2FA آپ کے اکاؤنٹ کی حفاظت کے لیے ایک اضافی قدم کا اضافہ کرتا ہے، جیسے آپ کے فون پر بھیجا گیا کوڈ۔'
      },
      {
        question_text: 'آپ نامناسب مواد کی رپورٹ کیسے کر سکتے ہیں؟',
        options: ['اسے نظر انداز کریں', 'رپورٹ بٹن استعمال کریں', 'دوستوں کے ساتھ شیئر کریں', 'اس پر تبصرہ کریں'],
        correct_index: 1,
        explanation: 'زیادہ تر پلیٹ فارمز میں جائزے کے لیے نامناسب مواد کو جھنڈا لگانے کے لیے رپورٹ بٹن ہوتا ہے۔'
      }
    ];
  }
  
  // Phone Basics Questions (Tutorials 45-55)
  if (tutorialId >= 45 && tutorialId <= 55) {
    return [
      {
        question_text: 'اسمارٹ فون کیا ہے؟',
        options: ['ایک فون جو صرف کال کر سکتا ہے', 'ایک فون جس میں کمپیوٹر جیسی خصوصیات اور ٹچ اسکرین ہو', 'ایک فون جس میں بہت لمبی بیٹری ہو', 'ایک پرانے زمانے کا لینڈ لائن فون'],
        correct_index: 1,
        explanation: 'اسمارٹ فون فون کالز کو انٹرنیٹ تک رسائی، ایپس، اور ٹچ اسکرین فیچرز کے ساتھ جوڑتے ہیں۔'
      },
      {
        question_text: 'پلے اسٹور / ایپ اسٹور کیا ہے؟',
        options: ['ایک فزیکل اسٹور', 'وہ جگہ جہاں سے آپ ایپس ڈاؤن لوڈ کرتے ہیں', 'ایک فون برانڈ', 'ایک قسم کا SIM کارڈ'],
        correct_index: 1,
        explanation: 'ایپ اسٹور ڈیجیٹل مارکیٹ پلیس ہیں جہاں سے آپ اپنے فون کے لیے ایپلی کیشنز ڈاؤن لوڈ کر سکتے ہیں۔'
      },
      {
        question_text: 'WiFi آپ کو کیا کرنے دیتا ہے؟',
        options: ['فون کالز کرنا', 'موبائل ڈیٹا استعمال کیے بغیر انٹرنیٹ سے جڑنا', 'اپنا فون چارج کرنا', 'بہتر تصاویر لینا'],
        correct_index: 1,
        explanation: 'WiFi آپ کو اپنے فون کے موبائل ڈیٹا پلان کا استعمال کیے بغیر انٹرنیٹ سے جڑنے دیتا ہے۔'
      },
      {
        question_text: 'اسکرین شاٹ کیا ہے؟',
        options: ['آپ کی اسکرین کی تصویر', 'ایک ویڈیو ریکارڈنگ', 'ایک قسم کی ایپ', 'ایک فون سیٹنگ'],
        correct_index: 0,
        explanation: 'اسکرین شاٹ اس لمحے آپ کی فون اسکرین پر بالکل وہی کچھ کیپچر کرتا ہے جو دکھایا جا رہا ہے۔'
      },
      {
        question_text: 'آپ اپنے فون پر الارم کیسے لگاتے ہیں؟',
        options: ['بیٹری نکال کر', 'گھنٹی ایپ استعمال کرکے', 'کسی کو کال کرکے', 'ٹیکسٹ میسج بھیج کر'],
        correct_index: 1,
        explanation: 'زیادہ تر فون میں گھنٹی ایپ ہوتی ہے جہاں آپ الارم اور ٹائمر لگا سکتے ہیں۔'
      }
    ];
  }
  
  // Email & Internet Questions (Tutorials 56-66)
  if (tutorialId >= 56 && tutorialId <= 66) {
    return [
      {
        question_text: 'ایک درست ای میل ایڈریس کی شکل کیا ہوتی ہے؟',
        options: ['username@domain.com', 'username.domain.com', 'username@domain', '@username.domain.com'],
        correct_index: 0,
        explanation: 'ای میل ایڈریس کی شکل ہوتی ہے: username@domain.com (یا .org, .net، وغیرہ)'
      },
      {
        question_text: 'ای میل میں CC کا کیا مطلب ہے؟',
        options: ['کاربن کاپی - دوسروں کو ایک کاپی بھیجتا ہے', 'قریبی کنکشن', 'کمپیوٹر کوڈ', 'کاپی بنائیں'],
        correct_index: 0,
        explanation: 'CC (کاربن کاپی) آپ کو اضافی لوگوں کو ای میل کی ایک کاپی بھیجنے دیتا ہے۔'
      },
      {
        question_text: 'تلاش انجن (Search Engine) کیا ہے؟',
        options: ['ایک قسم کی کار', 'ایک ویب سائٹ جو آن لائن معلومات تلاش کرتی ہے (جیسے Google)', 'ایک فون برانڈ', 'ایک ای میل فراہم کنندہ'],
        correct_index: 1,
        explanation: 'تلاش انجن جیسے Google آپ کو انٹرنیٹ پر ویب سائٹس اور معلومات تلاش کرنے میں مدد کرتے ہیں۔'
      },
      {
        question_text: 'براؤزر کیا ہے؟',
        options: ['ایک شخص جو براؤز کرتا ہے', 'ویب سائٹس دیکھنے کے لیے ایک ایپ (جیسے Chrome)', 'ایک قسم کی فائل', 'ایک تلاش کا نتیجہ'],
        correct_index: 1,
        explanation: 'براؤزر جیسے Chrome، Firefox، اور Safari ایسی ایپس ہیں جو ویب سائٹس دکھاتی ہیں۔'
      },
      {
        question_text: 'آپ کو مشکوک ای میلز کے ساتھ کیا کرنا چاہیے؟',
        options: ['سوالات پوچھ کر جواب دینا', 'تمام لنکس پر کلک کرنا', 'حذف کرنا اور جواب نہ دینا', 'تمام دوستوں کو فارورڈ کرنا'],
        correct_index: 2,
        explanation: 'مشکوک ای میلز اسکیم ہو سکتی ہیں۔ لنکس پر کلک نہ کریں یا جواب نہ دیں، بس حذف کر دیں۔'
      }
    ];
  }
  
  // Online Safety Questions (Tutorials 67-77)
  if (tutorialId >= 67 && tutorialId <= 77) {
    return [
      {
        question_text: 'آن لائن فراڈ (scam) کیا ہے؟',
        options: ['ایک ویڈیو گیم', 'آپ کے پیسے یا معلومات چرانے کی چال', 'ایک قسم کا اینٹی وائرس', 'ایک سوشل میڈیا پوسٹ'],
        correct_index: 1,
        explanation: 'فراڈ بے ایمان اسکیمیں ہیں جو آپ کو پیسے یا ذاتی معلومات دینے کے لیے دھوکہ دینے کے لیے بنائی گئی ہیں۔'
      },
      {
        question_text: 'کیا آپ کو اپنا پاس ورڈ کسی کے ساتھ شیئر کرنا چاہیے؟',
        options: ['ہاں، دوستوں کے ساتھ', 'ہاں، خاندان کے ساتھ', 'نہیں، کبھی بھی اپنا پاس ورڈ شیئر نہ کریں', 'صرف بینک ملازمین کے ساتھ'],
        correct_index: 2,
        explanation: 'اپنے پاس ورڈ کبھی بھی کسی کے ساتھ شیئر نہ کریں، یہاں تک کہ دوستوں یا خاندان کے ساتھ بھی نہیں۔'
      },
      {
        question_text: 'فشنگ (Phishing) کیا ہے؟',
        options: ['تعریفوں کے لیے مچھلی پکڑنا', 'جعلی پیغامات جو حقیقی کمپنیوں کا بہانہ کرتے ہیں', 'ایک قسم کا فون کیس', 'ایک نئی ایپ'],
        correct_index: 1,
        explanation: 'فشنگ فراڈ جعلی ای میلز یا پیغامات کا استعمال کرتے ہیں جو معلومات چرانے کے لیے حقیقی کمپنیوں سے ظاہر ہوتے ہیں۔'
      },
      {
        question_text: 'ایک پاس ورڈ کو مضبوط کیا بناتا ہے؟',
        options: ['چھوٹا اور آسان', 'آپ کا نام اور تاریخ پیدائش', 'لمبا، بے ترتیب، اور ہر اکاؤنٹ کے لیے مختلف', 'لفظ "پاس ورڈ"'],
        correct_index: 2,
        explanation: 'مضبوط پاس ورڈ طویل ہوتے ہیں، بے ترتیب حروف استعمال کرتے ہیں، اور ہر اکاؤنٹ کے لیے مختلف ہوتے ہیں۔'
      },
      {
        question_text: 'اینٹی وائرس سافٹ ویئر کیا کرتا ہے؟',
        options: ['جراثیم سے بچاتا ہے', 'آپ کے فون/کمپیوٹر کو وائرس اور مالویئر سے بچاتا ہے', 'انٹرنیٹ تیز کرتا ہے', 'تصاویر لیتا ہے'],
        correct_index: 1,
        explanation: 'اینٹی وائرس سافٹ ویئر آپ کے آلات سے نقصان دہ سافٹ ویئر (وائرس) کا پتہ لگاتا اور ہٹاتا ہے۔'
      }
    ];
  }
  
  // Job Applications Questions (Tutorials 78-88)
  return [
    {
      question_text: 'CV/رزومے کیا ہے؟',
      options: ['ایک تصویر', 'ایک دستاویز جو آپ کی مہارتوں اور تجربے کی فہرست دیتی ہے', 'ایک کور لیٹر', 'ایک درخواست فارم'],
      correct_index: 1,
      explanation: 'CV یا رزومے ایک دستاویز ہے جو آپ کی تعلیم، کام کے تجربے، اور مہارتوں کا خلاصہ آجروں کے لیے کرتی ہے۔'
    },
    {
      question_text: 'CV میں کیا شامل کیا جانا چاہیے؟',
      options: ['صرف آپ کے مشاغل', 'آپ کی مکمل زندگی کی کہانی', 'رابطہ کی معلومات، تعلیم، کام کا تجربہ، مہارتیں', 'آپ کے خاندان کی تفصیلات'],
      correct_index: 2,
      explanation: 'ایک اچھے CV میں آپ کی رابطہ کی معلومات، تعلیمی تاریخ، کام کا تجربہ، اور متعلقہ مہارتیں شامل ہوتی ہیں۔'
    },
    {
      question_text: 'کور لیٹر کیا ہے؟',
      options: ['انٹرویو کے بعد بھیجا جانے والا خط', 'ایک خط جو بتاتا ہے کہ آپ کسی مخصوص نوکری کے لیے کیوں اہل ہیں', 'آپ کے CV کی کاپی', 'ایک حوالہ خط'],
      correct_index: 1,
      explanation: 'کور لیٹر ایک ذاتی خط ہے جو بتاتا ہے کہ آپ کسی مخصوص عہدے کے لیے بہترین امیدوار کیوں ہیں۔'
    },
    {
      question_text: 'نوکری کے انٹرویو سے پہلے آپ کو کیا کرنا چاہیے؟',
      options: ['کمپنی پر تحقیق کرنا', 'بغیر تیاری کے پہنچنا', 'اپنے تمام دوستوں کو لانا', 'عام کپڑے پہننا'],
      correct_index: 0,
      explanation: 'کمپنی پر تحقیق کرنے سے آپ کو ان کے کام کو سمجھنے اور انٹرویو کے سوالوں کے لیے اچھے جوابات تیار کرنے میں مدد ملتی ہے۔'
    },
    {
      question_text: 'فری لانسنگ کیا ہے؟',
      options: ['مفت کام کرنا', 'مختلف کلائنٹس کے لیے منصوبوں پر آزادانہ طور پر کام کرنا', 'دفتر میں صبح 9 سے شام 5 تک کام کرنا', 'فیکٹری میں کام کرنا'],
      correct_index: 1,
      explanation: 'فری لانسرز خود ملازمت والے افراد ہوتے ہیں جو اکثر آن لائن متعدد کلائنٹس کے لیے منصوبوں پر کام کرتے ہیں۔'
    }
  ];
};

// All tutorials from your database
const tutorials = [
  // WhatsApp (1-11)
  { id: 1, title: 'How to Send WhatsApp Message' },
  { id: 2, title: 'How to Send Location on WhatsApp' },
  { id: 3, title: 'How to Make WhatsApp Video Call' },
  { id: 4, title: 'How to Send Voice Message on WhatsApp' },
  { id: 5, title: 'How to Create WhatsApp Group' },
  { id: 6, title: 'How to Block Someone on WhatsApp' },
  { id: 7, title: 'How to Send WhatsApp Photos' },
  { id: 8, title: 'How to Download WhatsApp Status' },
  { id: 9, title: 'How to Use WhatsApp Web' },
  { id: 10, title: 'How to Update WhatsApp' },
  { id: 11, title: 'How to Change WhatsApp Profile Picture' },
  // Digital Payments (12-22)
  { id: 12, title: 'How to Create JazzCash Account' },
  { id: 13, title: 'How to Send Money via Easypaisa' },
  { id: 14, title: 'How to Pay Electricity Bill Online' },
  { id: 15, title: 'How to Load Mobile Balance via JazzCash' },
  { id: 16, title: 'How to Pay Gas Bill Online' },
  { id: 17, title: 'How to Check JazzCash Balance' },
  { id: 18, title: 'How to Withdraw Cash from Easypaisa' },
  { id: 19, title: 'How to Pay Internet Bill Online' },
  { id: 20, title: 'How to Open Meezan Bank Account Online' },
  { id: 21, title: 'How to Pay School Fees Online' },
  { id: 22, title: 'How to Use HBL Mobile App' },
  // Government Services (23-33)
  { id: 23, title: 'How to Apply for CNIC Online' },
  { id: 24, title: 'How to Check FBR Tax Status' },
  { id: 25, title: 'How to Apply for Passport Online' },
  { id: 26, title: 'How to Track CNIC Application Status' },
  { id: 27, title: 'How to Register for Voter ID' },
  { id: 28, title: 'How to Pay Property Tax Online' },
  { id: 29, title: 'How to Apply for Domicile Certificate' },
  { id: 30, title: 'How to Check Pension Status Online' },
  { id: 31, title: 'How to Register Business with SECP' },
  { id: 32, title: 'How to Apply for Birth Certificate Online' },
  { id: 33, title: 'How to File Income Tax Return Online' },
  // Social Media (34-44)
  { id: 34, title: 'How to Create Facebook Account' },
  { id: 35, title: 'How to Upload Video on YouTube' },
  { id: 36, title: 'How to Create Instagram Account' },
  { id: 37, title: 'How to Change Facebook Password' },
  { id: 38, title: 'How to Go Live on Facebook' },
  { id: 39, title: 'How to Create YouTube Channel' },
  { id: 40, title: 'How to Use TikTok Safely' },
  { id: 41, title: 'How to Report Fake Facebook Profile' },
  { id: 42, title: 'How to Earn Money from YouTube' },
  { id: 43, title: 'How to Create Facebook Page for Business' },
  { id: 44, title: 'How to Use LinkedIn for Job Search' },
  // Phone Basics (45-55)
  { id: 45, title: 'How to Set Alarm on Phone' },
  { id: 46, title: 'How to Save Contact Number' },
  { id: 47, title: 'How to Take Screenshot on Android' },
  { id: 48, title: 'How to Increase Phone Storage' },
  { id: 49, title: 'How to Connect Phone to WiFi' },
  { id: 50, title: 'How to Transfer Photos to Computer' },
  { id: 51, title: 'How to Clear Phone Cache' },
  { id: 52, title: 'How to Set Ringtone on Android' },
  { id: 53, title: 'How to Backup Phone Data' },
  { id: 54, title: 'How to Use Google Maps for Navigation' },
  { id: 55, title: 'How to Install App from Play Store' },
  // Email & Internet (56-66)
  { id: 56, title: 'How to Create Gmail Account' },
  { id: 57, title: 'How to Send Email on Gmail' },
  { id: 58, title: 'How to Attach File in Email' },
  { id: 59, title: 'How to Use Google Drive' },
  { id: 60, title: 'How to Use Google Search Effectively' },
  { id: 61, title: 'How to Reset Forgotten Email Password' },
  { id: 62, title: 'How to Use Zoom for Video Meetings' },
  { id: 63, title: 'How to Download YouTube Videos' },
  { id: 64, title: 'How to Use Google Translate' },
  { id: 65, title: 'How to Use Microsoft Word on Phone' },
  { id: 66, title: 'How to Video Call on Google Meet' },
  // Online Safety (67-77)
  { id: 67, title: 'How to Identify Online Scams' },
  { id: 68, title: 'How to Create Strong Password' },
  { id: 69, title: 'How to Enable Two-Factor Authentication' },
  { id: 70, title: 'How to Protect Personal Information Online' },
  { id: 71, title: 'How to Avoid WhatsApp Scams' },
  { id: 72, title: 'How to Report Cybercrime in Pakistan' },
  { id: 73, title: 'How to Spot Fake Online Shops' },
  { id: 74, title: 'How to Secure Your WiFi Network' },
  { id: 75, title: 'How to Protect Children Online' },
  { id: 76, title: 'How to Avoid Investment Scams Online' },
  { id: 77, title: 'How to Use VPN Safely' },
  // Job Applications (78-88)
  { id: 78, title: 'How to Write CV in Urdu' },
  { id: 79, title: 'How to Apply for Jobs on Rozee.pk' },
  { id: 80, title: 'How to Create Profile on Upwork' },
  { id: 81, title: 'How to Apply for Government Jobs Online' },
  { id: 82, title: 'How to Prepare for Online Interview' },
  { id: 83, title: 'How to Use Fiverr to Earn Money' },
  { id: 84, title: 'How to Write Cover Letter in English' },
  { id: 85, title: 'How to Apply for Jobs on Indeed' },
  { id: 86, title: 'How to Get Freelancing Projects as Beginner' },
  { id: 87, title: 'How to Use Daraz to Sell Products' },
  { id: 88, title: 'How to Prepare for FPSC CSS Exam Online' }
];

async function seedQuizzes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing quizzes
    const deleted = await Quiz.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing quizzes`);
    
    const quizzes = [];
    
    for (const tutorial of tutorials) {
      const questions = getUrduQuestions(tutorial.id, tutorial.title);
      
      quizzes.push({
        tutorial_id: tutorial.id,
        tutorial_title: tutorial.title,
        questions: questions,
        generated_at: new Date(),
        generation_model: 'urdu-manual-seed'
      });
    }
    
    const inserted = await Quiz.insertMany(quizzes);
    console.log(`✅ Successfully seeded ${inserted.length} quizzes with Urdu questions`);
    
    // Display summary
    console.log('\n📋 Seeded Quizzes Summary (Urdu):');
    inserted.slice(0, 10).forEach(q => {
      console.log(`  - Tutorial ${q.tutorial_id}: ${q.tutorial_title}`);
      console.log(`    Question 1: ${q.questions[0].question_text.substring(0, 50)}...`);
    });
    if (inserted.length > 10) {
      console.log(`  ... and ${inserted.length - 10} more`);
    }
    
    console.log('\n✨ Quiz seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding quizzes:', err.message);
    process.exit(1);
  }
}

seedQuizzes();