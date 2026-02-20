"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bl-anthropic-api-key";

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) ?? "";
    setApiKeyState(stored);
  }, []);

  function setApiKey(key: string) {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return { apiKey, setApiKey };
}

/** Build headers object that includes the API key if present */
export function apiHeaders(apiKey: string, extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...extra };
  if (apiKey) {
    headers["x-anthropic-api-key"] = apiKey;
  }
  return headers;
}

interface ApiKeySettingsProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ApiKeySettings({ apiKey, onApiKeyChange }: ApiKeySettingsProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(apiKey);
  }, [apiKey]);

  const isSet = apiKey.length > 0;
  const maskedKey = apiKey ? `sk-ant-...${apiKey.slice(-8)}` : "";

  async function handleSave() {
    const nextKey = inputValue.trim();
    if (!nextKey) {
      onApiKeyChange("");
      setValidationError(null);
      setOpen(false);
      return;
    }

    setValidating(true);
    setValidationError(null);
    try {
      const res = await fetch("/api/health/apikey", {
        method: "GET",
        headers: apiHeaders(nextKey),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setValidationError(data.error ?? "APIキーが無効です。正しいキーを入力してください。");
        return;
      }

      onApiKeyChange(nextKey);
      setOpen(false);
    } catch {
      setValidationError("APIキーの検証に失敗しました。ネットワーク接続を確認してください。");
    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300 border ${
          isSet
            ? "border-emerald-400/20 text-emerald-400/70 bg-emerald-400/5 hover:bg-emerald-400/10"
            : "border-amber-400/20 text-amber-400/70 bg-amber-400/5 hover:bg-amber-400/10"
        }`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
        {isSet ? "API Key Set" : "Set API Key"}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80">
          <div className="glass-card p-4" style={{ background: "rgba(10, 15, 30, 0.95)" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Anthropic API Key
              </h4>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-[10px] text-white/25 mb-3 leading-relaxed">
              LLM分析・AI参加・クラスタラベル生成に使用されます。キーはブラウザのlocalStorageに保存され、サーバーには保存されません。
            </p>

            <div className="relative mb-3">
              <input
                type={showKey ? "text" : "password"}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="sk-ant-api03-..."
                className="input-abyss text-xs py-2.5 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  {showKey ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={validating}
                className="btn-glow text-[10px] py-1.5 px-4"
              >
                {validating ? "検証中..." : "保存"}
              </button>
              {isSet && (
                <button
                  type="button"
                  onClick={() => {
                    onApiKeyChange("");
                    setInputValue("");
                  }}
                  className="btn-glass text-[10px] py-1.5 px-3 text-rose-400/60"
                >
                  削除
                </button>
              )}
              {isSet && (
                <span className="text-[9px] text-emerald-400/40 ml-auto font-mono">
                  {maskedKey}
                </span>
              )}
            </div>
            {validationError && (
              <p className="mt-2 text-[10px] text-rose-300/80">{validationError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
