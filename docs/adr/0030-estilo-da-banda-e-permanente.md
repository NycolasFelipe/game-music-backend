# 0030 — O estilo da banda é permanente e vale para toda obra

- **Status:** Aceita
- **Data:** 2026-11-10
- **Decisores:** Dono do jogo + equipe de backend
- **Relacionada:** [0008 — Obras musicais](0008-obras-musicais.md),
  [0026 — Tom de voz dos textos](0026-tom-de-voz-dos-textos.md)

## Contexto

A banda escolhe um estilo (`theme`) na criação, e nenhuma rota permite trocá-lo.
Mesmo assim, a ADR-0008 tratava o estilo da obra como um campo próprio, com o da
banda só como padrão. O formulário da obra deixava escolher qualquer um dos 26
estilos, e o perfil de instrumentos e a recepção seguiam o escolhido. Uma banda
de metal podia lançar um disco de samba sem custo nenhum.

Na criação da banda, o jogador escolhia o estilo só pelo nome, sem saber o que
ele cobra de cada instrumento.

## Decisão

1. **O estilo é da banda.** `POST /bands/:bandId/releases` deixa de receber
   `style`, e a obra grava o `theme` da banda. Um cliente antigo que ainda mande o
   campo não quebra: o `ValidationPipe` (`whitelist: true`) descarta o campo.
2. **Permanente.** Continua sem rota para trocar o estilo.
3. **Prévia na escolha.** `GET /bands/options` devolve, para cada estilo, uma
   descrição curta no tom ácido da ADR-0026 (`THEME_DESCRIPTIONS`). O frontend
   mostra os três instrumentos que mais pesam no estilo, em palavras e sem
   porcentagem, usando `GET /releases/genre-profiles`. A lista de estilos já mostra
   esses instrumentos enquanto o jogador navega.
4. **Obra.** O formulário da obra mostra o estilo da banda só para leitura, com o
   mesmo perfil.

## Consequências

- A escolha do estilo na criação passa a pesar a partida inteira: a formação
  precisa ter quem cubra os instrumentos que o estilo cobra.
- As obras antigas guardam o estilo com que foram feitas. O campo `style` continua
  na tabela `releases`, e nada é migrado.
- O gerador de conceito (`POST /releases/generate-concept`) continua aceitando `style` como
  semente de texto. O frontend manda o da banda.
