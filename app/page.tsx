import { Gift, PlusCircle, Ticket, Stamp } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-festive-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-full max-w-md flex flex-col h-full min-h-[600px] justify-between z-10">
                {/* Header */}
                <div className="text-center mt-8">
                    <div className="inline-block p-3 rounded-full glass-panel mb-4 shadow-lg gold-glow">
                        <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-serif text-4xl text-white font-bold leading-tight drop-shadow-lg">
                        Secret
                        <br />
                        Santa
                    </h1>
                    <p className="text-white/80 text-sm mt-3 font-light tracking-widest uppercase">
                        互换礼物 · 传递惊喜
                    </p>
                </div>

                {/* Middle Visualization */}
                <div className="flex-1 flex items-center justify-center relative my-8">
                    {/* Decor Circles */}
                    <div className="absolute w-48 h-48 bg-christmas-gold/20 rounded-full blur-3xl"></div>
                    <div className="absolute w-32 h-32 bg-christmas-red/30 rounded-full blur-2xl -top-4 -right-4"></div>

                    <div className="glass-panel p-6 rounded-2xl w-full max-w-xs rotate-3 transform shadow-2xl border-white/20 border-t">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">
                                🎄
                            </div>
                            <div className="text-white/90 text-sm font-medium">
                                致：秘密好友
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                            <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Stamp className="w-10 h-10 text-christmas-gold opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 mb-8">
                    <Link
                        href="/create"
                        className="w-full glass-panel bg-christmas-gold/90 hover:bg-christmas-gold text-christmas-red font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                    >
                        <PlusCircle className="w-5 h-5 text-christmas-red" />
                        创建新活动
                    </Link>

                    <Link
                        href="/join"
                        className="w-full glass-panel bg-black/20 hover:bg-black/40 text-white font-medium py-4 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Ticket className="w-5 h-5 text-white/70" />
                        输入邀请码加入
                    </Link>

                    <p className="text-center text-white/40 text-xs mt-4">
                        无需注册 · 隐私加密 · 阅后即焚
                    </p>
                </div>
            </div>
        </main>
    );
}
