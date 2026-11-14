/* 品牌元信息、官网链接与特别版型号 */

/* 用户指定的主观分级与顺序；不代表任何客观排名。 */
const BRAND_ORDER = [
  ['bechstein', 'Perfect'], ['steinway', 'Perfect'], ['fazioli', 'Perfect'], ['bosendorfer', 'Perfect'], ['steingraeber', 'Perfect'],
  ['estonia', 'Prime'], ['shigeru', 'Prime'], ['grotrian', 'Prime'], ['bluthner', 'Prime'], ['yamaha-cf', 'Prime'], ['henrymason', 'Prime'], ['sauter', 'Prime'],
  ['haessler', 'Premier'], ['petrof', 'Premier'], ['schimmel', 'Premier'], ['roenisch', 'Premier'], ['augustfoerster', 'Premier'], ['seiler', 'Premier'], ['schulze', 'Premier'], ['boston', 'Premier'],
  ['baldwin', 'Passable'], ['kawai', 'Passable'], ['yamaha', 'Passable'], ['steinberg', 'Passable'], ['kayserburg', 'Passable'], ['hoffmann', 'Passable'], ['wilhelmgrotrian', 'Passable'], ['zimmermann', 'Passable'], ['ritmuller', 'Passable'], ['essex', 'Passable'], ['pearlriver', 'Passable'], ['apollo', 'Passable'], ['rosler', 'Passable'], ['irmler', 'Passable'],
  ['toyama', 'Pedestrian'], ['yangzi', 'Pedestrian'], ['samick', 'Pedestrian'], ['youngchang', 'Pedestrian'], ['hsinghai', 'Pedestrian'], ['hailun', 'Pedestrian'], ['steinburg', 'Pedestrian'], ['prince', 'Pedestrian'], ['carod', 'Pedestrian']
];

/* 编辑评分底稿：1–5，最终会按价格带压缩，同价位不会拉得太开。 */
const RATING_OVERRIDES = {
  bechstein: [4.8, 4.7, 4.6, 4.8, 4.8],
  steinway: [4.9, 4.8, 4.8, 4.8, 4.9],
  fazioli: [4.9, 4.8, 4.8, 4.8, 4.5],
  bosendorfer: [4.8, 4.5, 4.5, 4.8, 4.6],
  steingraeber: [4.8, 4.6, 4.5, 4.8, 4.2],
  estonia: [4.5, 4.4, 4.2, 4.5, 4.0],
  shigeru: [4.3, 4.3, 4.3, 4.5, 4.2],
  grotrian: [4.5, 4.4, 4.2, 4.5, 4.0],
  bluthner: [4.6, 4.4, 4.2, 4.7, 4.2],
  'yamaha-cf': [4.5, 4.7, 4.6, 4.6, 4.6],
  henrymason: [4.4, 4.1, 4.5, 4.5, 4.0],
  sauter: [4.2, 4.2, 4.0, 4.5, 3.8],
  haessler: [4.0, 4.0, 3.8, 4.1, 3.6],
  petrof: [3.7, 3.6, 3.6, 3.7, 3.3],
  schimmel: [3.8, 4.0, 3.7, 4.0, 3.6],
  roenisch: [3.9, 3.9, 3.8, 4.1, 3.5],
  augustfoerster: [4.5, 4.4, 4.3, 4.7, 4.1],
  seiler: [3.7, 3.7, 3.6, 4.0, 3.3],
  schulze: [3.7, 3.6, 3.4, 3.7, 3.0],
  boston: [3.3, 3.6, 3.3, 3.6, 3.9],
  baldwin: [3.4, 3.5, 3.3, 3.5, 3.6],
  kawai: [3.5, 4.0, 3.5, 3.7, 4.0],
  yamaha: [3.3, 3.7, 3.6, 4.0, 4.3],
  steinberg: [3.5, 3.5, 3.3, 3.6, 3.2],
  kayserburg: [3.1, 3.1, 2.9, 3.1, 2.8],
  hoffmann: [3.5, 3.5, 3.3, 3.6, 3.2],
  zimmermann: [2.9, 2.9, 2.7, 2.9, 2.5],
  wilhelmgrotrian: [3.0, 3.0, 2.7, 3.0, 2.4],
  ritmuller: [3.0, 3.0, 2.8, 3.0, 2.7],
  essex: [3.2, 3.4, 3.1, 3.3, 3.5],
  pearlriver: [2.7, 2.7, 2.4, 2.6, 2.3],
  apollo: [2.8, 2.8, 2.6, 2.8, 2.3],
  rosler: [3.3, 3.3, 3.2, 3.4, 3.0],
  irmler: [3.3, 3.3, 3.1, 3.3, 2.9],
  toyama: [2.5, 2.6, 2.3, 2.5, 2.2],
  yangzi: [2.2, 2.2, 2.0, 2.2, 1.9],
  samick: [2.6, 2.5, 2.3, 2.5, 2.2],
  youngchang: [2.5, 2.5, 2.2, 2.5, 2.2],
  hsinghai: [2.4, 2.4, 2.2, 2.4, 2.1],
  hailun: [2.8, 2.9, 2.6, 2.8, 2.5],
  steinburg: [2.3, 2.3, 2.1, 2.3, 2.0],
  prince: [2.1, 2.1, 1.9, 2.1, 1.8],
  carod: [2.2, 2.2, 2.0, 2.2, 1.9]
};

