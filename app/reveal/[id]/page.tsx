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
    Edit2,
    LogOut,
    Save,
    X,
} from "lucide-react";

interface RevealData {
    participant: {
        id: string;
        nickname: string;
        socialAccount: string;
        realName?: string;
        phone?: string;
        address?: string;
        noteToSanta?: string;
        noteToTarget?: string;
    };
    activity: {
        id: string;
        name: string;
        description: string | null;
        status: "OPEN" | "MATCHED" | "REVEALED";
        deadline: string;
    };
    target?: {
        nickname: string;
        socialAccount: string;
        realName: string;
        phone: string;
        address: string;
        noteToSanta: string;
    };
    sender?: {
        nickname: string;
        socialAccount: string;
        noteToTarget: string; // Message to me (noteToTarget)
        noteToSanta?: string; // Backward compatibility
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

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        nickname: "",
        socialAccount: "",
        realName: "",
        phone: "",
        address: "",
        noteToSanta: "",
        noteToTarget: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

                // Pre-fill edit form
                if (result.data.participant) {
                    setEditForm({
                        nickname: result.data.participant.nickname || "",
                        socialAccount:
                            result.data.participant.socialAccount || "",
                        realName: result.data.participant.realName || "",
                        phone: result.data.participant.phone || "",
                        address: result.data.participant.address || "",
                        noteToSanta: result.data.participant.noteToSanta || "",
                        noteToTarget:
                            result.data.participant.noteToTarget || "",
                    });
                }
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

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/participants/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "更新失败");
            }

            // Reload data to reflect changes
            window.location.reload();
        } catch (err: any) {
            alert(err.message);
            setIsSaving(false);
        }
    };

    const handleExit = async () => {
        if (!confirm("确定要退出活动吗？此操作不可撤销。")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/participants/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "退出失败");
            }

            router.push("/");
        } catch (err: any) {
            alert(err.message);
            setIsDeleting(false);
        }
    };

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
                <div className="text-red-400 mb-4 text-lg">错误</div>
                <p className="text-white/60 mb-6">{error}</p>
                <button
                    onClick={() => router.push("/reveal")}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors"
                >
                    返回登录
                </button>
            </div>
        );
    }

    if (!data) return null;

    const { activity, target, sender } = data;

    // SCENARIO 1: NOT STARTED (OPEN)
    if (activity.status === "OPEN") {
        if (isEditing) {
            return (
                <div className="min-h-screen bg-festive-gradient flex items-center justify-center p-6 overflow-y-auto">
                    <div className="glass-panel p-8 rounded-2xl max-w-md w-full my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-white">
                                更新信息
                            </h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                    昵称
                                </label>
                                <input
                                    value={editForm.nickname}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            nickname: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                    社交账号
                                </label>
                                <input
                                    value={editForm.socialAccount}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            socialAccount: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                    真实姓名
                                </label>
                                <input
                                    value={editForm.realName}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            realName: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                    手机号
                                </label>
                                <input
                                    value={editForm.phone}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                    收货地址
                                </label>
                                <textarea
                                    value={editForm.address}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            address: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm h-20 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                    给送礼人的备注 (愿望清单)
                                </label>
                                <textarea
                                    value={editForm.noteToSanta}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            noteToSanta: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm h-20 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">
                                    给收礼人的备注 (祝福语)
                                </label>
                                <textarea
                                    value={editForm.noteToTarget}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            noteToTarget: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white text-sm h-20 resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="flex-1 bg-christmas-gold hover:bg-yellow-500 text-christmas-red font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                保存更改
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-festive-gradient flex items-center justify-center p-6">
                <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⏳</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">
                        等待圣诞老人
                    </h2>
                    <p className="text-white/70 text-sm mb-6">
                        活动 "{activity.name}" 正在报名中。
                        <br />
                        房主尚未开始抽选。请耐心等待，直到截止日期或房主手动触发。
                    </p>
                    {activity.description && (
                        <div className="bg-black/20 p-4 rounded-lg mb-6 text-left">
                            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                                活动备注
                            </p>
                            <p className="text-white/80 text-sm whitespace-pre-wrap">
                                {activity.description}
                            </p>
                        </div>
                    )}
                    <div className="bg-black/20 p-4 rounded-lg mb-6">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                            你的状态
                        </p>
                        <p className="text-white font-medium">准备送礼</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            修改信息
                        </button>
                        <button
                            onClick={handleExit}
                            disabled={isDeleting}
                            className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-200 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <LogOut className="w-4 h-4" />
                            )}
                            退出活动
                        </button>
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
                <div className="absolute inset-0 bg-linear-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>

                <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                    <h2 className="text-white font-serif text-3xl mb-2 text-center drop-shadow-lg">
                        匹配已就绪
                    </h2>
                    <p className="text-white/60 text-sm text-center mb-10 font-serif italic">
                        你的送礼对象已选定。
                    </p>

                    {/* Envelope Interaction */}
                    <div
                        onClick={() => setIsOpened(true)}
                        className="relative w-full max-w-[300px] aspect-4/3 group cursor-pointer perspective-1000"
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
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#ff4d4d] to-[#8E001C] flex items-center justify-center z-20 shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all border-4 border-[#8E001C]/20">
                                <span className="text-white/90 font-serif font-bold text-xl drop-shadow-md">
                                    S
                                </span>
                            </div>

                            <div className="absolute bottom-6 text-[#8E001C] font-serif text-sm tracking-widest uppercase opacity-60 font-bold">
                                点击打开
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center space-y-2">
                        <p className="text-white/30 text-xs uppercase tracking-wider">
                            活动状态: {activity.status}
                        </p>
                        <div className="w-1 h-8 bg-linear-to-b from-white/20 to-transparent mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    // SCENARIO 3: TARGET DETAILS (CARD VIEW)
    // Refactored for better responsiveness and layout stability
    return (
        <div className="min-h-screen bg-[#0F172A] flex justify-center p-0 md:p-8">
            <div className="w-full max-w-5xl bg-[#1C1C1E] md:rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-screen md:min-h-0 relative transition-all duration-300">
                {/* Header / Avatar Area */}
                <div className="h-48 md:h-64 w-full bg-[#8E001C] relative shrink-0">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -top-10 -right-10"></div>
                        <div className="absolute w-64 h-64 bg-black/20 rounded-full blur-3xl bottom-0 left-0"></div>
                    </div>

                    <button
                        onClick={() => router.push("/")}
                        className="absolute top-8 left-6 md:top-10 md:left-10 bg-black/20 p-2 rounded-full backdrop-blur-md z-30 hover:bg-black/40 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>

                    <div className="absolute -bottom-10 left-6 md:left-10 z-20">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-linear-to-br from-[#D4AF37] to-yellow-600 shadow-xl flex items-center justify-center border-4 border-[#1C1C1E]">
                            <span className="text-4xl md:text-5xl select-none">
                                🎁
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body Content Wrapper */}
                <div className="flex-1 flex flex-col">
                    {/* Activity Description & Info Bar */}
                    {/* Padding top is adjusted to prevent icon overlap on mobile, and margin left for desktop */}
                    <div className="px-6 md:px-10 pt-16 md:pt-6 pb-6 bg-[#1C1C1E] border-b border-white/10 min-h-[100px] flex flex-col justify-center">
                        <div className="md:ml-48 transition-all duration-300">
                            {activity.description ? (
                                <div className="flex items-start gap-3">
                                    <span className="text-white/50 text-xs uppercase tracking-wider shrink-0 mt-1">
                                        活动备注:
                                    </span>
                                    <p className="text-white/90 text-sm md:text-base flex-1 whitespace-pre-wrap leading-relaxed">
                                        {activity.description}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-white/30 text-sm italic">
                                    没有活动备注
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="flex-1 p-6 md:p-10">
                        <div
                            className={`grid grid-cols-1 gap-12 ${
                                activity.status === "REVEALED" && sender
                                    ? "lg:grid-cols-2"
                                    : "max-w-2xl mx-auto"
                            }`}
                        >
                            {/* LEFT COLUMN: TARGET (Always visible here) */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                                            你是以下参与者的圣诞老人
                                        </p>
                                        <h2 className="text-white font-serif text-3xl md:text-4xl font-bold">
                                            {target?.nickname || "Unknown"}
                                        </h2>
                                        {target?.socialAccount && (
                                            <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                                                {target.socialAccount}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Wishes Card */}
                                <div className="bg-[#2C2C2E] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors shadow-lg">
                                    <div className="flex items-center gap-2 mb-4 relative z-10">
                                        <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg">
                                            <Gift className="w-4 h-4 text-[#D4AF37]" />
                                        </div>
                                        <span className="text-white/80 font-medium text-sm tracking-wide">
                                            TA 的愿望
                                        </span>
                                    </div>
                                    <p className="text-white/90 text-base leading-relaxed font-light relative z-10 whitespace-pre-wrap">
                                        {target?.noteToSanta
                                            ? target.noteToSanta
                                            : "TA 没有留下特别的愿望，自由发挥吧！"}
                                    </p>
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-linear-to-br from-white/5 to-transparent rounded-full blur-xl"></div>
                                </div>

                                {/* Private Info Card */}
                                <div className="bg-[#2C2C2E] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                                    <div className="p-6 space-y-5">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 bg-white/5 p-2.5 rounded-xl shrink-0">
                                                <MapPin className="w-5 h-5 text-white/50" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-white/40 uppercase mb-1 tracking-wider">
                                                    收货地址
                                                </div>
                                                <div className="text-white/80 text-sm md:text-base leading-relaxed select-text">
                                                    {target?.address ||
                                                        "等待揭晓..."}
                                                </div>
                                                <div className="text-[10px] text-white/40 mt-2 flex items-center gap-1.5">
                                                    <span className="opacity-50">
                                                        收件人:
                                                    </span>
                                                    <span className="text-white/60 font-medium">
                                                        {target?.realName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5 mx-2"></div>

                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 bg-white/5 p-2.5 rounded-xl shrink-0">
                                                <Phone className="w-5 h-5 text-white/50" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-white/40 uppercase mb-1 tracking-wider">
                                                    手机号码
                                                </div>
                                                <div className="text-white/80 text-sm md:text-base font-mono tracking-wider select-text">
                                                    {target?.phone ||
                                                        "等待揭晓..."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: SENDER (Only if REVEALED) */}
                            {activity.status === "REVEALED" && sender && (
                                <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-12 relative">
                                    <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent"></div>

                                    <div className="flex flex-col h-full">
                                        <div className="mb-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse"></span>
                                                Secret Santa Revealed
                                            </div>
                                            <h2 className="text-white font-serif text-3xl md:text-4xl font-bold">
                                                来自你的圣诞老人
                                            </h2>
                                        </div>

                                        <div className="bg-[#f1f5f9] rounded-2xl shadow-xl p-8 text-slate-800 relative transform transition-transform hover:scale-[1.01] duration-300">
                                            {/* Decorative Tape */}
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-red-600/90 shadow-sm rotate-1 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                                                    Merry Christmas
                                                </span>
                                            </div>

                                            <div className="mt-4 flex flex-col items-center gap-5 text-center">
                                                <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-100 shadow-inner flex items-center justify-center text-4xl">
                                                    🎅
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-2xl text-slate-900">
                                                        {sender.nickname}
                                                    </h3>
                                                    {sender.socialAccount && (
                                                        <p className="text-slate-500 text-sm mt-1">
                                                            {
                                                                sender.socialAccount
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-8 relative">
                                                <Quote className="w-8 h-8 text-slate-200 absolute -top-4 -left-2" />
                                                <div className="relative z-10 bg-white/60 p-6 rounded-xl border border-slate-200/60 backdrop-blur-sm">
                                                    <p className="text-base font-serif italic text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                        {sender.noteToTarget ||
                                                            "祝你拥有一个美好的圣诞节！"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 md:mt-20 text-center">
                            <p className="text-white/20 text-xs tracking-widest uppercase">
                                Made with ❤️ for Secret Santa
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
