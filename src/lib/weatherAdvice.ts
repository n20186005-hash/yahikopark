// Weather advice engine — shared by SSR (Astro frontmatter) and client live-refresh.
// Source: Open-Meteo forecast. All logic is pure (no DOM) so it runs in Node and the browser.

export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    precipitation: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface Advice {
  outfit: string[]; // 服装
  activity: string[]; // 過ごし方
  items: string[]; // 持ち物
  risk: string[]; // 注意・リスク（条件を満たす場合のみ）
}

const WMO_TEXT: Record<number, string> = {
  0: '晴れ',
  1: '大体晴れ',
  2: '一部曇り',
  3: '曇り',
  45: '霧',
  48: '霧（霧氷）',
  51: '小雨',
  53: '小雨',
  55: '小雨',
  56: '凍る小雨',
  57: '凍る小雨',
  61: '雨',
  63: '雨',
  65: '強い雨',
  66: '凍る雨',
  67: '凍る雨',
  71: '雪',
  73: '雪',
  75: '雪',
  77: '雪粒',
  80: 'にわか雨',
  81: 'にわか雨',
  82: '強いにわか雨',
  85: 'にわか雪',
  86: 'にわか雪',
  95: '雷雨',
  96: '雷雨（ひょう）',
  99: '雷雨（ひょう）',
};

const WMO_ICON: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌦️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '🌨️',
  77: '🌨️',
  80: '🌦️',
  81: '🌦️',
  82: '🌧️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

export function describeCode(code: number): string {
  return WMO_TEXT[code] ?? '—';
}

export function iconFor(code: number): string {
  return WMO_ICON[code] ?? '🌡️';
}

// km/h -> Beaufort level (気象庁・海上風力階級に準拠した概略)
export function windLevel(kmh: number): number {
  const v = kmh ?? 0;
  if (v <= 1) return 0;
  if (v <= 5) return 1;
  if (v <= 11) return 2;
  if (v <= 19) return 3;
  if (v <= 28) return 4;
  if (v <= 38) return 5;
  if (v <= 49) return 6;
  if (v <= 61) return 7;
  if (v <= 74) return 8;
  if (v <= 88) return 9;
  if (v <= 102) return 10;
  if (v <= 117) return 11;
  return 12;
}

export function uvLabel(uv: number): string {
  if (uv < 3) return `${uv}（弱い）`;
  if (uv < 6) return `${uv}（中程度）`;
  if (uv < 8) return `${uv}（強い）`;
  if (uv < 11) return `${uv}（非常に強い）`;
  return `${uv}（極めて強い）`;
}

