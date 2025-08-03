import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ChatInput.css';

// Custom hook for auto-resizing textarea
const useAutoResizeTextarea = ({ minHeight, maxHeight }) => {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight || Number.MAX_SAFE_INTEGER)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
};

// Constants
const MIN_HEIGHT = 48;
const MAX_HEIGHT = 164;

// Animated placeholder component
const AnimatedPlaceholder = ({ showSearch }) => (
  <div className="animated-placeholder">
    <p className={`placeholder-text ${showSearch ? 'search' : 'ask'}`}>
      {showSearch ? 'Search the web...' : 'Ask me anything...'}
    </p>
  </div>
);

const ChatInput = () => {
  const [value, setValue] = useState('');
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const [showSearch, setShowSearch] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (value.trim()) {
      console.log('Submitted:', value);
      // Here you would typically send the message to your backend
    }
    setValue('');
    adjustHeight(true);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <div className="chat-input-inner">
          <div
            className="chat-input-scroll-area"
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          >
            <div className="chat-input-textarea-container">
              <textarea
                value={value}
                placeholder=""
                className="chat-input-textarea"
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
              />
              {!value && (
                <div className="chat-input-placeholder">
                  <AnimatedPlaceholder showSearch={showSearch} />
                </div>
              )}
            </div>
          </div>

          <div className="chat-input-controls">
            <div className="chat-input-left-controls">
              <label
                className={`chat-input-file-label ${imagePreview ? 'active' : ''}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="chat-input-file-input"
                  accept="image/*"
                />
                <svg
                  className={`chat-input-icon ${imagePreview ? 'active' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                {imagePreview && (
                  <div className="chat-input-image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="chat-input-preview-img"
                    />
                    <button
                      onClick={handleClose}
                      className="chat-input-close-preview"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                )}
              </label>
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className={`chat-input-search-button ${showSearch ? 'active' : ''}`}
              >
                <div className="chat-input-search-icon-container">
                  <svg
                    className={`chat-input-search-icon ${showSearch ? 'active' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                {showSearch && <span className="chat-input-search-text">Search</span>}
              </button>
            </div>
            <div className="chat-input-right-controls">
              <button
                type="button"
                onClick={handleSubmit}
                className={`chat-input-send-button ${value ? 'active' : ''}`}
              >
                <svg
                  className="chat-input-send-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;