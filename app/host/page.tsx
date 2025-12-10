"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HostEnterPage() {
    const [adminKey, setAdminKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminKey.trim()) {
            setError("请输入 Admin Key");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `/api/activities?adminKey=${encodeURIComponent(adminKey)}`
            );
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "无效的 Admin Key");
            }

            const activityId = data.data.id;
            // 重定向到管理仪表板
            router.push(
                `/host/${activityId}/dashboard?adminKey=${encodeURIComponent(
                    adminKey
                )}`
            );
        } catch (err: any) {
            setError(err.message || "验证失败，请检查 Key 是否正确");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-festive-gradient flex items-center justify-center p-6">
            <div className="w-full max-w-md h-full min-h-[600px] flex flex-col">
                {/* 导航 */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/"
                        className="p-2 rounded-full glass-panel hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Link>
                    <span className="text-white font-serif text-xl tracking-wide">
                        房主管理入口
                    </span>
                </div>

                {/* 卡片 */}
                <div className="glass-panel p-6 rounded-3xl w-full flex-1 flex flex-col">
                    <h3 className="text-white/60 text-sm font-medium mb-6 uppercase tracking-wider">
                        输入管理员密钥
                    </h3>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 flex-1 flex flex-col"
                    >
                        <div className="space-y-2">
                            <label className="text-white text-sm ml-1 flex items-center gap-2">
                                <Key className="w-4 h-4 text-christmas-gold" />
                                管理员密钥
                            </label>
                            <input
                                type="text"
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                                placeholder="输入创建活动时获得的 Admin Key"
                                className="w-full glass-input p-4 rounded-xl text-white placeholder-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                                required
                                autoFocus
                            />
                            <p className="text-white/40 text-xs mt-2">
                                如果您是房主，请在创建活动时保存的 Admin Key
                                粘贴至此。
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                                <p className="text-red-200 text-sm text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="mt-auto pt-6 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-christmas-gold to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        验证中...
                                    </>
                                ) : (
                                    <>
                                        进入管理后台
                                        <Key className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
