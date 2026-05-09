// scripts/seedVideos.js
require('dotenv').config();
const mongoose = require('mongoose');
const { Video } = require('../models/videoModel');

const YOUTUBE_URL = 'https://www.youtube.com/watch?v=vttOPV_TWeg';

// All tutorials from your INSERT statement
const tutorials = [
  // WhatsApp (1-11)
  { id: 1, title: 'How to Send WhatsApp Message', duration: 5 },
  { id: 2, title: 'How to Send Location on WhatsApp', duration: 4 },
  { id: 3, title: 'How to Make WhatsApp Video Call', duration: 3 },
  { id: 4, title: 'How to Send Voice Message on WhatsApp', duration: 3 },
  { id: 5, title: 'How to Create WhatsApp Group', duration: 5 },
  { id: 6, title: 'How to Block Someone on WhatsApp', duration: 3 },
  { id: 7, title: 'How to Send WhatsApp Photos', duration: 3 },
  { id: 8, title: 'How to Download WhatsApp Status', duration: 4 },
  { id: 9, title: 'How to Use WhatsApp Web', duration: 6 },
  { id: 10, title: 'How to Update WhatsApp', duration: 4 },
  { id: 11, title: 'How to Change WhatsApp Profile Picture', duration: 3 },
  // Digital Payments (12-22)
  { id: 12, title: 'How to Create JazzCash Account', duration: 10 },
  { id: 13, title: 'How to Send Money via Easypaisa', duration: 8 },
  { id: 14, title: 'How to Pay Electricity Bill Online', duration: 6 },
  { id: 15, title: 'How to Load Mobile Balance via JazzCash', duration: 5 },
  { id: 16, title: 'How to Pay Gas Bill Online', duration: 6 },
  { id: 17, title: 'How to Check JazzCash Balance', duration: 2 },
  { id: 18, title: 'How to Withdraw Cash from Easypaisa', duration: 8 },
  { id: 19, title: 'How to Pay Internet Bill Online', duration: 5 },
  { id: 20, title: 'How to Open Meezan Bank Account Online', duration: 15 },
  { id: 21, title: 'How to Pay School Fees Online', duration: 7 },
  { id: 22, title: 'How to Use HBL Mobile App', duration: 12 },
  // Government Services (23-33)
  { id: 23, title: 'How to Apply for CNIC Online', duration: 20 },
  { id: 24, title: 'How to Check FBR Tax Status', duration: 12 },
  { id: 25, title: 'How to Apply for Passport Online', duration: 25 },
  { id: 26, title: 'How to Track CNIC Application Status', duration: 5 },
  { id: 27, title: 'How to Register for Voter ID', duration: 15 },
  { id: 28, title: 'How to Pay Property Tax Online', duration: 10 },
  { id: 29, title: 'How to Apply for Domicile Certificate', duration: 20 },
  { id: 30, title: 'How to Check Pension Status Online', duration: 8 },
  { id: 31, title: 'How to Register Business with SECP', duration: 30 },
  { id: 32, title: 'How to Apply for Birth Certificate Online', duration: 15 },
  { id: 33, title: 'How to File Income Tax Return Online', duration: 45 },
  // Social Media (34-44)
  { id: 34, title: 'How to Create Facebook Account', duration: 10 },
  { id: 35, title: 'How to Upload Video on YouTube', duration: 12 },
  { id: 36, title: 'How to Create Instagram Account', duration: 8 },
  { id: 37, title: 'How to Change Facebook Password', duration: 5 },
  { id: 38, title: 'How to Go Live on Facebook', duration: 8 },
  { id: 39, title: 'How to Create YouTube Channel', duration: 15 },
  { id: 40, title: 'How to Use TikTok Safely', duration: 10 },
  { id: 41, title: 'How to Report Fake Facebook Profile', duration: 5 },
  { id: 42, title: 'How to Earn Money from YouTube', duration: 20 },
  { id: 43, title: 'How to Create Facebook Page for Business', duration: 15 },
  { id: 44, title: 'How to Use LinkedIn for Job Search', duration: 20 },
  // Phone Basics (45-55)
  { id: 45, title: 'How to Set Alarm on Phone', duration: 3 },
  { id: 46, title: 'How to Save Contact Number', duration: 2 },
  { id: 47, title: 'How to Take Screenshot on Android', duration: 2 },
  { id: 48, title: 'How to Increase Phone Storage', duration: 8 },
  { id: 49, title: 'How to Connect Phone to WiFi', duration: 3 },
  { id: 50, title: 'How to Transfer Photos to Computer', duration: 8 },
  { id: 51, title: 'How to Clear Phone Cache', duration: 5 },
  { id: 52, title: 'How to Set Ringtone on Android', duration: 4 },
  { id: 53, title: 'How to Backup Phone Data', duration: 10 },
  { id: 54, title: 'How to Use Google Maps for Navigation', duration: 6 },
  { id: 55, title: 'How to Install App from Play Store', duration: 4 },
  // Email & Internet (56-66)
  { id: 56, title: 'How to Create Gmail Account', duration: 10 },
  { id: 57, title: 'How to Send Email on Gmail', duration: 5 },
  { id: 58, title: 'How to Attach File in Email', duration: 5 },
  { id: 59, title: 'How to Use Google Drive', duration: 10 },
  { id: 60, title: 'How to Use Google Search Effectively', duration: 8 },
  { id: 61, title: 'How to Reset Forgotten Email Password', duration: 8 },
  { id: 62, title: 'How to Use Zoom for Video Meetings', duration: 10 },
  { id: 63, title: 'How to Download YouTube Videos', duration: 6 },
  { id: 64, title: 'How to Use Google Translate', duration: 5 },
  { id: 65, title: 'How to Use Microsoft Word on Phone', duration: 10 },
  { id: 66, title: 'How to Video Call on Google Meet', duration: 7 },
  // Online Safety (67-77)
  { id: 67, title: 'How to Identify Online Scams', duration: 10 },
  { id: 68, title: 'How to Create Strong Password', duration: 5 },
  { id: 69, title: 'How to Enable Two-Factor Authentication', duration: 8 },
  { id: 70, title: 'How to Protect Personal Information Online', duration: 10 },
  { id: 71, title: 'How to Avoid WhatsApp Scams', duration: 8 },
  { id: 72, title: 'How to Report Cybercrime in Pakistan', duration: 12 },
  { id: 73, title: 'How to Spot Fake Online Shops', duration: 8 },
  { id: 74, title: 'How to Secure Your WiFi Network', duration: 8 },
  { id: 75, title: 'How to Protect Children Online', duration: 12 },
  { id: 76, title: 'How to Avoid Investment Scams Online', duration: 10 },
  { id: 77, title: 'How to Use VPN Safely', duration: 10 },
  // Job Applications (78-88)
  { id: 78, title: 'How to Write CV in Urdu', duration: 20 },
  { id: 79, title: 'How to Apply for Jobs on Rozee.pk', duration: 12 },
  { id: 80, title: 'How to Create Profile on Upwork', duration: 20 },
  { id: 81, title: 'How to Apply for Government Jobs Online', duration: 15 },
  { id: 82, title: 'How to Prepare for Online Interview', duration: 15 },
  { id: 83, title: 'How to Use Fiverr to Earn Money', duration: 20 },
  { id: 84, title: 'How to Write Cover Letter in English', duration: 15 },
  { id: 85, title: 'How to Apply for Jobs on Indeed', duration: 10 },
  { id: 86, title: 'How to Get Freelancing Projects as Beginner', duration: 25 },
  { id: 87, title: 'How to Use Daraz to Sell Products', duration: 20 },
  { id: 88, title: 'How to Prepare for FPSC CSS Exam Online', duration: 30 }
];

async function seedVideos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing videos
    const deleted = await Video.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing videos`);
    
    const videos = [];
    
    for (const tutorial of tutorials) {
      videos.push({
        tutorial_id: tutorial.id,
        tutorial_title: tutorial.title,
        video_url: YOUTUBE_URL,
        duration_minutes: tutorial.duration,
        description: `Watch this complete step-by-step video tutorial for "${tutorial.title}" in Urdu. Learn everything you need to know with easy-to-follow instructions.`
      });
    }
    
    const inserted = await Video.insertMany(videos);
    console.log(`✅ Successfully seeded ${inserted.length} videos`);
    
    // Display summary
    console.log('\n📹 Seeded Videos Summary:');
    inserted.forEach(v => {
      console.log(`  - Tutorial ${v.tutorial_id}: ${v.tutorial_title} (${v.duration_minutes} min) | URL: ${v.video_url}`);
    });
    
    console.log('\n✨ Video seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding videos:', err.message);
    process.exit(1);
  }
}

seedVideos();