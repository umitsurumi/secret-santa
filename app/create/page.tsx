"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Sparkles,
    CalendarClock,
    Sticker,
    Key,
    AlertOctagon,
    Loader2,
} from "lucide-react";

export default function CreateEvent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "2023 设计部圣诞派对",
        deadline: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.deadline) {
            setError("请填写完整信息");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/activities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "创建活动失败");
            }

            // 跳转到房主 Dashboard 并携带 Admin Key
            // 这里我们使用 URL search params 传递 key，
            // 实际上在生产环境中可能需要更安全的方式，或者在跳转后立即让用户保存
            const searchParams = new URLSearchParams({
                adminKey: data.data.adminKey,
                new: "true",
            });
            router.push(
                `/host/${
                    data.data.activityId
                }/dashboard?${searchParams.toString()}`
            );
        } catch (err: any) {
            console.error("Failed to create activity:", err);
            setError(err.message || "创建活动失败，请稍后重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-festive-gradient flex items-center justify-center p-6">
            <div className="w-full max-w-md h-full min-h-[600px] flex flex-col">
                {/* Nav */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/"
                        className="p-2 rounded-full glass-panel hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </Link>
                    <span className="text-white font-serif text-xl tracking-wide">
                        发起活动
                    </span>
                </div>

                {/* Form Card */}
                <div className="glass-panel p-6 rounded-3xl w-full flex-1 flex flex-col">
                    <h3 className="text-white/60 text-sm font-medium mb-6 uppercase tracking-wider">
                        Activity Details
                    </h3>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 flex-1 flex flex-col"
                    >
                        {/* Input 1: Activity Name */}
                        <div className="space-y-2">
                            <label className="text-white text-sm ml-1 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-christmas-gold" />
                                活动主题
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full glass-input p-4 rounded-xl text-white placeholder-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                                placeholder="给活动起个名字"
                                required
                            />
                        </div>

                        {/* Input 2: Deadline */}
                        <div className="space-y-2">
                            <label className="text-white text-sm ml-1 flex items-center gap-2">
                                <CalendarClock className="w-4 h-4 text-christmas-gold" />
                                截止报名时间
                            </label>
                            <div className="flex items-center glass-input p-4 rounded-xl focus-within:bg-black/30 focus-within:border-christmas-gold">
                                <input
                                    type="datetime-local"
                                    value={formData.deadline}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            deadline: e.target.value,
                                        })
                                    }
                                    className="bg-transparent w-full text-white outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input 3: Description */}
                        <div className="space-y-2">
                            <label className="text-white text-sm ml-1 flex items-center gap-2">
                                <Sticker className="w-4 h-4 text-christmas-gold" />
                                规则备注 (可选)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full glass-input p-4 rounded-xl text-white h-24 resize-none focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                placeholder="例如：礼物金额限制在 50-100 元..."
                            ></textarea>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                                <p className="text-red-200 text-sm text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Footer Warning & Submit */}
                        <div className="mt-auto pt-6 border-t border-white/10">
                            <div className="flex gap-3 items-start bg-red-500/20 p-3 rounded-lg border border-red-500/30 mb-4">
                                <AlertOctagon className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-red-200 leading-relaxed">
                                    活动创建后将生成唯一的{" "}
                                    <strong>Admin Key</strong>
                                    。由于系统不保存账号，请务必自行截图保存。
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-christmas-gold to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        创建中...
                                    </>
                                ) : (
                                    <>
                                        生成活动 Key
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
