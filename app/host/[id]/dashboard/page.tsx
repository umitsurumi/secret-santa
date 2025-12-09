import {
    Settings2,
    ShieldAlert,
    Copy,
    Users,
    Share2,
    Ghost,
} from "lucide-react";

export default function HostDashboard() {
    return (
        <main className="min-h-screen bg-festive-gradient flex items-center justify-center p-6">
            <div className="w-full max-w-md h-full min-h-[600px] flex flex-col">
                {/* Status Bar */}
                <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>{" "}
                        OPEN
                    </span>
                    <button className="text-white/60 hover:text-white transition-colors">
                        <Settings2 className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-white font-serif text-2xl">
                        2023 设计部圣诞派对
                    </h2>
                    <p className="text-white/50 text-xs mt-1">
                        创建于 12月20日 14:00
                    </p>
                </div>

                {/* Admin Key CARD */}
                <div className="glass-panel p-5 rounded-2xl mb-4 border-l-4 border-l-red-500 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-500/30 transition-all"></div>
                    <h4 className="text-red-200 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" />
                        Host Credential (Private)
                    </h4>
                    <div className="flex items-center justify-between gap-2 bg-black/40 p-3 rounded-lg border border-white/5">
                        <code className="text-white font-mono text-lg tracking-widest text-ellipsis overflow-hidden">
                            sk_928...x8z
                        </code>
                        <button className="text-white/70 hover:text-white p-2 transition-colors">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[10px] text-white/40 mt-2 text-right">
                        请立即截图保存，丢失无法找回
                    </p>
                </div>

                {/* Invite Key CARD */}
                <div className="glass-panel p-5 rounded-2xl mb-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-christmas-gold/20 rounded-full blur-xl"></div>
                    <Users className="w-24 h-24 text-white/5 absolute -bottom-4 -right-4 transform -rotate-12" />

                    <h4 className="text-christmas-gold text-xs font-bold uppercase tracking-wider mb-2">
                        Public Invitation Code
                    </h4>
                    <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-xl border border-dashed border-white/20">
                        <div className="text-3xl font-mono text-white font-bold tracking-[0.2em] mb-2">
                            XMAS-23
                        </div>
                        <p className="text-white/40 text-xs">
                            分享此代码给朋友加入
                        </p>
                    </div>

                    <button className="w-full mt-4 bg-white text-christmas-red font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                        <Share2 className="w-4 h-4" />
                        复制邀请链接
                    </button>
                </div>

                {/* Player List Preview */}
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-3 px-1">
                        <h3 className="text-white text-sm font-medium">
                            Participants (0)
                        </h3>
                        <span className="text-xs text-white/40">
                            Waiting for players...
                        </span>
                    </div>
                    <div className="glass-panel rounded-xl p-8 flex flex-col items-center justify-center text-center h-32 border-dashed border-white/10">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 animate-bounce">
                            <Ghost className="w-5 h-5 text-white/30" />
                        </div>
                        <p className="text-white/30 text-xs">
                            暂无参与者
                            <br />
                            快去分享邀请码吧
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
