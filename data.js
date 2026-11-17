/* 塔罗之路 · 学习内容数据（22 张大阿卡纳） */
const CARDS = [
  {
    id: 0, num: '0', name: '愚者', en: 'The Fool', glyph: '🧳', c1: '#8B7BF7', c2: '#C9BFFF',
    upright: ['新的开始', '自由', '信任直觉'],
    reversed: ['鲁莽', '逃避', '准备不足'],
    symbol: '悬崖边的行李、小白狗与明亮的太阳',
    story: '旅程的起点：他还没有被经验定义，只带着轻盈与好奇迈出第一步。',
    element: '风元素 · 天王星',
    scenario: {
      q: '你收到一个完全陌生的邀约，心里既兴奋又没底。抽到「愚者」正位，它更像在说什么？',
      a: '带着好奇迈出去，允许自己暂时不知道结果',
      wrong: ['先把所有细节查清再决定', '这是一场注定失败的冒险', '必须得到权威许可才能行动']
    }
  },
  {
    id: 1, num: 'I', name: '魔术师', en: 'The Magician', glyph: '🪄', c1: '#E06666', c2: '#FFB3A7',
    upright: ['创造', '行动', '资源齐备'],
    reversed: ['操控', '欺骗', '浪费才能'],
    symbol: '一手指天一手指地、无限符号与桌上四元素圣器',
    story: '愚者拿到了工具：意念、意志与资源，开始学习把想法变成现实。',
    element: '水星',
    scenario: {
      q: '你想启动一个搁置很久的计划，抽到「魔术师」正位。它提示你什么？',
      a: '你已具备所需资源，关键是开始行动',
      wrong: ['等待更有经验的人来主导', '放弃计划，先做好眼前琐事', '把结果完全交给运气']
    }
  },
  {
    id: 2, num: 'II', name: '女祭司', en: 'The High Priestess', glyph: '🌙', c1: '#5C6BC0', c2: '#A7B3F0',
    upright: ['直觉', '内在智慧', '静默'],
    reversed: ['忽视直觉', '隐瞒', '混乱'],
    symbol: '两根柱子之间的帷幕、月亮与胸前的圣书',
    story: '在行动之前，愚者学习安静下来，倾听尚未说出口的内在声音。',
    element: '月亮',
    scenario: {
      q: '面对两个都还不错的选项，抽到「女祭司」正位。你会怎么做？',
      a: '先安静下来，听听自己真实的直觉',
      wrong: ['立刻选看起来更赚钱的那个', '问遍所有人再决定', '抛硬币，听天由命']
    }
  },
  {
    id: 3, num: 'III', name: '皇后', en: 'The Empress', glyph: '👑', c1: '#66BB6A', c2: '#C5E1A5',
    upright: ['丰盛', '孕育', '滋养'],
    reversed: ['停滞', '过度依赖', '创造力受阻'],
    symbol: '金色麦田、石榴长袍与头上的十二颗星',
    story: '生命开始开花结果，愚者遇见世界的丰饶与照顾的力量。',
    element: '金星',
    scenario: {
      q: '一段关系让你觉得被照顾、被看见，抽到「皇后」正位。它强调什么？',
      a: '滋养、丰盛与情感上的安全感',
      wrong: ['严格的规则与边界', '短暂而激烈的冲突', '离开舒适区独自闯荡']
    }
  },
  {
    id: 4, num: 'IV', name: '皇帝', en: 'The Emperor', glyph: '🛡️', c1: '#E53935', c2: '#FFA29E',
    upright: ['秩序', '权威', '结构'],
    reversed: ['专制', '僵化', '失控'],
    symbol: '石座上的公羊头、权杖与宝珠',
    story: '为混乱建立边界：规则、责任与可以依靠的结构。',
    element: '白羊座',
    scenario: {
      q: '团队一盘散沙，你抽到「皇帝」正位。它的建议是？',
      a: '建立清晰的秩序与责任边界',
      wrong: ['完全放任，让大家自由发挥', '回避冲突，先讨好每个人', '把权力交给偶然']
    }
  },
  {
    id: 5, num: 'V', name: '教皇', en: 'The Hierophant', glyph: '📜', c1: '#8D6E63', c2: '#D7B79E',
    upright: ['传统', '指引', '体制'],
    reversed: ['墨守成规', '反叛', '虚假权威'],
    symbol: '三重冠、交叉的双钥匙与两根柱子',
    story: '愚者把个人体验交给传统与导师的框架，学习前人积累的智慧。',
    element: '金牛座',
    scenario: {
      q: '你在学一项新技术时抽到「教皇」正位。它倾向于什么？',
      a: '找一位老师或系统课程来打基础',
      wrong: ['完全拒绝传统方法', '只靠自己摸索，绝不求助', '跳过基础直接做最难的项目']
    }
  },
  {
    id: 6, num: 'VI', name: '恋人', en: 'The Lovers', glyph: '💞', c1: '#EC407A', c2: '#F8BBD0',
    upright: ['结合', '选择', '价值观一致'],
    reversed: ['失衡', '错误选择', '分裂'],
    symbol: '天使祝福下的两人、日月与两条不同的路',
    story: '愚者第一次真正面对「选择」：什么对我来说是真正重要的？',
    element: '双子座',
    scenario: {
      q: '面临一份新工作的取舍，抽到「恋人」正位。核心议题是什么？',
      a: '选择与自己的价值观真正契合的方向',
      wrong: ['只看薪水高低', '让别人替你做决定', '尽量拖延，不做选择']
    }
  },
  {
    id: 7, num: 'VII', name: '战车', en: 'The Chariot', glyph: '🏇', c1: '#42A5F5', c2: '#BBDEFB',
    upright: ['意志', '前进', '掌控'],
    reversed: ['失控', '急躁', '方向不明'],
    symbol: '战车、黑白双狮与星辰华盖',
    story: '愚者带着决心驶出舒适区，学会驾驭彼此冲突的力量。',
    element: '巨蟹座',
    scenario: {
      q: '你正准备一场重要谈判，抽到「战车」正位。它鼓励你什么？',
      a: '坚定目标，驾驭情绪往前推进',
      wrong: ['放弃目标，顺其自然', '让对方完全主导节奏', '先躲开这场对话']
    }
  },
  {
    id: 8, num: 'VIII', name: '力量', en: 'Strength', glyph: '🦁', c1: '#F9A825', c2: '#FFE082',
    upright: ['勇气', '温柔的掌控', '耐心'],
    reversed: ['自我怀疑', '粗暴', '疲惫'],
    symbol: '少女轻抚狮子、头顶无限符号与花冠',
    story: '真正的力量不是制服，而是与自己的本能温柔共处。',
    element: '狮子座',
    scenario: {
      q: '你面对一个让你害怕的局面，抽到「力量」正位。它说的是？',
      a: '用温柔而坚定的态度与恐惧相处',
      wrong: ['用强硬手段彻底压制对方', '逃避直到恐惧自己消失', '把责任全推给环境']
    }
  },
  {
    id: 9, num: 'IX', name: '隐者', en: 'The Hermit', glyph: '🕯️', c1: '#546E7A', c2: '#B0BEC5',
    upright: ['独处', '内省', '寻求真理'],
    reversed: ['孤立', '逃避', '迷失'],
    symbol: '斗篷旅人、提灯中的星与雪峰',
    story: '愚者离开人群，在孤独中点亮属于自己的那盏灯。',
    element: '处女座',
    scenario: {
      q: '你感到疲惫、信息过载，抽到「隐者」正位。它邀请你什么？',
      a: '暂时独处，向内寻找答案',
      wrong: ['立刻参加更多社交活动', '用忙碌麻痹自己', '把所有决定都交给朋友']
    }
  },
  {
    id: 10, num: 'X', name: '命运之轮', en: 'Wheel of Fortune', glyph: '🎡', c1: '#7E57C2', c2: '#D1C4E9',
    upright: ['转机', '命运', '周期'],
    reversed: ['停滞', '抗拒改变', '低迷'],
    symbol: '转动的轮盘、四角活物与狮身人面像',
    story: '愚者承认有些事不在掌控之中，学会随着轮子一起转动。',
    element: '木星',
    scenario: {
      q: '事情突然出现转折，抽到「命运之轮」正位。它提醒你什么？',
      a: '接受变化，顺势调整脚步',
      wrong: ['抗拒一切改变', '认定自己完全掌控全局', '把结果归咎于运气，什么都不做']
    }
  },
  {
    id: 11, num: 'XI', name: '正义', en: 'Justice', glyph: '⚖️', c1: '#26A69A', c2: '#B2DFDB',
    upright: ['公正', '因果', '责任'],
    reversed: ['偏见', '逃避责任', '不公'],
    symbol: '天平与剑、直视前方的坐姿与帷幕',
    story: '愚者看清因果的秤：每个选择都有它的重量。',
    element: '天秤座',
    scenario: {
      q: '一场争执之后抽到「正义」正位。它指向什么？',
      a: '理清事实，为自己的那一部分负责',
      wrong: ['只站在自己一边争输赢', '回避讨论，假装没事', '把责任全推给对方']
    }
  },
  {
    id: 12, num: 'XII', name: '倒吊人', en: 'The Hanged Man', glyph: '🔗', c1: '#29B6F6', c2: '#B3E5FC',
    upright: ['暂停', '换位思考', '顿悟'],
    reversed: ['拖延', '无谓牺牲', '僵局'],
    symbol: '被倒吊的人、头上的光环与交叉成十字的腿',
    story: '愚者主动停下来，用完全不同的角度重新看世界。',
    element: '海王星',
    scenario: {
      q: '你卡在一件事上很久，抽到「倒吊人」正位。它建议什么？',
      a: '暂停下来，换一个角度看问题',
      wrong: ['加倍蛮力往前推', '立刻放弃所有努力', '等待别人来拯救']
    }
  },
  {
    id: 13, num: 'XIII', name: '死神', en: 'Death', glyph: '💀', c1: '#455A64', c2: '#B0BEC5',
    upright: ['结束', '转化', '蜕变'],
    reversed: ['抗拒改变', '停滞', '缓慢释放'],
    symbol: '骷髅骑士、白玫瑰旗与远处的落日',
    story: '让该结束的真正结束，新的生命才有空间出现。',
    element: '天蝎座',
    scenario: {
      q: '一段关系已经名存实亡，抽到「死神」正位。它说的是？',
      a: '让旧的章节真正结束，才有新生',
      wrong: ['维持表面和平，绝不改变', '复活已经过去的美好', '把一切交给时间，什么都不做']
    }
  },
  {
    id: 14, num: 'XIV', name: '节制', en: 'Temperance', glyph: '🏺', c1: '#26C6DA', c2: '#B2EBF2',
    upright: ['平衡', '调和', '耐心'],
    reversed: ['失衡', '极端', '急躁'],
    symbol: '天使在两杯间倾倒流水、一脚在地一脚在水',
    story: '愚者在两极之间找到了属于自己的节奏。',
    element: '射手座',
    scenario: {
      q: '你在工作与生活之间失衡，抽到「节制」正位。它建议什么？',
      a: '调和而不极端，找到可持续的节奏',
      wrong: ['彻底放弃工作', '把所有时间投入娱乐', '继续透支直到撑不住']
    }
  },
  {
    id: 15, num: 'XV', name: '恶魔', en: 'The Devil', glyph: '😈', c1: '#5D4037', c2: '#A1887F',
    upright: ['束缚', '欲望', '执着'],
    reversed: ['挣脱', '觉醒', '面对阴影'],
    symbol: '有角的身影、松垮的锁链与倒五芒星',
    story: '愚者看见那些「我以为自愿」的枷锁，直视自己的阴影。',
    element: '摩羯座',
    scenario: {
      q: '你明明想改变，却总被习惯拉回去，抽到「恶魔」正位。它揭示了什么？',
      a: '看清那些看似自愿的执着与束缚',
      wrong: ['把问题全部归咎于命运', '更需要放纵来解压', '立刻切断所有人际关系']
    }
  },
  {
    id: 16, num: 'XVI', name: '高塔', en: 'The Tower', glyph: '🗼', c1: '#EF5350', c2: '#FFCDD2',
    upright: ['突变', '真相', '解放'],
    reversed: ['拖延的崩溃', '内在动荡', '避免灾难'],
    symbol: '被闪电击穿的塔、坠落的人与火焰王冠',
    story: '虚假的结构被闪电击碎，废墟里终于露出真实。',
    element: '火星',
    scenario: {
      q: '一个你以为稳固的计划突然崩塌，抽到「高塔」正位。它意味着？',
      a: '虚假结构被打破，真相带来解放',
      wrong: ['一切仍在掌控中，无需调整', '不惜一切保住旧框架', '这是纯粹的惩罚']
    }
  },
  {
    id: 17, num: 'XVII', name: '星星', en: 'The Star', glyph: '⭐', c1: '#4FC3F7', c2: '#FFF59D',
    upright: ['希望', '疗愈', '平静'],
    reversed: ['失望', '信念动摇', '疲惫'],
    symbol: '倾水的少女、八芒星与栖息的鹭鸟',
    story: '风暴之后的夜空，愚者重新看见温柔而稳定的光。',
    element: '水瓶座',
    scenario: {
      q: '经历一段低谷后抽到「星星」正位。它带来什么？',
      a: '疗愈与希望，慢慢恢复信心',
      wrong: ['立刻迎来巨大成功', '问题会自动消失', '不必再做任何努力']
    }
  },
  {
    id: 18, num: 'XVIII', name: '月亮', en: 'The Moon', glyph: '🌕', c1: '#5C6BC0', c2: '#D1C4E9',
    upright: ['直觉', '迷雾', '潜意识'],
    reversed: ['真相浮现', '恐惧消散', '困惑减轻'],
    symbol: '月亮、狼与狗、螃蟹与从水中升起的路径',
    story: '愚者走在光影交错的路上，学习与不确定相处。',
    element: '双鱼座',
    scenario: {
      q: '你对某件事看不清、心里不安，抽到「月亮」正位。它提醒什么？',
      a: '承认迷雾存在，别急着下结论',
      wrong: ['事情已经完全明朗', '你的直觉一定是错的', '立刻做最激进的决定']
    }
  },
  {
    id: 19, num: 'XIX', name: '太阳', en: 'The Sun', glyph: '☀️', c1: '#FFA726', c2: '#FFE082',
    upright: ['喜悦', '成功', '清晰'],
    reversed: ['暂时阴霾', '过度乐观', '延迟的喜悦'],
    symbol: '太阳、裸身孩童、向日葵与白马',
    story: '迷雾散去，生命以最简单的方式闪耀。',
    element: '太阳',
    scenario: {
      q: '你要做一次公开分享，抽到「太阳」正位。画面是什么？',
      a: '清晰、喜悦，真实地展现自己',
      wrong: ['需要一直躲在幕后', '结果一定会很糟糕', '过度谨慎才能成功']
    }
  },
  {
    id: 20, num: 'XX', name: '审判', en: 'Judgement', glyph: '📯', c1: '#7E57C2', c2: '#F8BBD0',
    upright: ['觉醒', '召唤', '重生'],
    reversed: ['自我批判', '犹豫', '逃避召唤'],
    symbol: '天使的号角、苏醒的人们与远方的山',
    story: '愚者听见内在的号角，回应那个更真实的自己。',
    element: '冥王星',
    scenario: {
      q: '你犹豫要不要回应一个迟来的机会，抽到「审判」正位。它鼓励什么？',
      a: '回应内在召唤，重新定义自己',
      wrong: ['停留在过去得到的评价里', '因为害怕被评判而沉默', '把决定推迟到明年']
    }
  },
  {
    id: 21, num: 'XXI', name: '世界', en: 'The World', glyph: '🌍', c1: '#43A047', c2: '#C8E6C9',
    upright: ['完成', '圆满', '整合'],
    reversed: ['未完结', '缺口', '停滞'],
    symbol: '月桂环中舞动的人与四角的活物',
    story: '旅程的终点，也是下一圈循环的开始。',
    element: '土星',
    scenario: {
      q: '一个长期项目终于收尾，抽到「世界」正位。它代表什么？',
      a: '阶段性的圆满，并准备走向新旅程',
      wrong: ['一切都结束了，无需再行动', '还差得远，完全没进展', '必须回到起点重来']
    }
  }
];

