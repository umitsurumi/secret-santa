"use client";

import { useSearchParams } from "next/navigation";
import { Download, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { addKeyPrefix } from "@/lib/utils";

function TicketContent() {
    const searchParams = useSearchParams();
    const nickname = searchParams.get("nickname") || "Guest";
    const participantKey = searchParams.get("key") || "UNKNOWN";
    const activityName = searchParams.get("activityName") || "Secret Santa";

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const keyWithPrefix = addKeyPrefix(participantKey, "participant");
        navigator.clipboard.writeText(keyWithPrefix);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-md w-full mx-auto bg-christmas-glass/30 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
            <div className="flex-1 flex flex-col items-center pt-8 px-6 relative z-10 overflow-y-auto no-scrollbar">
                <h2 className="text-white font-serif text-2xl mb-2 text-center">
                    报名成功！
                </h2>
                <p className="text-white/60 text-xs text-center mb-6 max-w-[200px]">
                    请务必保存下方票根，它是你领取礼物和查看结果的唯一凭证。
                </p>

                {/* THE TICKET */}
                <div className="w-full bg-[#Fdfbf7] text-slate-800 rounded-lg overflow-hidden shadow-2xl relative transform rotate-1 hover:rotate-0 transition-transform duration-500 group">
                    {/* Ticket Header */}
                    <div className="bg-christmas-red p-4 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute w-full h-full top-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                        <span className="text-white/80 font-mono text-xs z-10">
                            票根编号{" "}
                            {Math.floor(Math.random() * 1000)
                                .toString()
                                .padStart(3, "0")}
                        </span>
                        <div className="flex gap-1 z-10">
                            <div className="w-2 h-2 rounded-full bg-christmas-gold"></div>
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                    </div>

                    {/* Main Body */}
                    <div className="p-6 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-gray-900 leading-none mb-1">
                                    Secret
                                    <br />
                                    Santa
                                </h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 truncate max-w-[150px]">
                                    {activityName}
                                </p>
                            </div>
                            <div className="border-2 border-slate-900 p-1 rounded">
                                {/* Fake QR */}
                                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center">
                                    <div className="w-8 h-8 grid grid-cols-4 gap-0.5">
                                        <div className="bg-white col-span-2 row-span-2"></div>
                                        <div className="bg-white"></div>
                                        <div className="bg-white"></div>
                                        <div className="bg-white col-start-4 row-start-4"></div>
                                        <div className="bg-white col-start-1 row-start-3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Key */}
                        <div className="bg-slate-100 p-3 rounded border border-slate-200">
                            <p className="text-[10px] text-slate-400 uppercase mb-1">
                                你的参与密钥
                            </p>
                            <div className="flex justify-between items-center gap-2">
                                <code className="text-sm font-mono font-bold text-christmas-red tracking-wider truncate flex-1 block">
                                    {addKeyPrefix(
                                        participantKey,
                                        "participant"
                                    )}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="shrink-0 p-1 hover:bg-slate-200 rounded transition-colors"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-slate-400 hover:text-christmas-red" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Rip Line */}
                        <div className="my-6 border-b-2 dashed border-slate-300 relative">
                            <div className="absolute -left-[34px] -top-2.5 w-5 h-5 bg-[#0F281E] rounded-full"></div>
                            <div className="absolute -right-[34px] -top-2.5 w-5 h-5 bg-[#0F281E] rounded-full"></div>
                        </div>

                        {/* Ticket Footer */}
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase">
                                    昵称
                                </div>
                                <div className="font-bold text-sm truncate max-w-[100px]">
                                    {nickname}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase text-right">
                                    状态
                                </div>
                                <div className="font-bold text-sm text-right text-green-600 flex items-center justify-end gap-1">
                                    等待中{" "}
                                    <span className="block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Edge */}
                    <div className="h-2 bg-linear-to-r from-christmas-red to-[#0F281E]"></div>
                </div>

                {/* Action Buttons */}
                <div className="w-full mt-8 space-y-3 pb-8">
                    <button
                        className="w-full glass-panel bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                        onClick={() => window.print()}
                    >
                        <Download className="w-4 h-4" />
                        保存图片 / 打印
                    </button>
                    <Link
                        href="/"
                        className="block w-full text-white/40 text-xs hover:text-white/60 py-2 text-center transition-colors"
                    >
                        既然保存好了，在此游览活动大厅 &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function TicketPage() {
    return (
        <div className="min-h-screen bg-christmas-dark flex items-center justify-center p-8 bg-[radial-gradient(circle_at_50%_10%,#1a4d33_0%,#051610_100%)]">
            <Suspense
                fallback={<div className="text-white">Loading ticket...</div>}
            >
                <TicketContent />
            </Suspense>
        </div>
    );
}
