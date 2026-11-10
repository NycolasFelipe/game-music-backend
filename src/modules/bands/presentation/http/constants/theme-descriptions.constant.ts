import type { BandTheme } from "@/modules/bands/domain/constants/band.constant";

/**
 * PT-BR one-line pitch for each band theme, shown when the player picks the
 * band's style (ADR-0030). Written in the game's acid voice (ADR-0026): the
 * sound first, then a dry remark. Presentation-only, like the labels.
 */
export const THEME_DESCRIPTIONS: Record<BandTheme, string> = {
  "indie-folk":
    "Violão, voz baixinha e letras sobre a janela do quarto. O chiado da gravação é proposital, segundo a banda.",
  grunge:
    "Guitarra suja, camisa de flanela e refrão gritado. A angústia é sincera; a afinação, nem sempre.",
  "rock-indie":
    "Riffs que viram improvisos de doze minutos e capas que ninguém entende. Metade do público entra em transe; a outra metade vai ao bar.",
  "rock-sinfonico":
    "Guitarra, coral e uma suíte em quatro movimentos sobre um mago. Todo disco é duplo, e todo show precisa de um caminhão extra.",
  punk: "Três acordes, dois minutos e nenhuma paciência. Ensaiar demais é considerado traição ao movimento.",
  metal:
    "Guitarra no talo, bumbo duplo e letras sobre o fim do mundo. A vizinhança concorda com a parte do fim do mundo.",
  blues:
    "Uma guitarra, uma voz rouca e doze compassos de sofrimento. Quanto pior a semana, melhor o disco.",
  jazz: "Piano, voz e improviso que nunca termina no mesmo lugar. A plateia aplaude no meio do solo, por via das dúvidas.",
  synthwave:
    "Sintetizador, bateria eletrônica e saudade de um futuro que nunca chegou. Os óculos escuros ficam no rosto até em show fechado.",
  cyberpunk:
    "Sintetizadores agressivos e letras sobre máquinas que dominam o mundo. A banda leva três horas para ligar o equipamento.",
  steampunk:
    "Sintetizador disfarçado de engenhoca de latão, cartola e engrenagens no figurino. O figurino pesa mais que o equipamento.",
  "rave-edm":
    "Batida que não para, teclado no comando e uma queda de grave a cada quatro minutos. A música termina quando a luz do dia aparece.",
  "pop-urbano":
    "Voz cheia de efeito, batida seca e refrão repetido até grudar. A letra cabe num guardanapo, e esse é o plano.",
  "rap-hiphop":
    "Rima, batida e muita coisa a dizer em pouco tempo. Uma palavra errada no verso, e a banda ouve falar dela por um ano.",
  "funk-carioca":
    "Batida pesada, grave no máximo e refrão para a pista inteira cantar. O síndico conhece a banda pelo nome.",
  kpop: "Coreografia ensaiada até a perfeição, voz impecável e refrão em dois idiomas. O ensaio começa às seis da manhã, e ninguém reclama em público.",
  "pop-mainstream":
    "Refrão feito para o rádio, voz na frente e três minutos exatos. Uma reunião da gravadora aprova cada palavra da letra.",
  "samba-raiz":
    "Percussão, voz e uma roda que atravessa a madrugada. Sempre tem alguém que lembra de mais um samba.",
  sertanejo:
    "Viola, voz em dueto e letras sobre amor perdido. Cada separação dentro da banda vira pelo menos três músicas.",
  mpb: "Letra caprichada, violão e harmonia que pede diploma. A crítica adora; o público precisa ouvir duas vezes.",
  reggae:
    "Baixo na frente, bateria sem pressa e letras sobre paz. A banda chega atrasada ao próprio show, e ninguém se estressa.",
  "folk-rock":
    "Violão de doze cordas, gaita e letras de protesto. A banda protesta até contra o técnico de som.",
  "egirl-eboy":
    "Sintetizador fofo, batida quebrada e voz sussurrada. O figurino é planejado com mais cuidado que o disco.",
  gotico:
    "Guitarra fria, voz grave e letras sobre cemitério. O show começa à meia-noite, e a banda acha cedo.",
  "emo-scene":
    "Guitarra emocionada, franja no olho e refrão sobre a pior semana da vida. Toda semana é a pior semana da vida.",
  "skate-streetwear":
    "Guitarra rápida, músicas curtas e um tênis gasto em cada capa. A banda ensaia na pista e perde metade do ensaio para o chão.",
};
