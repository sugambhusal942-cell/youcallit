import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, MessageSquare, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SenderRole } from "../../backend";
import type { ChatThread } from "../../backend";
import {
  useAllOpenThreads,
  useSendChefMessage,
  useThread,
} from "../../hooks/useQueries";
import { ChatBubble } from "../ChatBubble";

function ThreadListItem({
  thread,
  isSelected,
  onSelect,
  index,
}: {
  thread: ChatThread;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const unread = thread.messages.filter(
    (m) => !m.isRead && m.senderRole === SenderRole.customer,
  ).length;
  const lastMsg = thread.messages[thread.messages.length - 1];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-xl transition-smooth border ${
        isSelected
          ? "bg-primary/10 border-primary/30"
          : "bg-card border-border hover:bg-secondary/50"
      }`}
      data-ocid={`chat.thread.${index + 1}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground truncate">
          Order #{String(thread.orderId)}
        </span>
        {unread > 0 && (
          <span className="flex-shrink-0 min-w-[20px] h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center px-1">
            {unread}
          </span>
        )}
      </div>
      {lastMsg && (
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {lastMsg.senderRole === SenderRole.chef ? "You: " : ""}
          {lastMsg.content}
        </p>
      )}
      <p className="text-xs text-muted-foreground/60 mt-0.5">
        {thread.messages.length} message
        {thread.messages.length !== 1 ? "s" : ""}
      </p>
    </button>
  );
}

function ThreadView({ orderId }: { orderId: bigint }) {
  const { data: thread, isLoading } = useThread(orderId);
  const { mutate: sendMsg, isPending } = useSendChefMessage();
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    sendMsg(
      { orderId, content: message.trim() },
      {
        onSuccess: () => setMessage(""),
        onError: () => toast.error("Failed to send message"),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full px-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p className="text-sm">Thread not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border bg-card flex-shrink-0">
        <h3 className="font-medium text-foreground text-sm">
          Order #{String(thread.orderId)}
        </h3>
        <p className="text-xs text-muted-foreground">
          {thread.messages.length} message
          {thread.messages.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {thread.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                No messages yet. Start the conversation.
              </p>
            </div>
          </div>
        ) : (
          thread.messages.map((msg) => (
            <ChatBubble key={String(msg.id)} message={msg} isCustomer={false} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="px-4 py-4 border-t border-border bg-card flex-shrink-0 flex gap-2"
        data-ocid="chat.chef_reply_form"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reply as Chef Alexandre…"
          className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          data-ocid="chat.chef_reply_input"
        />
        <button
          type="submit"
          disabled={isPending || !message.trim()}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-smooth disabled:opacity-40"
          data-ocid="chat.chef_send_button"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export function ChefChatPanel() {
  const { data: threads = [], isLoading } = useAllOpenThreads();
  const [selectedOrderId, setSelectedOrderId] = useState<bigint | null>(null);

  useEffect(() => {
    if (threads.length > 0 && !selectedOrderId) {
      setSelectedOrderId(threads[0].orderId);
    }
  }, [threads, selectedOrderId]);

  return (
    <div className="flex h-full" data-ocid="chat.panel">
      <aside className="w-72 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-4 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-display italic text-lg text-foreground">
            Chef Chat
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {threads.length} open thread{threads.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))
          ) : threads.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full text-center py-12"
              data-ocid="chat.empty_state"
            >
              <MessageSquare className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No open threads</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Conversations with customers appear here
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {threads.map((thread, i) => (
                <motion.div
                  key={String(thread.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ThreadListItem
                    thread={thread}
                    isSelected={
                      String(selectedOrderId) === String(thread.orderId)
                    }
                    onSelect={() => setSelectedOrderId(thread.orderId)}
                    index={i}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-background">
        {selectedOrderId ? (
          <ThreadView orderId={selectedOrderId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-foreground font-medium">Select a thread</p>
              <p className="text-muted-foreground text-sm mt-1">
                Choose a customer conversation from the left
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
