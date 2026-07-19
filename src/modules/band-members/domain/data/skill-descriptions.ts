import type { SkillType } from "@/modules/band-members/domain/constants/skill.constant";

/** A skill level paired with its flavor description. */
export interface SkillLevelDescription {
  level: number;
  description: string;
}

/**
 * Per-skill level descriptions, ported verbatim from the `game-music` frontend
 * (read-only reference). Entries exist at levels 1, 3, 5, 7 and 10; use
 * {@link bucketSkillDescription} to resolve an arbitrary 0..10 level.
 */
export const SKILL_DESCRIPTIONS: Record<SkillType, SkillLevelDescription[]> = {
  vocal: [
    {
      level: 1,
      description:
        "Um papagaio tem mais controle vocal que esse personagem. Até um microfone desligado tem mais presença.",
    },
    {
      level: 3,
      description:
        'Já consegue cantar algumas músicas básicas, como "Parabéns Pra Você" e "Escravos de Jó".',
    },
    {
      level: 5,
      description:
        "Consegue segurar uma melodia e até arriscar alguns backing vocals. A afinação é... aceitável na maioria dos dias.",
    },
    {
      level: 7,
      description:
        "Voz potente e com personalidade. Já pode ser a voz principal em várias músicas e comanda a atenção do público.",
    },
    {
      level: 10,
      description:
        "Voz capaz de arrancar lágrimas ou quebrar vidros. Dominou completamente sua extensão vocal e emociona qualquer plateia.",
    },
  ],
  guitar: [
    {
      level: 1,
      description:
        "Mal consegue segurar o instrumento sem parecer que vai quebrá-lo. O som parece mais com unhas arranhando um quadro-negro.",
    },
    {
      level: 3,
      description:
        'Já domina os acordes básicos e consegue tocar a introdução de "Que País É Este" do Legião Urbana.',
    },
    {
      level: 5,
      description:
        "Solos básicos já são possíveis! Consegue tocar a maioria dos riffs clássicos do rock e mantém o ritmo da banda.",
    },
    {
      level: 7,
      description:
        "Técnica afiada e repertório vasto. Seus solos são memoráveis e a galera no show sempre pede para tocar mais uma.",
    },
    {
      level: 10,
      description:
        "Guitarra é uma extensão do seu corpo. Mistura técnica, feeling e criatividade para criar partes icônicas que definem a banda.",
    },
  ],
  bass: [
    {
      level: 1,
      description:
        "Ainda confunde as cordas com fios de varal. A banda inteira perde o ritmo quando esse personagem começa a tocar.",
    },
    {
      level: 3,
      description:
        "Consegue manter uma linha de baixo simples e constante. A base já tem um pouco de groove, mas ainda é invisível.",
    },
    {
      level: 5,
      description:
        "A coluna vertebral da banda! Seu groove já faz a cabeça do público balançar e ninguém mais fica parado.",
    },
    {
      level: 7,
      description:
        "Baixista técnico e criativo. Suas linhas são interessantes e marcantes, virando até tema para os fãs assobiarem.",
    },
    {
      level: 10,
      description:
        "Mestre do ritmo e da harmonia. Seu baixo não só sustenta a música como a guia, com slaps complexos e melodias inesquecíveis.",
    },
  ],
  drums: [
    {
      level: 1,
      description:
        "Parece um orangotango com cabos de vassoura. O ritmo é uma sugestão, não uma regra.",
    },
    {
      level: 3,
      description:
        "Consegue manter uma batida 4/4 básica sem se perder. Já não atropela todos os fills.",
    },
    {
      level: 5,
      description:
        "Groove sólido e fills na medida. A banda finalmente tem uma fundação rítmica confiável para se apoiar.",
    },
    {
      level: 7,
      description:
        "Baterista versátil e energético. Domina vários estilos e seus solos são um show à parte, cheios de técnica.",
    },
    {
      level: 10,
      description:
        "Metrônomo humano com criatividade de sobra. Sua bateria é complexa, poderosa e a alma pulsante de cada música.",
    },
  ],
  piano: [
    {
      level: 1,
      description:
        'Dedos de linguiça. Até "Brincando de Piano" no YouTube parece muito avançado.',
    },
    {
      level: 3,
      description:
        "Toca acordes simples e algumas melodias de ouvido. Já não assusta as crianças com dissonâncias acidentais.",
    },
    {
      level: 5,
      description:
        "Adiciona camadas ricas à música. Consegue tocar solos melódicos e constrói a atmosfera das composições.",
    },
    {
      level: 7,
      description:
        "Virtuose nas teclas. Domina desde pianos acústicos delicados até sintetizadores complexos, sendo essencial no som.",
    },
    {
      level: 10,
      description:
        "Maestro do teclado. Suas mãos parecem ter vida própria, criando arranjos orquestrais e solos de tirar o fôlego.",
    },
  ],
  lyrics: [
    {
      level: 1,
      description:
        '"Rosa, rosa, rosa... me dá um abraço, coisa gostosa". O trocadilho mais fraco do mundo soa como Shakespeare perto disso.',
    },
    {
      level: 3,
      description:
        "Consegue escrever refrães cativantes sobre amores de colégio. As rimas são previsíveis, mas funcionam.",
    },
    {
      level: 5,
      description:
        "Letras com emoção e algum significado. Já consegue contar uma história simples que ressoa com o público.",
    },
    {
      level: 7,
      description:
        "Letrista afiado. Consegue variar temas, usar metáforas inteligentes e criar hinos que os fãs decoram word by word.",
    },
    {
      level: 10,
      description:
        "Poeta da geração. Suas letras são profundas, atemporais e tocam a alma. Elas definem a identidade da banda.",
    },
  ],
};