const DOW = ['日', '月', '火', '水', '木', '金', '土'];
export function dayLabel(dateStr: string, index: number): string {
  if (index === 0) return '今日';
  if (index === 1) return '明日';
  const dt = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return '';
  return `${DOW[dt.getDay()]}曜`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 弥彦公園の立地（日本海側・弥彦山麓・神社・潟）を踏まえ、山・海辺の視点を含める
export function getWeatherAdvice(d: WeatherData): Advice {
  const cur = d.current;
  const day = d.daily;

  const tmax = Math.round(day.temperature_2m_max[0] ?? 0);
  const tmin = Math.round(day.temperature_2m_min[0] ?? 0);
  const diff = tmax - tmin;
  const prob = day.precipitation_probability_max[0] ?? 0;
  const uv = day.uv_index_max[0] ?? 0;
  const lvl = windLevel(cur.wind_speed_10m);

  const code = cur.weather_code;
  const isDrizzle = [51, 53, 55, 56, 57, 61].includes(code);
  const isRain = [63, 80, 81].includes(code);
  const isHeavyRain = [65, 82].includes(code);
  const isThunder = [95, 96, 99].includes(code);
  const isFog = [45, 48].includes(code);
  const isSnow = [71, 73, 75, 77, 85, 86].includes(code);

  const outfit: string[] = [];
  const activity: string[] = [];
  const items: string[] = [];
  const risk: string[] = [];

  // ベース（気温）
  if (tmax >= 30) outfit.push('気温が高いので、通気性の良い軽い服装がおすすめです。');
  else if (tmax >= 20) outfit.push('過ごしやすい気温なので、動きやすい服装でお出かけください。');
  else if (tmax >= 10) outfit.push('長袖や薄手の上着があると安心です。');
  else outfit.push('気温が低いので、しっかり防寒を心がけてください。');

  if (lvl >= 5) outfit.push('風が強いので、風を通さない上着があると便利です。');

  // ベース（天気）
  if (code === 0 || code === 1) activity.push('天気が良く屋外散策に最適です。朝日や夕日の景色も楽しめます。');
  else if (code === 2 || code === 3) activity.push('光が柔らかく、写真映えします。長時間の屋外にも向いています。');
  else activity.push('天候に合わせて、無理のないペースでお過ごしください。');

  // 降水
  if (prob >= 60) {
    outfit.push('降水確率が高いため、雨具の準備をおすすめします。');
    activity.push('屋内を中心に回り、山歩きや海辺の散策は控えめにしましょう。');
    items.push('傘・レインコート');
  }
  if (isDrizzle) {
    activity.push('小雨のため路面が滑りやすく、足元にご注意ください。');
    items.push('折りたたみ傘');
  }
  if (isRain) {
    activity.push('雨のため露天の体験は楽しみにくいかもしれません。');
    items.push('傘');
  }
  if (isHeavyRain) {
    risk.push('雨が強いので、谷や低い土地への立ち入りは避けてください。');
    activity.push('屋外の遊びは控え、遊覧船やロープウェーは運休の可能性があります。');
    items.push('レインコート（長傘は風で危険です）');
  }
  if (isThunder) {
    risk.push('雷にご注意を。登山・海辺での水遊び・木の下での避難は避けてください。');
    activity.push('水上のイベントは中止になる可能性が高いです。');
  }
  if (isFog) {
    risk.push('視界が悪いため、船や便の遅延が起きやすくなります。');
    activity.push('山や海の眺望は不向きな場合があります。');
    items.push('マスク');
  }
  if (isSnow) {
    risk.push('積雪や路面の凍結にご注意ください（山間部ほど注意）。');
    items.push('滑りにくい靴');
  }

  // 高温・紫外線
  if (tmax >= 32) {
    outfit.push('気温が高いので、正午の外出を避け、屋外の時間を短めにしてください。');
    items.push('日焼け止め・十分な飲み物・暑さ対策');
  }
  if (tmax >= 35) risk.push('熱中症に注意し、こまめに水分をとって休憩を。');
  if (uv >= 5) {
    activity.push('紫外線が強いので、日陰を活用してください。');
    items.push('日焼け止め・サングラス・帽子');
  }

  // 低温
  if (diff > 8) outfit.push('朝晩の寒暖差が大きいので、羽織れる上着を一枚おすすめします。');
  if (tmax <= 10) {
    outfit.push('気温が低めなので、防寒対策を。');
    items.push('厚手のコート・マフラー');
  }

  // 風
  if (lvl >= 5 && lvl <= 6) {
    activity.push('風がやや強く、海辺の遊覧船や一部の屋外施設が運休になる場合があります。');
    items.push('帽子は飛びやすいので、ゆったりした服装は控えめに');
  }
  if (lvl >= 7) {
    risk.push('強風のため、看板や海辺の岩場から離れてください。');
    activity.push('海上のイベントは中止になりやすいです。');
  }

  return { outfit, activity, items, risk };
}

function listHtml(arr: string[]): string {
  if (arr.length === 0) return '<li>特別な準備は不要です。</li>';
  return arr.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
}

export function renderWeatherHtml(d: WeatherData): string {
  const cur = d.current;
  const day = d.daily;

  const tempNow = Math.round(cur.temperature_2m);
  const tmax = Math.round(day.temperature_2m_max[0] ?? 0);
  const tmin = Math.round(day.temperature_2m_min[0] ?? 0);
  const prob = day.precipitation_probability_max[0] ?? 0;
  const uv = day.uv_index_max[0] ?? 0;
  const lvl = windLevel(cur.wind_speed_10m);
  const codeText = describeCode(cur.weather_code);
  const advice = getWeatherAdvice(d);
  const sunset = (day.sunset[0] ?? '').slice(11, 16);

  const riskHtml = advice.risk.length
    ? `<div class="wx-risk">⚠️ ${advice.risk.map(escapeHtml).join(' ')}</div>`
    : '';

  const itemsEmpty = advice.items.length === 0;

  const forecast = day.time
    .map((t, i) => {
      const mx = Math.round(day.temperature_2m_max[i] ?? 0);
      const mn = Math.round(day.temperature_2m_min[i] ?? 0);
      const p = day.precipitation_probability_max[i] ?? 0;
      return `<div class="wx-day">
        <p class="wx-dow">${dayLabel(t, i)}</p>
        <p class="wx-ico">${iconFor(day.weather_code[i] ?? 0)}</p>
        <p class="wx-temp">${mx}° / ${mn}°</p>
        <p class="wx-pop">降水 ${p}%</p>
      </div>`;
    })
    .join('');

  return `<div class="wx-card">
    <div class="wx-now">
      <div>
        <p class="wx-temp-big">${tempNow}<span>℃</span></p>
        <p class="wx-code">${escapeHtml(codeText)}</p>
      </div>
      <ul class="wx-meta">
        <li>本日 ${tmin}–${tmax}℃</li>
        <li>降水確率 ${prob}%</li>
        <li>風 ${lvl}級</li>
        <li>紫外線 ${uvLabel(uv)}</li>
        ${sunset ? `<li>日の入り ${escapeHtml(sunset)}</li>` : ''}
      </ul>
    </div>
    ${riskHtml}
    <div class="wx-tabs" role="tablist">
      <button class="wx-tab is-active" data-tab="outfit" type="button">服装</button>
      <button class="wx-tab" data-tab="activity" type="button">過ごし方</button>
      <button class="wx-tab" data-tab="items" type="button"${itemsEmpty ? ' disabled' : ''}>持ち物</button>
    </div>
    <div class="wx-panels">
      <ul class="wx-panel is-active" data-panel="outfit">${listHtml(advice.outfit)}</ul>
      <ul class="wx-panel" data-panel="activity" hidden>${listHtml(advice.activity)}</ul>
      <ul class="wx-panel" data-panel="items" hidden>${itemsEmpty ? '<li>特別な持ち物は不要です。</li>' : listHtml(advice.items)}</ul>
    </div>
    <div class="wx-forecast">${forecast}</div>
    <p class="wx-note">※ 気象状況は変わりやすいため、最新の情報をご確認ください。</p>
  </div>`;
}
