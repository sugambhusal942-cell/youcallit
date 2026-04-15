import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ChevronLeft,
  Clock,
  MessageCircle,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ChatMessage } from "../backend";
import { OrderStatus, SenderRole } from "../backend";
import { ChatBubble } from "../components/ChatBubble";
import { ChatInput } from "../components/ChatInput";
import { useActor } from "../hooks/useActor";
import { useOrder, useSendMessage, useThread } from "../hooks/useQueries";

const QUICK_REPLIES = [
  "No salt please",
  "Extra spicy 🌶️",
  "Sauce on the side",
  "Chef recommendation?",
  "Any allergens?",
  "Can I substitute this?",
];

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.pending]:
    "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  [OrderStatus.confirmed]: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  [OrderStatus.preparing]:
    "bg-orange-500/20 text-orange-300 border-orange-500/30",
  [OrderStatus.ready]: "bg-green-500/20 text-green-300 border-green-500/30",
  [OrderStatus.completed]: "bg-muted text-muted-foreground border-border",
  [OrderStatus.cancelled]:
    "bg-destructive/20 text-destructive border-destructive/30",
};

export default function ChatPage() {
  const { orderId } = useParams({ from: "/chat/$orderId" });
  const orderIdBig = BigInt(orderId);

  const { data: thread, isLoading: threadLoading } = useThread(orderIdBig);
  const { data: order } = useOrder(orderIdBig);
  const sendMessage = useSendMessage();
  const { actor } = useActor();

  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [newMessageIds, setNewMessageIds] = useState<Set<bigint>>(new Set());
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [hasNewBelow, setHasNewBelow] = useState(false);
  const initialized = useRef(false);
  const lastMessageIdRef = useRef<bigint>(0n);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Merge thread messages into local state on first load
  useEffect(() => {
    if (thread?.messages && !initialized.current) {
      initialized.current = true;
      setLocalMessages(thread.messages);
      if (thread.messages.length > 0) {
        const maxId = thread.messages.reduce(
          (m, msg) => (msg.id > m ? msg.id : m),
          0n,
        );
        lastMessageIdRef.current = maxId;
      }
    }
  }, [thread?.messages]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  // Poll for new messages every 2 seconds
  const pollMessages = useCallback(async () => {
    if (!actor || !thread?.id) return;
    try {
      const newMsgs = await actor.getNewMessages(
        thread.id,
        lastMessageIdRef.current,
      );
      if (newMsgs.length > 0) {
        const ids = new Set(newMsgs.map((m) => m.id));
        setNewMessageIds(ids);
        setLocalMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const fresh = newMsgs.filter((m) => !existingIds.has(m.id));
          return [...prev, ...fresh];
        });
        const maxId = newMsgs.reduce(
          (m, msg) => (msg.id > m ? msg.id : m),
          lastMessageIdRef.current,
        );
        lastMessageIdRef.current = maxId;
        if (isScrolledUp) setHasNewBelow(true);
        else scrollToBottom("smooth");
      }
    } catch {
      // silently ignore poll errors
    }
  }, [actor, thread?.id, isScrolledUp, scrollToBottom]);

  useEffect(() => {
    pollRef.current = setInterval(pollMessages, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollMessages]);

  useEffect(() => {
    if (localMessages.length > 0 && !isScrolledUp) {
      scrollToBottom("smooth");
    }
  }, [localMessages.length, isScrolledUp, scrollToBottom]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const scrolledUp = distFromBottom > 80;
    setIsScrolledUp(scrolledUp);
    if (!scrolledUp) setHasNewBelow(false);
  }

  async function handleSend() {
    const content = input.trim();
    if (!content) return;
    setInput("");
    // Optimistic message placeholder — use a temp id
    const tempId = BigInt(-Date.now());
    const optimistic: ChatMessage = {
      id: tempId,
      content,
      isRead: false,
      orderId: orderIdBig,
      timestamp: BigInt(Date.now()) * 1_000_000n,
      senderRole: SenderRole.customer,
      senderId: {} as import("../backend").UserId,
    };
    setLocalMessages((prev) => [...prev, optimistic]);
    setNewMessageIds(new Set([tempId]));
    scrollToBottom("smooth");

    try {
      const sent = await sendMessage.mutateAsync({
        orderId: orderIdBig,
        content,
      });
      setLocalMessages((prev) => prev.map((m) => (m.id === tempId ? sent : m)));
      lastMessageIdRef.current = sent.id;
    } catch {
      toast.error("Failed to send message. Please try again.");
      setLocalMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  }

  const statusLabel = order?.status
    ? String(order.status).charAt(0).toUpperCase() +
      String(order.status).slice(1)
    : "Loading";
  const statusColor = order ? (STATUS_COLORS[String(order.status)] ?? "") : "";

  return (
    <div
      className="relative flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden"
      data-ocid="chat.page"
    >
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 bg-card/90 border-b border-border/60 shadow-sm z-10"
        style={{ backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to="/order"
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
            data-ocid="chat.back_link"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </Link>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
              </div>
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card"
                data-ocid="chat.chef_online"
              >
                <motion.span
                  className="block w-full h-full rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-display text-foreground text-sm leading-tight">
                Chef Alexandre Dubois
              </p>
              <p className="text-xs text-green-400 font-medium">
                Online — responds instantly
              </p>
            </div>
          </div>

          {order && (
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5 text-xs">
                <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">
                  #{String(order.id)}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColor}`}
                data-ocid="chat.order_status"
              >
                {statusLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Messages ────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4 min-h-full">
          {threadLoading ? (
            <div
              className="flex flex-col gap-4 pt-4"
              data-ocid="chat.loading_state"
            >
              {(["a", "b", "c", "d"] as const).map((k, i) => (
                <div
                  key={k}
                  className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}
                >
                  <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                  <Skeleton
                    className={`h-14 rounded-2xl ${i % 2 === 0 ? "w-64" : "w-48"}`}
                  />
                </div>
              ))}
            </div>
          ) : localMessages.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence initial={false}>
              {localMessages.map((msg) => (
                <ChatBubble
                  key={msg.id.toString()}
                  message={msg}
                  isCustomer={msg.senderRole === SenderRole.customer}
                  isNew={newMessageIds.has(msg.id)}
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={bottomRef} className="h-1" />
        </div>
      </div>

      {/* ─── New message floating indicator ─────────────────────────────── */}
      <AnimatePresence>
        {hasNewBelow && (
          <motion.button
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            onClick={() => {
              scrollToBottom("smooth");
              setHasNewBelow(false);
            }}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-lg shadow-primary/30 hover:brightness-110 cursor-pointer transition-all"
            data-ocid="chat.new_message_indicator"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            New message
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Quick replies + Input ────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 bg-background/90 border-t border-border/50 z-10"
        style={{ backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-3">
          {/* Quick reply chips */}
          <div
            className="flex gap-2 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden"
            data-ocid="chat.quick_replies"
          >
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => setInput(reply)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 hover:border-primary/50 transition-all duration-150 font-body whitespace-nowrap cursor-pointer"
                data-ocid="chat.quick_reply"
              >
                {reply}
              </button>
            ))}
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={sendMessage.isPending}
            placeholder="Message your chef…"
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center py-20 text-center"
      data-ocid="chat.empty_state"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, -6, 6, 0] }}
        transition={{
          duration: 3.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6"
      >
        <MessageCircle className="w-9 h-9 text-primary" strokeWidth={1.5} />
      </motion.div>
      <h3 className="font-display text-2xl text-foreground mb-2">
        Start the Conversation
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
        Your chef is ready. Ask about ingredients, request modifications, or
        share your preferences.
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-4 py-2 rounded-full">
        <Clock className="w-3.5 h-3.5" />
        <span>Usually responds within seconds</span>
      </div>
    </div>
  );
}
