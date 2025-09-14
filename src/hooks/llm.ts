/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useState } from "react";
import settings from "app/settings";

export interface LLMHooks {
  isAIModeEnabled: boolean;
  toggleAIMode: () => void;
  enableAIMode: () => void;
  disableAIMode: () => void;
  promptForText: (message?: string) => Promise<string | null>;
  askAI: (question: string) => Promise<string | null>;
}

export const useLLM = (): LLMHooks => {
  const [isAIModeEnabled, setIsAIModeEnabled] = useState(false);

  const toggleAIMode = () => {
    const newState = !isAIModeEnabled;
    setIsAIModeEnabled(newState);
    console.log(`AI Mode ${newState ? "enabled" : "disabled"}`);
  };

  const enableAIMode = () => {
    setIsAIModeEnabled(true);
    console.log("AI Mode enabled");
  };

  const disableAIMode = () => {
    setIsAIModeEnabled(false);
    console.log("AI Mode disabled");
  };

  const promptForText = async (
    message: string = "Enter some text:"
  ): Promise<string | null> => {
    try {
      const text = prompt(message);
      if (text !== null) {
        console.log("User input:", text);
        return text;
      }
      return null;
    } catch (error) {
      console.error("Error prompting for text:", error);
      return null;
    }
  };

  const askAI = async (question: string): Promise<string | null> => {
    try {
      console.log("Asking AI:", question);

      const response = await fetch(
        `${settings.openai_api_endpoint}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${settings.openai_api_key}`,
          },
          body: JSON.stringify({
            model: settings.openai_model,
            messages: [
              {
                role: "user",
                content: question,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const answer =
        data.choices?.[0]?.message?.content || "No response from AI";

      console.log("AI Response:", answer);
      return answer;
    } catch (error) {
      console.error("Error calling AI:", error);
      return null;
    }
  };

  return {
    isAIModeEnabled,
    toggleAIMode,
    enableAIMode,
    disableAIMode,
    promptForText,
    askAI,
  };
};
