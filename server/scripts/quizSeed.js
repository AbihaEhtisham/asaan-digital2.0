const mongoose = require('mongoose');
const { Quiz } = require('../models/quizModel'); // Ensure path is correct
require('dotenv').config({ path: '../.env' });

const quizzes = [
  {
    tutorial_id: 1, // How to Send WhatsApp Message
    tutorial_title: 'How to Send WhatsApp Message',
    questions: [
      {
        question_text: 'Which icon do you tap to start a new chat in WhatsApp?',
        options: ['Camera icon', 'Green pencil/message icon', 'Settings gear', 'Search bar'],
        correct_index: 1,
        explanation: 'The green icon at the bottom right is used to start new conversations.'
      },
      {
        question_text: 'Where is the box located where you type your message?',
        options: ['At the very top', 'In the settings menu', 'At the bottom of the screen', 'On the profile picture'],
        correct_index: 2,
        explanation: 'The text input box is always located at the bottom of the chat window.'
      },
      {
        question_text: 'What must you do after typing your message to send it?',
        options: ['Shake the phone', 'Tap the send arrow/button', 'Close the app', 'Wait 5 minutes'],
        correct_index: 1,
        explanation: 'Tapping the arrow icon next to the text box sends your message immediately.'
      },
      {
        question_text: 'Does WhatsApp require a phone number to work?',
        options: ['Yes', 'No', 'Only on Sundays', 'Only for video calls'],
        correct_index: 0,
        explanation: 'WhatsApp accounts are linked directly to your mobile phone number.'
      },
      {
        question_text: 'What does a single grey tick mean?',
        options: ['Message read', 'Message delivered', 'Message sent successfully', 'Message failed'],
        correct_index: 2,
        explanation: 'One grey tick means the message left your phone but hasn\'t reached the other person yet.'
      }
    ]
  },
  {
    tutorial_id: 12, // How to Create JazzCash Account
    tutorial_title: 'How to Create JazzCash Account',
    questions: [
      {
        question_text: 'What is the first step to create a JazzCash account?',
        options: ['Go to a bank', 'Download the JazzCash app', 'Buy a new SIM', 'Call the police'],
        correct_index: 1,
        explanation: 'Downloading the official app is the easiest way to start the registration.'
      },
      {
        question_text: 'What document number is required for registration?',
        options: ['Passport', 'Driving License', 'CNIC Number', 'Utility Bill'],
        correct_index: 2,
        explanation: 'Your Computerized National Identity Card (CNIC) is required for verification.'
      },
      {
        question_text: 'What is an MPIN?',
        options: ['A type of SIM card', 'A 5-digit security password', 'Your username', 'An email address'],
        correct_index: 1,
        explanation: 'An MPIN is a secret 5-digit code used to authorize your transactions.'
      },
      {
        question_text: 'How do you receive the verification code (OTP)?',
        options: ['Via Email', 'Via Post office', 'Via SMS', 'Via WhatsApp'],
        correct_index: 2,
        explanation: 'JazzCash sends a One-Time Password (OTP) to your registered mobile number via SMS.'
      },
      {
        question_text: 'Can you use JazzCash without an internet connection?',
        options: ['Yes, via USSD code (*786#)', 'No, never', 'Only for checking balance', 'Only on Jazz SIMs'],
        correct_index: 0,
        explanation: 'You can use the *786# menu on your phone dialer even without data.'
      }
    ]
  },
  {
    tutorial_id: 23, // How to Apply for CNIC Online
    tutorial_title: 'How to Apply for CNIC Online',
    questions: [
      {
        question_text: 'Which official website is used for CNIC applications?',
        options: ['facebook.com', 'pakidentity.gov.pk', 'google.com', 'nadra.org.pk'],
        correct_index: 1,
        explanation: 'Pak-Identity is the official NADRA portal for online ID services.'
      },
      {
        question_text: 'What do you receive to track your application?',
        options: ['A physical key', 'A tracking number', 'A new phone', 'An email from the President'],
        correct_index: 1,
        explanation: 'NADRA provides a tracking number to monitor the progress of your ID card.'
      },
      {
        question_text: 'Do you need to upload scanned documents?',
        options: ['No', 'Only your photo', 'Yes, required documents must be scanned', 'Only if you are abroad'],
        correct_index: 2,
        explanation: 'You must upload clear scans of supporting documents like your old CNIC or birth certificate.'
      },
      {
        question_text: 'How is the fee paid online?',
        options: ['Giving cash to a postman', 'Credit/Debit card or mobile wallet', 'It is free', 'By sending a check'],
        correct_index: 1,
        explanation: 'Online applications require digital payment via cards or integrated mobile wallets.'
      },
      {
        question_text: 'What is the final step after filling the form?',
        options: ['Deleting the app', 'Submitting and saving the tracking ID', 'Printing the whole website', 'Calling NADRA office'],
        correct_index: 1,
        explanation: 'You must submit the application and keep the tracking ID for future reference.'
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');
    await Quiz.deleteMany({});
    await Quiz.insertMany(quizzes);
    console.log('✅ Quizzes seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();