/* 这些系列没有对应系列图，宁可空缺也不混用。 */
const SERIES_NO_PHOTO = {
  bechstein: ['Academy'],
  bosendorfer: ['Classic 系列'],
  schimmel: ['Classic', 'Wilhelm Schimmel'],
  kawai: ['GL 系列'],
  hoffmann: ['Tradition', 'Vision']
};

/* 系列级配图：同一品牌不同系列不再互相借用。 */
const SERIES_PHOTOS = {
  bechstein: { 'Academy': 'bechsteinAcademy' },
  bosendorfer: { 'Classic 系列': 'bosClassic' },
  kawai: { 'GL 系列': 'kawaiGL' },
  schimmel: { 'Classic': 'schimmelClassic', 'Wilhelm Schimmel': 'schimmelWilhelm' },
  hoffmann: { 'Tradition': 'hoffmannTradition', 'Vision': 'hoffmannVision' },
  yamaha: { 'CX 系列': 'yamahaCX', 'SX 系列': 'yamahaSX', 'GC / GB 系列': 'yamahaGC' },
  zimmermann: { 'Studio / Z 系列': 'zimmermann' },
  rosler: { 'Grands': 'rosler' },
  apollo: { 'NA 系列': 'apolloNA' },
  hsinghai: { 'XG 系列': 'xinghai' },
  samick: { 'SIG 系列': 'samick' },
  youngchang: { 'Y 系列': 'youngchang' },
  toyama: { 'Grands': 'toyama' }
};

/* 品牌保值/二手流通：按国内二手市场认知单独评估，不随新琴价格自动抬升。 */
const RESALE_SCORES = {
  steinway: 4.9, bechstein: 4.6, bosendorfer: 4.2, fazioli: 3.9, steingraeber: 3.9,
  bluthner: 4.1, grotrian: 4.0, augustfoerster: 3.4, henrymason: 3.2, sauter: 3.6,
  estonia: 3.7, shigeru: 3.6, 'yamaha-cf': 3.4, yamaha: 4.1,
  kawai: 3.8, boston: 3.6, essex: 3.1, petrof: 3.2, schimmel: 3.5,
  seiler: 2.9, schulze: 2.8, haessler: 3.0, roenisch: 2.7, hoffmann: 2.7,
  zimmermann: 2.2, baldwin: 2.7, steinberg: 2.6, wilhelmgrotrian: 2.3,
  rosler: 2.5, irmler: 2.6, kayserburg: 2.4, ritmuller: 2.3, pearlriver: 2.7,
  samick: 2.3, youngchang: 2.2, yangzi: 2.3, hailun: 2.4, toyama: 1.9,
  hsinghai: 2.0, steinburg: 1.7, prince: 1.8, carod: 1.7
};

