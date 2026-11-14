/* 继续扩充典藏款：新增 25 款，按 classic 指数插入。 */
const SPECIAL_EXTRA = [
  {
    brand: 'bechstein', models: [
      { model: 'D 282 Sphinx', cm: 282, quote: true, classic: 99, sig: 'D 282 的黄金斯芬克斯艺术版本，雕刻与金箔均为手工完成', tags: ['Sphinx', '金箔'], official: 'https://www.bechstein.cn/product/sphinx-fluegel.php', noPhoto: true },
      { model: 'B 212 Louis XV', cm: 212, quote: true, classic: 81, sig: '路易十五风格琴壳与描金细节，B 212 的宫廷艺术版本', tags: ['Louis XV', '描金'], official: 'https://www.bechstein.cn/product/louis-xv.php', noPhoto: true }
    ]
  },
  {
    brand: 'steinway', models: [
      { model: 'D-274 African Pommele', cm: 274, quote: true, classic: 97, sig: 'Crown Jewel 非洲桃花心木纹理，D-274 的收藏级外观', tags: ['Crown Jewel', 'African Pommele'], official: 'https://www.steinway.com/pianos/steinway/grand/model-d', photo: 'crownAfrican' },
      { model: 'D-274 Kewazinga Bubinga', cm: 274, quote: true, classic: 95, sig: 'Crown Jewel Kewazinga 木皮，D-274 的收藏级外观', tags: ['Crown Jewel', 'Kewazinga'], official: 'https://www.steinway.com/pianos/steinway/grand/model-d', photo: 'crownKewazinga' },
      { model: 'B-211 East Indian Rosewood', cm: 211, quote: true, classic: 93, sig: 'Crown Jewel 东印度玫瑰木，B-211 的收藏级外观', tags: ['Crown Jewel', 'Rosewood'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'crownRosewood' },
      { model: 'O-180 Figured Sycamore', cm: 180, quote: true, classic: 91, sig: 'Crown Jewel 花纹枫木，O-180 的收藏级外观', tags: ['Crown Jewel', 'Sycamore'], official: 'https://www.steinway.com/pianos/steinway/grand/model-o', photo: 'crownSycamore' },
      { model: 'D-274 Lang Lang Black Diamond', cm: 274, quote: true, classic: 89.5, sig: '郎朗与 Dakota Jackson 合作的 Black Diamond 限量版，金属黑漆面与 Spirio | r 系统', tags: ['Black Diamond', 'Lang Lang', '限量'], official: 'https://eu.steinway.com/en/pianos/steinway-limited-editions/black-diamond/', photo: 'blackDiamond' },
      { model: 'B-211 Lang Lang Black Diamond', cm: 211, quote: true, classic: 88.5, sig: 'Black Diamond 限量版 B-211，全球 88 台，配 Spirio | r 系统', tags: ['Black Diamond', 'Lang Lang', '限量'], official: 'https://eu.steinway.com/en/pianos/steinway-limited-editions/black-diamond/', photo: 'blackDiamond' }
    ]
  },
  {
    brand: 'bosendorfer', models: [
      { model: '290 Beethoven', cm: 290, quote: true, classic: 85, sig: '贝多芬主题艺术漆面，290 Imperial 的收藏级版本', tags: ['Beethoven', '艺术漆面'], official: 'https://www.boesendorfer.com/en', noPhoto: true },
      { model: '290 Chopin', cm: 290, quote: true, classic: 83, sig: '肖邦主题艺术漆面与手工细节，290 Imperial 的收藏级版本', tags: ['Chopin', '艺术漆面'], official: 'https://www.boesendorfer.com/en', noPhoto: true },
      { model: '290 Liszt', cm: 290, quote: true, classic: 75, sig: '李斯特主题艺术漆面，290 Imperial 的收藏级版本', tags: ['Liszt', '艺术漆面'], official: 'https://www.boesendorfer.com/en', noPhoto: true },
      { model: '290 Vienna', cm: 290, quote: true, classic: 65, sig: '维也纳主题艺术琴壳，290 Imperial 的城市收藏版', tags: ['Vienna', '艺术琴壳'], official: 'https://www.boesendorfer.com/en', noPhoto: true }
    ]
  },
  {
    brand: 'bluthner', models: [
      { model: 'Model 1 Julius Blüthner Edition', cm: 280, quote: true, classic: 79, sig: 'Julius Blüthner 纪念版琴壳与手工细节，Model 1 的收藏级版本', tags: ['Julius Blüthner', '纪念版'], official: 'https://bluthner.co.uk/', noPhoto: true },
      { model: 'Model 2 Queen Victoria', cm: 238, quote: true, classic: 73, sig: '维多利亚风格琴壳与描金，Model 2 的宫廷艺术版本', tags: ['Queen Victoria', '宫廷琴壳'], official: 'https://bluthner.co.uk/', noPhoto: true },
      { model: 'Model 4 Louis XIV', cm: 210, quote: true, classic: 63, sig: '路易十四风格琴壳与手工木皮，Model 4 的宫廷艺术版本', tags: ['Louis XIV', '宫廷琴壳'], official: 'https://bluthner.co.uk/', noPhoto: true }
    ]
  },
  {
    brand: 'fazioli', models: [
      { model: 'Gold Leaf (F212)', cm: 212, quote: true, classic: 89, sig: '金箔艺术琴壳与 Fazioli 透明音色，F212 的定制版本', tags: ['Gold Leaf', '金箔'], official: 'https://www.fazioli.com/en/special-models/gold-leaf/', photo: 'fazioliGold' },
      { model: 'M. Liminal (F228)', cm: 228, quote: true, classic: 87, sig: 'M. Liminal 艺术琴壳与 F228 的清晰音色', tags: ['M. Liminal', '艺术琴壳'], official: 'https://www.fazioli.com/en/special-models/m-liminal-2/', photo: 'fazioliLiminal' },
      { model: 'Macassar (F278)', cm: 278, quote: true, classic: 77, sig: '马卡萨木皮与 F278 的音乐会规模', tags: ['Macassar', '木皮'], official: 'https://www.fazioli.com/en/special-models/macassar-2/', photo: 'fazioliMacassar' },
      { model: 'Olive (F212)', cm: 212, quote: true, classic: 71, sig: '橄榄木艺术琴壳与 F212 的透明音色', tags: ['Olive', '木皮'], official: 'https://www.fazioli.com/en/special-models/olive-2/', photo: 'fazioliOlive' },
      { model: 'Walnut Strauss (F278)', cm: 278, quote: true, classic: 61, sig: '胡桃木与施特劳斯主题艺术琴壳，F278 的定制版本', tags: ['Walnut Strauss', '胡桃木'], official: 'https://www.fazioli.com/en/special-models/walnut-strauss-2/', photo: 'fazioliWalnut' },
      { model: 'Silver (F228)', cm: 228, quote: true, classic: 53, sig: '银色艺术漆面与 F228 的清晰音色', tags: ['Silver', '银色漆面'], official: 'https://www.fazioli.com/en/special-models/silver-2/', photo: 'fazioliSilver' }
    ]
  },
  {
    brand: 'schimmel', models: [
      { model: 'K 213 Otmar Alt', cm: 213, quote: true, classic: 69, sig: 'Otmar Alt 联名艺术琴壳，K 213 的设计特别版', tags: ['Otmar Alt', '设计联名'], official: 'https://www.schimmel-pianos.de/en/', noPhoto: true }
    ]
  },
  {
    brand: 'petrof', models: [
      { model: 'P 173 Breeze Chippendale', cm: 173, quote: true, classic: 67, sig: '齐彭代尔风格琴壳，P 173 Breeze 的艺术版本', tags: ['Chippendale', '艺术琴壳'], official: 'https://www.petrof.com/grand-piano-p-173-breeze-chippendale', photo: 'petrofChippendale' },
      { model: 'P 173 Breeze Klasik', cm: 173, quote: true, classic: 59, sig: '古典风格琴壳与手工细节，P 173 Breeze 的艺术版本', tags: ['Klasik', '艺术琴壳'], official: 'https://www.petrof.com/grand-piano-p-173-breeze-klasic', photo: 'petrofKlasik' }
    ]
  },
  {
    brand: 'haessler', series: {
      name: 'Art Case 特别版', note: '博兰斯勒家族艺术琴壳，按订单定制', madeIn: '德国',
      highlight: 'Haessler 的宫廷艺术琴壳', tradeoff: '交期与价格需单独确认', tags: ['特别版', 'Art Case']
    }, models: [
      { model: 'H 186 Louis XV', cm: 186, quote: true, classic: 57, sig: '路易十五风格琴壳与描金，H 186 的宫廷艺术版本', tags: ['Louis XV', '描金'], official: 'https://bluthner.co.uk/', noPhoto: true }
    ]
  },
  {
    brand: 'roenisch', series: {
      name: 'Carl Rönisch Edition', note: 'Carl Rönisch 纪念版木皮与细节', madeIn: '德国',
      highlight: 'Rönisch 的纪念版木皮', tradeoff: '特殊木皮，价格需确认', tags: ['特别版', '纪念版']
    }, models: [
      { model: '186 Carl Rönisch Edition', cm: 186, quote: true, classic: 55, sig: 'Carl Rönisch 纪念版树瘤木皮，186 的收藏级外观', tags: ['Carl Rönisch', '树瘤木皮'], official: 'https://www.roenisch-pianos.de/', noPhoto: true }
    ]
  },
  {
    brand: 'essex', series: {
      name: 'French Provincial', note: 'Essex 法式乡村艺术琴壳', madeIn: '中国',
      highlight: 'Essex 的法式艺术琴壳', tradeoff: '特殊外观，价格需确认', tags: ['特别版', '法式']
    }, models: [
      { model: 'EGP-173 French Provincial', cm: 173, quote: true, classic: 51, sig: '法式乡村风格琴壳，EGP-173 的外观特别版', tags: ['French Provincial', '法式'], official: 'https://www.steinway.com/pianos/essex/grand', noPhoto: true }
    ]
  }
];

SPECIAL_EXTRA.forEach((group) => {
  if (!SPECIAL_MODELS[group.brand]) {
    SPECIAL_MODELS[group.brand] = Object.assign({ name: '特别版', note: '定制特别版', madeIn: '—', highlight: '定制外观', tradeoff: '价格需确认', tags: ['特别版'] }, group.series || {}, { models: [] });
  }
  group.models.forEach((m) => SPECIAL_MODELS[group.brand].models.push(m));
});
