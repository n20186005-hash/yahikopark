export const site = {
  name: '弥彦公園ガイド',
  shortName: '弥彦公園',
  domain: 'YahikoPark.com',
  url: 'https://yahikopark.com',
  description: '新潟県弥彦村・弥彦公園の紅葉、桜、ライトアップ、アクセス、駐車場、散策コースを紹介する非公式ガイド。',
  address: '〒959-0323 新潟県西蒲原郡弥彦村弥彦667-1',
  coordinates: {
    latitude: 37.6994847,
    longitude: 138.8300798,
  },
  ga4: 'G-HXM22WWPKP',
  // 評価・口コミ（Google マップ ユーザー評価と同期）
  rating: {
    value: 4.3,
    count: 2150,
  },
  ratingSyncedAt: '2026年10月',
  // Google マップ 共有リンク（全評価表示用）
  mapsShareUrl: 'https://maps.app.goo.gl/ytxEr3Lwp5Aqp4Zp9',
  // 公式・観光情報（E-E-A-T 向け権威リンク）
  tourismUrl: 'https://www.e-yahiko.com/',
  villageUrl: 'https://www.vill.yahiko.niigata.jp/',
  tourismAssociationUrl: 'https://www.niigata-kankou.or.jp/',
  // 実体バインド用の英語表記
  attractionEn: 'Yahiko Park',
  cityEn: 'Yahiko',
  regionEn: 'Niigata',
  countryEn: 'Japan',
} as const;

// E-E-A-T 強化のための公式・観光機関リンク（フッター・アクセスページで表示）
export const authorityLinks = [
  { label: '弥彦村公式サイト', href: 'https://www.vill.yahiko.niigata.jp/' },
  { label: '新潟県観光協会', href: 'https://www.niigata-kankou.or.jp/' },
  { label: '弥彦観光協会（公式）', href: 'https://www.e-yahiko.com/' },
] as const;

export const navigation = [
  { label: '紅葉', href: '/momiji/' },
  { label: '桜', href: '/sakura/' },
  { label: 'ライトアップ', href: '/light-up/' },
  { label: '散策コース', href: '/walking-course/' },
  { label: '訪問ガイド', href: '/guide/' },
  { label: 'アクセス', href: '/access/' },
  { label: '駐車場', href: '/parking/' },
] as const;

export const seasons = [
  {
    number: '01',
    season: '春',
    title: '桜の余韻を歩く',
    period: '4月上旬〜5月上旬の目安',
    description: 'ソメイヨシノから八重桜、里桜へ。花の移ろいを長く楽しめる季節です。',
    href: '/sakura/',
  },
  {
    number: '02',
    season: '夏',
    title: '深い緑と水音',
    period: '5月〜9月',
    description: '木陰、渓流、滝の音。朝の散歩や静かな休憩に向く時季です。',
    href: '/walking-course/',
  },
  {
    number: '03',
    season: '秋',
    title: 'もみじ谷、朱の橋',
    period: '例年11月上旬〜中旬が中心',
    description: '観月橋ともみじ谷が色づく、弥彦公園を代表する季節です。',
    href: '/momiji/',
  },
  {
    number: '04',
    season: '冬',
    title: '雪が消す音',
    period: '12月〜2月',
    description: '雪化粧した橋と木立。足元と交通状況を確認し、静かな景色を楽しみます。',
    href: '/walking-course/',
  },
] as const;

export const facts = [
  { label: '入園料', value: '無料' },
  { label: '開園', value: '終日' },
  { label: '弥彦駅から', value: '徒歩 約1分' },
  { label: '広さ', value: '約13万㎡' },
] as const;

// 2026年 紅葉ライトアップ（新潟県観光協会・柏崎市の発表情報を参照。会場・日・料金・交通規制は現地の最新案内を優先）
export const autumnLightUp2026 = {
  year: 2026,
  periodText: '10月31日〜11月30日',
  periodStart: '10月31日',
  periodEnd: '11月30日',
  lightHours: '17:00〜21:00',
  location: '弥彦公園 もみじ谷',
  // 駐車費用は新潟県観光情報を参考値として記載。実際の会場・日・交通規制は現地案内を優先
  parkingFeeReference: '普通車 1,000円（参考値：新潟県観光情報）',
  sources: [
    {
      label: '新潟県観光協会（2026年イベント情報）',
      href: 'https://niigata-kankou.or.jp/event/detail_13501.html',
    },
    {
      label: '柏崎市（2026年秋のイベント情報）',
      href: 'https://www.city.kashiwazaki.lg.jp/kanko_bunka_sports/kanko/event_matsuri/akinoevent_matsuri/18189.html',
    },
  ],
} as const;
