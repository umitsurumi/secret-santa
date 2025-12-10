"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Camera, AtSign, Lock, Sparkles, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegistrationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: inviteCode } = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        nickname: "",
        socialAccount: "",
        realName: "",
        phone: "",
        address: "",
        wishes: "",
        thanks: "",
    });

    const handleSubmit = async () => {
        // 基础校验
        if (
            !formData.nickname ||
            !formData.realName ||
            !formData.phone ||
            !formData.address ||
            !formData.wishes
        ) {
            setError("请填写所有必填字段");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/participants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    activityId: inviteCode,
                    ...formData,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "报名失败");
            }

            // 跳转到成功页，携带 Participant Key
            const searchParams = new URLSearchParams({
                key: data.data.participantKey,
                nickname: data.data.nickname,
                activityName: data.data.activityName,
            });
            router.push(`/join/success?${searchParams.toString()}`);
        } catch (err: any) {
            setError(err.message || "报名失败，请重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    return (
        <div className="min-h-screen bg-christmas-dark flex items-center justify-center p-8 bg-[radial-gradient(circle_at_50%_10%,#1a4d33_0%,#051610_100%)]">
            <div className="max-w-md w-full mx-auto bg-christmas-glass/30 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
                <div className="flex-1 flex flex-col relative z-10 overflow-y-auto no-scrollbar pb-6">
                    {/* Sticky Header */}
                    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#0d2119]/80 backdrop-blur-md sticky top-0 z-50">
                        <div>
                            <h3 className="text-white font-serif text-lg">
                                填写详细信息
                            </h3>
                            <p className="text-xs text-white/40">
                                参加 Secret Santa
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-christmas-gold/20 flex items-center justify-center text-xs text-christmas-gold font-bold">
                            1/2
                        </div>
                    </div>

                    <div className="px-6 py-6 space-y-8">
                        {/* Public Profile Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/30">
                                    公开
                                </span>
                                <h4 className="text-white text-sm font-medium">
                                    谁在参与?
                                </h4>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
                                        <Camera className="w-6 h-6 text-white/50" />
                                    </div>
                                </div>
                                <div className="col-span-3 space-y-3">
                                    <input
                                        name="nickname"
                                        value={formData.nickname}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="昵称 (大家怎么称呼你)"
                                        className="w-full glass-input p-3 rounded-lg text-sm bg-black/20"
                                    />
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                                        <input
                                            name="socialAccount"
                                            value={formData.socialAccount}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="社交账号 (可选)"
                                            className="w-full glass-input p-3 pl-10 rounded-lg text-sm bg-black/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Private Data Section */}
                        <div className="glass-panel p-5 rounded-xl border-l-2 border-l-christmas-gold relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                                <Lock className="w-24 h-24 text-white" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-christmas-gold/20 text-christmas-gold text-[10px] px-2 py-0.5 rounded border border-christmas-gold/30 flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> 加密存储
                                </span>
                                <h4 className="text-white text-sm font-medium">
                                    收礼信息
                                </h4>
                            </div>

                            <div className="space-y-3 relative z-10">
                                <input
                                    name="realName"
                                    value={formData.realName}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="真实姓名"
                                    className="w-full glass-input p-3 rounded-lg text-sm bg-black/40"
                                />
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    type="tel"
                                    placeholder="手机号码"
                                    className="w-full glass-input p-3 rounded-lg text-sm bg-black/40"
                                />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="收货地址 (仅你的 Secret Santa 可见)"
                                    className="w-full glass-input p-3 rounded-lg text-sm bg-black/40 h-20 resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Wishes Section */}
                        <div className="space-y-2">
                            <label className="text-white text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-christmas-gold" />
                                你的愿望清单
                            </label>
                            <div className="bg-[#fffdf5] rounded-lg p-1 relative shadow-inner">
                                <div className="border border-dashed border-gray-300 rounded p-3 h-28">
                                    <textarea
                                        name="wishes"
                                        value={formData.wishes}
                                        onChange={handleChange}
                                        className="w-full h-full bg-transparent text-gray-700 text-sm focus:outline-none resize-none leading-relaxed placeholder-gray-400"
                                        placeholder="亲爱的 Santa，我是香薰蜡烛爱好者，或者一本好书也行..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                                <p className="text-red-200 text-sm text-center">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-christmas-gold hover:bg-amber-400 text-pine font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 text-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                提交中...
                            </>
                        ) : (
                            <>
                                确认提交
                                <Check className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
