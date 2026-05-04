import { useRef, useState, useCallback, useEffect } from "react";
import { Image, Send, X, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore.js";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage } = useChatStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiObject) => {
    setText((prevInput) => prevInput + emojiObject.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSend = useCallback(async () => {
    if (!text.trim() && !imagePreview) return;
    await sendMessage({ text: text.trim(), image: imagePreview });
    setText("");
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }, [text, imagePreview, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      {/* Image Preview */}
      {imagePreview && (
        <div className="image-preview-wrap">
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button className="remove-preview-btn" onClick={removeImage} title="Remove">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="message-input-area">
        {/* Image Upload Button */}
        <div className="input-actions" style={{ position: "relative" }}>
          {showEmojiPicker && (
            <div ref={emojiPickerRef} style={{ position: "absolute", bottom: "50px", left: "0", zIndex: 100 }}>
              <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
            </div>
          )}
          <button
            className="icon-btn"
            title="Add Emoji"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            style={{ color: showEmojiPicker ? "var(--accent)" : "var(--text-muted)" }}
          >
            <Smile size={20} />
          </button>
          
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload-input"
            onChange={handleImageChange}
          />
          <button
            id="image-upload-btn"
            className="icon-btn"
            title="Send image"
            onClick={() => fileRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Text Input */}
        <textarea
          id="message-text-input"
          className="message-input-box"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            // auto-resize
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        {/* Send Button */}
        <button
          id="send-message-btn"
          className="send-btn"
          onClick={handleSend}
          disabled={!text.trim() && !imagePreview}
          title="Send"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
