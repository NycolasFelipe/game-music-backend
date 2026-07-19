import type { SkillType } from "@/modules/band-members/domain/constants/skill.constant";

/**
 * A biography template with gender/name markers, ported from the frontend.
 * Markers like `[nome]` and `[o-a]` are resolved during generation.
 */
export interface BiographyTemplate {
  id: number;
  skill: SkillType;
  text: string;
}

export const BIOGRAPHIES: BiographyTemplate[] = [
  // Vocalistas
  {
    id: 1,
    skill: "vocal",
    text: 'Professor[a] de educação infantil por 6 anos, [nome] está acostumad[o-a] a alternar entre vozes suaves para cantarolinhos e gritos para controlar o recreio. Na banda, el[e-a] só não grita "para de correr!" no palco… mas se precisar, sabe como projetar.',
  },
  {
    id: 2,
    skill: "vocal",
    text: 'Criad[o-a] em uma família que acreditava firmemente que "quem canta, seus males espanta", [nome] levou o ditado a sério demais. Depois de anos cantando em aniversários, filas de banco e até em velórios (sem autorização), decidiu profissionalizar o talento.',
  },
  {
    id: 3,
    skill: "vocal",
    text: "Criad[o-a] em coral de igreja, [nome] aprendeu cedo a harmonizar, seguir regência e fingir concentração absoluta. Na banda, aplica disciplina vocal com um toque dramático, garantindo notas firmes e expressões intensas mesmo em músicas simples.",
  },
  {
    id: 4,
    skill: "vocal",
    text: "Antig[o-a] animador[a] de festas infantis, [nome] sabe manter atenção mesmo quando ninguém pediu. Sua voz é energética, versátil e acostumada a improvisar. No palco, canta como se o público inteiro tivesse acabado de ganhar um balão.",
  },
  {
    id: 5,
    skill: "vocal",
    text: "Ex-recepcionista, [nome] passou anos repetindo frases com sorriso forçado e tom amigável. Isso virou controle vocal refinado. Hoje usa a mesma técnica para cantar letras dramáticas sem perder a postura, mesmo quando a música pede sofrimento exagerado.",
  },
  {
    id: 6,
    skill: "vocal",
    text: "Criad[o-a] em uma casa onde todo mundo falava ao mesmo tempo, [nome] aprendeu cedo que projetar a voz era questão de sobrevivência. Começou cantando para ser ouvido e acabou descobrindo talento real.",
  },
  {
    id: 7,
    skill: "vocal",
    text: "[nome] começou cantando para amigos, depois para estranhos e agora para quem quiser ouvir. Desenvolveu confiança gradual e uma voz que cresce ao vivo. Cantando, traz autenticidade e um leve exagero emocional cuidadosamente calculado.",
  },
  {
    id: 8,
    skill: "vocal",
    text: "Antig[o-a] vendedor[a], [nome] sabe convencer qualquer pessoa de qualquer coisa. Aplicou isso ao canto, desenvolvendo interpretação intensa e conexão com o público.",
  },
  {
    id: 9,
    skill: "vocal",
    text: "[nome] canta como quem conversa seriamente. Cada música soa como um desabafo sincero. Cantando, entrega verdade, presença e a sensação de que aquela letra foi escrita ontem.",
  },
  {
    id: 10,
    skill: "vocal",
    text: "[nome] escreve mentalmente enquanto canta, adaptando emoção em tempo real. Às vezes muda a letra sem avisar. Cantando, traz espontaneidade e uma leve sensação de risco controlado.",
  },

  // Guitarristas
  {
    id: 11,
    skill: "guitar",
    text: 'Ex-advogad[o-a] especializad[o-a] em divórcios, [nome] trocou as petições pelos pedais depois de perceber que causar "rupturas" em solos de guitarra era mais gratificante e muito menos litigioso. Ainda gosta de discutir, mas agora prefere fazê-lo com riffs longos, distorção alta e olhares dramáticos para o amplificador.',
  },
  {
    id: 12,
    skill: "guitar",
    text: "[nome] aprendeu a tocar violão com vídeos duvidosos da internet e muita persistência. Passou anos decorando cifras erradas até perceber que estilo também conta como técnica. Alterna entre momentos de genialidade e longos períodos afinando o instrumento.",
  },
  {
    id: 13,
    skill: "guitar",
    text: "[nome] passou anos tocando violão em bares onde ninguém prestava atenção. Aprendeu constância, paciência e a tocar bem mesmo sendo ignorad[o-a]. No palco, valoriza cada aplauso como conquista pessoal.",
  },
  {
    id: 14,
    skill: "guitar",
    text: 'Autodidat[a], [nome] aprendeu guitarra em vídeos duvidosos e fóruns contraditórios. Desenvolveu estilo próprio misturando erros, insistência e atitude. Tocando, alterna entre solos inspirados e longas pausas para "sentir a vibe".',
  },
  {
    id: 15,
    skill: "guitar",
    text: "[nome] começou no violão para impressionar em rodas de amigos, mas acabou levando a sério demais. Hoje domina bases consistentes e solos emotivos, sempre com a expressão concentrada de quem acredita estar criando algo histórico.",
  },
  {
    id: 16,
    skill: "guitar",
    text: "[nome] começou tocando covers mal executados e evoluiu para versões autorais igualmente intensas. Prefere emoção à perfeição. Entrega solos longos e olhares dramáticos para o nada.",
  },
  {
    id: 17,
    skill: "guitar",
    text: "[nome] encara a guitarra como forma de diálogo. Nem sempre entende o que diz, mas fala com convicção. Contribui com riffs marcantes e pausas estratégicas.",
  },
  {
    id: 18,
    skill: "guitar",
    text: "Criad[o-a] ouvindo rock alto demais, [nome] desenvolveu ouvido apurado e resistência a reclamações. Consegue garantir riffs firmes e solos intensos, mesmo quando ninguém pediu.",
  },
  {
    id: 19,
    skill: "guitar",
    text: "Antig[o-a] estudante de artes, [nome] vê a guitarra como extensão da personalidade. Nem sempre afina perfeitamente, mas garante que é proposital. Nos ensaios, traz identidade sonora e debates longos sobre feeling.",
  },
  {
    id: 20,
    skill: "guitar",
    text: "Ex-técnic[o-a] de informática, [nome] encara a guitarra como sistema complexo. Ajusta tudo com cuidado extremo. Entrega precisão e reclama silenciosamente quando algo não está otimizado.",
  },

  // Bateristas
  {
    id: 21,
    skill: "drums",
    text: "Conhecid[o-a] na vizinhança por transformar qualquer superfície em instrumento, [nome] já foi proibid[o-a] de usar talheres metálicos, mesas de vidro e tampas de panela. Trabalhou como operador[a] de obras, onde aprendeu ritmo, resistência e a ignorar reclamações.",
  },
  {
    id: 22,
    skill: "drums",
    text: "[nome] começou a tocar bateria após perceber que gastar energia batendo em coisas era socialmente mais aceito quando havia ritmo envolvido. Ex-alun[o-a] exemplar em educação física, possui resistência para shows longos e ensaios intermináveis. Costuma chegar cedo, sair suad[o-a] e quebrar pelo menos uma baqueta por sessão.",
  },
  {
    id: 23,
    skill: "drums",
    text: "Antig[o-a] maquinista de metrô, [nome] mantém um ritmo preciso e implacável. Treinad[o-a] para nunca atrasar, sua batida é pontual como relógio suíço e teimosa como engarrafamento em hora de pico.",
  },
  {
    id: 24,
    skill: "drums",
    text: "Ex-sóci[o-a] de uma clínica de fisioterapia, [nome] trata cada componente da bateria como um paciente diferente: precisa de ritmo, força e terapia. Sua técnica é meticulosa, e sempre faz alongamento antes dos solos mais agressivos.",
  },
  {
    id: 25,
    skill: "drums",
    text: "Crescendo como irm[ã]o mais nov[o-a] entre sete irmãos, [nome] aprendeu a chamar a atenção fazendo barulho. Sua bateria é alta, energética e vem com a precisão de quem sempre brigava pelo controle remoto.",
  },
  {
    id: 26,
    skill: "drums",
    text: "Ex-caix[a] de supermercado, [nome] desenvolveu um senso rítmico único escaneando produtos no ritmo das músicas de espera. Sua batida é rápida, eficiente e ocasionalmente inclui o som de um beep imaginário.",
  },
  {
    id: 27,
    skill: "drums",
    text: "Antig[o-a] instrutor[a] de natação, [nome] vê a bateria como uma piscina: cada tom é uma braçada, cada compasso uma volta completa. Mantém um ritmo constante que pode durar horas, e sai do palco mais molhad[o-a] do que entrou.",
  },
  {
    id: 28,
    skill: "drums",
    text: "Formad[o-a] em culinária, [nome] trata a bateria como uma grande cozinha: cada prato (música) precisa do tempero certo (acentos), do tempo exato (timing) e de uma pitada de caos controlado (solo).",
  },
  {
    id: 29,
    skill: "drums",
    text: "Ex-cuidador[a] de pets, [nome] desenvolveu paciência e timing para lidar com criaturas imprevisíveis. Na bateria, mantém a constância de um latido no ritmo e a energia de um gato pulando no amplificador às 3 da manhã.",
  },
  {
    id: 30,
    skill: "drums",
    text: "Antig[o-a] jogador[a] profissional de jogos de ritmo, [nome] tem coordenação perfeita e dedos que parecem ter vida própria. Sua única fraqueza é achar que a vida real também tem combos e high scores.",
  },

  // Tecladistas/Pianistas
  {
    id: 31,
    skill: "piano",
    text: "Formad[o-a] em música clássica e em paciência extrema, [nome] passou anos tocando piano em casamentos enquanto observava noivos nervosos errarem a própria entrada. Desenvolveu habilidade única de continuar tocando mesmo quando tudo dá errado.",
  },
  {
    id: 32,
    skill: "piano",
    text: 'Ex-digitador[a] de processos judiciais, [nome] tem dedos ágeis e uma paciência de santo para repetições. No teclado, encontra a liberdade que os formulários não tinham, soltando acordes progressivos onde antes só havia "artigo 5º, parágrafo 3º".',
  },
  {
    id: 33,
    skill: "piano",
    text: "Criad[o-a] em uma loja de eletrônicos dos anos 80, [nome] acredita que os synths analógicos têm alma (e está sempre tentando exorcizar o ghost note do teclado velho). Seu som é uma viagem no tempo, com direito a estática e nostalgia.",
  },
  {
    id: 34,
    skill: "piano",
    text: "Ex-operador[a] de elevador, [nome] é especialista em criar climas. Sabe exatamente qual tecla pressionar para subir a tensão, descer a energia ou fazer o público flutuar em um bridge emocionante.",
  },
  {
    id: 35,
    skill: "piano",
    text: "Antig[o-a] meteorologist[a] de TV, [nome] transforma previsões do tempo em paisagens sonoras. Seus solos são como frente fria: chegam devagar, dominam tudo e vão embora deixando um clima diferente.",
  },
  {
    id: 36,
    skill: "piano",
    text: "Ex-caçador[a] de bugs em software, [nome] enxerga a música como código. Fica horas procurando o glitch perfeito, o loop mais limpo e o sample que não crasha o set.",
  },
  {
    id: 37,
    skill: "piano",
    text: "Criad[o-a] por avós que amavam serestas, [nome] conhece todos os clichês românticos do teclado – e como subvertê-los. Seus arranjos soam como uma novela das oito, mas com final imprevisível.",
  },
  {
    id: 38,
    skill: "piano",
    text: "Ex-taxista, [nome] sabe navegar por qualquer gênero musical como se fosse um mapa da cidade. Leva a música por atalhos surpreendentes, evita becos sem saída harmônica e sempre cobra um cover emocional no final.",
  },
  {
    id: 39,
    skill: "piano",
    text: "Antig[o-a] organizador[a] de eventos, [nome] entende que cada música é um cronograma. O intro é a recepção, o refrão o coquetel principal e o solo a hora do discurso.",
  },
  {
    id: 40,
    skill: "piano",
    text: "Ex-mestre de xadrez, [nome] enxerga o teclado como um tabuleiro de 88 casas. Cada movimento (nota) é calculado, cada melodia é uma abertura e cada erro é uma oportunidade para um checkmate musical dramático.",
  },

  // Compositores (Letras)
  {
    id: 41,
    skill: "lyrics",
    text: '[nome] afirma que não escreve músicas, apenas "registra sentimentos atrasados". Já trabalhou como atendente de SAC, onde aprendeu tudo sobre frustração humana, ironia e pedidos impossíveis. Suas letras misturam dramas cotidianos, pequenas vitórias e metáforas questionáveis.',
  },
  {
    id: 42,
    skill: "lyrics",
    text: 'Ex-redator[a] de jingle publicitário, [nome] tem o dom de grudar melodias na cabeça das pessoas. Suas letras são cativantes, diretas e, ocasionalmente, incluem um refrão que promete "oferta imperdível por tempo limitado" de felicidade.',
  },
  {
    id: 43,
    skill: "lyrics",
    text: "Criad[o-a] como irm[ã]o do meio, [nome] desenvolveu a arte de falar sem ser notado – e depois transformar isso em verso. Suas letras falam de invisibilidade, observação ácida e desejos de ser o solo, nem que seja por um compasso.",
  },
  {
    id: 44,
    skill: "lyrics",
    text: "Ex-entregador[a] de aplicativo, [nome] conhece a cidade por trás das fachadas. Escreve sobre solidão coletiva, amor que chega frio e a busca por um endereço emocional que não existe no GPS.",
  },
  {
    id: 45,
    skill: "lyrics",
    text: 'Formad[o-a] em filosofia, [nome] transforma perguntas sem resposta em refrões. "Ser ou não ser?" vira um hook pop. "O que é a verdade?" vira um bridge de rock progressivo.',
  },
  {
    id: 46,
    skill: "lyrics",
    text: "Ex-fisc[a] de condomínio, [nome] escreve sobre regras, infrações e a vida por trás das portas fechadas. Suas músicas são crônicas da normalidade, com choros abafados, festas até as três e disputas pelo lava-rápido da alma.",
  },
  {
    id: 47,
    skill: "lyrics",
    text: "Antig[o-a] tradutor[a] simultânea, [nome] acredita que emoções são idiomas. Traduz dor para blues, alegria para pop, saudade para samba.",
  },
  {
    id: 48,
    skill: "lyrics",
    text: 'Ex-cartomante, [nome] "vê" músicas no futuro. Escreve letras cheias de presságios, metáforas de tarô e promessas vagas. Garante que o próximo hit da banda já estava nas cartas.',
  },
  {
    id: 49,
    skill: "lyrics",
    text: "Criad[o-a] em um sebo de livros usados, [nome] empresta frases de romances esquecidos, títulos de enciclopédias e diálogos de peças antigas. Suas letras soam familiares, mas ninguém sabe porquê.",
  },
  {
    id: 50,
    skill: "lyrics",
    text: "Ex-monitor[a] de colônia de férias, [nome] sabe que toda história precisa de um conflito, uma lição e um lanche no final. Suas músicas seguem essa fórmula, garantindo que o público saia cantando e com vontade de suco de caixinha.",
  },

  // Baixistas
  {
    id: 51,
    skill: "bass",
    text: "Sempre no fundo do palco e no centro da harmonia, [nome] escolheu o baixo por achar que alguém precisava manter tudo unido. Ex-contador[a], entende perfeitamente de tempo, estrutura e quando segurar ou soltar.",
  },
  {
    id: 52,
    skill: "bass",
    text: '[nome] começou no baixo porque "sobrou esse instrumento". Com o tempo, desenvolveu orgulho da função invisível. Hoje toca linhas sólidas, observa tudo em silêncio e sabe exatamente quando algo está fora do eixo.',
  },
  {
    id: 53,
    skill: "bass",
    text: "[nome] acredita que tocar baixo é como cozinhar arroz: se ninguém nota, deu certo. Ex-cozinheir[o-a], aplica disciplina e consistência às linhas graves, mantendo tudo funcionando sem drama.",
  },
  {
    id: 54,
    skill: "bass",
    text: "Ex-vigilante noturno, [nome] aprendeu a ficar atento por longos períodos. No baixo, mantém foco absoluto do início ao fim do show.",
  },
  {
    id: 55,
    skill: "bass",
    text: "Ex-tecnic[o-a] administrativo, [nome] domina processos longos e monótonos. Aplicou isso ao baixo, garantindo constância impecável em músicas extensas e ensaios intermináveis.",
  },
  {
    id: 56,
    skill: "bass",
    text: "Ex-guia de turismo, [nome] vê sua função como conduzir o público por uma viagem segura. O baixo é o tour bus da música: ninguém nota até ele quebrar, mas é ele que leva todo mundo ao destino no ritmo certo.",
  },
  {
    id: 57,
    skill: "bass",
    text: "Antig[o-a] mecânic[o-a] de bicicletas, [nome] sabe que cada peça (nota) precisa estar no lugar para a máquina (banda) funcionar. Ajusta a afinação como quem aperta parafusos, e seu groove é tão redondo quanto um pneu novo.",
  },
  {
    id: 58,
    skill: "bass",
    text: "Ex-plantador[a] de árvores, [nome] entende de crescimento lento e raízes profundas. Suas linhas de baixo são a base que sustenta a música, criadas para durar e dar frutos no futuro.",
  },
  {
    id: 59,
    skill: "bass",
    text: "Criad[o-a] em uma família de contadores de história, [nome] acredita que o baixo é a narrativa por trás da melodia. Enquanto a guitarra grita e o vocal emociona, conta a história real, grave e cheia de detalhes.",
  },
  {
    id: 60,
    skill: "bass",
    text: "Ex-controlador[a] de tráfego aéreo, [nome] mantém a calma sob pressão. Enquanto solos e vocais decolam e aterrissam em seu ritmo, garante que não haja colisões harmônicas no espaço aéreo do palco.",
  },
];