const BRAND_META = {
  bechstein: {
    official: 'https://www.bechstein.com/en/', officialLabel: 'C. Bechstein 官网',
    photo: 'bechstein', logo: 'bechstein', photoCredit: 'C. Bechstein 官网', heroPhoto: false, detailPhoto: false,
    toneTags: ['温暖', '层次丰富', '歌唱性'], musicTags: ['德奥浪漫派', '室内乐', '独奏'],
    resaleAdj: 0.02
  },
  steinway: {
    official: 'https://www.steinway.com/pianos/steinway/grand', officialLabel: 'Steinway & Sons 官网',
    photo: 'steinway', logo: 'steinway', photoCredit: 'Steinway & Sons 官网',
    toneTags: ['开放', '中频突出', '强投射'], musicTags: ['协奏曲', '独奏', '爵士'],
    resaleAdj: 0.06,
    modelLinks: {
      'D-274': 'https://www.steinway.com/pianos/steinway/grand/model-d',
      'C-227': 'https://www.steinway.com/pianos/steinway/grand/model-c',
      'B-211': 'https://www.steinway.com/pianos/steinway/grand/model-b',
      'A-188': 'https://www.steinway.com/pianos/steinway/grand/model-a',
      'O-180': 'https://www.steinway.com/pianos/steinway/grand/model-o',
      'M-170': 'https://www.steinway.com/pianos/steinway/grand/model-m',
      'S-155': 'https://www.steinway.com/pianos/steinway/grand/model-s'
    }
  },
  bosendorfer: {
    official: 'https://www.boesendorfer.com/en', officialLabel: 'Bösendorfer 官网',
    photo: 'bosendorfer', logo: 'bosendorfer', photoCredit: 'Bösendorfer 官网',
    toneTags: ['暗色', '浑厚', '长延音'], musicTags: ['浪漫派', '室内乐', '录音'],
    resaleAdj: 0.02
  },
  estonia: {
    official: 'https://www.estoniapiano.com/', officialLabel: 'Estonia 官网',
    photo: 'estonia', logo: 'estonia', photoCredit: 'Estonia 官网',
    toneTags: ['温暖', '木质', '歌唱性'], musicTags: ['古典', '室内乐', '家庭'],
    resaleAdj: 0.01
  },
  fazioli: {
    official: 'https://www.fazioli.com/en/', officialLabel: 'Fazioli 官网',
    photo: 'fazioli', logo: 'fazioli', photoCredit: 'Fazioli 官网',
    toneTags: ['透明', '清晰', '颗粒感'], musicTags: ['现代作品', '录音', '炫技'],
    resaleAdj: 0.02,
    modelLinks: {
      'F156': 'https://www.fazioli.com/en/grand-pianos/f156/',
      'F183': 'https://www.fazioli.com/en/grand-pianos/f183/',
      'F198': 'https://www.fazioli.com/en/grand-pianos/f198/',
      'F212': 'https://www.fazioli.com/en/grand-pianos/f212/',
      'F228': 'https://www.fazioli.com/en/grand-pianos/f228/',
      'F278': 'https://www.fazioli.com/en/grand-pianos/f278/',
      'F308': 'https://www.fazioli.com/en/grand-pianos/f308/'
    }
  },
  shigeru: {
    official: 'https://www.shigerukawai.com/', officialLabel: 'Shigeru Kawai 官网',
    photo: 'shigeru', logo: 'shigeru', photoCredit: 'Shigeru Kawai 官网',
    toneTags: ['中性', '干净', '控制力'], musicTags: ['古典', '爵士', '教学'],
    resaleAdj: 0.02,
    modelLinks: {
      'SK-EX': 'https://www.shigerukawai.com/shigeru/models/sk-ex',
      'SK-7': 'https://www.shigerukawai.com/shigeru/models/sk-7',
      'SK-6': 'https://www.shigerukawai.com/shigeru/models/sk-6',
      'SK-5': 'https://www.shigerukawai.com/shigeru/models/sk-5',
      'SK-3': 'https://www.shigerukawai.com/shigeru/models/sk-3',
      'SK-2': 'https://www.shigerukawai.com/shigeru/models/sk-2'
    }
  },
  grotrian: {
    official: 'https://www.grotrian.cn/', officialLabel: 'Grotrian 官网',
    photo: 'grotrian', logo: 'grotrian', photoCredit: 'Grotrian 官网',
    toneTags: ['木质', '通透', '声部清晰'], musicTags: ['古典', '室内乐', '沙龙'],
    resaleAdj: 0.01
  },
  steingraeber: {
    official: 'https://www.steingraeber.de/en/instrumente/grand-pianos/', officialLabel: 'Steingraeber 官网',
    photo: 'steingraeber', logo: 'steingraeber', photoCredit: 'Steingraeber 官网',
    toneTags: ['灵活', '细腻', '色彩丰富'], musicTags: ['德奥', '现代', '定制'],
    resaleAdj: 0.01
  },
  bluthner: {
    official: 'https://bluthner.co.uk/', officialLabel: 'Blüthner 官网',
    photo: 'bluthner', logo: 'bluthner', photoCredit: 'Blüthner 官网',
    toneTags: ['金色', '甜美', '圆润'], musicTags: ['浪漫派', '沙龙', '声乐'],
    resaleAdj: 0.01
  },
  'yamaha-cf': {
    official: 'https://usa.yamaha.com/products/musical_instruments/pianos/grand_pianos/cf_series/index.html', officialLabel: 'Yamaha CF 官网',
    photo: 'yamahacf', logo: 'yamaha', photoCredit: 'Yamaha 官网',
    toneTags: ['清晰', '精准', '强投射'], musicTags: ['现代', '爵士', '协奏'],
    resaleAdj: 0.04,
    modelLinks: {
      'CFX': 'https://usa.yamaha.com/products/musical_instruments/pianos/grand_pianos/cf_series/cfx.html',
      'CF6': 'https://usa.yamaha.com/products/musical_instruments/pianos/grand_pianos/cf_series/cf6.html',
      'CF4': 'https://usa.yamaha.com/products/musical_instruments/pianos/grand_pianos/cf_series/cf4.html'
    }
  },
  petrof: {
    official: 'https://www.petrof.com/petrof-grand-pianos', officialLabel: 'Petrof 官网',
    photo: 'petrof', logo: 'petrof', photoCredit: 'Petrof 官网',
    toneTags: ['温暖', '欧洲', '亲民'], musicTags: ['古典', '家庭', '教学'],
    resaleAdj: 0,
    modelLinks: {
      'P 284 Mistral': 'https://www.petrof.com/grand-piano-p-284-mistral',
      'P 237 Monsoon': 'https://www.petrof.com/grand-piano-p-237-monsoon',
      'P 210 Pasat': 'https://www.petrof.com/grand-piano-p-210-pasat',
      'P 194 Storm': 'https://www.petrof.com/grand-piano-p-194-storm',
      'P 173 Breeze': 'https://www.petrof.com/grand-piano-p-173-breeze',
      'P 159 Bora': 'https://www.petrof.com/grand-piano-p-159-bora'
    }
  },
  schimmel: {
    official: 'https://www.schimmel-pianos.de/en/', officialLabel: 'Schimmel 官网',
    photo: 'schimmel', logo: 'schimmel', photoCredit: 'Schimmel 官网',
    toneTags: ['干净', '精确', '现代'], musicTags: ['教学', '录音', '现代'],
    resaleAdj: 0,
    modelLinks: {
      'K 219': 'https://www.schimmel-pianos.de/en/grand-pianos/konzert/k-219/'
    }
  },
  sauter: {
    official: 'https://www.sauter-pianos.de/en/instruments/grand-pianos/', officialLabel: 'Sauter 官网',
    photo: 'sauter', logoText: 'SAUTER', photoCredit: 'Sauter 官网',
    toneTags: ['华丽', '扎实', '低音'], musicTags: ['古典', '沙龙', '独奏'],
    resaleAdj: 0
  },
  schulze: {
    official: 'https://www.schulzepollmann.com/', officialLabel: 'Schulze Pollmann 官网',
    photo: 'schulze', logo: 'schulze', photoCredit: 'Schulze Pollmann 官网',
    toneTags: ['意大利', '温暖', '木味'], musicTags: ['室内乐', '沙龙', '古典'],
    resaleAdj: 0
  },
  seiler: {
    official: 'https://www.seiler-pianos.com/seiler-grand-pianos', officialLabel: 'Seiler 官网',
    photo: 'seiler', logo: 'seiler', photoCredit: 'Seiler 官网',
    toneTags: ['清晰', '轻快', '高音光泽'], musicTags: ['家庭', '教学', '沙龙'],
    resaleAdj: 0
  },
  henrymason: {
    official: 'https://masonhamlin.com/', officialLabel: 'Mason & Hamlin 官网',
    photo: 'henrymason', logo: 'mason', photoCredit: 'Mason & Hamlin 官网',
    toneTags: ['美式', '厚声', '动态'], musicTags: ['协奏', '爵士', '美式'],
    resaleAdj: 0
  },
  boston: {
    official: 'https://www.steinway.com/pianos/boston/grand', officialLabel: 'Boston 官网',
    photo: 'boston', logoText: 'BOSTON', photoCredit: 'Boston 官网',
    toneTags: ['稳定', '中性', '好弹'], musicTags: ['教学', '家庭', '流行'],
    resaleAdj: 0.04,
    modelLinks: {
      'GP-215': 'https://www.steinway.com/pianos/boston/grand/gp-215-pe',
      'GP-193': 'https://www.steinway.com/pianos/boston/grand/gp-193-pe',
      'GP-178': 'https://www.steinway.com/pianos/boston/grand/gp-178-pe',
      'GP-163': 'https://www.steinway.com/pianos/boston/grand/gp-163-pe',
      'GP-156': 'https://www.steinway.com/pianos/boston/grand/gp-156-pe'
    }
  },
  kawai: {
    official: 'https://www.kawai-global.com/product/gx-3/', officialLabel: 'Kawai 官网',
    photo: 'kawai', logo: 'kawai', photoCredit: 'Kawai 官网',
    toneTags: ['中性', '稳定', '手感'], musicTags: ['教学', '爵士', '家庭'],
    resaleAdj: 0.04,
    modelLinks: {
      'GX-7': 'https://www.kawai-global.com/product/gx-7/',
      'GX-6': 'https://www.kawai-global.com/product/gx-6/',
      'GX-5': 'https://www.kawai-global.com/product/gx-5/',
      'GX-3': 'https://www.kawai-global.com/product/gx-3/',
      'GX-2': 'https://www.kawai-global.com/product/gx-2/',
      'GX-1': 'https://www.kawai-global.com/product/gx-1/',
      'GL-50': 'https://www.kawai-global.com/product/gl-50/',
      'GL-40': 'https://www.kawai-global.com/product/gl-40/',
      'GL-30': 'https://www.kawai-global.com/product/gl-30/',
      'GL-20': 'https://www.kawai-global.com/product/gl-20/',
      'GL-10': 'https://www.kawai-global.com/product/gl-10/'
    }
  },
  yamaha: {
    official: 'https://usa.yamaha.com/products/musical_instruments/pianos/grand_pianos/index.html', officialLabel: 'Yamaha 官网',
    photo: null, logo: 'yamaha', photoCredit: 'Yamaha 官网',
    toneTags: ['明亮', '稳定', '保值'], musicTags: ['流行', '爵士', '教学'],
    resaleAdj: 0.04
  },
  kayserburg: {
    official: 'https://kayserburg.pearlriverpiano.com/', officialLabel: 'Kayserburg 官网',
    photo: 'kayserburg', logo: 'kayserburg', photoCredit: 'Kayserburg 官网',
    toneTags: ['国产', '明亮', '配置'], musicTags: ['家庭', '教学', '流行'],
    resaleAdj: -0.02
  },
  hoffmann: {
    official: 'https://www.bechstein.com/en/upright-grand-pianos/whoffmann/', officialLabel: 'W. Hoffmann 官网',
    photo: 'hoffmann', logo: 'hoffmann', photoCredit: 'W. Hoffmann 官网',
    toneTags: ['欧洲', '均衡', '亲民'], musicTags: ['家庭', '古典', '教学'],
    resaleAdj: -0.01
  },
  zimmermann: {
    official: 'https://www.bechstein.cn/products?cid=7&style=2', officialLabel: 'Zimmermann 官网',
    photo: null, logo: null, logoText: 'ZIMMERMANN', photoCredit: 'C. Bechstein 官网',
    toneTags: ['入门', '明亮', '贝希斯坦设计'], musicTags: ['教学', '家庭', '练习'],
    resaleAdj: -0.02
  },
  ritmuller: {
    official: 'https://pearlriverpianogroup.com/ritmuller-pianos/', officialLabel: 'Ritmüller 官网',
    photo: 'ritmuller', logo: 'ritmuller', photoCredit: 'Ritmüller 官网',
    toneTags: ['德系名', '明亮', '性价比'], musicTags: ['家庭', '教学', '流行'],
    resaleAdj: -0.02
  },
  pearlriver: {
    official: 'https://pearlriverpianogroup.com/pianos/', officialLabel: 'Pearl River 官网',
    photo: 'pearlriver', logo: 'pearlriver', photoCredit: 'Pearl River 官网',
    toneTags: ['国产', '务实', '渠道'], musicTags: ['家庭', '教学', '机构'],
    resaleAdj: -0.03
  },
  samick: {
    official: 'https://samick.com/', officialLabel: 'Samick 官网',
    photo: null, logoText: 'SAMICK', photoCredit: 'Samick 官网',
    toneTags: ['入门', '基础'], musicTags: ['练习', '教学'], resaleAdj: -0.04
  },
  youngchang: {
    official: 'http://youngchang.com.cn/', officialLabel: 'Young Chang 官网',
    photo: null, logoText: 'YOUNG CHANG', photoCredit: 'Young Chang 官网',
    toneTags: ['入门', '轻'], musicTags: ['练习', '教学'], resaleAdj: -0.04
  },
  yangzi: {
    official: 'http://www2.yangtzeriver-pianos.com/', officialLabel: '长江钢琴官网',
    photo: 'yangzi', logo: 'yangzi', photoCredit: '长江钢琴官网',
    toneTags: ['预算', '基础'], musicTags: ['练习', '教学'], resaleAdj: -0.04
  },
  wilhelmgrotrian: {
    official: 'https://www.grotrian.cn/cn/piano/WilhelmGrotrian/WG/', officialLabel: 'Wilhelm Grotrian 官网',
    photo: null, logoText: 'WILHELM GROTRIAN', photoCredit: 'Grotrian 官网',
    toneTags: ['德系名', '国产', '外观'], musicTags: ['家庭', '教学'], resaleAdj: -0.03
  },
  prince: {
    official: 'http://www.dbpiano.com/', officialLabel: '东北钢琴（Prince）官网', photo: null, logoText: 'PRINCE',
    toneTags: ['低价', '入门'], musicTags: ['练习'], resaleAdj: -0.05
  },
  augustfoerster: {
    official: 'https://www.august-foerster.de/en/grand-pianos/', officialLabel: 'August Förster 官网',
    photo: 'augustfoerster', logo: null, logoText: 'AUGUST FÖRSTER', photoCredit: 'August Förster 官网',
    toneTags: ['温暖', '扎实', '歌唱性'], musicTags: ['德奥', '室内乐', '独奏'],
    resaleAdj: 0.01
  },
  haessler: {
    official: 'https://bluthner.co.uk/', officialLabel: 'Haessler / Blüthner 官网',
    photo: 'haessler', logoText: 'HAESSLER', photoCredit: 'Blüthner 官网',
    toneTags: ['温暖', '传统', '均衡'], musicTags: ['古典', '家庭', '教学'], resaleAdj: 0
  },
  roenisch: {
    official: 'https://www.roenisch-pianos.de/', officialLabel: 'Rönisch 官网',
    photo: null, logoText: 'RÖNISCH', photoCredit: 'Rönisch 官网',
    toneTags: ['传统', '温润', '德式'], musicTags: ['古典', '家庭', '教学'], resaleAdj: 0
  },
  baldwin: {
    official: 'https://www.baldwinpiano.com/', officialLabel: 'Baldwin 官网',
    photo: null, logoText: 'BALDWIN', photoCredit: 'Baldwin 官网',
    toneTags: ['美式', '温暖', '直白'], musicTags: ['流行', '爵士', '家庭'], resaleAdj: -0.01
  },
  steinberg: {
    official: 'http://www.wilh-steinberg.cn/', officialLabel: 'Wilh. Steinberg 官网',
    photo: null, logoText: 'WILH. STEINBERG', photoCredit: 'Wilh. Steinberg 官网',
    toneTags: ['温暖', '德产', '低调'], musicTags: ['古典', '家庭', '教学'], resaleAdj: -0.01
  },
  essex: {
    official: 'https://www.steinway.com/pianos/essex/grand', officialLabel: 'Essex 官网',
    photo: 'essex', logoText: 'ESSEX', photoCredit: 'Steinway & Sons 官网',
    toneTags: ['中性', '稳定', '好弹'], musicTags: ['教学', '家庭', '流行'], resaleAdj: 0.01
  },
  apollo: {
    official: 'http://www.apollo-piano.com/', officialLabel: 'Apollo / Toyo 官网',
    photo: null, logoText: 'APOLLO', photoCredit: 'Apollo 官网',
    toneTags: ['明亮', '亲民', '日系'], musicTags: ['教学', '家庭', '流行'],
    resaleAdj: -0.02
  },
  rosler: {
    official: 'http://roslerpiano.com/html/en/GrandPiano/', officialLabel: 'Rösler 官网',
    photo: null, logoText: 'RÖSLER', photoCredit: 'Rösler 官网',
    toneTags: ['欧洲', '温暖', '亲民'], musicTags: ['古典', '家庭', '教学'], resaleAdj: -0.01
  },
  irmler: {
    official: 'https://irmler-piano.com/', officialLabel: 'Irmler 官网',
    photo: 'irmler', logoText: 'IRMLER', photoCredit: 'Irmler 官网',
    toneTags: ['德系', '温暖', '均衡'], musicTags: ['古典', '家庭', '教学'], resaleAdj: -0.01
  },
  toyama: {
    official: 'http://www2.toyamamusic.com/', officialLabel: 'Toyama 官网',
    photo: null, logoText: 'TOYAMA', photoCredit: 'Toyama 官网',
    toneTags: ['入门', '明亮', '轻'], musicTags: ['练习', '教学', '家庭'], resaleAdj: -0.03
  },
  hsinghai: {
    official: 'https://www.xhpiano.com/', officialLabel: '星海钢琴官网',
    photo: null, logoText: 'HSINGHAI', photoCredit: '星海钢琴官网',
    toneTags: ['国产', '务实', '基础'], musicTags: ['教学', '机构', '练习'], resaleAdj: -0.04
  },
  hailun: {
    official: 'https://hailunpianoco.com/', officialLabel: 'Hailun 官网',
    photo: 'hailun', logoText: 'HAILUN', photoCredit: 'Hailun 官网',
    toneTags: ['国产', '明亮', '配置'], musicTags: ['家庭', '教学', '流行'], resaleAdj: -0.03
  },
  steinburg: {
    official: 'http://www.sterinborghpiano.com/', officialLabel: '斯坦伯格钢琴官网',
    photo: null, logoText: 'STEINBURG', photoCredit: '斯坦伯格钢琴官网',
    toneTags: ['入门', '配置', '低价'], musicTags: ['练习', '教学'], resaleAdj: -0.04
  },
  carod: {
    official: 'http://www.carodpiano.com/', officialLabel: '卡罗德钢琴官网',
    photo: null, logoText: 'CAROD', photoCredit: '卡罗德钢琴官网',
    toneTags: ['入门', '现代', '配置'], musicTags: ['练习', '教学', '家庭'], resaleAdj: -0.04
  },
};

