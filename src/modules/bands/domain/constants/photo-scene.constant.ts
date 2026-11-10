/**
 * Backdrops of the band's cover photo (ADR-0023). Pure set dressing: no game
 * effect. `ensaio` = rehearsal room, `palco` = stage, `muro` = street wall,
 * `estudio` = recording studio.
 */
export const PHOTO_SCENES = ["ensaio", "palco", "muro", "estudio"] as const;
export type PhotoScene = (typeof PHOTO_SCENES)[number];
