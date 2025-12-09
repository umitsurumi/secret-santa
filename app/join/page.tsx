"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function JoinPage() {
    const router = useRouter();
    const [inviteCode, setInviteCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleJoin = async () => {
        if (!inviteCode.trim()) {
            setError("请输入邀请码");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // 验证邀请码是否存在
            const res = await fetch(`/api/activities/${inviteCode}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "无效的邀请码");
            }

            if (data.data.status !== "OPEN") {
                throw new Error("该活动已停止报名");
            }

            if (new Date(data.data.deadline) < new Date()) {
                throw new Error("该活动报名已截止");
            }

            // 跳转到报名表单
            router.push(`/join/${inviteCode}`);
        } catch (err: any) {
            setError(err.message || "验证失败，请重试");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-christmas-dark flex items-center justify-center p-8 bg-[radial-gradient(circle_at_50%_10%,#1a4d33_0%,#051610_100%)]">
            <div className="w-[375px] h-[812px] bg-transparent border-[12px] border-[#1a1a1a] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col shrink-0">
                {/* Decorative Snow */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full blur-[1px]"></div>
                <div className="absolute top-20 right-20 w-3 h-3 bg-white/10 rounded-full blur-[2px]"></div>

                <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
                    <Link
                        href="/"
                        className="absolute top-12 left-6 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>

                    <div className="text-center space-y-8">
                        <div className="inline-flex w-20 h-20 rounded-full bg-white/5 border border-white/10 items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                            <Ticket className="w-8 h-8 text-christmas-gold" />
                        </div>

                        <div>
                            <h2 className="text-2xl text-white font-serif font-bold mb-2">
                                Have an Invite?
                            </h2>
                            <p className="text-white/50 text-sm">
                                请输入房间邀请码加入活动
                            </p>
                        </div>

                        {/* PIN Input Simulation */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="XMAS-??"
                                value={inviteCode}
                                onChange={(e) => {
                                    setInviteCode(e.target.value);
                                    setError("");
                                }}
                                className="w-full text-center text-2xl font-mono tracking-[0.1em] uppercase bg-transparent border-b-2 border-white/20 pb-4 text-white focus:outline-none focus:border-christmas-gold placeholder-white/10 transition-colors"
                            />
                            {error && (
                                <p className="text-christmas-red text-sm animate-pulse">
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleJoin}
                            disabled={isLoading}
                            className="w-full bg-white text-pine font-bold py-4 rounded-xl shadow-lg mt-8 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    验证中...
                                </>
                            ) : (
                                <>
                                    验证并加入
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
