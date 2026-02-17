import type { ChatStep } from '../types';

export const chatScript: ChatStep[] = [
  // === CHAMADA RECEBIDA ===
  { type: 'incoming-call' },

  // === APÓS ATENDER: ÁUDIO DE SAUDAÇÃO ===
  {
    type: 'audio-message',
    sender: 'orientadora',
    durationSec: 12,
    delay: 1500,
  },
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Desculpa ter ligado! 😅 Prefere que eu te mande áudio ou por texto?',
    delay: 600,
  },
  {
    type: 'options',
    choices: ['Por texto', 'Pode mandar áudio'],
    key: 'preferencia_comunicacao',
  },

  // === INTRO / ACOLHIMENTO ===
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Oii! 😊 Eu sou a Terapeutica.ia, orientadora do Cadê Meu Psi.',
    delay: 800,
  },
  { type: 'typing', duration: 2000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Que bom que você chegou até aqui! Isso já mostra muita coragem. 💛',
    delay: 600,
  },
  { type: 'progress', step: 1, label: 'Acolhimento' },
  { type: 'typing', duration: 2500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Vou te fazer algumas perguntas pra entender o que você tá sentindo. É rápido, sigiloso e personalizado com IA. Tudo que você disser fica só entre nós, tá? 🔒',
    delay: 800,
  },

  // === TELA 2 - NOME ===
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Primeiro, como posso te chamar?',
    delay: 600,
  },
  {
    type: 'text-input',
    placeholder: 'Digite seu nome...',
    key: 'nome',
  },

  // === TELA 3 - GÊNERO ===
  { type: 'progress', step: 2, label: 'Seu Perfil' },
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Prazer, {nome}! 💚 Como você se identifica?',
    delay: 600,
  },
  {
    type: 'options',
    choices: [
      'Feminino',
      'Masculino',
      'Prefiro não dizer',
    ],
    key: 'genero',
  },

  // === TELA 4 - FAIXA ETÁRIA ===
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Qual é a sua faixa etária?',
    delay: 600,
  },
  {
    type: 'options',
    choices: [
      'Até 17 anos',
      '18 a 24 anos',
      '25 a 34 anos',
      '35 a 44 anos',
      '45 a 59 anos',
      '60+',
    ],
    key: 'faixa_etaria',
  },

  // === TELA 5 - PILAR PRINCIPAL (segmentado por gênero) ===
  { type: 'progress', step: 3, label: 'Suas Necessidades' },
  { type: 'typing', duration: 2000 },
  {
    type: 'conditional-options',
    key: 'pilar',
    conditionKey: 'genero',
    branches: {
      'Feminino': {
        question: 'Agora vamos ao que importa, {nome} ✨\nQual dessas áreas mais pesa na sua vida hoje?',
        choices: [
          'Ansiedade e sobrecarga emocional',
          'Relacionamentos e autoestima',
          'Corpo, alimentação e imagem',
          'Maternidade e vida familiar',
          'Violência e traumas',
        ],
      },
      'Masculino': {
        question: 'Agora vamos ao que importa, {nome} ✨\nQual dessas áreas mais pesa na sua vida hoje?',
        choices: [
          'Pressão financeira e profissional',
          'Dificuldade em expressar emoções',
          'Relacionamentos e vida afetiva',
          'Vícios e comportamentos de fuga',
          'Solidão e propósito de vida',
        ],
      },
      'Prefiro não dizer': {
        question: 'Agora vamos ao que importa, {nome} ✨\nQual dessas áreas mais pesa na sua vida hoje?',
        choices: [
          'Ansiedade e equilíbrio emocional',
          'Autoestima e autoconfiança',
          'Relacionamentos e vida afetiva',
          'Autoconhecimento e propósito',
          'Pressão e sobrecarga do dia a dia',
        ],
      },
    },
  },

  // === TELA 6 - SUB-DESAFIO (condicional por pilar) ===
  { type: 'typing', duration: 2000 },
  {
    type: 'conditional-options',
    key: 'sub_desafio',
    conditionKey: 'pilar',
    branches: {
      // ── FEMININO ──
      'Ansiedade e sobrecarga emocional': {
        question: 'Dentro disso, o que mais te representa?',
        choices: [
          'Minha mente não para, penso em tudo o tempo todo',
          'Me cobro demais, sinto que nunca dou conta',
          'Tenho medo de ser julgada ou de errar',
          'Sinto que carrego o mundo nas costas (casa, trabalho, filhos...)',
          'Sinto que sou uma fraude, que vão "me descobrir"',
        ],
      },
      'Relacionamentos e autoestima': {
        question: 'O que mais pesa nessa área pra você?',
        choices: [
          'Me anulo nos relacionamentos pra agradar o outro',
          'Tenho medo de ficar sozinha e acabo aceitando o que não deveria',
          'Não consigo me ver com valor, me acho inferior',
          'Preciso da aprovação dos outros pra me sentir bem',
          'Saí de um relacionamento e não sei quem eu sou sem ele',
        ],
      },
      'Corpo, alimentação e imagem': {
        question: 'O que mais te incomoda nessa relação com o corpo?',
        choices: [
          'Já tentei de tudo pra emagrecer e nada funciona de verdade',
          'Como por ansiedade, estresse ou pra preencher um vazio',
          'Me comparo com o que vejo nas redes e me sinto mal',
          'Não consigo me olhar no espelho sem me criticar',
          'Sinto que meu corpo não é "bom o suficiente"',
        ],
      },
      'Maternidade e vida familiar': {
        question: 'O que mais pesa pra você nessa área?',
        choices: [
          'Me sinto exausta e ninguém percebe',
          'Carrego uma culpa enorme por não "dar conta de tudo"',
          'Me sinto triste ou vazia desde que meu filho nasceu',
          'Conflitos em casa estão me consumindo',
          'Perdi minha identidade — sou só "mãe" e mais nada',
        ],
      },
      'Violência e traumas': {
        question: 'Sei que é difícil falar sobre isso. Qual situação mais se aproxima da sua? 💛',
        choices: [
          'Sofro ou sofri violência psicológica (manipulação, controle, humilhação)',
          'Estou num relacionamento que me faz mal mas não consigo sair',
          'Carrego traumas da infância que ainda me afetam',
          'Sofri ou sofro assédio e não sei como lidar',
          'Passei por violência física e preciso de apoio',
        ],
      },
      // ── MASCULINO ──
      'Pressão financeira e profissional': {
        question: 'O que mais pesa pra você nessa área?',
        choices: [
          'A pressão de ser o provedor me sufoca',
          'Sinto que estou fracassando profissionalmente',
          'Não consigo parar de trabalhar, mesmo exausto',
          'Ansiedade financeira tira meu sono',
          'Perdi o sentido no que faço, mas não posso parar',
        ],
      },
      'Dificuldade em expressar emoções': {
        question: 'Como isso aparece na sua vida?',
        choices: [
          'Guardo tudo pra mim e explodo depois',
          'Não consigo chorar ou mostrar fraqueza',
          'Sinto raiva sem saber o motivo real',
          'As pessoas dizem que sou "fechado" ou "frio"',
          'Nunca aprendi a falar sobre o que sinto',
        ],
      },
      'Relacionamentos e vida afetiva': {
        question: 'O que mais pesa nos seus relacionamentos?',
        choices: [
          'Tenho medo de me abrir e ser vulnerável',
          'Relacionamentos sempre acabam e eu não entendo por quê',
          'Me sinto preso num relacionamento que não funciona',
          'A solidão pesa, mas não consigo me conectar de verdade',
          'Dependo emocionalmente da outra pessoa',
        ],
      },
      'Vícios e comportamentos de fuga': {
        question: 'Sem julgamento — o que mais se aproxima da sua situação?',
        choices: [
          'Uso álcool ou outras substâncias pra lidar com o que sinto',
          'Fico horas no celular, jogos ou redes sociais pra não pensar',
          'Tenho comportamentos compulsivos que não consigo controlar',
          'Uso pornografia de forma que me incomoda',
          'Sei que estou fugindo, mas não consigo parar',
        ],
      },
      'Solidão e propósito de vida': {
        question: 'O que mais te representa hoje?',
        choices: [
          'Não tenho com quem conversar de verdade',
          'Sinto um vazio que nada preenche',
          'Não sei o que quero da vida, perdi o rumo',
          'Penso que ninguém realmente se importa comigo',
          'Estou no piloto automático, só existindo',
        ],
      },
      // ── PREFIRO NÃO DIZER ──
      'Ansiedade e equilíbrio emocional': {
        question: 'O que mais tem afetado sua saúde emocional?',
        choices: [
          'Pensamentos que não param, preocupação constante',
          'Cansaço que não passa, mesmo descansando',
          'Mudanças grandes que tiraram meu chão',
          'Tristeza ou vazio que não vai embora',
          'Me cobro demais e nunca é o suficiente',
        ],
      },
      'Autoestima e autoconfiança': {
        question: 'O que mais afeta a forma como você se vê?',
        choices: [
          'Nunca sinto que sou o suficiente',
          'Me comparo muito com os outros',
          'Tenho dificuldade de me aceitar como sou',
          'Dependo da aprovação dos outros para me sentir bem',
          'Sinto que sou uma fraude nas coisas que faço',
        ],
      },
      'Autoconhecimento e propósito': {
        question: 'O que te trouxe até aqui?',
        choices: [
          'Quero me entender melhor e não sei por onde começar',
          'Não sei o que quero da vida',
          'Sinto que estou no piloto automático',
          'Quero mudar mas algo me trava',
          'Sinto que me perdi de mim',
        ],
      },
      'Pressão e sobrecarga do dia a dia': {
        question: 'O que mais pesa no seu dia a dia?',
        choices: [
          'Trabalho demais e não consigo descansar',
          'Sinto que carrego tudo nas costas',
          'Não tenho tempo pra mim',
          'Estou sempre irritado(a) e não sei por quê',
          'Sinto que vou explodir a qualquer momento',
        ],
      },
    },
  },

  // === TELA 7 - VALIDAÇÃO EMPÁTICA ===
  { type: 'typing', duration: 2500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: '{nome}, obrigada por confiar em mim com algo tão importante. 💛\nO que você sente tem nome, tem explicação e, mais importante: tem caminho.',
    delay: 800,
  },

  // === TELA 8 - FREQUÊNCIA ===
  { type: 'progress', step: 4, label: 'Frequência' },
  { type: 'typing', duration: 1800 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Com que frequência você se sente assim?',
    delay: 600,
  },
  {
    type: 'options',
    choices: [
      'Raramente',
      'Às vezes',
      'Frequentemente',
      'Quase todo dia',
    ],
    key: 'frequencia',
  },

  // === TELA 9 - IMPACTO ===
  { type: 'typing', duration: 1800 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'E quanto isso tem atrapalhado a sua rotina? Trabalho, sono, relações...',
    delay: 600,
  },
  {
    type: 'options',
    choices: [
      'Não muito, mas quero prevenir',
      'Um pouco, já sinto o impacto',
      'Bastante, tem sido bem difícil',
      'Muito, sinto que preciso de ajuda urgente',
    ],
    key: 'impacto',
  },

  // === TELA 10 - AUTOCUIDADO ===
  { type: 'progress', step: 5, label: 'Autocuidado' },
  { type: 'typing', duration: 2000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'E quando você se sente assim, o que costuma fazer?',
    delay: 600,
  },
  {
    type: 'options',
    choices: [
      'Guardo tudo pra mim, não falo com ninguém',
      'Desabafo com alguém próximo',
      'Tento me distrair (redes, séries, comida...)',
      'Já faço ou já fiz terapia',
    ],
    key: 'autocuidado',
  },

  // === TELA 11 - BARREIRAS ===
  { type: 'progress', step: 6, label: 'Último passo' },
  { type: 'typing', duration: 2000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Última pergunta, {nome}... 💚\nO que mais te impede de buscar ajuda profissional?',
    delay: 800,
  },
  {
    type: 'options',
    choices: [
      'O custo — acho caro demais',
      'Falta de tempo na minha rotina',
      'Vergonha ou medo de julgamento',
      'Não sei por onde começar',
      'Não acredito que funcione pra mim',
    ],
    key: 'barreira',
  },

  // === VALIDAÇÃO PERSONALIZADA ===
  { type: 'progress', step: 7, label: 'Resultado' },
  { type: 'typing', duration: 2500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Pronto, {nome}! Já entendi o que você precisa. 🎯',
    delay: 600,
  },
  { type: 'typing', duration: 3000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Olha, vou ser sincera com você: o que você descreveu — {pilar}, sentir "{sub_desafio}" — isso é muito mais comum do que parece. Milhares de pessoas passam por isso e sofrem em silêncio.',
    delay: 800,
  },
  { type: 'typing', duration: 2500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Não é frescura. Não é falta de força. É algo real que precisa de atenção real. E você já deu o passo mais difícil: reconhecer. 💛',
    delay: 800,
  },
  { type: 'typing', duration: 2500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Com base em tudo que você me contou, temos um grupo exclusivo com conteúdo de psicólogos especializados exatamente nesse tema.',
    delay: 800,
  },
  { type: 'typing', duration: 2000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'São áudios, exercícios práticos e orientações feitas sob medida. Tudo por apenas R$27,00 — menos que um lanche de delivery. 💚',
    delay: 800,
  },
  { type: 'typing', duration: 1800 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Você não precisa resolver tudo {sozinho}. Quer começar essa jornada? 😊',
    delay: 600,
  },
  {
    type: 'options',
    choices: [
      'Quero participar! ✨',
      'Ainda tenho dúvidas, me conta mais',
    ],
    key: 'ver_match',
  },

  // === TRANSIÇÃO PARA GRUPO ===
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Ótimo, {nome}! Vou te mostrar como participar... 🔮✨',
    delay: 1200,
  },
  { type: 'navigate', to: '/match', delay: 2000 },
];