const UNITS = [
  { title: '启程 · 愚者踏出第一步', sub: '0 — III', cards: [0, 1, 2, 3], color: '#7C6CF0' },
  { title: '秩序 · 与世界建立规则', sub: 'IV — VII', cards: [4, 5, 6, 7], color: '#EF6C6C' },
  { title: '试炼 · 力量与内在之光', sub: 'VIII — XI', cards: [8, 9, 10, 11], color: '#F9A825' },
  { title: '深渊 · 阴影与转化', sub: 'XII — XV', cards: [12, 13, 14, 15], color: '#5C6BC0' },
  { title: '风暴之后 · 光重新出现', sub: 'XVI — XIX', cards: [16, 17, 18, 19], color: '#26C6DA' },
  { title: '归来 · 完成与新的循环', sub: 'XX — XXI', cards: [20, 21], color: '#43A047' },
  { title: '逆位篇 · 阴影的镜子', sub: '全部 22 张 · 倒过来重新认识', cards: CARDS.map(c => c.id), color: '#8E5AA8', reverse: true }
];

const LEVEL_KINDS = {
  study: { title: '图卡速览', icon: '📖', phase: '记忆' },
  imageName: { title: '看图识牌', icon: '🃏', phase: '记忆' },
  nameImage: { title: '牌名配图', icon: '🔍', phase: '记忆' },
  imageKeyword: { title: '图意对应', icon: '🔑', phase: '记忆' },
  reversed: { title: '逆位理解', icon: '↩️', phase: '练习' },
  symbol: { title: '意象与故事', icon: '🌟', phase: '练习' },
  scenario: { title: '情境解读', icon: '💬', phase: '练习' },
  boss: { title: '单元挑战', icon: '👑', phase: '挑战' },
  reverseStudy: { title: '逆位图卡速览', icon: '🔄', phase: '逆位记忆' },
  reverseImageName: { title: '倒牌识名', icon: '🃏', phase: '逆位记忆' },
  reverseKeyword: { title: '逆位关键词', icon: '🔑', phase: '逆位记忆' },
  reverseScenario: { title: '逆位情境', icon: '🌗', phase: '逆位练习' },
  reverseBoss: { title: '逆位试炼', icon: '👑', phase: '逆位挑战' }
};
const KIND_ORDER = ['study', 'imageName', 'nameImage', 'imageKeyword', 'reversed', 'symbol', 'scenario', 'boss'];
const REVERSE_KIND_ORDER = ['reverseStudy', 'reverseImageName', 'reverseKeyword', 'reverseScenario', 'reverseBoss'];
const LEVELS = [];
UNITS.forEach((u, ci) => {
  (u.reverse ? REVERSE_KIND_ORDER : KIND_ORDER).forEach(k => {
    LEVELS.push({ id: `c${ci + 1}-${k}`, chapter: ci, kind: k, title: LEVEL_KINDS[k].title, icon: LEVEL_KINDS[k].icon, phase: LEVEL_KINDS[k].phase, cards: u.cards, reverse: !!u.reverse });
  });
});
LEVELS.push({ id: 'final', chapter: UNITS.length - 2, kind: 'final', title: '愚者试炼', icon: '🏆', phase: '挑战', cards: CARDS.map(c => c.id), final: true });
LEVELS.forEach((l, i) => { l.index = i; });
const cardImage = (id) => `images/cards/${String(id).padStart(2, '0')}.jpg`;

