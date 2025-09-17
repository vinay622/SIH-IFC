import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Download, Upload, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import speechService from '../services/speechService';
import webSpeechService from '../services/webSpeechService';

const SpeechToText = ({ 
  onTranscript, 
  language = 'malayalam',
  className = '',
  showSettings = true,
  autoPreload = true 
}) => {
  const { t } = useTranslation();
  
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [provider, setProvider] = useState('huggingface');
  const [modelStatus, setModelStatus] = useState('not-loaded');
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const streamRef = useRef(null);

  // Language options
  const languageOptions = [
    { value: 'malayalam', label: 'മലയാളം', flag: '🇮🇳' },
    { value: 'english', label: 'English', flag: '🇺🇸' },
    { value: 'hindi', label: 'हिंदी', flag: '🇮🇳' }
  ];

  // Provider options
  const providerOptions = [
    { 
      value: 'huggingface', 
      label: 'Hugging Face Whisper (Offline)', 
      description: 'Best accuracy, works offline, free',
      available: true
    },
    { 
      value: 'webspeech', 
      label: 'Browser Speech API', 
      description: 'Fast, requires internet, good for real-time',
      available: webSpeechService.isAvailable()
    }
  ];

  // Initialize model on component mount
  useEffect(() => {
    if (autoPreload && provider === 'huggingface') {
      preloadModel();
    }
  }, [autoPreload, provider]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const preloadModel = async () => {
    setModelStatus('loading');
    try {
      const result = await speechService.preloadModel();
      if (result.success) {
        setModelStatus('ready');
        setError(null);
      } else {
        setModelStatus('error');
        setError(result.error);
      }
    } catch (err) {
      setModelStatus('error');
      setError('Failed to load speech model');
      console.error('Model preload error:', err);
    }
  };

  const startRecording = async () => {
    setError(null);
    setTranscript('');
    setIsRecording(true);

    try {
      if (provider === 'webspeech') {
        await startWebSpeechRecording();
      } else {
        await startHuggingFaceRecording();
      }
    } catch (error) {
      setError(error.message);
      setIsRecording(false);
      console.error('Recording start error:', error);
    }
  };

  const startWebSpeechRecording = async () => {
    try {
      const result = await webSpeechService.startRecording(language);
      
      if (result.success) {
        setTranscript(result.text);
        onTranscript(result.text);
        
        if (result.isFinal) {
          setIsRecording(false);
        }
      }
    } catch (error) {
      setError(error.message);
      setIsRecording(false);
    }
  };

  const startHuggingFaceRecording = async () => {
    try {
      // Check model status
      if (modelStatus !== 'ready') {
        setModelStatus('loading');
        await speechService.initialize();
        setModelStatus('ready');
      }

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      streamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await processRecording();
      };

      mediaRecorder.start(1000); // Collect data every second
      
    } catch (error) {
      setError('Failed to access microphone: ' + error.message);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (provider === 'webspeech') {
      webSpeechService.stopRecording();
    } else if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      setError('No audio data recorded');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Transcribe using Hugging Face
      const result = await speechService.transcribeAudio(audioBlob, language);
      
      if (result.success) {
        setTranscript(result.text);
        onTranscript(result.text);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Transcription failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await speechService.transcribeAudio(file, language);
      
      if (result.success) {
        setTranscript(result.text);
        onTranscript(result.text);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('File transcription failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }

    // Reset file input
    event.target.value = '';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModelStatusColor = () => {
    switch (modelStatus) {
      case 'ready': return 'text-green-600';
      case 'loading': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getModelStatusText = () => {
    switch (modelStatus) {
      case 'ready': return '✅ Model Ready';
      case 'loading': return '⏳ Loading Model...';
      case 'error': return '❌ Model Error';
      default: return '⚪ Model Not Loaded';
    }
  };

  return (
    <div className={`speech-to-text-container bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🎙️ Speech to Text
        </h3>
        
        {showSettings && (
          <button
            onClick={() => setShowProviderSettings(!showProviderSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* Provider Settings */}
      {showProviderSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speech Provider:
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isRecording || isProcessing}
              >
                {providerOptions.map(option => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={!option.available}
                  >
                    {option.label} {!option.available ? '(Not Available)' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {providerOptions.find(p => p.value === provider)?.description}
              </p>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language:
              </label>
              <select
                value={language}
                onChange={(e) => onTranscript && onTranscript('', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isRecording || isProcessing}
              >
                {languageOptions.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Model Status */}
          {provider === 'huggingface' && (
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-sm font-medium ${getModelStatusColor()}`}>
                {getModelStatusText()}
              </span>
              {modelStatus !== 'ready' && modelStatus !== 'loading' && (
                <button
                  onClick={preloadModel}
                  className="text-sm text-primary-600 hover:text-primary-700"
                  disabled={isProcessing}
                >
                  Load Model
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || (provider === 'huggingface' && modelStatus === 'loading')}
          className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110'
              : 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg'
          } ${(isProcessing || (provider === 'huggingface' && modelStatus === 'loading')) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : isRecording ? (
            <MicOff size={28} />
          ) : (
            <Mic size={28} />
          )}
        </button>

        {/* File Upload */}
        <div className="relative">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="audio-upload"
            disabled={isRecording || isProcessing}
          />
          <label
            htmlFor="audio-upload"
            className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 text-gray-500 hover:text-primary-500 cursor-pointer transition-colors ${
              (isRecording || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload size={20} />
          </label>
        </div>

        {/* Status Display */}
        <div className="flex-1">
          {isRecording && (
            <div className="flex items-center text-red-500">
              <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="font-medium">
                Recording... {formatTime(recordingTime)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                ({provider})
              </span>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex items-center text-blue-500">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
              <span className="font-medium">Processing audio...</span>
            </div>
          )}
          
          {!isRecording && !isProcessing && provider === 'huggingface' && (
            <div className={`text-sm ${getModelStatusColor()}`}>
              {getModelStatusText()}
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Transcript:</h4>
            <button
              onClick={() => navigator.clipboard.writeText(transcript)}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-900 leading-relaxed">{transcript}</p>
        </div>
      )}

      {/* Instructions */}
      {!transcript && !error && (
        <div className="text-center text-gray-500 text-sm">
          <p>🎤 Click the microphone to start recording</p>
          <p>📁 Or upload an audio file to transcribe</p>
          <p>🌍 Supports Malayalam, English, and Hindi</p>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;