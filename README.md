# 🎅 Secret Santa (Web Application)

> 一个基于 Web 的轻量级、去账号化、隐私优先的“圣诞节互换礼物”辅助工具。

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.0+-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📖 项目简介

**Secret Santa** 旨在为熟人社交圈（朋友、同事、社群）提供一个简单、安全的礼物交换平台。

**核心理念：**
* **去账号化 (No-Account)**：无需注册登录，通过唯一的 `Key`（凭证）参与活动。
* **隐私优先 (Privacy First)**：敏感信息（姓名、地址、电话）在数据库中加密存储（AES-256-GCM）。
* **防剧透 (Spoiler-Free)**：房主默认无法看到具体的互换关系，仅管理活动进度。

## ✨ 功能特性

* **角色体系**：
    * **房主 (Host)**：创建活动、管理参与者、触发抽选、控制流程。
    * **参与者 (Participant)**：通过邀请码加入、填写愿望清单、查看送礼对象。
* **完整流程**：
    1.  **创建**：房主设置活动信息，生成 `Admin Key` 和 `Invite Key`。
    2.  **报名**：玩家填写入场券，填写收货信息及备注（给送礼人/收礼人的寄语）。
    3.  **抽选**：基于 Fisher-Yates 洗牌算法生成循环送礼链（A->B->C->A）。
    4.  **揭晓**：玩家使用 `Participant Key` 查看自己的送礼目标及对方的愿望。
    5.  **结束**：活动结束后可物理销毁数据，保障隐私。
* **安全机制**：
    * 真实姓名、手机号、收货地址在落库前进行应用层加密。
    * 严格的 API 访问控制与状态流转限制。

## 🛠️ 技术栈

* **框架**: [Next.js](https://nextjs.org/) (App Router)
* **语言**: [TypeScript](https://www.typescriptlang.org/)
* **数据库**: [PostgreSQL](https://www.postgresql.org/)
* **ORM**: [Prisma](https://www.prisma.io/)
* **样式**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
* **加密**: Node.js `crypto` module

## 🚀 快速开始

### 1. 环境要求

* Node.js 20+
* PostgreSQL 数据库

### 2. 安装依赖

```bash
git clone [https://github.com/your-username/secret-santa.git](https://github.com/your-username/secret-santa.git)
cd secret-santa
npm install
# 或
yarn install
# 或
pnpm install

```

### 3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`：

```bash
cp env.example .env

```

编辑 `.env` 文件，填入您的配置：

```env
# 数据库连接字符串
DATABASE_URL="postgresql://username:password@localhost:5432/secret_santa?schema=public"

# 加密密钥 (必须是 32 字节的 Base64 编码字符串)
# 您可以在终端运行 `openssl rand -base64 32` 生成一个
ENCRYPTION_KEY="your-generated-secret-key"

# 应用基础 URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

### 4. 数据库迁移

初始化数据库表结构：

```bash
npm run prisma:migrate
# 或者
npx prisma migrate dev --name init

```

### 5. 启动开发服务器

```bash
npm run dev

```

打开浏览器访问 [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) 即可看到应用。

## 📝 使用指南

### 对于房主 (Host)

1. 点击首页的 "Create Activity"。
2. 填写活动名称和截止时间。
3. **重要**：保存好页面展示的 `Admin Key`（用于管理）和 `Invite Key`（发给朋友）。
4. 当所有人报名完成后，使用 Admin Key 进入管理面板点击“开始抽选”。

### 对于参与者 (Participant)

1. 使用房主分享的 `Invite Key` 进入活动页面。
2. 填写昵称、收货信息以及给 "Secret Santa" 的备注。
3. **重要**：提交后保存好系统生成的 `Participant Key`。
4. 等待房主抽选后，使用 Key 再次登录查看你需要送礼的对象。

## 📂 项目结构

```
.
├── app/                  # Next.js App Router 页面与 API
│   ├── api/              # 后端 API 路由 (Restful)
│   ├── create/           # 创建活动页面
│   ├── host/             # 房主管理页面
│   ├── join/             # 参与者报名页面
│   ├── reveal/           # 结果揭晓页面
│   └── page.tsx          # 落地页
├── lib/                  # 工具库
│   ├── db.ts             # Prisma Client 单例
│   ├── encryption.ts     # AES-256-GCM 加解密逻辑
│   ├── matching.ts       # 抽选匹配算法
│   └── utils.ts          # 通用工具函数
├── prisma/               # 数据库模型与迁移
│   └── schema.prisma     # 数据库 Schema 定义
├── public/               # 静态资源
└── types.d.ts            # TypeScript 类型定义

```

## 🔒 安全说明

本项目涉及用户家庭住址和电话等敏感信息，因此在 `lib/encryption.ts` 中实现了加密逻辑。

* **Key**: 使用环境变量中的 `ENCRYPTION_KEY`。
* **Algorithm**: AES-256-GCM。
* **Scope**: `realName`, `phone`, `address` 字段在存入 PostgreSQL 之前会被加密，读取时仅在特定 API 验证通过后解密返回。

## 🤝 贡献 (Contributing)

欢迎提交 Issue 或 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证 (License)

[MIT](https://www.google.com/search?q=LICENSE) © 2025 Secret Santa Project
