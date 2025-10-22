/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { i18n } from "app/utils/i18n";
import { PageHooks } from "app/hooks/page";
import { Page } from "app/types";
import { selectFile } from "app/utils/file";
import Icon from "app/components/Icon";
import { useLLM } from "app/hooks/llm";
import { llm_prompt_dialog } from "./sidebars/LLMPrompt";
import { useMemo } from "react";
import settings from "app/settings";

interface TopBarProps {
  page_hooks: PageHooks;
  preview_url?: string;
}

const TopBar = ({ page_hooks, preview_url }: TopBarProps) => {
  const llm_hooks = useLLM(page_hooks);

  const is_llm_enabled = useMemo(() => {
    return (
      settings.openai_api_key &&
      settings.openai_api_endpoint &&
      settings.openai_model
    );
  }, [
    settings.openai_api_key,
    settings.openai_api_endpoint,
    settings.openai_model,
  ]);

  return (
    <nav className="bar h-16 min-h-16 flex">
      <button
        className="h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0"
        onClick={() => {
          history.back();
        }}
      >
        <Icon name="left" />
      </button>
      <div className="flex items-center gap-2 flex-1 px-4">
        <span className="text-xl font-semibold tracking-tight text-slate-50 dark:text-slate-900">
          {i18n("Coralpages Editor")} - {page_hooks.page?.title}
        </span>
      </div>

      <div className="flex items-center">
        <button
          className="h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0"
          onClick={() => {
            document.documentElement.classList.toggle("dark");
          }}
        >
          <Icon name="theme" />
        </button>
        {is_llm_enabled && (
          <button
            className={`h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0 ${
              llm_hooks.isAIModeEnabled ? "ai-button-active" : ""
            }`}
            aria-label={i18n("AI Assistant")}
            title={i18n("AI Assistant")}
            onClick={async () => {
              const question = await llm_prompt_dialog(
                i18n("What would you like me to help you with?")
              );
              if (question) {
                await llm_hooks.askAI(question);
              }
            }}
          >
            <Icon name="ai" className="ai-icon" />
          </button>
        )}
        <button
          className="h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0"
          aria-label={i18n("Undo")}
          title={i18n("Undo (Ctrl+Z)")}
          onClick={page_hooks.undo}
          disabled={!page_hooks.canUndo}
        >
          <Icon name="undo" />
        </button>
        <button
          className="h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0"
          aria-label={i18n("Redo")}
          title={i18n("Redo (Ctrl+Y)")}
          onClick={page_hooks.redo}
          disabled={!page_hooks.canRedo}
        >
          <Icon name="redo" />
        </button>
        <button
          className="h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0"
          aria-label={i18n("Download")}
          title={i18n("Download")}
          onClick={() => {
            if (page_hooks.page) {
              download_page(page_hooks.page);
            }
          }}
          disabled={!page_hooks.page}
        >
          <Icon name="download" />
        </button>
        <button
          className="h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0"
          aria-label={i18n("Upload")}
          title={i18n("Upload")}
          onClick={() => upload_page(page_hooks.setPage)}
        >
          <Icon name="upload" />
        </button>

        {preview_url && (
          <a
            className="h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0 flex items-center justify-center"
            aria-label={i18n("View page")}
            title={i18n("View page")}
            href={preview_url}
            target={`preview-${page_hooks.page?.id}`}
            rel="noopener noreferrer"
          >
            <Icon name="eye" />
          </a>
        )}
        <button
          className="h-16 w-16 transition-all duration-200 cursor-pointer text-slate-50 dark:text-slate-900 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-0 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-600 disabled:hover:bg-transparent disabled:focus:ring-0"
          aria-label={i18n("Save")}
          title={i18n("Save")}
          onClick={page_hooks.savePage}
        >
          <Icon
            name="save"
            className={page_hooks.need_save ? "text-red-500" : ""}
          />
        </button>
      </div>
    </nav>
  );
};

const download_page = (page: Page) => {
  // convert the page to a json string, then to a blob, then to a download link
  const json_str = JSON.stringify(page, null, 2);
  const blob = new Blob([json_str], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${page.title}.json`;
  a.click();
  setTimeout(() => {
    a.remove();
  }, 10000);
  URL.revokeObjectURL(url);
};

const upload_page = async (setPage: (page: Page) => void) => {
  const file = await selectFile("application/json");
  console.log(file);
  if (file) {
    const json_str = await file.text();
    const page = JSON.parse(json_str) as Page;
    setPage(page);
  }
};

export default TopBar;
