class WebSpeechService {
  constructor() {
    this.recognition = null;
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    this.isListening = false;
    this.languageMap = {
      'malayalam': 'ml-IN',
      'english': 'en-US',
      'hindi': 'hi-IN'
    };
  }

  isAvailable() {
    return this.isSupported;
  }

  initialize(language = 'malayalam') {
    if (!this.isSupported) {
      console.warn('❌ Web Speech API not supported in this browser');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    const langCode = this.languageMap[language] || 'ml-IN';
    this.recognition.lang = langCode;
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;

    console.log('✅ Web Speech API initialized for language:', langCode);
    return true;
  }

  startRecording(language = 'malayalam') {
    return new Promise((resolve, reject) => {
      if (!this.initialize(language)) {
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      let finalTranscript = '';
      let interimTranscript = '';

      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('🎙️ Web Speech API recording started');
      };

      this.recognition.onresult = (event) => {
        finalTranscript = '';
        interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Return interim results for real-time feedback
        if (interimTranscript) {
          resolve({
            success: true,
            text: interimTranscript,
            confidence: 0.7,
            isFinal: false,
            provider: 'web-speech-api'
          });
        }

        // Return final result
        if (finalTranscript) {
          this.isListening = false;
          resolve({
            success: true,
            text: finalTranscript.trim(),
            confidence: event.results[0][0].confidence || 0.8,
            isFinal: true,
            provider: 'web-speech-api'
          });
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.error('❌ Web Speech API error:', event.error);
        
        let errorMessage = 'Speech recognition error';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied.';
            break;
          case 'network':
            errorMessage = 'Network error occurred.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('🛑 Web Speech API recording ended');
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopRecording() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('🛑 Web Speech API recording stopped manually');
    }
  }

  abort() {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
      console.log('🚫 Web Speech API recording aborted');
    }
  }

  isCurrentlyListening() {
    return this.isListening;
  }

  getSupportedLanguages() {
    return Object.keys(this.languageMap);
  }
}

// Create singleton instance
const webSpeechService = new WebSpeechService();

export default webSpeechService;