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
    text: 'Vou te fazer algumas perguntas rápidas pra entender melhor o que você precisa e encontrar o profissional ideal pra você, tá?',
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
    text: '{nome}, como você se identifica?',
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

  // === TELA 5 - PILAR PRINCIPAL ===
  { type: 'progress', step: 3, label: 'Suas Necessidades' },
  { type: 'typing', duration: 2000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Agora vamos ao que importa ✨\nQual área da sua vida você sente que precisa de mais atenção agora?',
    delay: 800,
  },
  {
    type: 'options',
    choices: [
      'Emagrecimento e relação com o corpo',
      'Autoestima e autoconfiança',
      'Relacionamentos e vida afetiva',
      'Sexualidade e intimidade',
      'Ansiedade e equilíbrio emocional',
      'Autoconhecimento',
    ],
    key: 'pilar',
  },

  // === TELA 6 - SUB-DESAFIO (CONDICIONAL) ===
  { type: 'typing', duration: 2000 },
  {
    type: 'conditional-options',
    key: 'sub_desafio',
    conditionKey: 'pilar',
    branches: {
      'Emagrecimento e relação com o corpo': {
        question: 'Dentro da sua relação com o corpo, o que mais te incomoda?',
        choices: [
          'Já tentei de tudo e nada funciona',
          'Como de forma emocional, por estresse ou ansiedade',
          'Não me sinto bem com meu corpo',
          'Tenho uma relação difícil com comida',
        ],
      },
      'Autoestima e autoconfiança': {
        question: 'O que mais afeta a forma como você se vê?',
        choices: [
          'Nunca sinto que sou o suficiente',
          'Me comparo muito com os outros',
          'Tenho dificuldade de me aceitar como sou',
          'Dependo da aprovação dos outros para me sentir bem',
        ],
      },
      'Relacionamentos e vida afetiva': {
        question: 'O que mais pesa nos seus relacionamentos?',
        choices: [
          'Relações que me desgastam ou me fazem mal',
          'Dificuldade de criar conexões verdadeiras',
          'Dependência emocional',
          'Fim de um relacionamento ou solidão',
        ],
      },
      'Sexualidade e intimidade': {
        question: 'Dentro da sua sexualidade, o que mais precisa de atenção?',
        choices: [
          'Dificuldade de falar sobre o assunto',
          'Insatisfação ou desconforto na vida sexual',
          'Estou me descobrindo e preciso de apoio',
          'Conflitos sobre intimidade no relacionamento',
        ],
      },
      'Ansiedade e equilíbrio emocional': {
        question: 'O que mais tem afetado sua saúde emocional?',
        choices: [
          'Pensamentos que não param, preocupação constante',
          'Cansaço que não passa, mesmo descansando',
          'Mudanças grandes que tiraram meu chão',
          'Tristeza ou vazio que não vai embora',
        ],
      },
      'Autoconhecimento': {
        question: 'O que te trouxe até aqui?',
        choices: [
          'Quero me entender melhor',
          'Não sei o que quero da vida',
          'Sinto que estou no piloto automático',
          'Quero mudar mas não sei por onde começar',
        ],
      },
    },
  },

  // === TELA 7 - FREQUÊNCIA ===
  { type: 'progress', step: 4, label: 'Frequência' },
  { type: 'typing', duration: 1800 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Entendo... obrigada por compartilhar. 🤗\nCom que frequência você se sente assim?',
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

  // === TELA 8 - IMPACTO ===
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Isso tem afetado o seu dia a dia?',
    delay: 600,
  },
  {
    type: 'options',
    choices: [
      'Não muito',
      'Um pouco, mas consigo lidar',
      'Bastante, tem sido difícil',
      'Muito, sinto que preciso de ajuda',
    ],
    key: 'impacto',
  },

  // === TELA 9 - AUTOCUIDADO ===
  { type: 'progress', step: 5, label: 'Autocuidado' },
  { type: 'typing', duration: 2000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'E o que você costuma fazer quando se sente assim?',
    delay: 600,
  },
  {
    type: 'options',
    choices: [
      'Guardo para mim',
      'Converso com alguém próximo',
      'Tento me distrair',
      'Busco ajuda profissional',
    ],
    key: 'autocuidado',
  },

  // === TELA 10 - BARREIRAS ===
  { type: 'progress', step: 6, label: 'Último passo' },
  { type: 'typing', duration: 2000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Quase lá! Última pergunta... 💚\nSe existisse uma forma acessível de se sentir melhor, o que te impediria de tentar?',
    delay: 800,
  },
  {
    type: 'options',
    choices: [
      'O custo',
      'Falta de tempo',
      'Vergonha ou medo de julgamento',
      'Não sei por onde começar',
      'Não sei se realmente funciona',
    ],
    key: 'barreira',
  },

  // === FINALIZAÇÃO E TRANSIÇÃO ===
  { type: 'progress', step: 7, label: 'Finalizado' },
  { type: 'typing', duration: 2500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Maravilha, {nome}! Já tenho tudo que preciso. 🎯',
    delay: 600,
  },
  { type: 'typing', duration: 2000 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Com base no que você me contou, tenho aqui um grupo de psicólogos especializados nesta situação...',
    delay: 800,
  },
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'A primeira sessão de terapia custa apenas R$40,00! 💚',
    delay: 800,
  },
  {
    type: 'options',
    choices: [
      'Quero escolher meu psicólogo e começar! ✨',
      'Quero continuar conversando para achar outra solução',
    ],
    key: 'ver_match',
  },

  // === TRANSIÇÃO PARA MATCH ===
  { type: 'typing', duration: 1500 },
  {
    type: 'message',
    sender: 'orientadora',
    text: 'Preparando seu match perfeito... 🔮✨',
    delay: 1200,
  },
  { type: 'navigate', to: '/match', delay: 2000 },
];
