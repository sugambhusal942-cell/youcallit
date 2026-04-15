import { SendHorizonal } from "lucide-react";
import { motion } from "motion/react";
import { type KeyboardEvent, useEffect, useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder,
}: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  });

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      className="relative flex items-end gap-3 bg-card/70 backdrop-blur border border-border/60 rounded-2xl px-4 py-3 shadow-lg transition-colors focus-within:border-primary/50"
      style={{ backdropFilter: "blur(16px)" }}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder={placeholder ?? "Message your chef…"}
        rows={1}
        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none outline-none leading-relaxed max-h-40 min-h-[24px] font-body disabled:opacity-50"
        data-ocid="chat.input"
      />

      <motion.button
        type="button"
        onClick={() => canSend && onSend()}
        disabled={!canSend}
        whileHover={canSend ? { scale: 1.08 } : {}}
        whileTap={canSend ? { scale: 0.92 } : {}}
        className={`
          flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
          ${
            canSend
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:brightness-110 cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }
        `}
        aria-label="Send message"
        data-ocid="chat.send_button"
      >
        <motion.div
          key={value}
          initial={false}
          animate={canSend ? { rotate: 0 } : { rotate: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <SendHorizonal className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </div>
  );
}
