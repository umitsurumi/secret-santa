"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { removeKeyPrefix } from "@/lib/utils";

export default function RevealEntryPage() {
    const router = useRouter();
    const [key, setKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!key.trim()) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/reveal?key=${removeKeyPrefix(key)}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "查询失败");
            }

            // If valid, redirect to the dynamic reveal page
            router.push(`/reveal/${key}`);
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-festive-gradient flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="glass-panel p-8 rounded-2xl shadow-2xl border-t border-white/20">
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-3xl text-white font-bold mb-2">
                            查看你的匹配结果
                        </h1>
                        <p className="text-white/60 text-sm">
                            输入您的参与者密钥 (Participant Key) 查看结果
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="key"
                                className="block text-xs font-medium text-white/80 uppercase tracking-wider mb-2"
                            >
                                参与者密钥
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="key"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder="例如: clq..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-christmas-gold focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            const text =
                                                await navigator.clipboard.readText();
                                            setKey(text);
                                        } catch (err) {
                                            console.error(
                                                "Failed to read clipboard",
                                                err
                                            );
                                        }
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-christmas-gold hover:text-white transition-colors"
                                >
                                    粘贴
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !key.trim()}
                            className="w-full bg-christmas-gold hover:bg-yellow-500 text-christmas-red font-bold py-3.5 rounded-xl shadow-lg shadow-christmas-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    查看结果
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-white/40 text-xs">
                            找不到 Key? 请联系活动房主协助找回。
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
