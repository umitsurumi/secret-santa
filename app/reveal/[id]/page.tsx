"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Loader2,
    Gift,
    MapPin,
    Phone,
    MessageCircle,
    ArrowRightCircle,
    Quote,
    ArrowLeft,
} from "lucide-react";

interface RevealData {
    participant: {
        id: string;
        nickname: string;
        socialAccount: string;
    };
    activity: {
        id: string;
        name: string;
        status: "OPEN" | "MATCHED" | "REVEALED";
        deadline: string;
    };
    target?: {
        nickname: string;
        socialAccount: string;
        realName: string;
        phone: string;
        address: string;
        wishes: string;
    };
    sender?: {
        nickname: string;
        socialAccount: string;
        wishes: string; // Message to me
    };
    message?: string; // For status messages like "Waiting for matching"
}

export default function RevealResultPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<RevealData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpened, setIsOpened] = useState(false); // Controls envelope opening

    const id = params.id as string;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/reveal?key=${id}`);
                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.error || "获取数据失败");
                }

                setData(result.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-red-400 mb-4 text-lg">Error</div>
                <p className="text-white/60 mb-6">{error}</p>
                <button
                    onClick={() => router.push("/reveal")}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    if (!data) return null;

    const { activity, target, sender } = data;

    // SCENARIO 1: NOT STARTED (OPEN)
    if (activity.status === "OPEN") {
        return (
            <div className="min-h-screen bg-festive-gradient flex items-center justify-center p-6">
                <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⏳</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">
                        Waiting for Santa
                    </h2>
                    <p className="text-white/70 text-sm mb-6">
                        活动 "{activity.name}" 正在报名中。
                        <br />
                        房主尚未开始抽选。请耐心等待，直到截止日期或房主手动触发。
                    </p>
                    <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                            Your Status
                        </p>
                        <p className="text-white font-medium">Ready to Gift</p>
                    </div>
                </div>
            </div>
        );
    }

    // SCENARIO 2: TARGET REVEALED (MATCHED / REVEALED) - THE ENVELOPE
    if (!isOpened) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>

                <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                    <h2 className="text-white font-serif text-3xl mb-2 text-center drop-shadow-lg">
                        The Match
                        <br />
                        Is Ready
                    </h2>
                    <p className="text-white/60 text-sm text-center mb-10 font-serif italic">
                        Your target has been selected.
                    </p>

                    {/* Envelope Interaction */}
                    <div
                        onClick={() => setIsOpened(true)}
                        className="relative w-full max-w-[300px] aspect-[4/3] group cursor-pointer perspective-1000"
                    >
                        <div className="absolute inset-0 bg-[#f4e4bc] rounded-lg shadow-2xl transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2 flex items-center justify-center border border-white/20 overflow-hidden">
                            {/* Texture */}
                            <div
                                className="absolute inset-0 opacity-50"
                                style={{
                                    backgroundImage:
                                        "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                                }}
                            ></div>

                            {/* Flap Design */}
                            <div
                                className="absolute top-0 left-0 w-full h-1/2 bg-black/5 z-10"
                                style={{
                                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                                }}
                            ></div>

                            {/* Wax Seal */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff4d4d] to-[#8E001C] flex items-center justify-center z-20 shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all border-4 border-[#8E001C]/20">
                                <span className="text-white/90 font-serif font-bold text-xl drop-shadow-md">
                                    S
                                </span>
                            </div>

                            <div className="absolute bottom-6 text-[#8E001C] font-serif text-sm tracking-widest uppercase opacity-60 font-bold">
                                Tap to Open
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center space-y-2">
                        <p className="text-white/30 text-xs uppercase tracking-wider">
                            Activity Status: {activity.status}
                        </p>
                        <div className="w-1 h-8 bg-gradient-to-b from-white/20 to-transparent mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    // SCENARIO 3: TARGET DETAILS (CARD VIEW)
    // If status is REVEALED, we might also show the Sender, but let's prioritize the Target info first
    // and maybe put the Sender info at the bottom or in a separate tab?
    // The design for REVEALED shows a "The Circle is Complete" screen.
    // Let's toggle between "My Target" and "My Santa" if REVEALED.

    return (
        <div className="min-h-screen bg-[#0F172A] flex justify-center p-0 md:p-8">
            <div className="w-full max-w-md bg-[#1C1C1E] md:rounded-[40px] md:border-[12px] md:border-[#020617] md:shadow-2xl overflow-hidden flex flex-col h-[100dvh] md:h-[812px] relative">
                {/* Header / Avatar Area */}
                <div className="h-1/3 w-full bg-[#8E001C] relative shrink-0">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -top-10 -right-10"></div>
                        <div className="absolute w-64 h-64 bg-black/20 rounded-full blur-3xl bottom-0 left-0"></div>
                    </div>

                    <button
                        onClick={() => router.push("/")}
                        className="absolute top-12 left-6 bg-black/20 p-2 rounded-full backdrop-blur-md z-20 hover:bg-black/40 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>

                    <div className="absolute -bottom-10 left-6 z-20">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-yellow-600 shadow-xl flex items-center justify-center border-4 border-[#1C1C1E]">
                            <span className="text-4xl select-none">🎁</span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 px-6 pt-12 pb-6 overflow-y-auto">
                    {/* Target Info Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                                    You are the Santa for
                                </p>
                                <h2 className="text-white font-serif text-3xl font-bold">
                                    {target?.nickname || "Unknown"}
                                </h2>
                                {target?.socialAccount && (
                                    <p className="text-white/50 text-xs mt-1">
                                        {target.socialAccount}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Wishes Card */}
                            <div className="bg-[#2C2C2E] p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                    <Gift className="w-4 h-4 text-[#D4AF37]" />
                                    <span className="text-white/80 font-medium text-sm">
                                        TA 的愿望
                                    </span>
                                </div>
                                <p className="text-white/90 text-sm leading-relaxed font-light relative z-10 whitespace-pre-wrap">
                                    {target?.wishes
                                        ? `"${target.wishes}"`
                                        : "TA 没有留下特别的愿望，自由发挥吧！"}
                                </p>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-tr-2xl rounded-bl-3xl"></div>
                            </div>

                            {/* Private Info Card */}
                            <div className="bg-[#2C2C2E] rounded-2xl border border-white/5 overflow-hidden">
                                <div className="p-5 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 bg-white/5 p-2 rounded-lg">
                                            <MapPin className="w-4 h-4 text-white/50" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-white/40 uppercase mb-1">
                                                Shipping Address
                                            </div>
                                            <div className="text-white/80 text-sm leading-relaxed select-text">
                                                {target?.address ||
                                                    "Wait for reveal..."}
                                            </div>
                                            <div className="text-[10px] text-white/40 mt-1">
                                                * 真实姓名: {target?.realName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5"></div>

                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 bg-white/5 p-2 rounded-lg">
                                            <Phone className="w-4 h-4 text-white/50" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-white/40 uppercase mb-1">
                                                Phone Number
                                            </div>
                                            <div className="text-white/80 text-sm font-mono tracking-wider select-text">
                                                {target?.phone ||
                                                    "Wait for reveal..."}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SENDER REVEAL SECTION (Only if REVEALED) */}
                    {activity.status === "REVEALED" && sender && (
                        <div className="mt-10 pt-10 border-t border-white/10">
                            <div className="flex justify-center mb-6">
                                <span className="px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 rounded-full text-[10px] font-bold tracking-widest uppercase animate-pulse">
                                    Secret Santa Revealed
                                </span>
                            </div>

                            <div className="relative group perspective-1000 mb-8">
                                {/* Ribbon Decor */}
                                <div
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-12 bg-red-600 z-20 shadow-lg"
                                    style={{
                                        clipPath:
                                            "polygon(0 0, 100% 0, 100% calc(100% - 10px), 50% 100%, 0 calc(100% - 10px))",
                                    }}
                                ></div>

                                <div className="bg-[#f1f5f9] rounded-lg shadow-2xl p-6 text-slate-800 relative rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                    <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                                        <p className="font-serif text-red-700 font-bold text-lg">
                                            From Your Santa
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-200 border-4 border-white shadow-inner flex items-center justify-center text-2xl">
                                            🎅
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-900 text-center">
                                                {sender.nickname}
                                            </h3>
                                            {sender.socialAccount && (
                                                <p className="text-slate-500 text-xs text-center mt-1">
                                                    {sender.socialAccount}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message from Sender (which is their 'wishes' to me) */}
                                    <div className="mt-6 bg-white p-4 rounded shadow-sm border border-slate-100 relative">
                                        <Quote className="w-4 h-4 text-slate-300 absolute -top-2 -left-2 bg-white rounded-full p-0.5" />
                                        <p className="text-sm font-serif italic text-slate-600 whitespace-pre-wrap">
                                            {sender.wishes
                                                ? `"${sender.wishes}"`
                                                : "Merry Christmas!"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-center pb-8">
                        <p className="text-white/30 text-[10px]">
                            请在截止日期前寄出礼物 · 祝你玩得开心
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
