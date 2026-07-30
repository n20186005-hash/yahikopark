# YahikoPark.com

弥彦公園の紅葉・桜・ライトアップ・アクセス・散策情報を紹介する、日語単言語の静的観光サイトです。Astro、Tailwind CSS、TypeScript、Cloudflare Workers Static Assets で構成しています。

## ローカル起動

```bash
corepack enable
corepack prepare pnpm@11.17.0 --activate
pnpm install
pnpm dev
```

## ビルド

```bash
pnpm build
pnpm preview
```

## Cloudflare Workers へデプロイ

1. `wrangler login` を実行します。
2. 下記を実行します。

```bash
pnpm deploy
```

最初のデプロイでは Cloudflare が提供する `workers.dev` のURLを使用します。`yahikopark.com` を使用する場合は、ドメインを同じ Cloudflare アカウントへ追加してプロキシを有効にした後、Worker 管理画面の Custom Domains から設定してください。

## 更新箇所

- 基本情報：`src/data/site.ts`
- 2026年ライトアップ告知：`src/pages/light-up/index.astro`
- 写真：`public/images/`
- GA4：`src/layouts/BaseLayout.astro`（測定ID `G-HXM22WWPKP`）

## 写真について

実写素材はすべてローカル配信です。著作者・ライセンス・原典は `/photo-credits/` と `LICENSE-PHOTOS.md` に記載しています。写真の再利用時は各 Creative Commons 条件を確認してください。
