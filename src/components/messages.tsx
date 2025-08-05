import { useEffect, useState } from "react";

let message_id = 0;
const MESSAGE_TIMEOUT = 200 * 1000;

const next_message_id = () => {
  return `message-${message_id++}`;
};

export type MessageLevel = "error" | "warning" | "info";

export interface MessageProps {
  id?: string;
  content?: string;
  level?: MessageLevel;
  duration?: number; // milliseconds, defaults to 5000
}

export interface MessageState {
  id: string;
  content: string;
  level: MessageLevel;
  duration: number;
  createdAt: number;
}

let setMessageStack = (
  setter: (old_messages: MessageState[]) => MessageState[],
) => {};

export const set_setMessageStack = (
  new_setMessageStack: (
    setter: (old_messages: MessageState[]) => MessageState[],
  ) => void,
) => {
  setMessageStack = new_setMessageStack;
};

const remove_from_stack = (id: string) => {
  setMessageStack((oldMessages) => {
    return oldMessages.filter((message) => message.id !== id);
  });
};

const add_to_stack = (message: MessageState) => {
  setMessageStack((oldMessages) => {
    return [...oldMessages, message];
  });
};

export const showMessage = (content: string, props: MessageProps) => {
  const id = props.id || next_message_id();
  const duration = props.duration || MESSAGE_TIMEOUT;
  const message: MessageState = {
    id,
    content,
    level: props.level || "info",
    duration,
    createdAt: Date.now(),
  };

  add_to_stack(message);

  // Auto-remove after duration
  setTimeout(() => {
    remove_from_stack(id);
  }, duration);

  return id;
};

export const MessageStack = () => {
  const [messages, setMessages] = useState<MessageState[]>([]);

  useEffect(() => {
    set_setMessageStack(setMessages);
  }, []);

  return (
    <div className="fixed top-6 left-center">
      {messages.map((message) => (
        <Message key={message.id} message={message} className="mb-6" />
      ))}
    </div>
  );
};

const Message = ({
  message,
  className,
}: {
  message: MessageState;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      remove_from_stack(message.id);
    }, 300); // Wait for fade out animation
  };

  const getLevelClass = () => {
    switch (message.level) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={`w-120 shadow-md shadow-black/50 rounded p-6 ${getLevelClass()} ${
        isVisible ? "visible" : "hidden"
      } ${className || ""}`}
    >
      <div className="text-white flex flex-row justify-between">
        <span className="pr-12">{message.content}</span>
        <button
          className="cursor-pointer border-white border rounded px-2 hover:bg-white/50"
          onClick={handleClose}
          aria-label="Close message"
        >
          ×
        </button>
      </div>
    </div>
  );
};
