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
    Copy,
    Check,
    Share2,
} from "lucide-react";
import { addKeyPrefix } from "@/lib/utils";

export default function CreateEvent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [createdActivity, setCreatedActivity] = useState<{
        activityId: string;
        adminKey: string;
        name: string;
        deadline: string;
    } | null>(null);

    const [formData, setFormData] = useState({
        name: "2025 圣诞派对",
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

            // 保存创建的活动数据，显示成功面板
            setCreatedActivity(data.data);
        } catch (err: any) {
            console.error("Failed to create activity:", err);
            setError(err.message || "创建活动失败，请稍后重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        alert(`${type} 已复制到剪贴板`);
    };

    const handleGoToDashboard = () => {
        if (!createdActivity) return;
        const searchParams = new URLSearchParams({
            adminKey: createdActivity.adminKey,
            new: "true",
        });
        router.push(
            `/host/${
                createdActivity.activityId
            }/dashboard?${searchParams.toString()}`
        );
    };

    // 成功面板
    if (createdActivity) {
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
                            创建成功
                        </span>
                    </div>

                    {/* Success Card */}
                    <div className="glass-panel p-6 rounded-3xl w-full flex-1 flex flex-col">
                        <h3 className="text-white/60 text-sm font-medium mb-6 uppercase tracking-wider">
                            Activity Created
                        </h3>

                        <div className="space-y-6 flex-1">
                            {/* Activity Info */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <h4 className="text-white font-bold text-lg mb-2">
                                    {createdActivity.name}
                                </h4>
                                <p className="text-white/60 text-sm">
                                    截止时间:{" "}
                                    {new Date(
                                        createdActivity.deadline
                                    ).toLocaleString("zh-CN")}
                                </p>
                            </div>

                            {/* Keys */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-white/70 text-sm mb-2 block">
                                        <span className="flex items-center gap-2">
                                            <Key className="w-4 h-4 text-christmas-gold" />
                                            邀请码 (Invite Key)
                                        </span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 glass-input p-3 rounded-lg text-white font-mono text-sm truncate">
                                            {addKeyPrefix(
                                                createdActivity.activityId,
                                                "invite"
                                            )}
                                        </code>
                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    addKeyPrefix(
                                                        createdActivity.activityId,
                                                        "invite"
                                                    ),
                                                    "邀请码"
                                                )
                                            }
                                            className="p-3 glass-panel hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Copy className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                    <p className="text-white/40 text-xs mt-2">
                                        将此码分享给参与者，让他们加入活动。
                                    </p>
                                </div>

                                <div>
                                    <label className="text-white/70 text-sm mb-2 block">
                                        <span className="flex items-center gap-2">
                                            <Key className="w-4 h-4 text-red-400" />
                                            管理密钥 (Admin Key)
                                        </span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 glass-input p-3 rounded-lg text-white font-mono text-sm truncate">
                                            {addKeyPrefix(
                                                createdActivity.adminKey,
                                                "admin"
                                            )}
                                        </code>
                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    addKeyPrefix(
                                                        createdActivity.adminKey,
                                                        "admin"
                                                    ),
                                                    "管理密钥"
                                                )
                                            }
                                            className="p-3 glass-panel hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Copy className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                    <p className="text-red-300/70 text-xs mt-2 flex items-center gap-1">
                                        <AlertOctagon className="w-3 h-3" />
                                        请务必保存此密钥！这是您管理活动的唯一凭证，丢失无法找回。
                                    </p>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                                <p className="text-red-200 text-sm leading-relaxed">
                                    <strong>重要提示：</strong>
                                    系统不会存储您的 Admin
                                    Key，请立即截图或复制保存。关闭此页面后将无法再次查看。
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
                                <button
                                    onClick={handleGoToDashboard}
                                    className="w-full bg-linear-to-r from-christmas-gold to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    进入管理后台
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <Link
                                    href="/"
                                    className="w-full glass-panel bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    返回首页
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // 原始表单
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
                                <AlertOctagon className="w-5 h-5 text-red-300 mt-0.5 shrink-0" />
                                <p className="text-xs text-red-200 leading-relaxed">
                                    活动创建后将生成唯一的{" "}
                                    <strong>Admin Key</strong>
                                    。由于系统不保存账号，请务必自行截图保存。
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-linear-to-r from-christmas-gold to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
