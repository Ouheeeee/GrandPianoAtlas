/* 三角钢琴价格查询系统 · 应用层 */
(function () {
  'use strict';

  /* ---------- 基础工具 ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const round1 = (v) => Math.round(v * 10) / 10;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tierMeta = (t) => TIERS[t];
  const tierStyle = (t) => `--tier:${TIERS[t].color}`;
  const fmtNum = (n) => (Number.isInteger(n) ? String(n) : Number(n).toFixed(1));
  const priceRange = (m) => m.quote ? '定制询价' : `¥${fmtNum(m.low)}–${fmtNum(m.high)} 万`;
  const priceMid = (m) => m.quote ? '定制询价' : `约 ${fmtNum(Math.round(m.mid * 10) / 10)} 万`;
  const sizeText = (cm) => `${cm} cm`;
  const feetText = (cm) => `约 ${(cm / 30.48).toFixed(1)} 英尺`;
  const tierRank = (t) => TIERS[t].rank;

  const SIZE_BANDS = {
    compact: { label: '小空间 < 170', short: '< 170' },
    home: { label: '家用 170–190', short: '170–190' },
    grand: { label: '大琴 190–210', short: '190–210' },
    large: { label: '音乐会 ≥ 210', short: '≥ 210' }
  };
  const sizeBand = (cm) => (cm < 170 ? 'compact' : cm < 190 ? 'home' : cm < 210 ? 'grand' : 'large');

  const RATING_KEYS = [
    ['tone', '音色个性'], ['touch', '触感控制'], ['power', '声场投射'],
    ['build', '做工用料'], ['prestige', '品牌保值']
  ];

  /* ---------- 数据展开 ---------- */
  const BRANDS = [];
  const MODELS = [];
  const MODEL_BY_ID = Object.create(null);

  const BRAND_ORDER_MAP = {};
  if (typeof BRAND_ORDER !== 'undefined') BRAND_ORDER.forEach(([id, tier], i) => { BRAND_ORDER_MAP[id] = { tier, order: i }; });

  RAW_BRANDS.forEach((raw, brandIndex) => {
    const meta = (typeof BRAND_META !== 'undefined' && BRAND_META[raw.id]) || {};
    const ratingBase = (typeof RATING_OVERRIDES !== 'undefined' && RATING_OVERRIDES[raw.id]) || raw.ratings;
    const brand = Object.assign({}, raw, meta, {
      baseRatings: ratingBase.slice(), series: [], index: brandIndex
    });
    brand.resaleScore = (typeof RESALE_SCORES !== 'undefined' && RESALE_SCORES[raw.id] != null) ? RESALE_SCORES[raw.id] : brand.baseRatings[4];
    const orderInfo = BRAND_ORDER_MAP[raw.id];
    if (orderInfo) brand.tier = orderInfo.tier;
    brand.order = orderInfo ? orderInfo.order : 1000 + brandIndex;
    brand.photoKey = meta.photo === null ? null : (meta.photo || raw.id);
    brand.logoKey = meta.logo || null;
    brand.resaleAdj = meta.resaleAdj || 0;
    brand.heroPhoto = meta.heroPhoto !== false;
    brand.toneTags = meta.toneTags || [];
    brand.musicTags = meta.musicTags || [];

    const allSeries = raw.series.slice();
    const special = (typeof SPECIAL_MODELS !== 'undefined' && SPECIAL_MODELS[raw.id]) || null;
    if (special) allSeries.push(Object.assign({}, special, { special: true }));

    allSeries.forEach((rawSeries, seriesIndex) => {
      const seriesPhotoKey = (typeof SERIES_PHOTOS !== 'undefined' && SERIES_PHOTOS[brand.id] && SERIES_PHOTOS[brand.id][rawSeries.name]) || null;
      const noPhotoSeries = (typeof SERIES_NO_PHOTO !== 'undefined' && (SERIES_NO_PHOTO[brand.id] || []).indexOf(rawSeries.name) !== -1) && !seriesPhotoKey;
      const series = {
        name: rawSeries.name, note: rawSeries.note, madeIn: rawSeries.madeIn,
        highlight: rawSeries.highlight, tradeoff: rawSeries.tradeoff,
        tags: (rawSeries.tags || []).slice(), adj: rawSeries.adj || {},
        special: !!rawSeries.special, models: [], brandId: brand.id, photoKey: seriesPhotoKey,
        brandRef: brand
      };
      const styleInfo = (!rawSeries.special && typeof SERIES_STYLE !== 'undefined' && SERIES_STYLE[`${brand.id}|${rawSeries.name}`]) || null;
      const archetypeKey = styleInfo ? styleInfo.a : 'german';
      const archetype = (typeof STYLE_ARCHETYPES !== 'undefined' && STYLE_ARCHETYPES[archetypeKey]) || {};
      series.origin = styleInfo ? styleInfo.o : 'EU';
      series.originLabel = (typeof ORIGIN_DEFS !== 'undefined' && ORIGIN_DEFS[series.origin]) ? ORIGIN_DEFS[series.origin].label : '欧洲其他';
      series.styleArchetype = archetypeKey;
      series.styleProfile = Object.assign({}, archetype, { p: styleInfo ? (styleInfo.p || 0) : 0 });
      series.styleNote = archetype.note || '';
      const modelRows = rawSeries.special ? rawSeries.models.slice().sort((a, b) => (b.classic || 0) - (a.classic || 0)) : rawSeries.models;
      modelRows.forEach((row, modelIndex) => {
        const isObj = !Array.isArray(row);
        const modelName = isObj ? row.model : row[0];
        const cm = isObj ? row.cm : row[1];
        const quote = isObj ? !!row.quote : false;
        const low = quote ? null : (isObj ? row.low : row[2]);
        const high = quote ? null : (isObj ? row.high : row[3]);
        const sig = isObj ? row.sig : row[4];
        const tags = (isObj ? (row.tags || []) : (row[5] || [])).concat(series.tags || []);
        const options = (isObj ? row : (row[6] || {}));
        const official = options.official
          || (brand.modelLinks && brand.modelLinks[modelName])
          || brand.official || null;
        const specialPhoto = rawSeries.special && typeof SPECIAL_PHOTO_OVERRIDES !== 'undefined'
          ? SPECIAL_PHOTO_OVERRIDES[`${brand.id}|${modelName}`] : null;
        const m = {
          id: `${brand.id}-${seriesIndex}-${modelIndex}`,
          brandId: brand.id, brand: brand.name, brandZh: brand.zh,
          tier: brand.tier, country: brand.country,
          series: series.name, madeIn: series.madeIn, seriesNote: series.note,
          model: modelName, cm, low, high,
          mid: quote ? null : (low + high) / 2,
          quote, classic: isObj ? (row.classic || 0) : 0,
          noPhoto: (((isObj ? !!row.noPhoto : false) || noPhotoSeries) && !specialPhoto),
          sig, tags: uniqueStrings(tags),
          special: !!(options.special || series.special || tags.indexOf('特别版') !== -1),
          official, photoKey: options.photo || specialPhoto || null,
          origin: series.origin, originLabel: series.originLabel, styleProfile: series.styleProfile, styleNote: series.styleNote
        };
        m.ratings = makeRatings(brand.baseRatings, series.adj, m.cm, m.mid, quote, brand.resaleScore);
        m.use = useFor(m);
        m.brandRef = brand;
        m.seriesRef = series;
        series.models.push(m);
        MODELS.push(m);
        MODEL_BY_ID[m.id] = m;
      });
      brand.series.push(series);
    });
    BRANDS.push(brand);
  });


  function balanceRatings() {
    const priced = MODELS.filter((m) => !m.quote);
    const groups = {};
    priced.forEach((m) => {
      const bucket = Math.round(m.mid / 20) * 20;
      (groups[bucket] = groups[bucket] || []).push(m);
    });
    Object.keys(groups).forEach((bucket) => {
      const list = groups[bucket];
      if (list.length < 3) return;
      ['tone', 'touch', 'build'].forEach((key) => {
        const mean = list.reduce((a, m) => a + m.ratings[key], 0) / list.length;
        list.forEach((m) => {
          const delta = clamp(m.ratings[key] - mean, -0.4, 0.4);
          m.ratings[key] = round1(clamp(mean + delta, 1, 5));
        });
      });
      ['power'].forEach((key) => {
        const mean = list.reduce((a, m) => a + m.ratings[key], 0) / list.length;
        list.forEach((m) => {
          const delta = clamp(m.ratings[key] - mean, -0.5, 0.5);
          m.ratings[key] = round1(clamp(mean + delta, 1, 5));
        });
      });
    });
  }

  BRANDS.sort((a, b) => a.order - b.order);
  balanceRatings();

  /* ---------- 图片 / logo / 官网 ---------- */
  const MEDIA_DATA = (typeof MEDIA !== 'undefined') ? MEDIA : { photos: {}, logos: {} };
  const HAS_MEDIA = !!(MEDIA_DATA.photos && Object.keys(MEDIA_DATA.photos).length);
  document.documentElement.dataset.media = HAS_MEDIA ? 'on' : 'off';

  (function injectMediaStyles() {
    if (!MEDIA_DATA.photos) return;
    const rules = Object.keys(MEDIA_DATA.photos).map((key) => {
      const photo = MEDIA_DATA.photos[key];
      return `.photo-${key}{--photo:url("${photo.src}");background-image:var(--photo)}`;
    });
    const style = document.createElement('style');
    style.id = 'mediaStyles';
    style.textContent = rules.join('\n');
    document.head.appendChild(style);
  })();

  function photoInfo(m) {
    if (m.noPhoto) return null;
    const key = m.photoKey || (m.seriesRef && m.seriesRef.photoKey) || (m.brandRef && m.brandRef.photoKey);
    if (!key || !MEDIA_DATA.photos || !MEDIA_DATA.photos[key]) return null;
    return Object.assign({ key }, MEDIA_DATA.photos[key]);
  }
  function photoClass(m) {
    const p = photoInfo(m);
    return p ? `photo-${p.key}` : '';
  }
  function photoFit(m) {
    const p = photoInfo(m);
    return p && p.fit === 'contain' ? 'fit-contain' : 'fit-cover';
  }
  function photoPlate(m) {
    const p = photoInfo(m);
    return p && p.plate ? 'photo-plate' : '';
  }
  function brandPhoto(brand) {
    const key = brand.photoKey;
    if (!key || !MEDIA_DATA.photos || !MEDIA_DATA.photos[key]) return null;
    return Object.assign({ key }, MEDIA_DATA.photos[key]);
  }
  function brandPhotoClass(brand) {
    const p = brandPhoto(brand);
    return p ? `photo-${p.key}` : '';
  }
  function brandPhotoFit(brand) {
    const p = brandPhoto(brand);
    return p && p.fit === 'contain' ? 'fit-contain' : 'fit-cover';
  }
  function photoCaption(m) {
    if (!HAS_MEDIA) return 'GGPRD 文字图版';
    if (!photoInfo(m)) return '图片暂缺 · 官网可查';
    if (m.special) return '特别版 / 系列图';
    return '系列官方图 · 官网';
  }
  function logoInfo(brand) {
    const key = brand.logoKey;
    if (!key || !MEDIA_DATA.logos || !MEDIA_DATA.logos[key]) return null;
    return MEDIA_DATA.logos[key];
  }
  function brandInitials(brand) {
    const words = String(brand.name).replace(/[&.]/g, ' ').split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  function logoMarkup(brand, size) {
    size = size || 'sm';
    const info = logoInfo(brand);
    if (info) {
      return `<span class="brand-logo ${size}${info.dark ? ' dark' : ''}"><img src="${info.src}" alt="${esc(brand.name)} logo" loading="lazy" decoding="async"></span>`;
    }
    if (brand.logoText && MEDIA_DATA.logos && Object.keys(MEDIA_DATA.logos).length) {
      const lines = brand.logoText.split(/\s+/).map((w) => esc(w)).join('<br>');
      return `<span class="brand-logo ${size} wordmark">${lines}</span>`;
    }
    return `<span class="brand-logo ${size} mono"><b>${esc(brandInitials(brand))}</b><em>${brand.est || ''}</em></span>`;
  }
  function officialUrl(m) {
    return m.official || (m.brandRef && m.brandRef.official) || null;
  }
  function officialLink(m, cls) {
    const url = officialUrl(m);
    if (!url) return '';
    return `<a class="${cls || 'official-mini'}" href="${url}" target="_blank" rel="noopener" title="访问品牌官网">官网 ↗</a>`;
  }
  function fallbackArt() {
    return `<svg viewBox="0 0 260 160" fill="none" aria-hidden="true">
      <path d="M28 112c0-44 40-73 99-73 51 0 89 24 89 58 0 36-42 55-94 55H28v-40Z" stroke="currentColor" stroke-width="1.2"/>
      <path d="M28 112h188" stroke="currentColor" stroke-width="1.2"/>
      <path d="M36 112v22M47 112v22M58 112v22M69 112v22M80 112v22M91 112v22M102 112v22M113 112v22M124 112v22M135 112v22M146 112v22M157 112v22M168 112v22M179 112v22M190 112v22M201 112v22" stroke="currentColor" stroke-width=".8" opacity=".6"/>
      <path d="M58 62c30-22 88-24 122 0" stroke="currentColor" stroke-width=".8" opacity=".55"/>
      <path d="M48 132h10M204 132h10" stroke="currentColor" stroke-width="2"/>
    </svg>`;
  }

  const COUNTRY_EN = { '德国': 'Germany', '美国 / 德国': 'USA / Germany', '意大利': 'Italy', '奥地利': 'Austria', '爱沙尼亚': 'Estonia', '日本': 'Japan', '美国': 'USA', '捷克': 'Czechia', '圣马力诺': 'San Marino', '日本 / 印尼': 'Japan / Indonesia', '中国': 'China', '日本 / 中国': 'Japan / China', '韩国 / 印尼': 'Korea / Indonesia', '韩国 / 中国': 'Korea / China', '德国 / 中国': 'Germany / China', '中国广州': 'Guangzhou, China', '中国宜昌': 'Yichang, China' };
  const countryEn = (v) => COUNTRY_EN[v] || v;
  const seriesEn = (v) => String(v || '').replace(/系列/g, 'Series').replace(/Grands/g, 'Grands');

  function priceAnchor(mid) {
    if (!mid || !isFinite(mid)) return 4.4;
    const pts = [[8, 2.55], [20, 2.95], [40, 3.4], [60, 3.7], [90, 4.0], [130, 4.2], [180, 4.4], [250, 4.55], [400, 4.75]];
    const x = Math.log10(clamp(mid, 8, 400));
    for (let i = 0; i < pts.length - 1; i++) {
      const [p0, v0] = pts[i], [p1, v1] = pts[i + 1];
      if (x <= Math.log10(p1)) {
        const t = (x - Math.log10(p0)) / (Math.log10(p1) - Math.log10(p0));
        return v0 + (v1 - v0) * clamp(t, 0, 1);
      }
    }
    return pts[pts.length - 1][1];
  }

  function makeRatings(base, adj, cm, mid, quote, resaleScore) {
    const powerAdj = cm >= 240 ? 0.5 : cm >= 210 ? 0.25 : cm >= 190 ? 0 : cm >= 175 ? -0.25 : -0.5;
    const anchor = quote ? 4.4 : priceAnchor(mid);
    const blend = (baseValue, seriesAdj, sizeAdj) => {
      const v = baseValue * 0.38 + anchor * 0.62 + seriesAdj * 0.45 + (sizeAdj || 0);
      return round1(clamp(v, 1, 5));
    };
    return {
      tone: blend(base[0], adj.tone || 0),
      touch: blend(base[1], adj.touch || 0),
      power: blend(base[2], adj.power || 0, powerAdj),
      build: blend(base[3], adj.build || 0),
      prestige: round1(clamp((resaleScore != null ? resaleScore : base[4]) + (adj.prestige || 0) * 0.5, 1, 5))
    };
  }

  function useFor(m) {
    if (m.cm >= 240) return '音乐厅 / 专业院校 / 协奏';
    if (m.cm >= 210) return '中型演奏厅 / 专业工作室';
    if (m.cm >= 190) return '小型演奏 / 进阶家用';
    if (m.cm >= 170) return '家用主力 / 教学 / 沙龙';
    return '公寓 / 练习 / 小空间';
  }

  function sizePro(cm) {
    if (cm >= 240) return '音乐会尺寸，低音下潜与整体声场最完整';
    if (cm >= 210) return '大琴体带来从容的动态余量';
    if (cm >= 190) return '尺寸与空间平衡，低音已有规模';
    if (cm >= 170) return '家用黄金尺寸，兼顾音色与占地';
    return '占地友好，适合公寓与小型空间';
  }
  function sizeCon(cm) {
    if (cm >= 240) return '需要较大空间与良好声学，搬运维护成本高';
    if (cm >= 210) return '对房间尺寸和声学有一定要求';
    if (cm >= 190) return '强奏时仍需控制空间混响';
    if (cm >= 170) return '受尺寸限制，低音规模与动态余量不及 7 尺以上琴';
    return '低音下潜与强奏动态明显受限';
  }
  function uniqueStrings(arr) {
    const out = [];
    arr.forEach((s) => { if (s && out.indexOf(s) === -1) out.push(s); });
    return out;
  }
  function prosFor(m) {
    return uniqueStrings([m.seriesRef.highlight, m.brandRef.strengths[0], sizePro(m.cm)]).slice(0, 3);
  }
  function consFor(m) {
    return uniqueStrings([m.seriesRef.tradeoff, m.brandRef.weaknesses[0], sizeCon(m.cm)]).slice(0, 3);
  }

  function siblingNote(m) {
    const siblings = (m.seriesRef.models || []).filter((x) => !x.quote && x.id !== m.id);
    if (!siblings.length) return '';
    siblings.sort((a, b) => Math.abs(a.cm - m.cm) - Math.abs(b.cm - m.cm));
    const s = siblings[0];
    const diff = s.cm - m.cm;
    const priceDiff = Math.round(Math.abs(s.mid - m.mid));
    if (Math.abs(diff) < 1) return '';
    return `同系列还有 ${s.model}（${s.cm} cm，${priceRange(s)}），比它${diff > 0 ? '长' : '短'} ${Math.abs(diff)} cm，参考价${s.mid > m.mid ? '高' : '低'}约 ${priceDiff} 万。`;
  }

  function longDescription(m) {
    const b = m.brandRef, s = m.seriesRef;
    const sizeLine = m.cm >= 240
      ? '这是音乐会尺寸，低音下潜和整体声场最完整，但对房间与声学也最挑剔。'
      : m.cm >= 210
        ? '这个尺寸已经能提供从容的动态余量，适合中型演奏厅或专业工作室。'
        : m.cm >= 190
          ? '7 尺级琴体在低音规模与占地之间取得平衡，是进阶家用和小型演奏的常见选择。'
          : m.cm >= 170
            ? '这是家用黄金尺寸：比小三角有更完整的低音，又不至于占满客厅。'
            : '小尺寸带来更好的占地与预算友好性，但低音规模和强奏余量会有所妥协。';
    const priceLine = m.quote
      ? '特别版通常按订单制作，价格、木材、漆面与交期都需要与品牌定制部门单独确认。'
      : `目前参考价 ${priceRange(m)}，在 ${m.tier} 分级中属于${m.mid >= 180 ? '高预算段' : m.mid >= 80 ? '中高预算段' : m.mid >= 35 ? '中预算段' : '入门预算段'}。`;
    return `${b.zh} ${m.model} 是 ${s.name} 系列中长 ${m.cm} cm 的型号，定位为${m.use}。${m.sig}。${b.character} 核心强项是${s.highlight}；需要留意的是${s.tradeoff}。\n\n${sizeLine}${siblingNote(m)}\n\n${priceLine} 如果它与你的预算和空间匹配，下一步应该带着熟悉的曲目现场试弹，并比较同价位的 2–3 台对手。`;
  }

  function usedTiers(m) {
    if (m.quote) return [];
    // 以新琴中位价为锚，按年龄/成色曲线折算；品牌保值与尺寸流动性做小幅修正。
    const curves = {
      Perfect:    [0.82, 0.71, 0.58, 0.44],
      Prime:      [0.78, 0.67, 0.54, 0.41],
      Premier:    [0.72, 0.61, 0.48, 0.35],
      Passable:   [0.64, 0.53, 0.40, 0.29],
      Pedestrian: [0.50, 0.40, 0.29, 0.20]
    };
    const spreads = [0.045, 0.040, 0.035, 0.030];
    const rows = [
      ['准新 · 95 新', '1–3 年 / 极少使用', '原厂状态，轻微使用痕迹'],
      ['良好 · 9 成新', '4–8 年 / 定期调律', '正常使用，无结构性维修'],
      ['一般 · 8 成新', '9–15 年 / 外观磨损', '可能需要整音与易损件更换'],
      ['需整备 · 7 成新', '16 年以上 / 需检修', '建议预留整修与搬运预算']
    ];
    const curve = curves[m.tier] || curves.Passable;
    const score = RESALE_SCORES[m.brandId] || 3;
    const brandAdj = (score - 3) * 0.02;
    const sizeAdj = m.cm >= 270 ? -0.030 : m.cm >= 220 ? -0.015 : m.cm >= 180 ? 0.010 : m.cm >= 160 ? 0.005 : -0.005;
    const base = (m.low + m.high) / 2;
    return rows.map((row, i) => {
      const mid = clamp(curve[i] + brandAdj + sizeAdj, 0.18, 0.90);
      const lo = clamp(mid - spreads[i], 0.12, 0.92);
      const hi = clamp(mid + spreads[i], 0.15, 0.94);
      return {
        label: row[0], age: row[1], note: row[2],
        low: base * lo, high: base * hi,
        pctLow: Math.round(lo * 100), pctHigh: Math.round(hi * 100)
      };
    });
  }


  function brandModels(brand) {
    return brand.series.reduce((acc, s) => acc.concat(s.models), []);
  }
  function brandPriceRange(brand) {
    const ms = brandModels(brand).filter((m) => !m.quote);
    if (!ms.length) return { low: 0, high: 0 };
    return { low: Math.min.apply(null, ms.map((m) => m.low)), high: Math.max.apply(null, ms.map((m) => m.high)) };
  }
  function findModel(brandId, modelName) {
    return MODELS.find((m) => m.brandId === brandId && m.model === modelName) || null;
  }

  /* 同价位对手：优先不同品牌，价格最近 */
  function peersFor(model, limit) {
    limit = limit || 3;
    if (!model || model.quote) return [];
    const pool = MODELS.filter((m) => !m.quote && m.id !== model.id && m.brandId !== model.brandId);
    let near = pool.filter((m) => Math.abs(m.mid - model.mid) <= Math.max(8, model.mid * 0.22));
    if (near.length < limit) {
      near = pool.filter((m) => Math.abs(m.mid - model.mid) <= Math.max(16, model.mid * 0.38));
    }
    near.sort((a, b) => {
      const da = Math.abs(a.mid - model.mid);
      const db = Math.abs(b.mid - model.mid);
      if (Math.abs(da - db) > 0.001) return da - db;
      return tierRank(a.tier) - tierRank(b.tier);
    });
    const picked = [];
    near.forEach((m) => {
      if (picked.length >= limit) return;
      if (picked.some((p) => p.brandId === m.brandId)) return;
      picked.push(m);
    });
    if (picked.length < limit) {
      near.forEach((m) => { if (picked.length < limit && picked.indexOf(m) === -1) picked.push(m); });
    }
    if (picked.length < limit) {
      const rest = pool.slice().sort((a, b) => Math.abs(a.mid - model.mid) - Math.abs(b.mid - model.mid));
      rest.forEach((m) => { if (picked.length < limit && picked.indexOf(m) === -1) picked.push(m); });
    }
    return picked.slice(0, limit);
  }


  /* 一键 PK：只选价位、分级真正接近的对手，不强行填满 */
  function closePeers(model, max) {
    max = max || 9;
    if (!model || model.quote) return [];
    const pool = MODELS.filter((m) => !m.quote && m.id !== model.id && m.brandId !== model.brandId);
    const collect = (priceTol, tierTol) => pool.map((m) => {
      const priceGap = Math.abs(m.mid - model.mid);
      const tierDiff = Math.abs(tierRank(m.tier) - tierRank(model.tier));
      const overlap = Math.min(m.high, model.high) - Math.max(m.low, model.low);
      return { m, priceGap, tierDiff, overlap };
    }).filter((x) => x.tierDiff <= tierTol && x.priceGap <= Math.max(6, model.mid * priceTol));
    let candidates = collect(0.18, 1);
    if (candidates.length < 2) candidates = collect(0.26, 1);
    if (candidates.length < 2) candidates = collect(0.42, 2);
    candidates.sort((a, b) => a.tierDiff - b.tierDiff || b.overlap - a.overlap || a.priceGap - b.priceGap);
    const picked = [];
    candidates.forEach((x) => {
      if (picked.length >= max) return;
      if (picked.some((p) => p.brandId === x.m.brandId)) return;
      picked.push(x.m);
    });
    return picked;
  }

  const BRAND_ALIASES = {
    bechstein: ['Bechstein', '贝希斯坦'],
    steinway: ['Steinway', '施坦威'],
    bosendorfer: ['Bosendorfer', '贝森朵夫'],
    estonia: ['Estonia', '爱沙尼亚'],
    fazioli: ['Fazioli', '法吉奥里'],
    shigeru: ['Shigeru', 'Kawai', 'SK'],
    grotrian: ['Grotrian', 'Grotrian Steinweg', '高天'],
    steingraeber: ['Steingraeber', 'Sohne', '施坦格列泊'],
    bluthner: ['Bluthner', '博兰斯勒'],
    'yamaha-cf': ['Yamaha CF', 'CFX', 'CF'],
    petrof: ['Petrof', '佩卓夫'],
    schimmel: ['Schimmel', '舒密尔'],
    sauter: ['Sauter', '索特'],
    schulze: ['Schulze', 'Pollmann', '舒尔茨波尔曼'],
    seiler: ['Seiler', '赛乐尔'],
    henrymason: ['Mason Hamlin', 'Henry Mason', '梅森汉姆林'],
    boston: ['Boston', '波士顿'],
    kawai: ['Kawai', 'K. Kawai', '卡瓦依', '河合'],
    yamaha: ['Yamaha', '雅马哈'],
    kayserburg: ['Kayserburg', 'Cayserburg', '恺撒堡'],
    hoffmann: ['Hoffmann', 'Hoffman', '霍夫曼'],
    zimmermann: ['Zimmermann', 'Zimmerman', '齐默尔曼'],
    ritmuller: ['Ritmuller', 'Ritmiller', '里特米勒'],
    pearlriver: ['Pearl River', '珠江'],
    apollo: ['Apollo', 'Toyo', 'Toyo Apollo', '阿波罗'],
    samick: ['Samick', '三益'],
    youngchang: ['Young Chang', '英昌'],
    yangzi: ['Yangzi', 'Yangtze', '长江'],
    wilhelmgrotrian: ['Wilhelm Grotrian', '威腾'],
    prince: ['Prince', '王子'],
    haessler: ['Haessler', 'Heassler', 'Häßler', '海斯勒'],
    roenisch: ['Rönisch', 'Ronisch', '罗尼施'],
    baldwin: ['Baldwin', '鲍德温'],
    steinberg: ['Steinberg', 'Wilh. Steinberg', '威廉史丹堡', '威廉·史丹堡'],
    essex: ['Essex', '艾塞克斯'],
    rosler: ['Rösler', 'Rosler', '罗瑟'],
    irmler: ['Irmler', '欧米勒'],
    toyama: ['Toyama', '托雅玛'],
    hsinghai: ['Hsinghai', 'Xinghai', '星海'],
    hailun: ['Hailun', '海伦'],
    steinburg: ['Steinburg', '斯坦伯格'],
    carod: ['Carod', '卡罗德']
  };

  function searchHay(m) {
    return `${m.brand} ${m.brandZh} ${(BRAND_ALIASES[m.brandId] || []).join(' ')} ${m.series} ${m.model} ${m.tags.join(' ')} ${m.sig}`.toLowerCase();
  }

  /* ---------- 状态与持久化 ---------- */
  const state = {
    view: 'brand',
    brand: null,
    q: '',
    tier: 'all',
    priceMin: 30,
    priceMax: 60,
    priceBands: [],
    priceTiers: [],
    priceSizes: [],
    priceOrigins: [],
    priceBrand: '',
    size: 'all',
    sort: 'price-asc',
    compare: [],
    compareBarHidden: false,
    origin: 'all',
    lang: 'zh',
    styleExpanded: {},
    sidebarOpen: false
  };

  const FAV_KEY = 'pianoAtlasFavorites.v1';
  let favorites = new Set();
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (raw) JSON.parse(raw).forEach((id) => { if (MODEL_BY_ID[id]) favorites.add(id); });
  } catch (err) { /* file:// 或隐私模式下忽略 */ }

  function saveFavorites() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favorites))); } catch (err) { /* ignore */ }
  }

  const NOTES_KEY = 'pianoAtlasNotes.v1';
  const PRIORITY_KEY = 'pianoAtlasPriority.v1';
  let notes = {};
  let priorities = {};
  try {
    const n = localStorage.getItem(NOTES_KEY);
    const pr = localStorage.getItem(PRIORITY_KEY);
    if (n) notes = JSON.parse(n) || {};
    if (pr) priorities = JSON.parse(pr) || {};
  } catch (err) { /* ignore */ }
  function saveNotes() {
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch (err) { /* ignore */ }
  }
  function savePriorities() {
    try { localStorage.setItem(PRIORITY_KEY, JSON.stringify(priorities)); } catch (err) { /* ignore */ }
  }

  const EN_TEXT = {
    '品牌浏览': 'Browse brands', '价格找琴': 'Budget finder', '风格榜': 'Style rankings', '特别款': 'Special editions',
    '对比台': 'Compare', '短名单': 'Saved list',
    '全部品牌': 'All brands', '品牌索引': 'Brands', '五档分级': 'Five tiers', '品牌地图': 'Every brand',
    '按预算找琴': 'Find by budget', '分级与数据口径': 'How the data works', '六种风格': 'Six styles',
    '查看更多': 'See more', '进入 →': 'Open →', '查看 →': 'View →', '详情': 'Details', '收藏': 'Save', '已收藏': 'Saved',
    '对比': 'Compare', '已选': 'Selected', '同价 PK': 'Match on price', '官网': 'Website', '官网 ↗': 'Website ↗',
    '上一张': 'Previous', '下一张': 'Next',
    'Perfect': 'Perfect', 'Prime': 'Prime', 'Premier': 'Premier', 'Passable': 'Passable', 'Pedestrian': 'Pedestrian',
    '顶级': 'Perfect', '一线': 'Prime', '中坚': 'Premier', '主流': 'Passable', '入门': 'Entry',
    '点击分级筛选 · 分级由使用者指定，非客观排名': 'Click a tier to filter.',
    '同一分级内，性格与价格也可能相差显著': 'Prices vary widely within a single tier.',
    '价格区间 · 同价对手 · 产地筛选': 'Price range · rival models · origin',
    '系列级匹配 · 现代 / 浪漫 / 德奥': 'Ranked by series · modern / romantic / Austro-German',
    'Art Case · 限量设计': 'Art Case · limited editions',
    '最多 10 台并排 · 可拖动排序': 'Up to 10 side by side · drag to reorder',
    '定制询价 · Art Case': 'Price on request · Art Case', '查看特别款目录 →': 'View all special editions →',
    '共': 'Total', '款': 'models', '个品牌': 'brands', '台': 'pianos', '万': '×10k CNY',
    '搜索品牌 / 型号': 'Search brands or models', '搜索品牌、型号或系列': 'Search brands, models or series',
    '价格从低到高': 'Price: low to high', '价格从高到低': 'Price: high to low',
    '尺寸从大到小': 'Size: large to small', '分级从高到低': 'Tier: high to low',
    '全部': 'All', '分级': 'Tier', '尺寸': 'Size', '产地': 'Origin', '品牌': 'Brand', '排序': 'Sort',
    '美产': 'US-made', '日系': 'Japanese', '德奥系': 'Austro-German', '国产': 'Chinese', '韩系': 'Korean',
    '北欧': 'Nordic', '意大利': 'Italian', '捷克': 'Czech',
    '按价找琴': 'Budget finder', '同价位如何选择': 'What your budget buys',
    '你的预算区间': 'Your budget', '最低': 'Min', '最高': 'Max', '参考成交 · 含税': 'Indicative street price, tax incl.',
    '区间重叠': 'in range', '价格 × 尺寸分布': 'Price vs. size', '点圆点看详情': 'Click a dot for details',
    '重置筛选': 'Reset filters', '落在预算里的琴': 'Models in your budget', '区间有重叠即计入': 'Overlapping ranges included',
    '继续选琴': 'Add more pianos', '复制摘要': 'Copy summary', '打印 / PDF': 'Print or save as PDF', '清空对比': 'Clear comparison',
    '差异摘要': 'The short version', '适合场景': 'Best for', '同价位对手': 'Close competitor',
    '暂无收藏': 'Nothing saved yet', '特别款目录': 'Special editions',
    '风格': 'Style', '现代风格': 'Modern', '浪漫派': 'Romantic', '德奥古典': 'Austro-German classical',
    '爵士 / 流行': 'Jazz and pop', '教学 / 家用': 'Teaching and home', '室内乐 / 录音': 'Chamber and studio',
    '全部产地': 'All origins', '来源': 'Origin', '当前': 'Current'
  };

  /* 小型词汇表只服务界面骨架，长文案一律写在中英各自的模板里，避免“翻译腔”。 */

  function translateTextNodes(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p || /^(SCRIPT|STYLE|OPTION)$/.test(p.tagName) && p.tagName === 'SCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const raw = node.nodeValue;
      const key = raw.trim();
      if (!key) return;
      if (EN_TEXT[key]) { node.nodeValue = raw.replace(key, EN_TEXT[key]); return; }
      let v = key;
      v = v.replace(/共\s*(\d+)\s*款/g, '$1 models');
      v = v.replace(/(\d+)\s*个品牌/g, '$1 brands');
      v = v.replace(/已选\s*(\d+)\s*\/\s*10/g, 'Selected $1 / 10');
      v = v.replace(/(\d+)\s*款/g, '$1 models');
      v = v.replace(/^(\d+)\s*–\s*(\d+)\s*万/, '¥$1–$2 ×10k');
      if (v !== key) node.nodeValue = raw.replace(key, v);
    });
    root.querySelectorAll('option').forEach((opt) => {
      const key = opt.textContent.trim();
      if (EN_TEXT[key]) opt.textContent = EN_TEXT[key];
    });
    root.querySelectorAll('select').forEach((sel) => {
      const map = { '全部品牌': 'All brands', '价格从低到高': 'Price: low to high', '价格从高到低': 'Price: high to low', '尺寸从大到小': 'Size: large to small', '分级从高到低': 'Tier: high to low' };
      Array.from(sel.options).forEach((o) => { if (map[o.textContent.trim()]) o.textContent = map[o.textContent.trim()]; });
    });
  }

  function applyLanguage() {
    document.documentElement.dataset.lang = state.lang;
    if (langToggle) langToggle.textContent = state.lang === 'en' ? '中' : 'EN';
    const navLabels = { brand: ['品牌浏览', 'Brands'], price: ['价格找琴', 'Prices'], style: ['风格榜', 'Styles'], special: ['特别款', 'Special editions'], compare: ['对比台', 'Compare'], shortlist: ['短名单', 'Saved'] };
    tabs.forEach((tab) => {
      const pair = navLabels[tab.dataset.view];
      if (!pair) return;
      const textNode = Array.from(tab.childNodes).find((n) => n.nodeType === 3 && n.nodeValue.trim());
      if (textNode) textNode.nodeValue = state.lang === 'en' ? pair[1] : pair[0];
    });
    if (searchInput) searchInput.placeholder = state.lang === 'en' ? 'Search brands / models' : '搜索品牌 / 型号';
    if (state.lang !== 'en') return;
    translateTextNodes(document.querySelector('.app'));
    const ph = { '搜索品牌 / 型号': 'Search brands / models' };
    document.querySelectorAll('input[placeholder]').forEach((el) => { if (ph[el.placeholder]) el.placeholder = ph[el.placeholder]; });
  }

  function setLanguage(lang) {
    state.lang = lang;
    try { localStorage.setItem('pianoAtlasLang', lang); } catch (err) { /* ignore */ }
    applyLanguage();
    rerenderCurrent();
  }

  /* ---------- DOM ---------- */
  const main = $('#main');
  const viewEls = {
    brand: $('#view-brand'), price: $('#view-price'), style: $('#view-style'), special: $('#view-special'),
    compare: $('#view-compare'), shortlist: $('#view-shortlist')
  };
  const tabs = $$('.tab');
  const compareCount = $('#compareCount');
  const favCount = $('#favCount');
  const compareBar = $('#compareBar');
  const compareChips = $('#compareChips');
  const brandNav = $('#brandNav');
  const searchInput = $('#search');
  const langToggle = $('#langToggle');
  const toastEl = $('#toast');
  const modalRoot = $('#modalRoot');
  let toastTimer = null;
  let priceTimer = null;
  let lastFocused = null;
  let compareDrag = null;
  let mpTimer = null;
  let mpIndex = 0;
  let mpRoot = null;

  /* ---------- 通用渲染 ---------- */
  function renderChrome() {
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.view === state.view));
    compareCount.textContent = String(state.compare.length);
    favCount.textContent = String(favorites.size);
    const specialCount = $('#specialCount');
    if (specialCount) specialCount.textContent = String(MODELS.filter((m) => m.special).length);
    $('#brandCount').textContent = String(BRANDS.length);
    $('#allBrandCount').textContent = String(MODELS.length);
    renderSidebar();
    renderCompareBar();
    applyLanguage();
  }

  function renderSidebar() {
    const activeId = state.view === 'price' ? state.priceBrand : state.view === 'brand' ? state.brand : '';
    const groups = Object.keys(TIERS).map((tier) => {
      const list = BRANDS.filter((b) => b.tier === tier);
      const links = list.map((b) => {
        const n = brandModels(b).length;
        const active = activeId === b.id ? ' active' : '';
        return `<button class="brand-link${active}" data-brand="${b.id}"><span>${esc(state.lang === 'en' ? b.name : b.zh)}</span><span class="n">${n}</span></button>`;
      }).join('');
      return `<div class="brand-group">
        <div class="brand-group-head" data-tier-filter="${tier}" style="--tier:${TIERS[tier].color}" title="${esc(TIERS[tier].desc)}">
          <i></i><b>${esc(tier)}</b><em>${list.length}</em>
        </div>${links}</div>`;
    }).join('');
    brandNav.innerHTML = groups;
    const allBtn = $('#allBrandsBtn');
    if (allBtn) allBtn.classList.toggle('active', !activeId);
  }

  function renderCompareBar() {
    const show = state.compare.length > 0 && state.view !== 'compare' && !state.compareBarHidden;
    compareBar.hidden = !show;
    if (!show) return;
    const items = state.compare.map((id) => MODEL_BY_ID[id]).filter(Boolean);
    compareChips.innerHTML = items.map((m) => `<span class="compare-chip">${esc(m.brandZh)} ${esc(m.model)}<button data-act="remove-compare" data-id="${m.id}" aria-label="移除 ${esc(m.model)}">×</button></span>`).join('');
  }

  function setView(view, opts) {
    opts = opts || {};
    state.view = view;
    Object.keys(viewEls).forEach((k) => { viewEls[k].hidden = k !== view; });
    if (view === 'brand') renderBrandView();
    if (view === 'price') renderPriceView();
    if (view === 'style') renderStyleView();
    if (view === 'special') renderSpecialView();
    if (view === 'compare') renderCompareView();
    if (view === 'shortlist') renderShortlist();
    renderChrome();
    if (!opts.noScroll) {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
    }
  }

  function rerenderCurrent() {
    if (state.view === 'brand') renderBrandView();
    else if (state.view === 'price') renderPriceView();
    else if (state.view === 'style') renderStyleView();
    else if (state.view === 'special') renderSpecialView();
    else if (state.view === 'compare') renderCompareView();
    else if (state.view === 'shortlist') renderShortlist();
    renderChrome();
  }

  /* ---------- 概览 ---------- */
  const HERO_ART = `
  <svg viewBox="0 0 460 310" fill="none" aria-hidden="true" class="glow">
    <defs>
      <linearGradient id="lidGrad" x1="80" y1="60" x2="390" y2="240" gradientUnits="userSpaceOnUse">
        <stop stop-color="#e3c68f" stop-opacity=".8"/><stop offset="1" stop-color="#c9a86a" stop-opacity=".18"/>
      </linearGradient>
      <linearGradient id="keyGrad" x1="0" y1="210" x2="0" y2="290" gradientUnits="userSpaceOnUse">
        <stop stop-color="#f2eadb"/><stop offset="1" stop-color="#cfc4b0"/>
      </linearGradient>
    </defs>
    <circle cx="245" cy="145" r="118" stroke="#c9a86a" stroke-opacity=".1"/>
    <circle cx="245" cy="145" r="88" stroke="#c9a86a" stroke-opacity=".09"/>
    <path d="M55 232C58 122 155 51 295 55c74 2 122 39 135 95" stroke="url(#lidGrad)" stroke-width="1.4"/>
    <path d="M70 220C76 132 165 72 292 76c64 2 105 33 120 79" stroke="#c9a86a" stroke-opacity=".22"/>
    <path d="M95 232c30-48 86-78 158-80 47-1 84 9 110 28" stroke="#e3c68f" stroke-opacity=".25"/>
    <path d="M135 246l38-118M181 246l18-124M229 246l-2-126M277 246l-20-124M325 246l-38-118" stroke="#c9a86a" stroke-opacity=".13"/>
    <g transform="translate(83 244)">
      <rect x="0" y="0" width="294" height="50" rx="2" fill="#0d0e10" stroke="#c9a86a" stroke-opacity=".28"/>
      ${Array.from({ length: 14 }, (_, i) => `<rect x="${4 + i * 20.5}" y="3" width="19" height="44" rx="1.2" fill="url(#keyGrad)"/>`).join('')}
      ${[0, 1, 3, 4, 5, 7, 8, 9, 11, 12].map((i) => `<rect x="${13 + i * 20.5}" y="3" width="10" height="28" rx="1" fill="#191a1d"/>`).join('')}
    </g>
    <text x="83" y="307" fill="#c9a86a" fill-opacity=".55" font-size="7.5" letter-spacing="3.2">EIGHTY-EIGHT KEYS · FIVE TIERS</text>
    <text x="377" y="54" fill="#c9a86a" fill-opacity=".4" font-size="8" letter-spacing="2">EST. 1853</text>
  </svg>`;

  const TIER_DESC_EN = {
    Perfect: 'Top-tier handmade instruments; voice and craft as reference points.',
    Prime: 'First-line performance instruments approaching handmade standards.',
    Premier: 'Traditional mid-tier and upper-entry lines; stable value.',
    Passable: 'Mainstream production and entry models; dependable ownership.',
    Pedestrian: 'Entry and budget instruments; careful selection required.'
  };

  function renderOverview() {
    const EN = state.lang === 'en';
    const visibleTiers = state.tier === 'all' ? Object.keys(TIERS) : [state.tier];
    const pricedModels = MODELS.filter((m) => !m.quote);
    const totalLow = Math.min.apply(null, pricedModels.map((m) => m.low));
    const totalHigh = Math.max.apply(null, pricedModels.map((m) => m.high));

    const tierCards = Object.keys(TIERS).map((tier, tierIndex) => {
      const meta = TIERS[tier];
      const list = BRANDS.filter((b) => b.tier === tier);
      const ms = list.reduce((acc, b) => acc.concat(brandModels(b)), []);
      const priced = ms.filter((m) => !m.quote);
      const low = Math.min.apply(null, priced.map((m) => m.low));
      const high = Math.max.apply(null, priced.map((m) => m.high));
      const active = state.tier === tier ? ' active' : '';
      return `<button class="tier-card${active}" data-tier-filter="${tier}" style="${tierStyle(tier)}">
        <span class="tier-num">0${tierIndex + 1}</span>
        <div class="en">${esc(tier)}</div>
        <h4>${esc(EN ? meta.en : meta.zh)}</h4>
        <p>${esc(EN ? TIER_DESC_EN[tier] : meta.desc)}</p>
        <div class="meta"><span><b>${ms.length}</b> 款</span><span>${fmtNum(low)}–${fmtNum(high)} 万</span></div>
      </button>`;
    }).join('');

    const masterpieces = MODELS.filter((m) => m.special).sort((a, b) => (b.classic || 0) - (a.classic || 0)).slice(0, 10);
    const mpSlides = masterpieces.map((m, i) => `<article class="mp-slide${i === 0 ? ' active' : ''}" data-mp-slide="${i}">
      <span class="mp-index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <div class="mp-media ${photoClass(m)}${photoClass(m) ? '' : ' mp-noimg'}">${photoClass(m) ? '' : `<span class="mp-fallback">${esc(brandInitials(m.brandRef))}</span>`}</div><div class="mp-shade"></div>
      <div class="mp-copy">
        <div class="mp-kicker">No. ${String(i + 1).padStart(2, '0')} <span>/</span> ${esc(m.tier)} <span>/</span> ${m.cm} cm</div>
        <h3>${esc(state.lang === 'en' ? m.brand : m.brandZh)} <em>${esc(m.model)}</em></h3>
        <p>${esc(m.sig)}</p>
        <div class="mp-foot"><span>定制询价 · Art Case</span><button class="btn small" data-view="special">查看特别款目录 →</button></div>
      </div>
    </article>`).join('');
    const mpDots = masterpieces.map((m, i) => `<button class="mp-dot${i === 0 ? ' active' : ''}" data-mp-dot="${i}" aria-label="第 ${i + 1} 张"></button>`).join('');

    const sections = visibleTiers.map((tier) => {
      const list = BRANDS.filter((b) => b.tier === tier);
      if (!list.length) return '';
      const cards = list.map((brand) => {
        const ms = brandModels(brand);
        const range = brandPriceRange(brand);
        return `<button class="brand-card" data-brand="${brand.id}" style="${tierStyle(tier)}">
          <span class="brand-ghost">${esc(brandInitials(brand))}</span>
          <div class="brand-card-top">
            ${logoMarkup(brand, 'sm')}
            <span class="tier-badge" style="${tierStyle(tier)}">${esc(tier)}</span>
          </div>
          <h4>${esc(brand.name)}</h4>
          <div class="zh">${esc(brand.zh)} · ${esc(brand.country)} · 始于 ${brand.est}</div>
          <p>${esc(brand.character)}</p>
          <div class="brand-card-foot">
            <div class="price"><small>${ms.length} 款 · 参考价</small>${fmtNum(range.low)}–${fmtNum(range.high)} 万</div>
            <span class="go">查看 →</span>
          </div>
        </button>`;
      }).join('');
      return `<section class="brand-section">
        <div class="brand-section-head" style="${tierStyle(tier)}"><span class="dot"></span><h3>${esc(tier)}${EN ? '' : ' · ' + esc(TIERS[tier].zh)}</h3><span>${esc(EN ? TIER_DESC_EN[tier] : TIERS[tier].desc)}</span><em>${list.length}${EN ? ' brands' : ' 个品牌'}</em></div>
        <div class="brand-grid">${cards}</div>
      </section>`;
    }).join('');

    viewEls.brand.innerHTML = `
      <div class="hero">
        <div class="hero-copy">
          <div class="hero-edition">VOL. 01 <span>/</span> 2026</div>
          <div class="eyebrow hero-brand">GGPRD</div>
          <h1 class="hero-title">Global Grand Piano<br><em>Review Database</em></h1>
          <div class="hero-zh">全球三角钢琴评测数据库</div>
          <p class="lead">${state.lang === 'en' ? `${MODELS.length} instruments, brought together on one price scale.` : `${MODELS.length} 款三角琴，同一把尺。`}</p>
          <div class="hero-actions">
            <button class="btn primary" data-view="price">${EN ? 'Find by budget' : '按预算找琴'}</button>
            <button class="btn" data-open-about>${EN ? 'Methodology' : '分级与数据口径'}</button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><strong>${BRANDS.length}</strong><span>${EN ? 'Brands' : 'Brands 品牌'}</span></div>
            <div class="hero-stat"><strong>${MODELS.length}</strong><span>${EN ? 'Models' : 'Models 型号'}</span></div>
            <div class="hero-stat"><strong>${Object.keys(TIERS).length}</strong><span>${EN ? 'Tiers' : 'Tiers 分级'}</span></div>
            <div class="hero-stat"><strong>${fmtNum(totalLow)}–${fmtNum(totalHigh)}</strong><span>${EN ? '×10k CNY · reference' : '万元 · 参考价'}</span></div>
          </div>
        </div>
        <div class="hero-art">${HERO_ART}<span class="hero-caption">Global grand piano review database</span></div>
      </div>

      <div class="home-quick">
        <button class="quick-card" data-view="price"><span class="quick-num">01</span><b>${EN ? 'Find by budget' : '按预算找琴'}</b><small>${EN ? 'Budget · nearby rivals · origin' : '价格区间 · 同价对手 · 产地筛选'}</small><em>进入 →</em></button>
        <button class="quick-card" data-view="style"><span class="quick-num">02</span><b>${EN ? 'Six styles' : '六种风格'}</b><small>${EN ? 'Series-level fit · modern / romantic / Austro-German' : '系列级匹配 · 现代 / 浪漫 / 德奥'}</small><em>进入 →</em></button>
        <button class="quick-card" data-view="special"><span class="quick-num">03</span><b>${EN ? 'Special editions' : '特别款'}</b><small>${EN ? `Art Case · limited design · ${MODELS.filter((m) => m.special).length} models` : `Art Case · 限量设计 · ${MODELS.filter((m) => m.special).length} 款`}</small><em>进入 →</em></button>
        <button class="quick-card" data-view="compare"><span class="quick-num">04</span><b>${EN ? 'Compare' : '对比台'}</b><small>${EN ? 'Up to 10 side by side · drag to reorder' : '最多 10 台并排 · 可拖动排序'}</small><em>进入 →</em></button>
      </div>

      <section class="masterpiece" id="masterpiece" aria-label="Masterpiece">
        <div class="mp-head">
          <div><div class="eyebrow">MASTERPIECE <span>/</span> ${state.lang === 'en' ? 'SELECTED WORKS' : '大师之作'}</div></div>
          <div class="mp-controls"><button data-mp="prev" aria-label="上一张">←</button><span class="mp-count"><b id="mpNow">01</b> / ${String(masterpieces.length).padStart(2, '0')}</span><button data-mp="next" aria-label="下一张">→</button></div>
        </div>
        <div class="mp-stage">${mpSlides}<div class="mp-dots">${mpDots}</div></div>
      </section>

      <div class="section-head"><h3><span class="head-index">01</span>${EN ? 'Five tiers' : '五档分级'}</h3><div class="line"></div><p>${EN ? 'Click a tier to narrow the list.' : '点击筛选。'}</p></div>
      <div class="subjective-note"><b>${EN ? 'Note' : '说明'}</b> ${EN ? 'Tiers, ordering and scores are editorial judgements, not industry rankings.' : '排序与评分为编辑口径。'}</div>
      <div class="tier-board">${tierCards}</div>

      <div class="section-head"><h3><span class="head-index">02</span>${EN ? 'Brand map' : '品牌地图'}</h3><div class="line"></div><p>${EN ? 'Grouped by tier, from the highest down.' : '按分级排列。'}</p></div>
      ${sections}
      <div class="footnote"><span>${EN ? 'Indicative 2026 prices for mainland China. Not quotations. Brand and model names belong to their respective owners; this is an independent reference.' : '2026 年中国大陆参考区间，非报价。品牌与型号名称归各自权利人所有，本站为独立参考资料，与各品牌无隶属关系。'}</span><button data-open-about>查看数据来源 →</button></div>
    `;
    initMasterpiece();
  }

  function mpShow(index) {
    if (!mpRoot) return;
    const slides = Array.from(mpRoot.querySelectorAll('[data-mp-slide]'));
    if (!slides.length) return;
    mpIndex = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === mpIndex));
    mpRoot.querySelectorAll('[data-mp-dot]').forEach((d, i) => d.classList.toggle('active', i === mpIndex));
    const now = mpRoot.querySelector('#mpNow');
    if (now) now.textContent = String(mpIndex + 1).padStart(2, '0');
  }

  const REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mpStart() {
    clearInterval(mpTimer);
    if (REDUCED_MOTION) return;
    mpTimer = setInterval(() => mpShow(mpIndex + 1), 5500);
  }

  function initMasterpiece() {
    clearInterval(mpTimer);
    mpRoot = $('#masterpiece');
    if (!mpRoot) return;
    mpIndex = 0;
    const slides = mpRoot.querySelectorAll('[data-mp-slide]');
    if (slides.length < 2) return;
    mpRoot.querySelectorAll('[data-mp]').forEach((btn) => {
      btn.addEventListener('click', () => {
        mpShow(mpIndex + (btn.dataset.mp === 'next' ? 1 : -1));
        mpStart();
      });
    });
    mpRoot.querySelectorAll('[data-mp-dot]').forEach((dot) => {
      dot.addEventListener('click', () => { mpShow(Number(dot.dataset.mpDot)); mpStart(); });
    });
    const stage = mpRoot.querySelector('.mp-stage');
    if (stage) {
      stage.addEventListener('mouseenter', () => clearInterval(mpTimer));
      stage.addEventListener('mouseleave', mpStart);
    }
    mpStart();
  }

  /* ---------- 品牌详情 ---------- */
  function renderBrandView() {
    if (state.q) { renderSearchResults(); return; }
    if (state.brand) {
      const brand = BRANDS.find((b) => b.id === state.brand);
      if (brand) { renderBrandDetail(brand); return; }
      state.brand = null;
    }
    renderOverview();
  }

  function renderSearchResults() {
    const EN = state.lang === 'en';
    const q = state.q.toLowerCase();
    const results = MODELS.filter((m) => {
      if (state.tier !== 'all' && m.tier !== state.tier) return false;
      if (state.size !== 'all' && sizeBand(m.cm) !== state.size) return false;
      if (state.origin !== 'all' && m.origin !== state.origin) return false;
      const hay = searchHay(m);
      return hay.indexOf(q) !== -1;
    }).sort((a, b) => tierRank(a.tier) - tierRank(b.tier) || (a.quote ? 1e9 : a.mid) - (b.quote ? 1e9 : b.mid));

    const cards = results.map(renderModelCard).join('');
    viewEls.brand.innerHTML = `
      <div class="page-head">
        <div class="eyebrow">SEARCH / 搜索</div>
        <div class="crumb"><button data-brand="">全部品牌</button><span>/</span><span>搜索结果</span></div>
        <h2>“${esc(state.q)}”</h2>
        <p>${EN ? `${results.length === 1 ? 'One model matches' : `${results.length} models match`}.` : `找到 <b style="color:var(--gold-2)">${results.length}</b> 款。`}</p>
      </div>
      ${results.length ? `<div class="results-grid">${cards}</div>` : emptyState('没有找到匹配的型号', '试试品牌英文名、中文名或型号关键词，例如 “Bechstein”“C3X”“手工”。', '清除搜索', 'clear-search')}
      <div class="footnote"><span>搜索范围：品牌、系列、型号、标签与一句话定位。</span><button data-open-about>数据说明 →</button></div>
    `;
  }

  function renderBrandDetail(brand) {
    const all = brandModels(brand);
    const filtered = all.filter((m) => {
      if (state.tier !== 'all' && m.tier !== state.tier) return false;
      if (!state.q) return true;
      const q = state.q.toLowerCase();
      return `${m.model} ${m.series} ${m.sig} ${m.tags.join(' ')}`.toLowerCase().indexOf(q) !== -1;
    });
    const range = brandPriceRange(brand);
    const seriesHtml = brand.series.map((s, i) => {
      const ms = s.models.filter((m) => filtered.indexOf(m) !== -1);
      if (!ms.length) return '';
      return `<section class="series-block">
        <div class="series-head">
          <div class="index">${String(i + 1).padStart(2, '0')}</div>
          <div><h3>${esc(s.name)}</h3><div class="note">${esc(s.note)}</div></div>
          <div class="right">
            <div class="tags">${s.special ? '<span class="tag gold">特别版</span>' : ''}${(s.tags || []).filter((t) => !(s.special && t === '特别版')).map((t) => `<span class="tag gold">${esc(t)}</span>`).join('')}</div>
          </div>
        </div>
        <div class="series-intro"><span>强项：<b>${esc(s.highlight)}</b></span><span>注意：${esc(s.tradeoff)}</span></div>
        <div class="model-list">${ms.map(renderModelRow).join('')}</div>
      </section>`;
    }).join('');

    viewEls.brand.innerHTML = `
      <div class="page-head">
        <div class="eyebrow">BRAND / 品牌档案</div>
        <div class="crumb"><button data-brand="">全部品牌</button><span>/</span><button data-tier-filter="${brand.tier}">${esc(brand.tier)}</button><span>/</span><span>${esc(brand.zh)}</span></div>
        <div class="brand-hero ${brandPhotoClass(brand) && brand.heroPhoto !== false ? 'has-photo' : ''} ${brandPhotoFit(brand)}" style="${tierStyle(brand.tier)}">
          <div class="brand-hero-photo ${brandPhotoClass(brand)}"></div>
          <div class="brand-hero-shade"></div>
          <div class="brand-hero-content">
            ${logoMarkup(brand, 'lg')}
            <div class="eyebrow">${esc(brand.tier)} · ${esc(TIERS[brand.tier].zh)}</div>
            <h1>${esc(brand.name)}</h1>
            <div class="zh">${esc(brand.zh)} · ${esc(brand.country)} · 始于 ${brand.est}</div>
            <p class="character">${esc(brand.character)}</p>
            ${brandPhotoClass(brand) && brand.heroPhoto !== false ? `<div class="brand-photo-credit">${esc(brand.photoCredit || '品牌官网图')}</div>` : ''}
          </div>
          <div class="brand-hero-side">
            <div class="brand-meta">
              <div><span>成立</span><b>${brand.est}</b></div>
              <div><span>产地</span><b>${esc(brand.country)}</b></div>
              <div><span>系列</span><b>${brand.series.length}</b></div>
              <div><span>型号</span><b>${all.length}</b></div>
            </div>
            <div class="price-range"><span>全系参考价</span><strong>${fmtNum(range.low)}–${fmtNum(range.high)} 万</strong></div>
            <div class="actions">
              <button class="btn small primary" data-act="brand-price" data-id="${brand.id}">按价格筛选本品牌</button>
              <button class="btn small" data-act="brand-compare" data-id="${brand.id}">选两台代表对比</button>
              ${brand.official ? `<a class="btn small" href="${brand.official}" target="_blank" rel="noopener">官网 ↗</a>` : ''}
            </div>
          </div>
        </div>
        <div class="brand-notes">
          <div class="note-card"><h5><i></i>优势 Strengths</h5><ul>${brand.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
          <div class="note-card warn"><h5><i></i>注意 Watch-outs</h5><ul>${brand.weaknesses.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
        </div>
      </div>
      ${filtered.length ? seriesHtml : emptyState('这个品牌下没有匹配的型号', '清除搜索词或放宽分级筛选。', '清除筛选', 'reset-brand-filter')}
      <div class="footnote"><span>${esc(brand.name)} · 价格为参考区间，实际成交受配置、地区与经销商影响。</span><button data-open-about>数据口径 →</button></div>
    `;
  }

  function modelTags(m) {
    const tags = [SIZE_BANDS[sizeBand(m.cm)].short + ' cm'].concat(m.tags);
    return uniqueStrings(tags).slice(0, 4);
  }

  function renderModelRow(m) {
    const selected = state.compare.indexOf(m.id) !== -1;
    const pClass = photoClass(m);
    const priceHtml = m.quote
      ? `<strong class="quote-price">定制询价</strong><span>Art Case / 特别版</span>`
      : `<strong>${fmtNum(m.low)}–${fmtNum(m.high)} <em>万</em></strong><span>参考成交价</span>`;
    const actions = m.quote
      ? `<button class="btn small" data-act="detail" data-id="${m.id}">详情</button>`
      : `<button class="btn small" data-act="detail" data-id="${m.id}">详情</button>
         <button class="btn small" data-act="peers" data-id="${m.id}">同价 PK</button>
         <button class="btn small${selected ? ' on' : ''}" data-act="compare" data-id="${m.id}" data-on="已选" data-off="对比">${selected ? '已选' : '对比'}</button>`;
    return `<article class="model-row ${m.special ? 'is-special' : ''}" data-act="detail" data-id="${m.id}" style="cursor:pointer">
      <div class="model-row-photo ${pClass} ${photoFit(m)}">${pClass ? '' : `<span>${esc(brandInitials(m.brandRef))}</span>`}</div>
      <div>
        <div class="model-title"><h4>${esc(m.model)}</h4><span class="size">${sizeText(m.cm)} · ${feetText(m.cm)}</span>${officialLink(m)}</div>
        <p class="sig">${esc(m.sig)}</p>
        <div class="tags">${modelTags(m).map((t, i) => `<span class="tag${i === 0 ? ' gold' : ''}">${esc(t)}</span>`).join('')}</div>
      </div>
      <div class="model-price">${priceHtml}</div>
      <div class="model-actions">${actions}</div>
    </article>`;
  }

  function renderModelCard(m, opts) {
    opts = opts || {};
    const selected = state.compare.indexOf(m.id) !== -1;
    const fav = favorites.has(m.id);
    const pClass = photoClass(m);
    const official = officialLink(m, 'photo-official');
    const specialTag = m.special ? '<span class="photo-special">特别版</span>' : '';
    const actions = [];
    if (!m.quote) {
      actions.push(`<button data-act="peers" data-id="${m.id}" title="找同价位对手">同价 PK</button>`);
      actions.push(`<button data-act="compare" data-id="${m.id}" class="${selected ? 'on' : ''}" data-on="已选" data-off="对比">${selected ? '已选' : '对比'}</button>`);
    } else {
      actions.push(`<button data-act="detail" data-id="${m.id}">详情</button>`);
    }
    actions.push(`<button data-act="fav" data-id="${m.id}" class="${fav ? 'on' : ''}" data-on="${opts.shortlist ? '移出' : '已收藏'}" data-off="收藏">${fav ? (opts.shortlist ? '移出' : '已收藏') : '收藏'}</button>`);
    const priceHtml = m.quote
      ? `<div class="price quote-price">定制询价 <em>Art Case</em></div>`
      : `<div class="price">${fmtNum(m.low)}–${fmtNum(m.high)} <em>${state.lang === 'en' ? '×10k' : '万'}</em></div>`;
    return `<article class="model-card ${m.special ? 'is-special' : ''}" data-act="detail" data-id="${m.id}" style="cursor:pointer;${tierStyle(m.tier)}">
      <div class="model-photo ${pClass} ${photoFit(m)} ${photoPlate(m)}">
        <div class="photo-ambient"></div>
        <div class="photo-sharp"></div>
        <div class="model-photo-shade"></div>
        <span class="tier-badge" style="${tierStyle(m.tier)}">${esc(m.tier)}</span>
        ${official}
        ${specialTag}
        <span class="photo-note">${esc(photoCaption(m))}</span>
        ${pClass ? '' : `<span class="photo-fallback-art">${fallbackArt()}</span><span class="photo-fallback">${esc(brandInitials(m.brandRef))}</span><div class="plate-copy"><span class="plate-brand">${esc(m.brand)}</span><strong class="plate-model">${esc(m.model)}</strong><span class="plate-series">${esc(m.series)}</span></div>`}
      </div>
      <div class="model-card-body">
        <div class="model-card-top"><span class="size">${sizeText(m.cm)} · ${esc(SIZE_BANDS[sizeBand(m.cm)].short)}</span><span class="series-mini">${esc(state.lang === 'en' ? seriesEn(m.series) : m.series)}</span></div>
        <h3><span class="brand">${state.lang === 'en' ? esc(m.brand) : esc(m.brandZh) + ' · ' + esc(m.brand)}</span>${esc(m.model)}</h3>
        <p class="sig">${esc(m.sig)}</p>
        <div class="model-card-foot">
          ${priceHtml}
          <div class="acts">${actions.join('')}</div>
        </div>
      </div>
    </article>`;
  }
  function emptyState(title, desc, btnText, act) {
    return `<div class="empty">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 19V8.5L12 4l8 4.5V19"/><path d="M4 19h16M8 19v-6h8v6"/></svg>
      <h4>${esc(title)}</h4><p>${esc(desc)}</p>
      <button class="btn" data-act="${act}">${esc(btnText)}</button>
    </div>`;
  }

  /* ---------- 风格榜 ---------- */
  const STYLE_TIER_BONUS = { Perfect: 4, Prime: 3, Premier: 2, Passable: 0, Pedestrian: -3 };

  function originChipsMarkup() {
    return ['all'].concat(ORIGIN_ORDER).map((key) => {
      const label = key === 'all' ? '全部' : ORIGIN_DEFS[key].label;
      return `<button class="chip${state.origin === key ? ' active' : ''}" data-origin="${key}">${esc(label)}</button>`;
    }).join('');
  }

  function priceOriginChipsMarkup() {
    return ['all'].concat(ORIGIN_ORDER).map((key) => {
      const label = key === 'all' ? '全部' : ORIGIN_DEFS[key].label;
      const active = key === 'all' ? !state.priceOrigins.length : state.priceOrigins.indexOf(key) !== -1;
      return `<button class="chip${active ? ' active' : ''}" data-origin="${key}">${esc(label)}</button>`;
    }).join('');
  }

  function togglePriceFilter(key, value) {
    const arr = state[key] || [];
    if (value === 'all') state[key] = [];
    else if (arr.indexOf(value) !== -1) state[key] = arr.filter((x) => x !== value);
    else state[key] = arr.concat(value);
  }

  function seriesStyleList(styleKey) {
    const out = [];
    BRANDS.forEach((brand) => {
      brand.series.forEach((series) => {
        if (series.special || !series.models.length) return;
        if (state.origin !== 'all' && series.origin !== state.origin) return;
        const base = (series.styleProfile && series.styleProfile[styleKey]) || 0;
        const bonus = styleKey === 'teaching' ? 0 : (STYLE_TIER_BONUS[brand.tier] || 0);
        const position = styleKey === 'teaching' ? 0 : (series.styleProfile && series.styleProfile.p) || 0;
        const score = clamp(Math.round(base + bonus + position), 1, 100);
        const priced = series.models.filter((m) => !m.quote);
        const low = Math.min.apply(null, priced.map((m) => m.low));
        const high = Math.max.apply(null, priced.map((m) => m.high));
        out.push({ brand, series, score, low, high, count: priced.length });
      });
    });
    out.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (styleKey === 'teaching') return a.low - b.low || tierRank(a.brand.tier) - tierRank(b.brand.tier);
      return tierRank(a.brand.tier) - tierRank(b.brand.tier) || a.low - b.low;
    });
    return out;
  }

  function renderStyleView() {
    const EN = state.lang === 'en';
    const boards = STYLE_DEFS.map((def, index) => {
      const allList = seriesStyleList(def.key);
      const expanded = !!state.styleExpanded[def.key];
      const list = expanded ? allList : allList.slice(0, 10);
      const rows = list.map((item, i) => {
        const b = item.brand;
        const s = item.series;
        return `<button class="style-row" data-brand="${b.id}" data-style-row="${esc(s.name)}">
          <span class="style-rank">${String(i + 1).padStart(2, '0')}</span>
          <span class="style-info">
            <span class="style-name">${esc(EN ? b.name : b.zh)} · ${esc(EN ? seriesEn(s.name) : s.name)}</span>
            <span class="style-note">${esc(EN ? '' : (s.styleNote || ''))}</span>
          </span>
          <span class="style-score">
            <span class="style-bar"><i style="width:${item.score}%"></i></span>
            <b>${item.score}</b>
          </span>
          <span class="style-price">${fmtNum(item.low)}–${fmtNum(item.high)} ${EN ? '×10k' : '万'}</span>
          <span class="style-origin">${esc(EN ? (ORIGIN_DEFS[s.origin] ? ORIGIN_DEFS[s.origin].en : '') : (s.originLabel || ''))}</span>
        </button>`;
      }).join('');
      return `<section class="style-board">
        <div class="style-board-head">
          <span class="style-index">0${index + 1}</span>
          <div><div class="style-en">${esc(def.en)}</div><h3>${esc(EN ? def.nameEn : def.name)}</h3></div>
          <p>${esc(EN ? def.descEn : def.desc)}</p>
        </div>
        <div class="style-list">${rows || `<div class="style-empty">${EN ? 'No series under this origin filter' : '这个产地筛选下暂无系列'}</div>`}</div>
        ${allList.length > 10 ? `<button class="style-more" data-style-expand="${def.key}">${expanded ? (EN ? 'Collapse to top 10 ↑' : '收起，只看前 10 个系列 ↑') : (EN ? `Show all ${allList.length} series ↓` : `展开全部 ${allList.length} 个系列 ↓`)}</button>` : ''}
      </section>`;
    }).join('');
    viewEls.style.innerHTML = `
      <div class="page-head">
        <div class="eyebrow">${EN ? 'STYLE' : '风格榜'}</div>
        <h2>${EN ? 'Every series, ranked' : '按系列排名'}</h2>
        <p>${EN ? 'Series are ranked individually, so one maker can appear at very different positions.' : '同一品牌的不同系列，分别计算。'}</p>
      </div>
      <div class="style-toolbar panel">
        <div class="style-toolbar-main"><span class="filter-label">${EN ? 'Origin' : '产地 / 风格来源'}</span><div class="style-chips">${originChipsMarkup()}</div></div>
        <span class="style-scope">${EN ? `${BRANDS.reduce((n, b) => n + b.series.filter((s) => !s.special && s.models.length && (state.origin === 'all' || s.origin === state.origin)).length, 0)} series` : `当前 ${BRANDS.reduce((n, b) => n + b.series.filter((s) => !s.special && s.models.length && (state.origin === 'all' || s.origin === state.origin)).length, 0)} 个系列`}</span>
      </div>
      <div class="style-grid">${boards}</div>
      <div class="footnote"><span>${EN ? 'Style fit weighs series lineage, origin, tone and intended use.' : '按系列、产地、音色与用途判断。'}</span><button data-open-about>${EN ? 'Methodology →' : '数据口径 →'}</button></div>
    `;
  }

  /* ---------- 价格找琴 ---------- */
  const PRICE_PRESETS = [
    [8, 15, '8–15 万'], [15, 25, '15–25 万'], [25, 40, '25–40 万'], [40, 60, '40–60 万'],
    [60, 90, '60–90 万'], [90, 130, '90–130 万'], [130, 200, '130–200 万'], [200, 400, '200 万+']
  ];

  function budgetRanges() {
    const bands = (state.priceBands || []).filter((pair) => Array.isArray(pair) && pair.length === 2 && isFinite(pair[0]) && isFinite(pair[1]));
    if (bands.length) return bands.map((pair) => [Math.min(pair[0], pair[1]), Math.max(pair[0], pair[1])]);
    return [[Math.min(state.priceMin, state.priceMax), Math.max(state.priceMin, state.priceMax)]];
  }

  function budgetBounds() {
    const ranges = budgetRanges();
    return { lo: Math.min.apply(null, ranges.map((r) => r[0])), hi: Math.max.apply(null, ranges.map((r) => r[1])) };
  }

  function budgetLabel(enc) {
    const bands = (state.priceBands || []);
    if (!bands.length) {
      const b = budgetBounds();
      return `${fmtNum(b.lo)}–${fmtNum(b.hi)} ${enc ? '×10k' : '万'}`;
    }
    return bands.map(([lo, hi]) => `${fmtNum(Math.min(lo, hi))}–${fmtNum(Math.max(lo, hi))}`).join(' / ') + (enc ? ' ×10k' : ' 万');
  }

  function inBudget(m) {
    return budgetRanges().some(([lo, hi]) => m.high >= lo && m.low <= hi);
  }

  function renderPriceView() {
    const EN = state.lang === 'en';
    const b = budgetBounds();
    const multi = (state.priceBands || []).length > 0;
    const brandOptions = BRANDS.map((br) => `<option value="${br.id}"${state.priceBrand === br.id ? ' selected' : ''}>${esc(br.zh)} · ${esc(br.name)}</option>`).join('');
    const tierChips = [['all', '全部']].concat(Object.keys(TIERS).map((t) => [t, t])).map(([v, label]) => {
      const active = v === 'all' ? !state.priceTiers.length : state.priceTiers.indexOf(v) !== -1;
      return `<button class="chip${active ? ' active' : ''}" data-tier-filter="${v}">${esc(label)}</button>`;
    }).join('');
    const sizeChips = [['all', '全部']].concat(Object.keys(SIZE_BANDS).map((k) => [k, SIZE_BANDS[k].short])).map(([v, label]) => {
      const active = v === 'all' ? !state.priceSizes.length : state.priceSizes.indexOf(v) !== -1;
      return `<button class="chip${active ? ' active' : ''}" data-size="${v}">${esc(label)}</button>`;
    }).join('');
    const originChips = priceOriginChipsMarkup();
    const presets = PRICE_PRESETS.map(([lo, hi, label]) => {
      const active = (state.priceBands || []).some((pair) => pair[0] === lo && pair[1] === hi) || (!multi && b.lo === lo && b.hi === hi);
      return `<button class="preset${active ? ' active' : ''}" data-price-preset="${lo},${hi}">${label}</button>`;
    }).join('');
    const bandChips = multi ? `<div class="price-band-row"><span>已选价位</span>${state.priceBands.map(([lo, hi]) => `<button class="band-chip" data-remove-band="${lo},${hi}">${fmtNum(Math.min(lo, hi))}–${fmtNum(Math.max(lo, hi))} 万 <em>×</em></button>`).join('')}<button class="band-clear" data-act="clear-bands">清空多选</button></div>` : '';

    viewEls.price.innerHTML = `
      <div class="page-head">
        <div class="eyebrow">PRICE FINDER / ${EN ? 'BUDGET' : '按价找琴'}</div>
        <h2>${EN ? 'How to choose within budget' : '同价位如何选择'}</h2>
        <p>${EN ? 'Pick a budget, then narrow by tier, size and origin.' : '输入预算，按价格区间与产地筛选。'}</p>
      </div>
      <div class="filter-panel panel">
        <div class="budget-line">
          <div>
            <div class="budget-title">${EN ? 'Your budget' : '你的预算区间'}</div>
            <div class="budget-big"><span id="priceLabel">${budgetLabel(EN)}</span><small>${multi ? (EN ? 'Multiple bands' : '多个价位') : (EN ? 'Reference · tax incl.' : '参考成交 · 含税')}</small></div>
          </div>
          <div class="budget-inputs">
            <div class="input-wrap${multi ? ' is-multi' : ''}"><label>最低</label><input id="priceMin" type="number" min="0" max="400" step="1" value="${state.priceMin}"${multi ? ' disabled' : ''}></div>
            <span class="unit">—</span>
            <div class="input-wrap${multi ? ' is-multi' : ''}"><label>最高</label><input id="priceMax" type="number" min="0" max="400" step="1" value="${state.priceMax}"${multi ? ' disabled' : ''}></div>
            <span class="unit">万元</span>
            <div class="result-count"><b id="priceCount">0</b> ${EN ? 'models overlap' : '款区间重叠'}</div>
          </div>
        </div>
        <div class="preset-row">${presets}</div>
        ${bandChips}
        <div class="filters">
          <div class="filter-group"><span class="filter-label">分级</span>${tierChips}</div>
          <div class="filter-group"><span class="filter-label">尺寸</span>${sizeChips}</div>
          <div class="filter-group"><span class="filter-label">产地</span>${originChips}</div>
          <div class="filter-group"><span class="filter-label">品牌</span>
            <select class="select" id="brandFilter"><option value="">全部品牌</option>${brandOptions}</select>
          </div>
          <div class="filter-group"><span class="filter-label">排序</span>
            <select class="select" id="sortSel">
              <option value="price-asc"${state.sort === 'price-asc' ? ' selected' : ''}>价格从低到高</option>
              <option value="price-desc"${state.sort === 'price-desc' ? ' selected' : ''}>价格从高到低</option>
              <option value="size-desc"${state.sort === 'size-desc' ? ' selected' : ''}>尺寸从大到小</option>
              <option value="tier"${state.sort === 'tier' ? ' selected' : ''}>分级从高到低</option>
            </select>
          </div>
        </div>
      </div>
      <div class="chart-panel panel">
        <div class="chart-head">
          <h4>${EN ? 'Price × size' : '价格 × 尺寸分布'}</h4>
          <span>${tierLegend()} · ${EN ? 'click a dot for details' : '点圆点看详情'}</span>
        </div>
        <div class="chart-box" id="priceChart"></div>
      </div>
      <div id="priceResults"></div>
      <div class="footnote"><span>${EN ? 'A model appears when its price band overlaps your budget; sorting uses the mid-point.' : '价格区间重叠即计入；按中位价排序。'}</span><button data-open-about>${EN ? 'Methodology →' : '数据口径 →'}</button></div>
    `;
    renderPriceResults();
    updateBudgetLabel();
  }

  function tierLegend() {
    return Object.keys(TIERS).map((t) => `<span style="display:inline-flex;align-items:center;gap:4px;margin-left:8px"><i style="width:5px;height:5px;border-radius:50%;background:${TIERS[t].color};display:inline-block"></i>${t}</span>`).join('');
  }

  function updateBudgetLabel() {
    const label = $('#priceLabel');
    if (label) label.textContent = budgetLabel(state.lang === 'en');
  }

  function priceScope(includePrice) {
    return MODELS.filter((m) => {
      if (m.quote) return false;
      if (state.priceTiers.length && state.priceTiers.indexOf(m.tier) === -1) return false;
      if (state.priceBrand && m.brandId !== state.priceBrand) return false;
      if (state.priceSizes.length && state.priceSizes.indexOf(sizeBand(m.cm)) === -1) return false;
      if (state.priceOrigins.length && state.priceOrigins.indexOf(m.origin) === -1) return false;
      if (state.q) {
        const q = state.q.toLowerCase();
        const hay = searchHay(m);
        if (hay.indexOf(q) === -1) return false;
      }
      if (includePrice && !inBudget(m)) return false;
      return true;
    });
  }

  function sortModels(list) {
    const arr = list.slice();
    if (state.sort === 'price-asc') arr.sort((a, b) => a.mid - b.mid);
    else if (state.sort === 'price-desc') arr.sort((a, b) => b.mid - a.mid);
    else if (state.sort === 'size-desc') arr.sort((a, b) => b.cm - a.cm || a.mid - b.mid);
    else if (state.sort === 'tier') arr.sort((a, b) => tierRank(a.tier) - tierRank(b.tier) || a.mid - b.mid);
    return arr;
  }

  const SORT_LABELS = { 'price-asc': '价格从低到高', 'price-desc': '价格从高到低', 'size-desc': '尺寸从大到小', 'tier': '分级从高到低' };
  const SORT_LABELS_EN = { 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', 'size-desc': 'Size: large to small', 'tier': 'Tier: high to low' };

  function applySort(value) {
    if (state.sort === value) return;
    state.sort = value;
    renderPriceResults();
    toast(`已按${SORT_LABELS[value] || '当前条件'}排序`);
  }

  function renderPriceResults() {
    if (!$('#priceResults')) return;
    const scope = priceScope(false);
    const results = sortModels(priceScope(true));
    const count = $('#priceCount');
    if (count) count.textContent = String(results.length);
    updateBudgetLabel();

    const chart = $('#priceChart');
    if (chart) renderChart(chart, scope);

    const grid = results.map(renderModelCard).join('');
    const b = budgetBounds();
    const originName = !state.priceOrigins.length ? '全部产地' : (state.priceOrigins.length > 1 ? `${state.priceOrigins.length} 个产地` : (ORIGIN_DEFS[state.priceOrigins[0]] ? ORIGIN_DEFS[state.priceOrigins[0]].label : '全部产地'));
    const activeBrand = state.priceBrand ? BRANDS.find((x) => x.id === state.priceBrand) : null;
    const enc = state.lang === 'en';
    const head = `<div class="results-head">
      <div><h3>${enc ? 'Within budget' : '落在预算里的琴'}</h3><div class="sub">${budgetLabel(enc)} · ${enc ? results.length + ' models' : '共 ' + results.length + ' 款'} · ${enc ? (activeBrand ? activeBrand.name : 'All brands') : (activeBrand ? activeBrand.zh : '全部品牌')} · ${enc ? (!state.priceOrigins.length ? 'All origins' : state.priceOrigins.length > 1 ? state.priceOrigins.length + ' origins' : (ORIGIN_DEFS[state.priceOrigins[0]] ? ORIGIN_DEFS[state.priceOrigins[0]].label : 'All origins')) : originName} · ${enc ? (SORT_LABELS_EN[state.sort] || 'Current order') : (SORT_LABELS[state.sort] || '当前排序')}</div></div>
      <button class="btn ghost" data-act="reset-price">${enc ? 'Reset filters' : '重置筛选'}</button>
    </div>`;
    $('#priceResults').innerHTML = results.length
      ? head + `<div class="results-grid">${grid}</div>`
      : head + emptyState('这个区间暂时没有匹配', '可以放宽预算、取消分级/尺寸限制，或直接看预算外最接近的型号。', '把预算放宽 25%', 'widen-price');
  }

  function renderChart(box, scope) {
    if (!scope.length) {
      box.innerHTML = '<div class="chart-empty">当前筛选下没有可绘制的型号</div>';
      return;
    }
    const W = 940, H = 330, ml = 44, mr = 18, mt = 18, mb = 34;
    const xMin = 5, xMax = 400, yMin = 135, yMax = 320;
    const xScale = (v) => {
      const vv = clamp(v, xMin, xMax);
      return ml + (Math.log(vv) - Math.log(xMin)) / (Math.log(xMax) - Math.log(xMin)) * (W - ml - mr);
    };
    const yScale = (v) => mt + (yMax - v) / (yMax - yMin) * (H - mt - mb);
    const ranges = budgetRanges();
    const xTicks = [5, 10, 20, 50, 100, 200, 400];
    const yTicks = [150, 180, 210, 240, 270, 300];
    const inBudget = (m) => ranges.some(([lo, hi]) => m.high >= lo && m.low <= hi);
    const bandsSvg = ranges.map(([lo, hi]) => {
      const x1 = xScale(lo), x2 = xScale(hi);
      const x = Math.min(x1, x2), w = Math.max(2, Math.abs(x2 - x1));
      return `<rect x="${x}" y="${mt}" width="${w}" height="${H - mt - mb}" fill="rgba(201,168,106,.075)"/>
        <line x1="${x1}" y1="${mt}" x2="${x1}" y2="${H - mb}" stroke="rgba(201,168,106,.4)" stroke-dasharray="3 4"/>
        <line x1="${x2}" y1="${mt}" x2="${x2}" y2="${H - mb}" stroke="rgba(201,168,106,.4)" stroke-dasharray="3 4"/>`;
    }).join('');

    const gridX = xTicks.map((v) => `<line x1="${xScale(v)}" y1="${mt}" x2="${xScale(v)}" y2="${H - mb}" stroke="#2a2c31" stroke-width="1"/>
      <text x="${xScale(v)}" y="${H - mb + 16}" text-anchor="middle" fill="#6f6b64" font-size="9">${v}</text>`).join('');
    const gridY = yTicks.map((v) => `<line x1="${ml}" y1="${yScale(v)}" x2="${W - mr}" y2="${yScale(v)}" stroke="#2a2c31" stroke-width="1"/>
      <text x="${ml - 8}" y="${yScale(v) + 3}" text-anchor="end" fill="#6f6b64" font-size="9">${v}</text>`).join('');
    const dots = scope.map((m) => {
      const cx = xScale(m.mid), cy = yScale(m.cm);
      const on = inBudget(m);
      const selected = state.compare.indexOf(m.id) !== -1;
      const r = selected ? 5.2 : 4.2;
      const stroke = selected ? '#f3eee4' : 'none';
      return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${TIERS[m.tier].color}" fill-opacity="${on ? 0.9 : 0.24}" stroke="${stroke}" stroke-width="${selected ? 1.3 : 0}" data-act="detail" data-id="${m.id}" style="cursor:pointer"><title>${esc(m.brandZh)} ${esc(m.model)} · ${priceRange(m)} · ${m.cm} cm</title></circle>`;
    }).join('');

    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="三角钢琴价格与尺寸分布图">
      <rect x="${ml}" y="${mt}" width="${W - ml - mr}" height="${H - mt - mb}" fill="#121316" rx="3"/>
      ${gridX}${gridY}
      ${bandsSvg}
      ${dots}
      <text x="${ml}" y="${mt - 4}" fill="#6f6b64" font-size="8.5" letter-spacing="1.6">SIZE / CM</text>
      <text x="${W - mr}" y="${H - 4}" text-anchor="end" fill="#6f6b64" font-size="8.5" letter-spacing="1.4">PRICE / 万元 · 对数刻度</text>
    </svg><div class="chart-tip" id="chartTip" hidden></div>`;
    box.innerHTML = svg;

    const tip = $('#chartTip', box);
    $$('circle[data-id]', box).forEach((circle) => {
      circle.addEventListener('mouseenter', () => {
        const m = MODEL_BY_ID[circle.dataset.id];
        if (!m) return;
        tip.innerHTML = `<b>${esc(m.brandZh)} ${esc(m.model)}</b> · ${esc(priceRange(m))} · ${m.cm} cm`;
        const cr = circle.getBoundingClientRect();
        const br = box.getBoundingClientRect();
        tip.style.left = `${cr.left - br.left + cr.width / 2}px`;
        tip.style.top = `${cr.top - br.top}px`;
        tip.hidden = false;
      });
      circle.addEventListener('mouseleave', () => { tip.hidden = true; });
    });
  }

  function schedulePriceResults() {
    clearTimeout(priceTimer);
    priceTimer = setTimeout(() => {
      const lo = Number(state.priceMin), hi = Number(state.priceMax);
      if (!isFinite(lo) || !isFinite(hi)) return;
      renderPriceResults();
    }, 180);
  }

  /* ---------- 特别款目录 ---------- */
  function specialModels() {
    return MODELS.filter((m) => m.special).sort((a, b) => (b.classic || 0) - (a.classic || 0) || tierRank(a.tier) - tierRank(b.tier));
  }

  function renderSpecialView() {
    const list = specialModels();
    const cards = list.map((m, i) => renderSpecialCard(m, i)).join('');
    viewEls.special.innerHTML = `
      <div class="page-head">
        <div class="eyebrow">${state.lang === 'en' ? 'SPECIAL EDITIONS' : '特别款'}</div>
        <h2>${state.lang === 'en' ? 'Classic rank' : '经典程度，由高到低'}</h2>
        <p>${state.lang === 'en' ? `${list.length} Art Case and limited models, ordered by classic rank.` : `${list.length} 款 Art Case 与限量型号，按经典程度排列。`}</p>
      </div>
      <div class="special-note panel">
        <span><b>${state.lang === 'en' ? 'Classic index' : '经典指数'}</b> ${state.lang === 'en' ? 'an editorial order' : '为编辑排序'}</span>
        <span>${state.lang === 'en' ? 'Each one is built to order. Price, veneer and lead time are confirmed by the maker.' : '单台定制；价格、木材与交期以品牌确认为准。'}</span>
        <button class="btn small" data-view="brand">${state.lang === 'en' ? 'Back to brands' : '回到品牌浏览'}</button>
      </div>
      <div class="special-grid">${cards}</div>
      <div class="footnote"><span>${state.lang === 'en' ? 'Photographs are from the makers. Where none was usable, the card links to the brand.' : '图片来自品牌官网；缺图保留官网链接。'}</span><button data-open-about>${state.lang === 'en' ? 'Methodology →' : '数据口径 →'}</button></div>
    `;
  }

  function renderSpecialCard(m, index) {
    const p = photoInfo(m);
    const fav = favorites.has(m.id);
    const official = officialUrl(m);
    const pClass = p ? `${photoClass(m)} ${photoFit(m)}` : '';
    return `<article class="special-card" data-act="detail" data-id="${m.id}" style="${tierStyle(m.tier)}">
      <div class="special-media ${pClass} ${photoFit(m)} ${photoPlate(m)}">
        <div class="photo-ambient"></div>
        <div class="photo-sharp"></div>
        <div class="special-media-shade"></div>
        ${p ? '' : `<span class="special-fallback-art">${fallbackArt()}</span><span class="special-monogram">${esc(brandInitials(m.brandRef))}</span><div class="special-plate-copy"><span class="plate-brand">${esc(m.brand)}</span><strong class="plate-model">${esc(m.model)}</strong><span class="plate-series">${esc(m.series)}</span></div>`}
        <span class="special-rank">#${String(index + 1).padStart(2, '0')}</span>
        <span class="special-brand">${esc(state.lang === 'en' ? m.brand : m.brandZh)} · ${esc(state.lang === 'en' ? seriesEn(m.series) : m.series)}</span>
        ${official ? `<a class="photo-official" href="${official}" target="_blank" rel="noopener">官网 ↗</a>` : ''}
        <span class="special-photo-note">${esc(photoCaption(m))}</span>
      </div>
      <div class="special-body">
        <div class="special-kicker"><span class="special-number">#${String(index + 1).padStart(2, '0')}</span><span>${esc(m.tier)}</span><span>${state.lang === 'en' ? `Rank ${m.classic || '—'}` : `经典指数 ${m.classic || '—'}`}</span><span>${m.cm} cm</span></div>
        <h3>${esc(m.model)}</h3>
        <p>${esc(m.sig)}</p>
        <div class="special-foot">
          <div class="special-price">${state.lang === 'en' ? 'Price on request' : '定制询价'} <em>Art Case</em></div>
          <div class="special-actions">
            <button data-act="detail" data-id="${m.id}">详情</button>
            <button data-act="fav" data-id="${m.id}" class="${fav ? 'on' : ''}" data-on="已收藏" data-off="收藏">${fav ? '已收藏' : '收藏'}</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  /* ---------- 对比 ---------- */
  const COMPARE_PRESETS = [
    { title: '40–50 万 · 家用主力', desc: '雅马哈 C3X / 佩卓夫 P194 / 舒密尔 C189 / 波士顿 GP-193', ids: [] },
    { title: '80–110 万 · 欧洲手工', desc: 'Shigeru SK-7 / 高天 Charis / 博兰斯勒 Model 6 / 舒密尔 K219', ids: [] },
    { title: '180 万+ · 音乐会', desc: '施坦威 D-274 / 贝希斯坦 D 282 / 贝森朵夫 280VC / 法奇奥里 F278', ids: [] }
  ];
  function presetModels(preset) {
    return preset.names.map(([brandId, modelName]) => findModel(brandId, modelName)).filter(Boolean);
  }
  COMPARE_PRESETS[0].names = [['yamaha', 'C3X'], ['petrof', 'P 194 Storm'], ['schimmel', 'C 189'], ['boston', 'GP-193']];
  COMPARE_PRESETS[1].names = [['shigeru', 'SK-7'], ['grotrian', 'Charis 208'], ['bluthner', 'Model 6'], ['schimmel', 'K 219']];
  COMPARE_PRESETS[2].names = [['steinway', 'D-274'], ['bechstein', 'D 282'], ['bosendorfer', '280VC'], ['fazioli', 'F278']];

  function renderCompareView() {
    const selected = state.compare.map((id) => MODEL_BY_ID[id]).filter(Boolean);
    const EN = state.lang === 'en';
    if (selected.length < 2) {
      const one = selected[0];
      const presets = COMPARE_PRESETS.map((p, i) => `<button class="preset-card" data-preset="${i}"><b>${esc(p.title)}</b><span>${esc(p.desc)}</span><em>一键载入 →</em></button>`).join('');
      viewEls.compare.innerHTML = `
        <div class="page-head">
          <div class="eyebrow">${EN ? 'COMPARISON' : '对比台'}</div>
          <h2>${state.lang === 'en' ? 'Put similar pianos side by side' : '把同价位的琴，放在一起看'}</h2>
          <p>${state.lang === 'en' ? 'Compare up to 10 models side by side, then copy or print the summary.' : '最多 10 台，左右滑动；可打印或复制。'}</p>
        </div>
        <div class="empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="4" width="7" height="16" rx="2"/><rect x="14" y="4" width="7" height="16" rx="2"/><path d="M10 12h4"/></svg>
          <h4>${one ? '已选 1 台，再选至少 1 台' : '还没有选择对比型号'}</h4>
          <p>${one ? `当前：${esc(one.brandZh)} ${esc(one.model)}。再从同价位里挑 1–9 台，差异会更清楚。` : '在品牌页、价格页或详情弹窗中点击“对比”，最多同时比较 10 台。'}</p>
          <div class="compare-empty-actions">
            <button class="btn primary" data-view="price">去价格页选琴</button>
            ${one ? `<button class="btn" data-act="peers" data-id="${one.id}">自动找 3 台同价位</button>` : ''}
            <button class="btn ghost" data-act="clear-compare">清空选择</button>
          </div>
        </div>
        <div class="section-head"><h3>经典同价位组合</h3><div class="line"></div><p>一键载入，可再替换</p></div>
        <div class="preset-compare">${presets}</div>
        <div class="footnote"><span>${EN ? 'Scores are editorial. Prices are indicative only.' : '评分为编辑口径；价格以书面报价为准。'}</span><button data-open-about>${EN ? 'Methodology →' : '数据口径 →'}</button></div>
      `;
      return;
    }

    const insights = buildInsights(selected);
    const maxByKey = {};
    const minByKey = {};
    RATING_KEYS.forEach(([key]) => {
      maxByKey[key] = Math.max.apply(null, selected.map((m) => m.ratings[key]));
      minByKey[key] = Math.min.apply(null, selected.map((m) => m.ratings[key]));
    });
    const minMid = Math.min.apply(null, selected.map((m) => m.mid));
    const maxMid = Math.max.apply(null, selected.map((m) => m.mid));
    const minCm = Math.min.apply(null, selected.map((m) => m.cm));
    const maxCm = Math.max.apply(null, selected.map((m) => m.cm));
    const ratingSpread = Math.max.apply(null, RATING_KEYS.map(([key]) => maxByKey[key] - minByKey[key]));

    const cols = selected.map((m) => {
      const peers = peersFor(m, 4).filter((p) => selected.indexOf(p) === -1).slice(0, 2);
      const flags = [];
      if (m.mid === minMid) flags.push(`<span class="flag low">${EN ? 'Lowest median' : '中位价最低'}</span>`);
      if (m.mid === maxMid) flags.push(`<span class="flag high">${EN ? 'Highest median' : '中位价最高'}</span>`);
      if (m.cm === maxCm) flags.push(`<span class="flag big">${EN ? 'Largest' : '最大尺寸'}</span>`);
      if (m.cm === minCm) flags.push(`<span class="flag small">${EN ? 'Smallest' : '最小尺寸'}</span>`);
      const ratings = RATING_KEYS.map(([key, label]) => {
        const best = m.ratings[key] === maxByKey[key];
        const worst = m.ratings[key] === minByKey[key] && maxByKey[key] - minByKey[key] >= 0.4;
        return `<div class="rating-row${best ? ' best' : ''}${worst ? ' worst' : ''}"><span>${label}</span>${ratingMeter(m.ratings[key], best)}<b>${m.ratings[key]}</b></div>`;
      }).join('');
      return `<article class="compare-col" data-id="${m.id}" style="${tierStyle(m.tier)}">
        <div class="compare-col-head">
          <button class="remove" data-act="remove-compare" data-id="${m.id}" aria-label="从对比中移除">×</button>
          <span class="tier-badge" style="${tierStyle(m.tier)}">${esc(m.tier)}</span>
          <div class="brand">${esc(state.lang === 'en' ? m.brand : m.brandZh + ' · ' + m.brand)}</div>
          <h3>${esc(m.model)}</h3>
          <div class="series">${esc(state.lang === 'en' ? seriesEn(m.series) + ' · ' + countryEn(m.madeIn) : m.series + ' · ' + m.madeIn)}</div>
          <div class="price">${priceRange(m)} <em>参考</em></div>
          <div class="flags">${flags.join('') || '<span class="flag">同场对比</span>'}</div>
        </div>
        <div class="compare-sec"><h5>${EN ? 'Positioning' : '定位'}</h5><p class="sig">${esc(m.sig)}</p><div class="meta-line" style="margin-top:6px"><span>${sizeText(m.cm)} · ${feetText(m.cm)}</span><span>${esc(m.use)}</span></div></div>
        <div class="compare-sec pros"><h5>${EN ? 'Strengths' : '优势'}</h5><ul>${prosFor(m).map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
        <div class="compare-sec cons"><h5>${EN ? 'Watch-outs' : '注意'}</h5><ul>${consFor(m).map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
        <div class="compare-sec"><h5>${EN ? 'Editorial score / 5' : '编辑评分 / 5'}</h5>${ratings}</div>
        <div class="compare-sec"><h5>${EN ? 'Nearby rivals' : '同价位对手'}</h5>
          <div class="peer-mini">${peers.length ? peers.map((p) => `<button data-act="detail" data-id="${p.id}"><span>${esc(p.brandZh)} ${esc(p.model)}</span><b>${fmtNum(p.low)}–${fmtNum(p.high)} 万</b></button>`).join('') : '<span style="font-size:9.5px;color:var(--faint)">暂无更近的同价位型号</span>'}</div>
        </div>
        <div class="compare-sec"><h5>适合场景</h5><div class="meta-line"><span>${esc(m.use)}</span><button class="btn small" data-act="detail" data-id="${m.id}" style="height:24px;font-size:9.5px">详情</button></div></div>
      </article>`;
    }).join('');

    viewEls.compare.innerHTML = `
      <div class="page-head">
        <div class="eyebrow">${EN ? 'COMPARISON' : '对比台'}</div>
        <h2>${EN ? `${selected.length} pianos, <span style="color:var(--gold-2)">¥${fmtNum(Math.min.apply(null, selected.map((m) => m.low)))}–${fmtNum(Math.max.apply(null, selected.map((m) => m.high)))} ×10k</span>` : `${selected.length} 台琴，<span style="color:var(--gold-2)">${fmtNum(Math.min.apply(null, selected.map((m) => m.low)))}–${fmtNum(Math.max.apply(null, selected.map((m) => m.high)))} 万</span>`}</h2>
        <p>${EN ? 'Start with the difference summary, then compare strengths, watch-outs and scores. Price, size and tier differences usually explain the gap better than a single score.' : '先看差异摘要，再逐项比较优势、短板与评分。价格、尺寸与分级差异，通常比单项评分更能解释实际价差。'}</p>
      </div>
      <div class="compare-toolbar">
        <button class="btn" data-view="price">${EN ? 'Keep browsing' : '继续选琴'}</button>
        <button class="btn" data-act="copy-compare">${EN ? 'Copy summary' : '复制摘要'}</button>
        <button class="btn" data-act="print">${EN ? 'Print / PDF' : '打印 / PDF'}</button>
        <button class="btn ghost" data-act="clear-compare">${EN ? 'Clear compare' : '清空对比'}</button>
        <div class="spacer"></div>
        <div class="compare-scroll">
          <button class="btn small" data-act="scroll-compare" data-dir="-1" aria-label="向左浏览">←</button>
          <button class="btn small" data-act="scroll-compare" data-dir="1" aria-label="向右浏览">→</button>
        </div>
        <span style="font-size:10px;color:var(--faint)">${EN ? 'Selected' : '已选'} ${selected.length} / 10</span>
      </div>
      <div class="compare-hint">左右滑动或点箭头浏览 · 长按卡片顶部可拖动排序</div>
      <div class="compare-insights"><h4>差异摘要</h4><ul>${insights.map((s) => `<li>${s}</li>`).join('')}</ul></div>
      <div class="compare-diffbar">
        <span>${EN ? 'Price spread' : '价差'} <b>${fmtNum(Math.round(maxMid - minMid))} ${EN ? '×10k' : '万'}</b></span>
        <span>${EN ? 'Size spread' : '尺寸差'} <b>${maxCm - minCm} cm</b></span>
        <span>${EN ? 'Max rating spread' : '评分最大差'} <b>${round1(ratingSpread)}</b></span>
        <em>${EN ? 'Gold = highest · grey = lowest' : '金色 = 本场最高 · 灰点 = 本场最低'}</em>
      </div>
      <div class="compare-grid" id="compareGrid" style="--n:${selected.length}">${cols}</div>
      <div class="footnote"><span>${EN ? 'Five scores, each out of five. Prices are indicative ranges.' : '五项评分，5 分制；价格为参考区间。'}</span><button data-open-about>数据口径 →</button></div>
    `;
    attachCompareGrid();
  }

  function attachCompareGrid() {
    const grid = $('#compareGrid');
    if (!grid) return;
    grid.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('button,a,input,select,textarea')) return;
      const col = e.target.closest('.compare-col');
      if (!col) return;
      compareDrag = {
        grid, col, id: col.dataset.id, startX: e.clientX, startY: e.clientY,
        pointerId: e.pointerId, active: false, insertAt: null, timer: null
      };
      compareDrag.timer = setTimeout(() => {
        if (!compareDrag) return;
        compareDrag.active = true;
        compareDrag.col.classList.add('dragging');
        compareDrag.grid.classList.add('drag-active');
        document.body.classList.add('dragging-compare');
        try { compareDrag.col.setPointerCapture(compareDrag.pointerId); } catch (err) { /* ignore */ }
      }, 340);
    });
  }

  function onComparePointerMove(e) {
    const d = compareDrag;
    if (!d) return;
    if (!d.active) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 9) {
        clearTimeout(d.timer);
        compareDrag = null;
      }
      return;
    }
    if (e.cancelable) e.preventDefault();
    d.col.style.transform = `translateX(${e.clientX - d.startX}px)`;
    const gr = d.grid.getBoundingClientRect();
    if (e.clientX < gr.left + 42) d.grid.scrollLeft -= 16;
    else if (e.clientX > gr.right - 42) d.grid.scrollLeft += 16;
    const others = Array.from(d.grid.querySelectorAll('.compare-col')).filter((c) => c !== d.col);
    let insertAt = others.length;
    for (let i = 0; i < others.length; i++) {
      const r = others[i].getBoundingClientRect();
      if (e.clientX < r.left + r.width / 2) { insertAt = i; break; }
    }
    d.insertAt = insertAt;
    others.forEach((c) => c.classList.remove('drop-before'));
    if (insertAt < others.length) others[insertAt].classList.add('drop-before');
  }

  function endCompareDrag() {
    const d = compareDrag;
    if (!d) return;
    clearTimeout(d.timer);
    if (!d.active) { compareDrag = null; return; }
    d.col.classList.remove('dragging');
    d.col.style.transform = '';
    d.grid.classList.remove('drag-active');
    d.grid.querySelectorAll('.compare-col').forEach((c) => c.classList.remove('drop-before'));
    document.body.classList.remove('dragging-compare');
    const ids = state.compare.slice();
    const from = ids.indexOf(d.id);
    const to = d.insertAt == null ? from : d.insertAt;
    compareDrag = null;
    if (from >= 0 && to !== from) {
      ids.splice(from, 1);
      ids.splice(to, 0, d.id);
      state.compare = ids;
      renderCompareView();
      toast('对比顺序已调整');
    }
  }

  function ratingLabel(value) {
    if (value >= 4.6) return '标杆';
    if (value >= 4.2) return '优秀';
    if (value >= 3.8) return '良好';
    if (value >= 3.3) return '均衡';
    if (value >= 2.8) return '基础';
    return '有限';
  }

  function ratingMeter(value, best) {
    const pct = clamp((value / 5) * 100, 0, 100);
    return `<div class="rating-meter${best ? ' best' : ''}" title="${value.toFixed(1)} / 5 · ${ratingLabel(value)}"><i style="width:${pct.toFixed(1)}%"></i></div>`;
  }

  function buildInsights(models) {
    const sorted = models.slice().sort((a, b) => a.mid - b.mid);
    const out = [];
    const low = sorted[0], high = sorted[sorted.length - 1];
    const overallLow = Math.min.apply(null, models.map((m) => m.low));
    const overallHigh = Math.max.apply(null, models.map((m) => m.high));
    out.push(`本次对比 <b>${models.length}</b> 台，参考价覆盖 <b>¥${fmtNum(overallLow)}–${fmtNum(overallHigh)} 万</b>；中位价跨度约 <b>${fmtNum(Math.round(high.mid - low.mid))} 万</b>。`);

    let pair = null, diff = Infinity;
    for (let i = 0; i < sorted.length - 1; i++) {
      const d = sorted[i + 1].mid - sorted[i].mid;
      if (d < diff) { diff = d; pair = [sorted[i], sorted[i + 1]]; }
    }
    if (pair) {
      const pct = Math.round(diff / pair[0].mid * 100);
      const same = diff < 0.6;
      const relation = same
        ? '的中位价相同，价格区间几乎完全重叠'
        : `价差最小（约 ${fmtNum(Math.round(diff * 10) / 10)} 万，${pct}%）`;
      out.push(`<b>${esc(pair[0].brandZh)} ${esc(pair[0].model)}</b> 与 <b>${esc(pair[1].brandZh)} ${esc(pair[1].model)}</b> ${relation}，是最直接的对手：前者强在${esc(pair[0].seriesRef.highlight)}；后者强在${esc(pair[1].seriesRef.highlight)}。`);
    }

    const maxM = models.slice().sort((a, b) => b.cm - a.cm)[0];
    const minM = models.slice().sort((a, b) => a.cm - b.cm)[0];
    if (maxM.cm !== minM.cm) {
      out.push(`尺寸从 <b>${minM.cm} cm</b>（${esc(minM.brandZh)} ${esc(minM.model)}）到 <b>${maxM.cm} cm</b>（${esc(maxM.brandZh)} ${esc(maxM.model)}），相差 <b>${maxM.cm - minM.cm} cm</b>；这通常直接对应低音下潜、声场规模与占地要求。`);
    }

    const leaders = RATING_KEYS.slice(0, 4).map(([key, label]) => {
      const max = Math.max.apply(null, models.map((m) => m.ratings[key]));
      const names = models.filter((m) => m.ratings[key] === max).map((m) => `${esc(m.brandZh)} ${esc(m.model)}`);
      return `${label}最高：<b>${names.join(' / ')}</b>（${max} 分）`;
    });
    out.push(leaders.join('；') + '。');

    const tiers = uniqueStrings(models.map((m) => m.tier));
    if (tiers.length > 1) {
      const tierNames = tiers.sort((a, b) => tierRank(a) - tierRank(b)).join(' / ');
      out.push(`这组对比跨越 <b>${tierNames}</b> 分级。价差并不只由尺寸决定，产地、手工比例、品牌溢价与售后网络同样在价格里。`);
    }
    return out;
  }

  /* ---------- 短名单 ---------- */
  function shortlistPriorityRank(id) {
    return { high: 0, medium: 1, low: 2 }[priorities[id]] ?? 3;
  }

  function renderShortlist() {
    const EN = state.lang === 'en';
    const list = MODELS.filter((m) => favorites.has(m.id)).sort((a, b) => shortlistPriorityRank(a.id) - shortlistPriorityRank(b.id) || tierRank(a.tier) - tierRank(b.tier) || a.mid - b.mid);
    viewEls.shortlist.innerHTML = `
      <div class="page-head">
        <div class="eyebrow">${EN ? 'SAVED' : '短名单'}</div>
        <h2>${EN ? 'Save it, then go play it' : '先记下来，再去试弹'}</h2>
        <p>${EN ? 'Kept in this browser only. Reorder by priority and add your own notes.' : '本地保存，可加备注与优先级。'}</p>
      </div>
      <div class="compare-toolbar">
        <button class="btn primary" data-act="add-all-favs"${list.filter((m) => !m.quote).length >= 2 ? '' : ' disabled'}>${EN ? 'Add first 10 to compare' : '把前 10 台加入对比'}</button>
        <button class="btn" data-act="export-shortlist"${list.length ? '' : ' disabled'}>${EN ? 'Export CSV' : '导出 CSV'}</button>
        <button class="btn" data-act="print-shortlist"${list.length ? '' : ' disabled'}>${EN ? 'Print list' : '打印清单'}</button>
        <button class="btn ghost" data-act="clear-favs"${list.length ? '' : ' disabled'}>${EN ? 'Clear' : '清空短名单'}</button>
        <div class="spacer"></div><span style="font-size:10px;color:var(--faint)">${list.length} ${EN ? 'models' : '台'}</span>
      </div>
      ${list.length ? `<div class="results-grid shortlist-grid">${list.map(renderShortlistCard).join('')}</div>` : emptyState(EN ? 'Your shortlist is empty' : '短名单还是空的', EN ? 'Use “Save” on a brand, price or detail view to add a candidate.' : '在品牌页、价格页或详情弹窗里点“收藏”，就会出现在这里。', EN ? 'Browse by budget' : '去价格页逛逛', 'goto-price')}
      <div class="footnote"><span>${EN ? 'Saved in this browser only. Clearing site data removes it.' : '仅保存在当前浏览器。'}</span><button data-open-about>${EN ? 'Methodology →' : '数据口径 →'}</button></div>
    `;
  }

  function renderShortlistCard(m) {
    const EN = state.lang === 'en';
    const note = notes[m.id] || '';
    const pr = priorities[m.id] || '';
    return `<div class="shortlist-item">
      ${renderModelCard(m, { shortlist: true })}
      <div class="shortlist-tools">
        <label class="shortlist-priority"><span>${EN ? 'Priority' : '优先级'}</span><select data-priority="${m.id}">
          <option value=""${pr === '' ? ' selected' : ''}>${EN ? '—' : '未设置'}</option>
          <option value="high"${pr === 'high' ? ' selected' : ''}>${EN ? 'Audition first' : '优先试弹'}</option>
          <option value="medium"${pr === 'medium' ? ' selected' : ''}>${EN ? 'Shortlist' : '备选'}</option>
          <option value="low"${pr === 'low' ? ' selected' : ''}>${EN ? 'Watch' : '观望'}</option>
        </select></label>
        <textarea data-note="${m.id}" rows="2" placeholder="${EN ? 'Notes: action, tone, price, delivery, finish…' : '备注：现场手感、音色、价格、交期、颜色…'}">${esc(note)}</textarea>
      </div>
    </div>`;
  }

  function exportShortlistCsv() {
    const list = MODELS.filter((m) => favorites.has(m.id));
    if (!list.length) { toast(state.lang === 'en' ? 'Shortlist is empty' : '短名单为空'); return; }
    const escCsv = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const rows = [['Brand', 'Model', 'Series', 'Tier', 'cm', 'Price low (10k)', 'Price high (10k)', 'Priority', 'Note']];
    list.forEach((m) => {
      rows.push([m.brand, m.model, m.series, m.tier, m.cm, m.quote ? '' : m.low, m.quote ? '' : m.high, priorities[m.id] || '', notes[m.id] || '']);
    });
    const csv = '\ufeff' + rows.map((r) => r.map(escCsv).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'piano-shortlist.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(state.lang === 'en' ? 'CSV exported' : '短名单 CSV 已导出');
  }

  /* ---------- 详情弹窗 ---------- */
  function openDetail(id) {
    const EN = state.lang === 'en';
    const m = MODEL_BY_ID[id];
    if (!m) return;
    lastFocused = document.activeElement;
    const peers = peersFor(m, 3);
    const selected = state.compare.indexOf(m.id) !== -1;
    const fav = favorites.has(m.id);
    const showPhoto = m.special ? !m.noPhoto : !(m.noPhoto || m.brandRef.detailPhoto === false);
    const pClass = showPhoto ? photoClass(m) : '';
    const info = showPhoto ? photoInfo(m) : null;
    const official = officialUrl(m);
    const ratings = RATING_KEYS.map(([key, label]) => `<div class="rating-row"><span class="rating-name">${label}<em>${ratingLabel(m.ratings[key])}</em></span>${ratingMeter(m.ratings[key], false)}<b>${m.ratings[key]}</b></div>`).join('');
    const peerHtml = peers.length ? peers.map((p) => `<button class="peer-card" data-act="detail" data-id="${p.id}" style="${tierStyle(p.tier)}">
      <span class="pt">${esc(p.tier)} · ${p.cm} cm</span><b>${esc(p.brandZh)} ${esc(p.model)}</b><span>${priceRange(p)}</span>
    </button>`).join('') : '<span style="font-size:11px;color:var(--faint)">暂无价格接近的对手。</span>';
    const quoteList = (typeof PIANIST_QUOTES !== 'undefined' && PIANIST_QUOTES[`${m.brandId}|${m.model}`]) || [];
    const quotesHtml = quoteList.length ? `<div class="modal-section quote-section">
      <h4>${state.lang === 'en' ? 'Performer note' : '演奏者评价'} <span style="font-weight:400;letter-spacing:0;color:var(--faint)">${state.lang === 'en' ? 'Published quote' : '公开评价'}</span></h4>
      ${quoteList.map((q) => `<figure class="quote-card"><blockquote>“${esc(state.lang === 'en' ? q.textEn : q.textZh)}”</blockquote><figcaption><b>${esc(q.name)}</b><span>${esc(q.role)}</span><a href="${q.source}" target="_blank" rel="noopener">${esc(q.sourceLabel)} ↗</a></figcaption></figure>`).join('')}
    </div>` : '';
    const used = usedTiers(m);
    const usedHtml = used.length ? `<div class="used-wrap">
      <table class="used-table"><thead><tr><th>成色</th><th>典型状态</th><th>参考价</th><th>残值率</th></tr></thead><tbody>
      ${used.map((u) => `<tr><td><b>${esc(u.label)}</b><span>${esc(u.age)}</span></td><td>${esc(u.note)}</td><td>¥${fmtNum(Math.round(u.low * 2) / 2)}–${fmtNum(Math.round(u.high * 2) / 2)} 万</td><td>${u.pctLow}–${u.pctHigh}%</td></tr>`).join('')}
      </tbody></table>
      <p class="used-note">以新琴参考价中位数为锚，按年龄/成色曲线、品牌保值与尺寸流动性折算；不含翻新、运费、调律与地区价差。仅作议价锚点。</p>
    </div>` : `<div class="mini-note"><h5>特别版说明</h5><ul><li>Art Case / 定制款没有标准二手梯队，价格取决于具体木材、漆面、工艺与出处。</li><li>如考虑二手，请单独做 provenance（来源）与修复评估。</li></ul></div>`;
    const actions = [];
    if (!m.quote) {
      actions.push(`<button class="btn primary${selected ? ' on' : ''}" data-act="compare" data-id="${m.id}" data-on="已加入对比" data-off="加入对比">${selected ? '已加入对比' : '加入对比'}</button>`);
      actions.push(`<button class="btn" data-act="peers" data-id="${m.id}">一键同价 PK</button>`);
    }
    actions.push(`<button class="btn" data-act="fav" data-id="${m.id}" data-on="已收藏" data-off="收藏">${fav ? '已收藏' : '收藏'}</button>`);
    if (official) actions.push(`<a class="btn" href="${official}" target="_blank" rel="noopener">访问官网 ↗</a>`);
    actions.push('<button class="btn ghost" data-act="close-modal">关闭</button>');

    modalRoot.innerHTML = `<div class="modal-overlay" data-modal-overlay>
      <div class="modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="detailTitle">
        <button class="modal-close" data-act="close-modal" aria-label="关闭">×</button>
        <div class="modal-photo ${pClass} ${photoFit(m)} ${photoPlate(m)}">
          <div class="photo-ambient"></div>
          <div class="photo-sharp"></div>
          ${pClass ? '' : `<span class="modal-photo-fallback-art">${fallbackArt()}</span><span class="modal-photo-fallback">${esc(brandInitials(m.brandRef))}</span><div class="modal-plate-copy"><span class="plate-brand">${esc(m.brand)}</span><strong class="plate-model">${esc(m.model)}</strong><span class="plate-series">${esc(m.series)}</span></div>`}
          <div class="modal-photo-shade"></div>
          <span class="modal-photo-cap">${esc(showPhoto ? photoCaption(m) : '图片暂缺 · 官网可查')}</span>
          <span class="modal-photo-credit">${esc(info ? info.caption : '官网可查')}</span>
        </div>
        <div class="modal-head" style="${tierStyle(m.tier)}">
          <span class="tier-badge" style="${tierStyle(m.tier)}">${esc(m.tier)} · ${esc(TIERS[m.tier].zh)}</span>
          ${m.special ? '<span class="tier-badge" style="--tier:#c9a86a;margin-left:4px">特别版</span>' : ''}
          <h2 id="detailTitle">${esc(m.brandZh)} ${esc(m.model)}</h2>
          <div class="brandline">${esc(m.brand)} · ${esc(m.series)} · ${esc(m.madeIn)} ${official ? `<a href="${official}" target="_blank" rel="noopener" class="inline-official">官网 ↗</a>` : ''}</div>
          <p class="sig">${esc(m.sig)}</p>
        </div>
        <div class="modal-body">
          <div class="spec-grid">
            <div><span>尺寸</span><b>${m.cm} cm · ${feetText(m.cm)}</b></div>
            <div><span>参考价</span><b style="color:var(--gold-2)">${priceRange(m)}</b></div>
            <div><span>产地</span><b>${esc(m.madeIn)}</b></div>
            <div><span>适合</span><b>${esc(m.use)}</b></div>
          </div>
          <div class="modal-section">
            <h4>这台琴的画像</h4>
            <p class="long-desc">${esc(longDescription(m))}</p>
            <div class="profile-tags">${(m.brandRef.toneTags || []).map((t) => `<span class="tag gold">${esc(t)}</span>`).join('')}${(m.brandRef.musicTags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          </div>
          <div class="modal-section"><h4>编辑评分 / 5 <span style="font-weight:400;letter-spacing:0;color:var(--faint)">价格带校准 · 保值单独评估</span></h4><div class="rating-grid">${ratings}</div></div>
          <div class="modal-section split">
            <div class="mini-note"><h5>${EN ? 'Strengths' : '优势'}</h5><ul>${prosFor(m).map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
            <div class="mini-note warn"><h5>${EN ? 'Watch-outs' : '注意'}</h5><ul>${consFor(m).map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
          </div>
          <div class="modal-section">
            <h4>二手参考价梯队 <span style="font-weight:400;letter-spacing:0;color:var(--faint)">按成色 / 年份分类</span></h4>
            ${usedHtml}
          </div>
          ${m.quote ? '' : `<div class="modal-section"><h4>同价位对手 · 价格接近，但取舍不同</h4><div class="peer-list">${peerHtml}</div></div>`}
          ${quotesHtml}
          <div class="modal-actions">${actions.join('')}</div>
          <div class="footnote" style="margin-top:18px"><span>价格为参考区间，非报价；评分、优劣与二手梯队为编辑判断。产品图来自品牌官网，仅作识别与示意。</span></div>
        </div>
      </div>
    </div>`;
    document.body.classList.add('no-scroll');
    setTimeout(() => { const btn = $('.modal-close', modalRoot); if (btn) btn.focus(); }, 30);
  }

  function closeModal() {
    modalRoot.innerHTML = '';
    document.body.classList.remove('no-scroll');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus(); } catch (err) { /* ignore */ }
    }
  }

  function openAbout() {
    lastFocused = document.activeElement;
    modalRoot.innerHTML = `<div class="modal-overlay" data-modal-overlay>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="aboutTitle" style="max-width:780px">
        <div class="modal-head">
          <button class="modal-close" data-act="close-modal" aria-label="关闭">×</button>
          <span class="tier-badge" style="--tier:var(--gold)">DATA NOTES</span>
          <h2 id="aboutTitle">数据口径与使用说明</h2>
          <p class="sig">这是一个选购决策工具，不是报价系统。所有价格都应视为“合理的量级”，而不是经销商承诺。</p>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <h4>价格口径</h4>
            <div class="mini-note" style="margin-bottom:8px"><ul>
              <li>单位：人民币万元；口径：中国大陆新琴参考成交价区间（含税），数据版本 2026 年 11 月（估算）。</li>
              <li>区间综合厂商建议价、进口成本、市场成交与型号定位估算；不同城市、经销商、配置、汇率与促销会造成 ±20–30% 甚至更大的差异。</li>
              <li>不是实时报价。下单前请索取书面报价，并确认产地、年份、序列号、配置、保修与运费。</li>
            </ul></div>
          </div>
          <div class="modal-section">
            <h4>型号与分级</h4>
            <div class="mini-note" style="margin-bottom:8px"><ul>
              <li>收录 43 个品牌、326 款现产或常见在售三角琴，含 98 款 Art Case / 特别版（如 Fazioli Marco Polo、C. Bechstein Sphinx、Steinway Crown Jewel）；自动演奏/静音版、停产型号与部分小批量定制未全部列入。</li>
              <li>Perfect / Prime / Premier / Passable / Pedestrian 五档及品牌顺序完全来自你的指定，没有任何排名依据，不代表客观评价或行业定论。</li>
              <li>音色、触感、投射、做工按价格带校准并压缩同价位差距；品牌保值单独按国内二手流通评估，不随新琴价格自动抬升。</li>
              <li>同一品牌的不同系列差异很大，请以系列与具体型号为准。</li>
              <li>评分为编辑口径 5 分制，用于同场相对比较，并非实验室测量。</li>
              <li>每款型号尽量配品牌官网图或同系列示意图；没有可靠图片的型号留空，并保留官网直达链接。图片版权归品牌所有，仅作识别与选购参考。</li>
              <li>部分新增品牌（Haessler、Rönisch、Baldwin、Wilh. Steinberg、Essex、Rösler、Irmler、Toyama、Hsinghai、Hailun、Steinburg、Carod、Zimmermann、Apollo）的型号与价格为公开资料与市场估算，购买前请以官网及经销商信息为准。</li>
            </ul></div>
          </div>
          <div class="modal-section">
            <h4>怎么用</h4>
            <div class="mini-note" style="margin-bottom:8px"><ul>
              <li><b>品牌浏览</b>：按五档分级进入品牌，查看每个系列的型号、尺寸、参考价与一句话定位。</li>
              <li><b>价格找琴</b>：输入预算，匹配价格区间有重叠的型号，并可按美产 / 日系 / 德奥系 / 国产 / 韩系 / 北欧 / 意大利 / 捷克筛选；点圆点或“同价 PK”自动找 3–7 台相近对手。</li>
              <li><b>风格榜</b>：按系列而非品牌，分别给出当代、浪漫派、德奥古典、爵士流行、教学家用、室内乐录音六种侧重的排名。</li>
              <li><b>对比台</b>：最多 10 台，先看差异摘要，再看优势、注意与评分；可打印或复制摘要。</li>
              <li><b>二手梯队</b>：详情页按准新 / 9 成新 / 8 成新 / 需整备四档给出参考价，以新琴中位价为锚，按年龄/成色曲线、品牌保值与尺寸流动性折算，仅作议价锚点。</li>
              <li><b>短名单</b>：收藏候选琴，保存在本机浏览器，方便约琴行试弹。</li>
            </ul></div>
          </div>
          <div class="modal-section">
            <h4>试弹清单</h4>
            <div class="mini-note" style="margin-bottom:8px"><ul>
              <li>同价位至少试 3 台，带熟悉的曲目：一首慢板、一首强奏、一段快速音阶。</li>
              <li>关注：中低音是否浑厚但不糊、高音是否发尖、弱奏是否可控、延音是否自然、键盘深浅与回弹。</li>
              <li>问清：产地、年份、是否新琴、整音记录、保修年限、送货与调律次数、旧琴置换政策。</li>
              <li>请独立技师验琴，尤其是二手、样琴、展琴与非授权渠道。</li>
            </ul></div>
          </div>
          <div class="modal-section">
            <h4>参考来源</h4>
            <p style="font-size:10.5px;color:var(--muted);line-height:1.8;margin:0">
              型号与系列主要参考品牌官网；相对价格量级参考 Piano Buyer 历史价格表，并结合 2026 年中国市场情况校准。
              可查阅：<a href="https://www.pianobuyer.com/" target="_blank" rel="noopener" style="color:var(--gold)">Piano Buyer</a> ·
              <a href="https://www.bechstein.cn/products" target="_blank" rel="noopener" style="color:var(--gold)">C. Bechstein / W. Hoffmann</a> ·
              <a href="https://www.bluthner.cn/" target="_blank" rel="noopener" style="color:var(--gold)">Blüthner</a> ·
              <a href="https://www.steingraeber.de/en/instrumente/grand-pianos/" target="_blank" rel="noopener" style="color:var(--gold)">Steingraeber</a> ·
              <a href="https://www.seiler-pianos.com/seiler-grand-pianos" target="_blank" rel="noopener" style="color:var(--gold)">Seiler</a> ·
              <a href="https://pearlriverpianogroup.com/" target="_blank" rel="noopener" style="color:var(--gold)">Pearl River / Kayserburg / Ritmüller</a> ·
              <a href="https://masonhamlin.com/" target="_blank" rel="noopener" style="color:var(--gold)">Mason & Hamlin / Henry Mason</a>
            </p>
          </div>
          <div class="modal-actions"><button class="btn primary" data-act="close-modal">知道了</button></div>
        </div>
      </div>
    </div>`;
    document.body.classList.add('no-scroll');
    setTimeout(() => { const btn = $('.modal-close', modalRoot); if (btn) btn.focus(); }, 30);
  }

  /* ---------- 交互 ---------- */
  function selectBrand(id) {
    state.brand = id || null;
    state.q = '';
    searchInput.value = '';
    state.tier = 'all';
    state.size = 'all';
    setView('brand');
  }

  function toggleCompare(id) {
    if (!MODEL_BY_ID[id]) return;
    if (MODEL_BY_ID[id].quote) { toast('特别版为定制询价，暂不参与价格对比'); return; }
    const idx = state.compare.indexOf(id);
    if (idx !== -1) {
      state.compare.splice(idx, 1);
      toast('已从对比台移除');
    } else {
      if (state.compare.length >= 10) { toast('最多同时对比 10 台，请先移除一台'); return; }
      state.compare.push(id);
      state.compareBarHidden = false;
      toast(state.compare.length === 1 ? '已加入 1 台，再选 1–9 台即可对比' : `已加入对比（${state.compare.length}/10）`);
    }
    syncCompareButtons();
    renderChrome();
    if (state.view === 'compare') renderCompareView();
    if (state.view === 'shortlist') renderShortlist();
    if (state.modalOpen) { /* modal buttons are synced below */ }
  }

  function removeCompare(id) {
    const idx = state.compare.indexOf(id);
    if (idx !== -1) state.compare.splice(idx, 1);
    syncCompareButtons();
    renderChrome();
    if (state.view === 'compare') renderCompareView();
  }

  function startPeerCompare(id) {
    const m = MODEL_BY_ID[id];
    if (!m) return;
    if (m.quote) { toast('特别版为定制询价，暂无标准同价位对手'); return; }
    if (modalRoot.innerHTML) closeModal();
    const peers = closePeers(m, 6);
    state.compare = [m].concat(peers).map((x) => x.id);
    state.compareBarHidden = false;
    syncCompareButtons();
    setView('compare');
    toast(state.compare.length > 1
      ? `已选 ${state.compare.length} 台价位/定位相近的对手`
      : '同价位与同定位的对手较少，先单独看这台');
  }

  function toggleFav(id) {
    if (!MODEL_BY_ID[id]) return;
    if (favorites.has(id)) {
      favorites.delete(id);
      toast('已移出短名单');
    } else {
      favorites.add(id);
      toast('已加入短名单');
    }
    saveFavorites();
    renderChrome();
    syncFavButtons();
    if (state.view === 'shortlist') renderShortlist();
  }

  function syncCompareButtons() {
    $$('[data-act="compare"]').forEach((btn) => {
      const on = state.compare.indexOf(btn.dataset.id) !== -1;
      btn.classList.toggle('on', on);
      const label = on ? (btn.dataset.on || '已选') : (btn.dataset.off || '对比');
      if (btn.classList.contains('btn')) btn.textContent = label;
      else btn.textContent = label;
    });
  }
  function syncFavButtons() {
    $$('[data-act="fav"]').forEach((btn) => {
      const on = favorites.has(btn.dataset.id);
      btn.classList.toggle('on', on);
      btn.textContent = on ? (btn.dataset.on || '已收藏') : (btn.dataset.off || '收藏');
    });
  }

  function toast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast('对比摘要已复制')).catch(() => fallbackCopy(text));
    } else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast('对比摘要已复制'); } catch (err) { toast('复制失败，请手动选择文本'); }
    document.body.removeChild(ta);
  }
  function compareText() {
    const models = state.compare.map((id) => MODEL_BY_ID[id]).filter(Boolean);
    if (!models.length) return '';
    const lines = ['三角钢琴对比 · GGPRD 全球三角钢琴评测数据库', ''];
    models.forEach((m) => {
      lines.push(`${m.brandZh} ${m.model}（${m.brand} · ${m.series}）`);
      lines.push(`  ${m.tier} · ${m.cm}cm · ${priceRange(m)} · ${m.madeIn}`);
      lines.push(`  优势：${prosFor(m).join('；')}`);
      lines.push(`  注意：${consFor(m).join('；')}`);
      lines.push('');
    });
    lines.push('价格为参考区间，非报价；评分与优劣为编辑判断。');
    return lines.join('\n');
  }

  function expandPrice() {
    const b = budgetBounds();
    const pad = Math.max(5, Math.round((b.hi - b.lo) * 0.25));
    state.priceBands = [];
    state.priceMin = Math.max(0, b.lo - pad);
    state.priceMax = b.hi + pad;
    renderPriceView();
    toast('预算已放宽');
  }

  function resetPrice() {
    state.priceMin = 30; state.priceMax = 60;
    state.priceBands = [];
    state.priceTiers = [];
    state.priceSizes = [];
    state.priceOrigins = [];
    state.priceBrand = ''; state.tier = 'all'; state.size = 'all'; state.origin = 'all'; state.q = '';
    searchInput.value = '';
    renderPriceView();
    renderChrome();
  }

  function addAllFavoritesToCompare() {
    const list = MODELS.filter((m) => favorites.has(m.id) && !m.quote).sort((a, b) => tierRank(a.tier) - tierRank(b.tier) || a.mid - b.mid);
    if (!list.length) { toast('特别版为定制询价，暂不参与价格对比'); return; }
    state.compare = list.slice(0, 10).map((m) => m.id);
    state.compareBarHidden = false;
    syncCompareButtons();
    renderChrome();
    setView('compare');
    if (list.length > 10) toast('已加入前 10 台；对比台最多 10 台');
  }

  function handleAction(act, id, el) {
    if (act === 'detail') { openDetail(id); return; }
    if (act === 'compare') { toggleCompare(id); return; }
    if (act === 'peers') { startPeerCompare(id); return; }
    if (act === 'fav') { toggleFav(id); return; }
    if (act === 'remove-compare') { removeCompare(id); return; }
    if (act === 'close-modal') { closeModal(); return; }
    if (act === 'clear-compare') { state.compare = []; state.compareBarHidden = false; syncCompareButtons(); renderChrome(); renderCompareView(); toast('对比台已清空'); return; }
    if (act === 'hide-compare-bar') { state.compareBarHidden = true; renderCompareBar(); toast('对比台已收起，可在对比菜单重新打开'); return; }
    if (act === 'copy-compare') { copyText(compareText()); return; }
    if (act === 'print') { window.print(); return; }
    if (act === 'scroll-compare') {
      const grid = $('#compareGrid');
      if (grid) grid.scrollBy({ left: Number(el.dataset.dir || 1) * Math.max(280, grid.clientWidth * 0.7), behavior: 'smooth' });
      return;
    }
    if (act === 'clear-favs') { favorites = new Set(); notes = {}; priorities = {}; saveFavorites(); saveNotes(); savePriorities(); renderChrome(); renderShortlist(); toast('短名单已清空'); return; }
    if (act === 'clear-bands') { state.priceBands = []; renderPriceView(); return; }
    if (act === 'export-shortlist') { exportShortlistCsv(); return; }
    if (act === 'print-shortlist') { window.print(); return; }
    if (act === 'add-all-favs') { addAllFavoritesToCompare(); return; }
    if (act === 'reset-price') { resetPrice(); return; }
    if (act === 'widen-price') { expandPrice(); return; }
    if (act === 'clear-search') { state.q = ''; searchInput.value = ''; renderBrandView(); renderChrome(); return; }
    if (act === 'reset-brand-filter') { state.q = ''; state.tier = 'all'; searchInput.value = ''; renderBrandView(); renderChrome(); return; }
    if (act === 'goto-price') { setView('price'); return; }
    if (act === 'brand-price') {
      const brand = BRANDS.find((b) => b.id === id);
      if (!brand) return;
      const range = brandPriceRange(brand);
      state.priceBrand = brand.id;
      state.priceMin = Math.floor(range.low);
      state.priceMax = Math.ceil(range.high);
      state.tier = 'all'; state.size = 'all';
      setView('price');
      return;
    }
    if (act === 'brand-compare') {
      const brand = BRANDS.find((b) => b.id === id);
      if (!brand) return;
      const ms = brandModels(brand).slice().sort((a, b) => b.cm - a.cm);
      const picks = ms.filter((m) => m.cm >= 185).slice(0, 2);
      state.compare = (picks.length >= 2 ? picks : ms.slice(0, 2)).map((m) => m.id);
      syncCompareButtons();
      setView('compare');
      return;
    }
  }

  /* ---------- 全局事件 ---------- */
  document.addEventListener('click', (e) => {
    if (e.target.closest('a[target="_blank"]')) return;
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) {
      e.preventDefault();
      state.q = '';
      searchInput.value = '';
      if (viewBtn.dataset.view === 'brand') state.brand = null;
      setView(viewBtn.dataset.view);
      return;
    }

    const about = e.target.closest('[data-open-about]');
    if (about) { e.preventDefault(); openAbout(); return; }

    const tierBtn = e.target.closest('[data-tier-filter]');
    if (tierBtn) {
      e.preventDefault();
      const t = tierBtn.dataset.tierFilter;
      if (state.view === 'price') {
        togglePriceFilter('priceTiers', t);
        renderPriceView();
        renderChrome();
        return;
      }
      state.tier = state.tier === t ? 'all' : t;
      if (state.view === 'brand') {
        state.brand = null;
        state.q = ''; searchInput.value = '';
        renderBrandView();
      } else if (state.view === 'price') renderPriceView();
      else { state.brand = null; setView('brand'); }
      renderChrome();
      return;
    }

    const sizeBtn = e.target.closest('[data-size]');
    if (sizeBtn) {
      togglePriceFilter('priceSizes', sizeBtn.dataset.size);
      renderPriceView();
      return;
    }

    const styleMore = e.target.closest('[data-style-expand]');
    if (styleMore) {
      e.preventDefault();
      const key = styleMore.dataset.styleExpand;
      state.styleExpanded[key] = !state.styleExpanded[key];
      renderStyleView();
      return;
    }

    const originBtn = e.target.closest('[data-origin]');
    if (originBtn) {
      if (state.view === 'price') {
        togglePriceFilter('priceOrigins', originBtn.dataset.origin);
        renderPriceView();
        renderChrome();
        return;
      }
      state.origin = originBtn.dataset.origin;
      if (state.view === 'style') renderStyleView();
      else renderStyleView();
      renderChrome();
      return;
    }

    const presetPrice = e.target.closest('[data-price-preset]');
    if (presetPrice) {
      const pair = presetPrice.dataset.pricePreset.split(',').map(Number);
      const bands = (state.priceBands || []).slice();
      const idx = bands.findIndex((b) => b[0] === pair[0] && b[1] === pair[1]);
      if (idx >= 0) bands.splice(idx, 1);
      else bands.push(pair);
      state.priceBands = bands.sort((a, b) => a[0] - b[0]);
      if (state.priceBands.length) {
        state.priceMin = Math.min.apply(null, state.priceBands.map((b) => b[0]));
        state.priceMax = Math.max.apply(null, state.priceBands.map((b) => b[1]));
      }
      renderPriceView();
      return;
    }
    const removeBand = e.target.closest('[data-remove-band]');
    if (removeBand) {
      const pair = removeBand.dataset.removeBand.split(',').map(Number);
      state.priceBands = (state.priceBands || []).filter((b) => !(b[0] === pair[0] && b[1] === pair[1]));
      if (state.priceBands.length) {
        state.priceMin = Math.min.apply(null, state.priceBands.map((b) => b[0]));
        state.priceMax = Math.max.apply(null, state.priceBands.map((b) => b[1]));
      }
      renderPriceView();
      return;
    }

    const presetCompare = e.target.closest('[data-preset]');
    if (presetCompare) {
      const p = COMPARE_PRESETS[Number(presetCompare.dataset.preset)];
      if (!p) return;
      const ms = presetModels(p);
      if (ms.length < 2) { toast('预设型号未找到'); return; }
      state.compare = ms.map((m) => m.id);
      syncCompareButtons();
      setView('compare');
      return;
    }

    const brandBtn = e.target.closest('[data-brand]');
    if (brandBtn) {
      e.preventDefault();
      selectBrand(brandBtn.dataset.brand || null);
      return;
    }

    const actBtn = e.target.closest('[data-act]');
    if (actBtn) {
      e.preventDefault();
      handleAction(actBtn.dataset.act, actBtn.dataset.id, actBtn);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.dataset && e.target.dataset.priority) {
      const id = e.target.dataset.priority;
      if (e.target.value) priorities[id] = e.target.value; else delete priorities[id];
      savePriorities();
      renderShortlist();
      return;
    }
    if (e.target.id === 'brandFilter') {
      state.priceBrand = e.target.value;
      if (state.priceBrand) {
        const brand = BRANDS.find((b) => b.id === state.priceBrand);
        if (brand) {
          const range = brandPriceRange(brand);
          const b = budgetBounds();
          if (state.tier !== 'all' && brand.tier !== state.tier) {
            state.tier = 'all';
            toast(`已切换到全部等级，显示 ${brand.zh} 的型号`);
          }
          if (b.hi < range.low || b.lo > range.high) {
            state.priceBands = [];
            state.priceMin = Math.floor(range.low);
            state.priceMax = Math.ceil(range.high);
            toast(`${brand.zh} 的参考价在 ${fmtNum(range.low)}–${fmtNum(range.high)} 万，已调整预算`);
          }
        }
      }
      renderPriceView();
      renderChrome();
      const picked = state.priceBrand ? BRANDS.find((x) => x.id === state.priceBrand) : null;
      toast(picked ? `已筛选 ${picked.zh}` : '已显示全部品牌');
      return;
    }
    if (e.target.id === 'sortSel') {
      applySort(e.target.value);
      return;
    }
    if (e.target.id === 'priceMin' || e.target.id === 'priceMax') {
      state.priceBands = [];
      normalizeBudgetInputs(e.target.id);
      renderPriceView();
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.dataset && e.target.dataset.note) {
      const id = e.target.dataset.note;
      notes[id] = e.target.value;
      saveNotes();
      return;
    }
    if (e.target.id === 'sortSel') {
      applySort(e.target.value);
      return;
    }
    if (e.target.id === 'priceMin' || e.target.id === 'priceMax') {
      state.priceBands = [];
      const lo = Number(e.target.value);
      if (!isFinite(lo)) return;
      if (e.target.id === 'priceMin') state.priceMin = clamp(lo, 0, 400);
      else state.priceMax = clamp(lo, 0, 400);
      schedulePriceResults();
    }
  });

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    state.q = q;
    if (q) state.brand = null;
    if (state.view !== 'brand') {
      setView('brand', { noScroll: true });
    } else {
      renderBrandView();
    }
    renderChrome();
    if (q) {
      const count = MODELS.filter((m) => {
        const hay = searchHay(m);
        return hay.indexOf(q.toLowerCase()) !== -1;
      }).length;
      if (count === 0) toast('没有匹配结果，试试更短的关键词');
    }
  });
  searchInput.addEventListener('search', () => {
    if (!searchInput.value) { state.q = ''; renderBrandView(); renderChrome(); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalRoot.innerHTML) { closeModal(); return; }
      if (state.q) { state.q = ''; searchInput.value = ''; renderBrandView(); renderChrome(); }
    }
    if (e.key === '/' && document.activeElement !== searchInput && !modalRoot.innerHTML) {
      e.preventDefault(); searchInput.focus();
    }
  });

  window.addEventListener('pointermove', onComparePointerMove, { passive: false });
  window.addEventListener('pointerup', endCompareDrag);
  window.addEventListener('pointercancel', endCompareDrag);

  modalRoot.addEventListener('click', (e) => {
    if (e.target.matches('[data-modal-overlay]')) closeModal();
  });

  $('#goCompare').addEventListener('click', () => setView('compare'));
  $('#aboutBtn').addEventListener('click', openAbout);
  if (langToggle) langToggle.addEventListener('click', () => setLanguage(state.lang === 'en' ? 'zh' : 'en'));

  function normalizeBudgetInputs(source) {
    let lo = Number(state.priceMin), hi = Number(state.priceMax);
    if (!isFinite(lo)) lo = 0;
    if (!isFinite(hi)) hi = 400;
    lo = clamp(lo, 0, 400); hi = clamp(hi, 0, 400);
    if (lo > hi) {
      if (source === 'priceMin') hi = lo;
      else lo = hi;
    }
    state.priceMin = lo; state.priceMax = hi;
  }

  /* ---------- 初始化 ---------- */
  try { const savedLang = localStorage.getItem('pianoAtlasLang'); if (savedLang === 'en') state.lang = 'en'; } catch (err) { /* ignore */ }
  renderChrome();
  setView('brand', { noScroll: true });

  // 供无头测试与调试使用
  window.__PIANO_ATLAS__ = { BRANDS, MODELS, state, TIERS };
})();
