import { pipeline } from '@xenova/transformers';

class HuggingFaceSpeechService {
  constructor() {
    this.transcriber = null;
    this.isLoading = false;
    this.isModelLoaded = false;
    this.supportedLanguages = {
      'malayalam': 'ml',
      'english': 'en', 
      'hindi': 'hi'
    };
  }

  async initialize() {
    if (this.transcriber || this.isLoading) return;
    
    this.isLoading = true;
    console.log('Loading Whisper model for speech recognition...');
    
    try {
      // Load Whisper small model (good balance of size and accuracy)
      // Supports Malayalam, English, and Hindi
      this.transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-small',
        { 
          revision: 'main',
          quantized: true, // Smaller model size
          progress_callback: (progress) => {
            console.log('Model loading progress:', Math.round(progress.progress * 100) + '%');
          }
        }
      );
      
      this.isModelLoaded = true;
      console.log('✅ Whisper model loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load Whisper model:', error);
      this.transcriber = null;
      this.isModelLoaded = false;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async transcribeAudio(audioBlob, language = 'malayalam') {
    try {
      // Ensure model is loaded
      if (!this.isModelLoaded) {
        await this.initialize();
      }

      if (!this.transcriber) {
        throw new Error('Speech recognition model not available');
      }

      console.log('🎙️ Transcribing audio...', { language, size: audioBlob.size });

      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      // Get language code
      const langCode = this.supportedLanguages[language] || 'ml';
      
      // Transcribe with language specification
      const result = await this.transcriber(arrayBuffer, {
        language: langCode,
        task: 'transcribe',
        return_timestamps: false,
        chunk_length_s: 30,
        stride_length_s: 5
      });

      const transcribedText = result.text.trim();
      
      console.log('✅ Transcription successful:', transcribedText);
      
      return {
        success: true,
        text: transcribedText,
        confidence: 0.95, // Whisper doesn't provide confidence scores
        language: language,
        provider: 'huggingface-whisper'
      };

    } catch (error) {
      console.error('❌ Transcription error:', error);
      return { 
        success: false, 
        error: error.message,
        provider: 'huggingface-whisper'
      };
    }
  }

  // Convert audio to optimal format for Whisper
  async preprocessAudio(audioBlob) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      audio.onload = () => {
        // Audio processing can be added here if needed
        resolve(audioBlob);
      };
      
      audio.onerror = reject;
      audio.src = URL.createObjectURL(audioBlob);
    });
  }

  // Check if the service is ready
  isReady() {
    return this.isModelLoaded && this.transcriber !== null;
  }

  // Get loading status
  getLoadingStatus() {
    if (this.isModelLoaded) return 'ready';
    if (this.isLoading) return 'loading';
    return 'not-loaded';
  }

  // Preload model (call this on app initialization)
  async preloadModel() {
    if (!this.isModelLoaded && !this.isLoading) {
      try {
        await this.initialize();
        return { success: true, message: 'Model preloaded successfully' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    return { success: true, message: 'Model already loaded' };
  }

  // Clean up resources
  destroy() {
    this.transcriber = null;
    this.isModelLoaded = false;
    this.isLoading = false;
    console.log('🧹 Speech service cleaned up');
  }
}

// Create singleton instance
const speechService = new HuggingFaceSpeechService();

// Preload model when service is imported (optional)
// speechService.preloadModel();

export default speechService;