import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { 
  Mic, 
  MicOff, 
  Send, 
  Camera, 
  Upload, 
  X, 
  MessageSquare,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { toast } from 'react-toastify';

const AIQueryInterface = ({ onMessageSent, messages = [], isLoading = false }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ml-IN'; // Malayalam
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + ' ' + transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please upload image files only.');
      return;
    }

    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true,
    noClick: true
  });

  const handleVoiceInput = () => {
    if (!recognition) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Revoke object URL to prevent memory leaks
      const removedImg = prev.find(img => img.id === imageId);
      if (removedImg) {
        URL.revokeObjectURL(removedImg.preview);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() && uploadedImages.length === 0) {
      toast.warning('Please enter a message or upload an image.');
      return;
    }

    const messageData = {
      text: inputText.trim(),
      images: uploadedImages.map(img => img.file),
      timestamp: new Date().toISOString(),
      type: 'user'
    };

    // Call parent function to handle message
    if (onMessageSent) {
      onMessageSent(messageData);
    }

    // Clear input
    setInputText('');
    setUploadedImages([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const escalateToExpert = (messageId) => {
    // Handle escalation to expert
    toast.info('Query escalated to agricultural expert. You will receive a response soon.');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        
        {isDragActive && (
          <div className="absolute inset-0 bg-primary-50 bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <Upload className="w-12 h-12 text-primary-500 mx-auto mb-2" />
              <p className="text-primary-700 font-medium">Drop images here to upload</p>
            </div>
          </div>
        )}

        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('aiChat.placeholder')}
            </h3>
            <p className="text-gray-500">
              Type your question, speak, or upload crop images for analysis
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.images && message.images.length > 0 && (
                <div className="mb-2 grid grid-cols-2 gap-2">
                  {message.images.map((img, idx) => (
                    <img 
                      key={idx}
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                      alt="Uploaded"
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              
              <p className="text-sm">{message.text}</p>
              
              {message.type === 'bot' && message.confidence && message.confidence < 0.7 && (
                <button
                  onClick={() => escalateToExpert(message.id)}
                  className="mt-2 flex items-center text-xs text-orange-600 hover:text-orange-700"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {t('aiChat.escalateToExpert')}
                </button>
              )}
              
              <span className="text-xs opacity-70 block mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">{t('aiChat.processing')}</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {uploadedImages.length > 0 && (
        <div className="border-t p-3">
          <div className="flex flex-wrap gap-2">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.preview}
                  alt="Upload preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                placeholder={t('aiChat.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[40px] max-h-32"
                rows={1}
                disabled={isLoading}
              />
            </div>
            
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={t('aiChat.voiceInput')}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            {/* Image Upload Button */}
            <button
              type="button"
              onClick={() => document.getElementById('image-upload').click()}
              disabled={isLoading}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title={t('aiChat.imageUpload')}
            >
              <Camera className="w-5 h-5" />
            </button>
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && uploadedImages.length === 0)}
              className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={t('aiChat.sendMessage')}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {isListening && (
            <div className="text-center">
              <span className="text-sm text-red-600 animate-pulse">
                {t('aiChat.listening')}
              </span>
            </div>
          )}
        </form>
        
        {/* Hidden file input */}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);
            onDrop(files);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default AIQueryInterface;
