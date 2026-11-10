import {
  PHOTO_SCENES,
  type PhotoScene,
} from "@/modules/bands/domain/constants/photo-scene.constant";

/**
 * Draws the backdrop of a new band's cover photo (ADR-0023), uniformly.
 *
 * @param random - Random source in `[0, 1)`; defaults to `Math.random`.
 * @returns The photo scene.
 */
export function pickPhotoScene(random: () => number = Math.random): PhotoScene {
  return PHOTO_SCENES[
    Math.min(
      PHOTO_SCENES.length - 1,
      Math.floor(random() * PHOTO_SCENES.length),
    )
  ];
}
