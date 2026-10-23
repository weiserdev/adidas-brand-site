"use client"

import { AI_DEMO_URL, AI_UNAVAILABLE_MESSAGE, AI_UNAVAILABLE_TITLE } from "@/lib/ai-service-error";

import { useDisableScroll } from "@/hooks/useDisableScroll"
import { Icon } from "@iconify/react"
import { useEffect, useRef, useState } from "react"

type Message = {
    role: "user" | "assistant"
    content: string
}

const INITIAL_MESSAGES: Message[] = [
    { role: "assistant", content: "👋 Welcome to the adidas AI chat!" },
    { role: "assistant", content: "I'm Adee. How can I assist you today?" },
]

const Chat = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [isReaded, setIsReaded] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [viewportHeight, setViewportHeight] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 0);
    const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Dynamically adjust chat height on iOS keyboard open/close
    useEffect(() => {
        if (!isOpen) return

        const updateSizes = () => {
            const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth
            setViewportWidth(vw);
            const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight
            setViewportHeight(vh);
        }

        updateSizes();

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", updateSizes);
        } else {
            window.addEventListener("resize", updateSizes);
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", updateSizes);
            } else {
                window.removeEventListener("resize", updateSizes);
            }
        }
    }, [isOpen]);

    useDisableScroll(isOpen && viewportWidth < 768)

    const toggleChat = () => {
        if (isOpen) {
            setMessages(INITIAL_MESSAGES);
            setInput("");
            setLoading(false);
            setIsReaded(true);
        }
        setIsOpen((prev) => !prev);
    }

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setMessages(INITIAL_MESSAGES);
                setInput("");
                setLoading(false);
                setIsOpen(false);
            }
        }
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
        }
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage: Message = { role: "user", content: input }
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userMessage.content }),
            })

            const data = await res.json();

            if (res.ok && data.output) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.output }])
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: AI_UNAVAILABLE_MESSAGE },
                ])
            }
        } catch (err) {
            console.error("Chat error:", err);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: AI_UNAVAILABLE_MESSAGE },
            ])
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {isOpen ? (
                <div
                    style={{ height: viewportHeight ? `${viewportHeight}px` : "100dvh" }}
                    className="md:w-[21rem] w-full md:max-h-[30rem] pb-1 bg-white fixed right-0 md:right-12 top-0 md:top-auto md:bottom-12 z-[9999] sm:rounded-lg overflow-hidden shadow-lg shadow-blue-900"
                >
                    {/* Header */}
                    <div className="h-[3rem] w-full headerbg pl-5 flex items-center justify-between">
                        <p className="text-white font-adineu text-[1.35rem]">adidas ai</p>
                        <Icon
                            icon="line-md:close-small"
                            width="45"
                            height="45"
                            color="white"
                            className="cursor-pointer"
                            onClick={toggleChat}
                        />
                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesEndRef}
                        className="bg-white w-full h-[calc(100%-6rem)] shadow-inner overflow-y-auto px-3 py-4 flex flex-col gap-y-2 scroll-smooth"
                    >
                        {messages.map((msg, i) => (
                            <p
                                key={i}
                                className={`font-adineu text-[0.95rem] rounded-md px-3 py-1 w-fit max-w-[90%] shadow-sm shadow-blue-900 ${msg.role === "user"
                                    ? "bg-gray-800 text-white self-end"
                                    : "bg-gray-100 text-gray-900 shadow-sm"
                                    }`}
                            >
                                {msg.role === "assistant" && msg.content === AI_UNAVAILABLE_MESSAGE ? (
                                    <>
                                        <span className="block font-semibold mb-2">{AI_UNAVAILABLE_TITLE}</span>
                                        <span>{msg.content}</span>
                                        <a href={AI_DEMO_URL} target="_blank" rel="noopener noreferrer" className="block mt-2 font-semibold underline underline-offset-4">Watch Video Demo →</a>
                                    </>
                                ) : msg.content}
                            </p>
                        ))}
                        {loading && (
                            <p className="font-adineu text-gray-500 animate-pulse">Adee is typing...</p>
                        )}
                    </div>

                    {/* Input */}
                    <div className="px-3 h-[3rem] flex items-center gap-x-2">
                        <input
                            type="text"
                            className="w-full py-2 border rounded-md px-2 shadow-sm font-adineu"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask me about Adidas..."
                        />
                        <Icon
                            icon="iconoir:send-solid"
                            width="36"
                            height="36"
                            className={`cursor-pointer ${loading ? "opacity-50 pointer-events-none" : ""}`}
                            onClick={sendMessage}
                        />
                    </div>
                </div>
            ) : (
                <div
                    className="fixed right-5 md:right-10 bottom-5 md:bottom-10 rounded-full p-2 headerbg z-[9999] cursor-pointer hover:scale-105 transition"
                    onClick={toggleChat}
                >
                    {!isReaded &&
                        <div className="rounded-full w-6 h-6 flex items-center justify-center bg-red-500 absolute -top-2 -right-1">
                            <p className="font-adineu text-white font-bold">1</p>
                        </div>
                    }
                    <Icon icon="hugeicons:ai-chat-02" className="text-white w-12 h-12" />
                </div>
            )}
        </>
    )
}

export default Chat;
