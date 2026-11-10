import { PHOTO_SCENES } from "@/modules/bands/domain/constants/photo-scene.constant";
import { pickPhotoScene } from "@/modules/bands/domain/generation/photo-scene.generator";

describe("pickPhotoScene", () => {
  it("maps the random roll onto the scene list", () => {
    expect(pickPhotoScene(() => 0)).toBe("ensaio");
    expect(pickPhotoScene(() => 0.3)).toBe("palco");
    expect(pickPhotoScene(() => 0.6)).toBe("muro");
    expect(pickPhotoScene(() => 0.99)).toBe("estudio");
  });

  it("always returns a known scene", () => {
    for (let i = 0; i < 20; i++) {
      expect(PHOTO_SCENES).toContain(pickPhotoScene());
    }
  });
});