const SPECIAL_MODELS = {
  bechstein: {
    name: 'Art Case 特别版', note: '手工雕刻、金箔与珍稀木皮，按订单定制', madeIn: '德国',
    highlight: '贝希斯坦 Art Case 的收藏级外观', tradeoff: '交期长，价格与配置需单独询价',
    tags: ['特别版', 'Art Case'], models: [
      { model: 'B 212 Sphinx', cm: 212, quote: true, classic: 96, sig: '黄金斯芬克斯雕刻与手工金箔，B 212 的收藏级艺术版本', tags: ['Sphinx', '金箔'], official: 'https://www.bechstein.cn/product/sphinx-fluegel.php', noPhoto: true },
      { model: 'D 282 Louis XV', cm: 282, quote: true, classic: 90, sig: '路易十五风格琴壳与描金细节，为音乐厅或宅邸定制', tags: ['Louis XV', '定制'], official: 'https://www.bechstein.cn/product/louis-xv.php', noPhoto: true },
      { model: 'B 212 Vogelaugenahorn', cm: 212, quote: true, classic: 62, sig: '鸟眼枫木琴壳与贝希斯坦手工整音，B 212 的珍稀木皮版本', tags: ['鸟眼枫木', '珍稀木皮'], official: 'https://www.bechstein.cn/product/vogelaugenahorn.php', noPhoto: true },
      { model: 'D 282 Sterling', cm: 282, quote: true, classic: 60, sig: '银色金属漆面与 Art Case 细节，D 282 的收藏级外观版本', tags: ['Sterling', '银色漆面'], official: 'https://www.bechstein.cn/product/sterling-fluegel.php', noPhoto: true }
    ]
  },
  steinway: {
    name: 'Crown Jewel 特别版', note: '珍稀木皮与 Art Case 外观，纽约/汉堡定制', madeIn: '美国 / 德国',
    highlight: '施坦威 Crown Jewel 的收藏级木皮', tradeoff: '价格与交期按木材和工艺单独确认',
    tags: ['特别版', 'Crown Jewel'], models: [
      { model: 'D-274 Crown Jewel', cm: 274, quote: true, classic: 98, sig: 'Crown Jewel 珍稀木皮系列，D-274 的收藏级外观版本', tags: ['Crown Jewel', '珍稀木皮'], official: 'https://www.steinway.com/pianos/steinway/grand/model-d', photo: 'crownJewel' },
      { model: 'B-211 Crown Jewel', cm: 211, quote: true, classic: 82, sig: 'Crown Jewel 珍稀木皮系列，B-211 的收藏级外观版本', tags: ['Crown Jewel', '珍稀木皮'], official: 'https://www.steinway.com/pianos/steinway/grand/model-b', photo: 'crownJewel' },
      { model: 'A-188 Crown Jewel', cm: 188, quote: true, classic: 80, sig: 'Crown Jewel 珍稀木皮系列，A-188 的收藏级外观版本', tags: ['Crown Jewel', '珍稀木皮'], official: 'https://www.steinway.com/pianos/steinway/grand/model-a', photo: 'crownJewel' }
    ]
  },
  bosendorfer: {
    name: 'Artisan / Art Case', note: '艺术漆面、绘画与手工镶嵌，按订单制作', madeIn: '奥地利',
    highlight: '贝森朵夫 Artisan 的绘画与镶嵌工艺', tradeoff: '定制周期长，价格需单独确认',
    tags: ['特别版', 'Art Case'], models: [
      { model: '290 Imperial Artisan', cm: 290, quote: true, classic: 94, sig: '97 键帝国大琴的 Artisan 艺术版本，漆面与镶嵌均为定制', tags: ['Artisan', '97键'], official: 'https://www.boesendorfer.com/en', noPhoto: true },
      { model: '290 Johann Strauss', cm: 290, quote: true, classic: 88, sig: '以约翰·施特劳斯命名的艺术漆面版本，290 Imperial 的收藏级外观', tags: ['Johann Strauss', '艺术漆面'], official: 'https://www.boesendorfer.com/en', noPhoto: true },
      { model: '290 Klimt', cm: 290, quote: true, classic: 86, sig: '克里姆特风格艺术漆面，290 Imperial 的维也纳艺术版本', tags: ['Klimt', '维也纳'], official: 'https://www.boesendorfer.com/en', photo: 'bosKlimt' },
      { model: '290 Camellia', cm: 290, quote: true, classic: 84, sig: '山茶花主题手绘艺术琴壳，290 Imperial 的东方花园版本', tags: ['Camellia', '手绘'], official: 'https://www.boesendorfer.com/en', photo: 'bosCamellia' }
    ]
  },
  bluthner: {
    name: 'Crystal / Art Case', note: '透明水晶琴壳、路易十四风格与手工木皮', madeIn: '德国',
    highlight: '博兰斯勒 Crystal 与宫廷艺术琴壳', tradeoff: '价格高、交期长，维护需专业团队',
    tags: ['特别版', 'Art Case'], models: [
      { model: 'Model 1 Crystal', cm: 280, quote: true, classic: 92, sig: '透明水晶琴壳与博兰斯勒金色音色的结合', tags: ['Crystal', '透明琴壳'], official: 'https://bluthner.co.uk/', photo: 'crystal' },
      { model: 'Model 1 Louis XIV', cm: 280, quote: true, classic: 78, sig: '路易十四风格琴壳、描金与手工木皮，Model 1 的宫廷艺术版本', tags: ['Louis XIV', '宫廷琴壳'], official: 'https://bluthner.co.uk/', noPhoto: true }
    ]
  },
  fazioli: {
    name: 'Art Case 特别版', note: 'Fazioli 的定制艺术琴壳，每一台均为单独委托', madeIn: '意大利',
    highlight: 'Fazioli Art Case 的绘画、木皮与漆面工艺', tradeoff: '均为单独委托，价格与交期需询价',
    tags: ['特别版', 'Art Case'], models: [
      { model: 'Marco Polo (F308)', cm: 308, quote: true, classic: 100, sig: 'F308 的 Marco Polo 定制版：红色高光漆面与 Canaletto 威尼斯风景手绘，纪念威尼斯与中国的古老联系', tags: ['Marco Polo', 'Canaletto'], official: 'https://www.fazioli.com/en/special-models/marco-polo-2/', photo: 'marcoPolo' },
      { model: 'Venetia (F278)', cm: 278, quote: true, classic: 76, sig: '以威尼斯为灵感的白色艺术琴壳，F278 的定制版本', tags: ['Venetia', '白色艺术琴壳'], official: 'https://www.fazioli.com/en/special-models/venetia/', photo: 'fazioliVenetia' },
      { model: 'Malachite (F228)', cm: 228, quote: true, classic: 74, sig: '孔雀石绿色艺术漆面与木皮，F228 的定制版本', tags: ['Malachite', '孔雀石'], official: 'https://www.fazioli.com/en/special-models/malachite-2/', photo: 'fazioliMalachite' }
    ]
  },
  schimmel: {
    name: '设计特别版', note: '玻璃、特殊漆面与设计联名，按订单制作', madeIn: '德国',
    highlight: 'Schimmel 的设计感琴壳与特殊材质', tradeoff: '非常规配置，价格与交期需确认',
    tags: ['特别版', '设计'], models: [
      { model: 'K 213 Glas', cm: 213, quote: true, classic: 72, sig: '透明亚克力与白色结构，K 213 的设计特别版', tags: ['Glas', '亚克力'], official: 'https://www.schimmel-pianos.de/en/', noPhoto: true },
      { model: 'K 208 Pegasus', cm: 208, quote: true, classic: 56, sig: '透明亚克力与金属结构组成的标志性设计三角琴', tags: ['Pegasus', '亚克力'], official: 'https://www.schimmel-pianos.de/en/', noPhoto: true }
    ]
  },
  sauter: {
    name: 'Peter Maly 设计特别版', note: 'Peter Maly 设计的现代琴壳与特殊漆面', madeIn: '德国',
    highlight: 'Sauter 与 Peter Maly 的现代设计语言', tradeoff: '特殊外观，价格与交期需确认',
    tags: ['特别版', '设计'], models: [
      { model: 'Ambiente 230', cm: 230, quote: true, classic: 70, sig: 'Peter Maly 设计，230 cm 的雕塑感琴壳与 Sauter 音色', tags: ['Peter Maly', 'Ambiente'], official: 'https://www.sauter-pianos.de/en/instruments/grand-pianos/', photo: 'sauterAmbiente' },
      { model: 'Vivace 210', cm: 210, quote: true, classic: 68, sig: 'Peter Maly 设计，210 cm 的现代琴壳与轻快手感', tags: ['Peter Maly', 'Vivace'], official: 'https://www.sauter-pianos.de/en/instruments/grand-pianos/', photo: 'sauterVivace' }
    ]
  },
  seiler: {
    name: 'Art Case 特别版', note: '卢浮宫、佛罗伦萨等艺术琴壳', madeIn: '德国',
    highlight: 'Seiler 的艺术琴壳与手工木皮', tradeoff: '特殊外观，价格需单独确认',
    tags: ['特别版', 'Art Case'], models: [
      { model: 'SE 186 Florenz', cm: 186, quote: true, classic: 66, sig: '佛罗伦萨风格艺术琴壳，SE 186 的定制版本', tags: ['Florenz', '艺术琴壳'], official: 'https://www.seiler-pianos.com/seiler-grand-pianos', noPhoto: true },
      { model: 'SE 186 Louvre', cm: 186, quote: true, classic: 54, sig: '以卢浮宫为灵感的艺术琴壳，SE 186 的定制版本', tags: ['Louvre', '艺术琴壳'], official: 'https://www.seiler-pianos.com/seiler-grand-pianos', noPhoto: true }
    ]
  },
  petrof: {
    name: 'Art Case 特别版', note: '洛可可、巴洛克与手工描金琴壳', madeIn: '捷克',
    highlight: 'Petrof 的传统艺术琴壳与手工装饰', tradeoff: '按订单制作，价格与交期需确认',
    tags: ['特别版', 'Art Case'], models: [
      { model: 'P 173 Breeze Rococo', cm: 173, quote: true, classic: 64, sig: '白色描金洛可可琴壳，P 173 Breeze 的艺术版本', tags: ['Rococo', '描金'], official: 'https://www.petrof.com/grand-piano-p-173-breeze-rococo', photo: 'petrofRococo' }
    ]
  },
  augustfoerster: {
    name: '特别版', note: 'August Förster 的特殊结构与定制型号', madeIn: '德国',
    highlight: '德产手工与特殊结构设计', tradeoff: '产量极少，需直接联系工厂',
    tags: ['特别版'], models: [
      { model: 'Quartertone Grand', cm: 275, quote: true, classic: 58, sig: '四分音三角琴，为当代音乐与微分音作品设计的特殊结构', tags: ['Quartertone', '四分音'], official: 'https://www.august-foerster.de/en/quartertone-grand-piano/', noPhoto: true }
    ]
  }
};
