import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 密钥前缀定义
 */
export const KEY_PREFIXES = {
    ADMIN: "adm_",
    INVITE: "inv_",
    PARTICIPANT: "par_",
} as const;

export type KeyType = "admin" | "invite" | "participant";

/**
 * 生成随机字符串（用于生成Keys）
 */
export function generateRandomString(length: number = 32): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
    }

    return result;
}

/**
 * 为密钥添加前缀
 */
export function addKeyPrefix(key: string, type: KeyType): string {
    const prefix =
        KEY_PREFIXES[type.toUpperCase() as keyof typeof KEY_PREFIXES];
    // 如果已经包含前缀，直接返回
    if (key.startsWith(prefix)) {
        return key;
    }
    return `${prefix}${key}`;
}

/**
 * 去除密钥前缀
 */
export function removeKeyPrefix(key: string): string {
    const prefixes = Object.values(KEY_PREFIXES);
    for (const prefix of prefixes) {
        if (key.startsWith(prefix)) {
            return key.slice(prefix.length);
        }
    }
    return key; // 如果没有前缀，返回原值
}

/**
 * 检测密钥类型
 */
export function detectKeyType(key: string): KeyType | "unknown" {
    if (key.startsWith(KEY_PREFIXES.ADMIN)) return "admin";
    if (key.startsWith(KEY_PREFIXES.INVITE)) return "invite";
    if (key.startsWith(KEY_PREFIXES.PARTICIPANT)) return "participant";
    return "unknown";
}

/**
 * 验证密钥格式（支持带前缀的密钥）
 */
export function isValidKey(key: string): boolean {
    const keyWithoutPrefix = removeKeyPrefix(key);
    return (
        keyWithoutPrefix.length >= 20 && /^[A-Za-z0-9]+$/.test(keyWithoutPrefix)
    );
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

/**
 * 检查活动是否已过期
 */
export function isActivityExpired(deadline: Date): boolean {
    return new Date() > deadline;
}
