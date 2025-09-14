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
import { Page } from "app/types";
import { PageHooks } from "./page";
import useElementDefinitions from "./element_definitions";
import { applyJSONPatch, JSONPatch } from "app/utils/jsonPatch";
import { useClassesDefinitions } from "./classes";

export interface LLMHooks {
  isAIModeEnabled: boolean;
  askAI: (question: string) => Promise<string | null>;
}

export const useLLM = (page_hooks: PageHooks): LLMHooks => {
  // Handle backward compatibility - if config is PageHooks directly, use it
  const page = page_hooks?.page;
  const classes = useClassesDefinitions();
  const [isAIModeEnabled, setIsAIModeEnabled] = useState(false);
  const [elementDefinitions] = useElementDefinitions();

  const askAI = async (question: string): Promise<string | null> => {
    try {
      console.log("Asking AI:", question);

      // Enable AI mode when starting the request
      setIsAIModeEnabled(true);

      // Create context with page data
      const pageContext = page
        ? JSON.stringify(page, null, 2)
        : "No page data available";

      const systemPrompt = `You are an AI assistant for a page editor. You help users modify and improve their web pages.

Current page data (JSON format):
${pageContext}

There are these elements available:
${JSON.stringify(elementDefinitions, null, 2)}

These are the predefined CSS classes. You can not add new classes if its not here:
${JSON.stringify(classes, null, 2)}

You can also add any CSS style class at any child's style property.

IMPORTANT: You must respond with ONLY valid JSON. Your response should be a JSON object that can be used to update the page. Do not include any explanatory text, markdown formatting, or code blocks - just pure JSON.

The modifications JSON should follow the RFC 6902 (JSON Patch) structure.

If you cannot perform the requested action, respond with:
{
  "error": "description of why the action cannot be performed"
}
  `;

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
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: question,
              },
            ],
            // temperature: 0.3,
            // max_tokens: 1500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const answer =
        data.choices?.[0]?.message?.content || "No response from AI";

      console.log("AI Response (Raw):", answer);

      // Try to parse as JSON to validate and apply patches
      try {
        const jsonResponse = JSON.parse(answer);
        console.log("AI Response (Parsed JSON):", jsonResponse);

        // Check if the response contains JSON Patch operations
        if (Array.isArray(jsonResponse)) {
          console.log("Applying JSON Patch operations from AI response...");
          const updatedPage = applyJSONPatchToPage(jsonResponse);

          if (updatedPage && page_hooks?.setPage) {
            console.log("Updating page with AI changes...");
            page_hooks.setPage(updatedPage);
          } else if (updatedPage) {
            console.log(
              "Page updated successfully, but no page_hooks provided"
            );
          } else {
            console.error("Failed to apply JSON Patch operations");
          }
        }

        // Disable AI mode when request completes successfully
        setIsAIModeEnabled(false);
        return answer;
      } catch (parseError) {
        console.warn("AI response is not valid JSON:", answer);
        console.error("Parse error:", parseError);

        // Disable AI mode even if JSON parsing fails
        setIsAIModeEnabled(false);
        return answer; // Return raw response even if not JSON
      }
    } catch (error) {
      console.error("Error calling AI:", error);

      // Disable AI mode on error
      setIsAIModeEnabled(false);
      return null;
    }
  };

  const applyJSONPatchToPage = (patch: JSONPatch): Page | null => {
    if (!page) {
      console.error("No page data available to apply patch");
      return null;
    }

    return applyJSONPatch<Page>(page as Page, patch);
  };

  return {
    isAIModeEnabled,
    askAI,
  };
};
