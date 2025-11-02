"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState, useRef } from "react";
import { ref, push, onValue, off, serverTimestamp } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { fadeInUp, scrollReveal } from "@/lib/animations";
import toast from "react-hot-toast";

interface Message {
  id: string;
  userId: string;
  text: string;
  displayName: string;
  timestamp: number;
}

export default function Chat() {
  return (
    <ProtectedRoute requireAuth={true}>
      <ChatContent />
    </ProtectedRoute>
  );
}

function ChatContent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = "main"; // Single chat room for now

  useEffect(() => {
    if (!user) return;

    const messagesRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData: Message[] = [];
        snapshot.forEach((child) => {
          messagesData.push({
            id: child.key!,
            ...child.val(),
          } as Message);
        });

        // Sort by timestamp
        messagesData.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesData);
      }
    });

    return () => {
      off(messagesRef);
    };
  }, [user, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || sending) return;

    try {
      setSending(true);
      const messagesRef = ref(database, `chats/${chatId}/messages`);

      await push(messagesRef, {
        userId: user.uid,
        text: newMessage.trim(),
        displayName: user.displayName || user.email || "Anonymous",
        timestamp: Date.now(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
              <h1 className="text-2xl font-bold text-white">
                Class Chat
              </h1>
              <p className="text-sm text-blue-100 mt-1">
                Real-time messaging for students • Accessible via email login
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No messages yet. Be the first to say hello!
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex ${
                      message.userId === user.uid ? "justify-end" : "justify-start"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md ${
                        message.userId === user.uid
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                    >
                      {message.userId !== user.uid && (
                        <div className="text-xs font-semibold mb-1 opacity-75">
                          {message.displayName}
                        </div>
                      )}
                      <div>{message.text}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.userId === user.uid ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </motion.div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                  disabled={sending}
                />
                <motion.button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  {sending ? "Sending..." : "Send"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

