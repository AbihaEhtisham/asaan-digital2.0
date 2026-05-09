import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceSearch.css';

const VoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'ur-PK'; // Urdu + English support
    
    recognitionInstance.onresult = (event) => {
      const transcriptText = event.results[0][0].transcript;
      setTranscript(transcriptText);
      setIsListening(false);
      // Auto search after getting voice input
      performSearch(transcriptText);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Show error message to user
      const errorMessages = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'No microphone detected. Please check your microphone.',
        'not-allowed': 'Microphone access denied. Please allow microphone access.'
      };
      
      const message = errorMessages[event.error] || 'Voice recognition failed. Please try again.';
      showToast(message, 'error');
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, []);

  const showToast = (message, type = 'error') => {
    // You can integrate with your existing toast system
    if (window.toast) {
      window.toast(message, type);
    } else {
      alert(message);
    }
  };

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      showToast('Please speak clearly. I couldn\'t understand.', 'error');
      return;
    }

    // Show searching feedback
    showToast(`Searching for: "${searchQuery}"`, 'info');

    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID?.() || Math.random().toString(36).substring(2);
      
      // Call search API
      const response = await fetch(`${API}/search?q=${encodeURIComponent(searchQuery)}&session_id=${sessionId}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.tutorial_id) {
        showToast(`Found tutorial: ${data.tutorial_title?.english || 'Tutorial'}`, 'success');
        // Navigate to tutorial page
        setTimeout(() => {
          navigate(`/tutorial/${data.tutorial_id}`);
        }, 500);
      } else if (data.suggestions && data.suggestions.length > 0) {
        showToast(`No exact match. Try: ${data.suggestions[0]}`, 'info');
      } else {
        showToast('No tutorial found. Please try a different search.', 'error');
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast('Search failed. Please try again.', 'error');
    }
  };

  const startListening = () => {
    if (!recognition) {
      showToast('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.', 'error');
      return;
    }
    
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  return (
    <>
      <button 
        className={`voice-search-btn ${isListening ? 'listening' : ''}`}
        onClick={startListening}
        aria-label="Voice Search"
      >
        <div className="voice-btn-inner">
          <i className={`fas ${isListening ? 'fa-microphone-alt' : 'fa-microphone'}`}></i>
        </div>
        {isListening && (
          <div className="voice-ripple">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </button>

      {isListening && (
        <div className="voice-overlay">
          <div className="voice-modal">
            <div className="voice-modal-icon">
              <i className="fas fa-microphone-alt"></i>
            </div>
            <h3>Listening...</h3>
            <p>Speak your question in Urdu or English</p>
            <div className="voice-wave">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <button className="voice-stop-btn" onClick={stopListening}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceSearch;