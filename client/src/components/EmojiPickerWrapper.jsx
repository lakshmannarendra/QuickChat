import React from 'react';
import Picker from 'emoji-picker-react';

const EmojiPickerWrapper = ({ onEmojiClick, theme }) => (
  <div className="absolute bottom-16 left-4 z-50">
    <Picker onEmojiClick={onEmojiClick} theme={theme || 'auto'} />
  </div>
);

export default EmojiPickerWrapper;
