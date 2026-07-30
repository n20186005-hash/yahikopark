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
} as const;

export const navigation = [
  { label: '紅葉', href: '/momiji/' },
  { label: '桜', href: '/sakura/' },
  { label: 'ライトアップ', href: '/light-up/' },
  { label: '散策コース', href: '/walking-course/' },
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