const byId = (id) => CARDS.find(c => c.id === id);
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const sample = (arr, n) => shuffle(arr).slice(0, n);

function optionSet(correct, wrongs) {
  return shuffle([
    { text: correct, ok: true },
    ...wrongs.map(w => ({ text: w, ok: false }))
  ]);
}

function otherValues(cards, getter, correct, n = 3) {
  const pool = cards.filter(c => getter(c) !== correct).map(getter);
  return sample([...new Set(pool)], n);
}

function buildQuestions(ids, count, types) {
  const cards = ids.map(byId).filter(Boolean);
  const all = CARDS;
  const groups = {
    name: [], reverseName: [], imageChoice: [], reverseImageChoice: [],
    keyword: [], reversed: [], reverseReversed: [], reverseScenario: [],
    symbol: [], journey: [], judge: [], scenario: [], order: []
  };
  const want = t => !types || types.includes(t);

  cards.forEach(c => {
    if (want('name')) groups.name.push({
      type: 'choice', tag: '看图识牌', cardId: c.id, showCard: true,
      prompt: '看着牌面，选出它的名字',
      options: optionSet(c.name, otherValues(all, x => x.name, c.name)),
      explanation: `${c.num} ${c.name}（${c.en}）。${c.symbol}。`
    });
    if (want('reverseName')) groups.reverseName.push({
      type: 'choice', tag: '倒牌识名', cardId: c.id, showCard: true, reversed: true,
      prompt: '这张牌倒过来了，它依然是……',
      options: optionSet(c.name, otherValues(all, x => x.name, c.name)),
      explanation: `${c.num} ${c.name}（${c.en}）。倒过来后，它的故事也跟着翻转。`
    });
    if (want('imageChoice')) groups.imageChoice.push({
      type: 'imageChoice', tag: '牌名配图', cardId: c.id,
      prompt: `哪一张是「${c.name}」？`,
      images: shuffle([c.id, ...sample(all.filter(x => x.id !== c.id).map(x => x.id), 3)]),
      explanation: `${c.num} ${c.name}（${c.en}）。${c.story}`
    });
    if (want('reverseImageChoice')) groups.reverseImageChoice.push({
      type: 'imageChoice', tag: '倒牌配名', cardId: c.id, reversed: true,
      prompt: `哪一张倒过来的牌是「${c.name}」？`,
      images: shuffle([c.id, ...sample(all.filter(x => x.id !== c.id).map(x => x.id), 3)]),
      explanation: `${c.num} ${c.name}（${c.en}）。${STORIES[c.id].reversed}`
    });
    if (want('keyword')) groups.keyword.push({
      type: 'choice', tag: '图意对应', cardId: c.id, showCard: true,
      prompt: `这张「${c.name}」的正位，最贴近哪个关键词？`,
      options: optionSet(c.upright[0], otherValues(all, x => x.upright[0], c.upright[0])),
      explanation: `${c.name}的正位关键词：${c.upright.join('、')}。${c.story}`
    });
    if (want('reversed')) groups.reversed.push({
      type: 'choice', tag: '逆位理解', cardId: c.id, showCard: true, reversed: true,
      prompt: `「${c.name}」逆位时，能量更可能转向哪里？`,
      options: optionSet(c.reversed[0], otherValues(all, x => x.reversed[0], c.reversed[0])),
      explanation: `${c.name}逆位常表示：${c.reversed.join('、')}。它不是简单的「坏」，而是能量被卡住或转向内。`
    });
    if (want('reverseReversed')) groups.reverseReversed.push({
      type: 'choice', tag: '逆位关键词', cardId: c.id, showCard: true, reversed: true,
      prompt: `看着这张倒过来的「${c.name}」，它更可能在说什么？`,
      options: optionSet(c.reversed[1] || c.reversed[0], otherValues(all, x => x.reversed[1] || x.reversed[0], c.reversed[1] || c.reversed[0])),
      explanation: `${c.name}逆位：${c.reversed.join('、')}。${STORIES[c.id].reversed}`
    });
    if (want('reverseScenario')) groups.reverseScenario.push({
      type: 'choice', tag: '逆位情境', cardId: c.id, showCard: true, reversed: true,
      prompt: `抽到倒过来的「${c.name}」，它提醒你留意什么？`,
      options: optionSet(`留意「${c.reversed[0]}」的倾向`, otherValues(all, x => `留意「${x.reversed[0]}」的倾向`, `留意「${c.reversed[0]}」的倾向`)),
      explanation: `${c.name}逆位常表示：${c.reversed.join('、')}。${STORIES[c.id].reversed}`
    });
    if (want('symbol')) groups.symbol.push({
      type: 'choice', tag: '意象与故事', cardId: c.id, showCard: true,
      prompt: `这张牌的画面里，藏着哪组意象？`,
      options: optionSet(c.symbol, otherValues(all, x => x.symbol, c.symbol)),
      explanation: `${c.name}的画面常常包含：${c.symbol}。`
    });
    if (want('scenario')) groups.scenario.push({
      type: 'choice', tag: '情境解读', cardId: c.id,
      prompt: c.scenario.q,
      options: optionSet(c.scenario.a, c.scenario.wrong),
      explanation: `「${c.name}」在这里提醒的是：${c.scenario.a}`
    });
    if (want('journey')) groups.journey.push({
      type: 'choice', tag: '愚者之旅', cardId: c.id,
      prompt: c.id === 21 ? '在愚者之旅中，「世界」之前是哪一张牌？' : `在愚者之旅中，「${c.name}」之后紧接着的是哪张牌？`,
      options: optionSet(c.id === 21 ? byId(20).name : byId(c.id + 1).name,
        otherValues(all, x => x.name, c.id === 21 ? byId(20).name : byId(c.id + 1).name)),
      explanation: `愚者之旅的顺序是：${byId(Math.max(0, c.id - 1)).name} → ${c.name} → ${c.id === 21 ? '新的开始' : byId(c.id + 1).name}。`
    });
    if (want('judge')) {
      const truth = Math.random() < 0.5;
      const use = truth ? c : sample(all.filter(x => x.id !== c.id && x.upright[0] !== c.upright[0]), 1)[0];
      groups.judge.push({
        type: 'judge', tag: '判断是非', cardId: c.id,
        prompt: `「${c.name}」的正位关键词包含「${use.upright[0]}」。`,
        options: shuffle([{ text: '正确', ok: truth }, { text: '错误', ok: !truth }]),
        explanation: truth
          ? `没错。「${c.name}」的正位关键词包括：${c.upright.join('、')}。`
          : `不对。「${use.upright[0]}」属于「${use.name}」；「${c.name}」的正位关键词是：${c.upright.join('、')}。`
      });
    }
  });

  if (want('order') && cards.length >= 3) {
    for (let i = 0; i + 2 < cards.length; i++) {
      const trio = [cards[i], cards[i + 1], cards[i + 2]];
      groups.order.push({
        type: 'order', tag: '顺序排列', cardId: trio[1].id,
        prompt: '把这三张牌按愚者之旅的先后顺序排列（依次点击）',
        items: shuffle(trio.map(c => c.id)),
        answer: trio.map(c => c.id),
        explanation: `正确顺序：${trio.map(c => c.name).join(' → ')}。`
      });
    }
  }

  Object.keys(groups).forEach(k => { groups[k] = shuffle(groups[k]); });
  const priority = types ? types.filter(t => groups[t]) : ['name', 'imageChoice', 'keyword', 'reversed', 'symbol', 'journey', 'judge', 'scenario', 'order'];
  const result = [];
  let guard = 0;
  while (result.length < count && guard < 500) {
    let added = false;
    for (const key of priority) {
      if (groups[key] && groups[key].length) {
        result.push(groups[key].shift());
        added = true;
        if (result.length >= count) break;
      }
    }
    if (!added) break;
    guard++;
  }
  return result;
}
