import {
  capitalizeFirst,
  englishIndefiniteArticle,
  joinPrefixEn,
  joinPrefixEs,
  joinPrefixPt,
  prepositionWithArticle,
  romanceArticle,
} from "@/modules/bands/domain/generation/band-name.grammar";

describe("band-name grammar", () => {
  describe("romanceArticle", () => {
    it.each([
      ["pt", "definite", "m", "sg", "o"],
      ["pt", "definite", "f", "pl", "as"],
      ["pt", "indefinite", "f", "sg", "uma"],
      ["pt", "indefinite", "m", "pl", "uns"],
      ["es", "definite", "m", "sg", "el"],
      ["es", "definite", "f", "pl", "las"],
      ["es", "indefinite", "m", "pl", "unos"],
    ] as const)("%s %s %s %s -> %s", (language, kind, gender, number, want) => {
      expect(romanceArticle(language, kind, gender, number)).toBe(want);
    });
  });

  describe("prepositionWithArticle", () => {
    it.each([
      ["pt", "de", "m", "sg", "do"],
      ["pt", "de", "f", "pl", "das"],
      ["pt", "em", "f", "sg", "na"],
      ["pt", "em", "m", "pl", "nos"],
      ["pt", "por", "m", "sg", "pelo"],
      ["pt", "por", "f", "pl", "pelas"],
      ["pt", "sem", "m", "sg", "sem o"],
      ["es", "de", "m", "sg", "del"],
      ["es", "de", "f", "sg", "de la"],
      ["es", "de", "m", "pl", "de los"],
      ["es", "más allá de", "m", "sg", "más allá del"],
      ["es", "a", "m", "sg", "al"],
      ["es", "a", "f", "pl", "a las"],
      ["es", "en", "m", "sg", "en el"],
      ["es", "con", "f", "sg", "con la"],
    ] as const)(
      "%s %s + %s %s -> %s",
      (language, preposition, gender, number, want) => {
        expect(
          prepositionWithArticle(language, preposition, gender, number),
        ).toBe(want);
      },
    );
  });

  describe("joinPrefixPt (Acordo Ortográfico)", () => {
    it.each([
      ["Neo", "Dragão", false, "Neodragão"],
      ["Super", "Anjo", false, "Superanjo"],
      ["Anti", "Rei", false, "Antirrei"],
      ["Ultra", "Samurai", false, "Ultrassamurai"],
      ["Neo", "Satélites", false, "Neossatélites"],
      ["Micro", "Oceano", false, "Micro-Oceano"],
      ["Anti", "Inferno", false, "Anti-Inferno"],
      ["Anti", "Herói", false, "Anti-Herói"],
      ["Hiper", "Realidade", false, "Hiper-Realidade"],
      ["Sub", "Reino", false, "Sub-Reino"],
      ["Sub", "Abismo", false, "Subabismo"],
      ["Pan", "Abismo", false, "Pan-Abismo"],
      ["Pan", "Mercenário", false, "Pan-Mercenário"],
      ["Pós", "Dragão", false, "Pós-Dragão"],
      ["Pré", "Ciclone", false, "Pré-Ciclone"],
      ["Pró", "Lua", false, "Pró-Lua"],
      ["Ex", "Pirata", false, "Ex-Pirata"],
      ["Vice", "Rei", false, "Vice-Rei"],
      ["Neo", "Éden", true, "Neo-Éden"],
      ["Trans", "Valhalla", true, "Trans-Valhalla"],
    ])("%s + %s -> %s", (prefix, word, proper, want) => {
      expect(joinPrefixPt(prefix, word, proper)).toBe(want);
    });
  });

  describe("joinPrefixEs (RAE)", () => {
    it.each([
      ["Super", "Dragón", false, "Superdragón"],
      ["Anti", "Héroe", false, "Antihéroe"],
      ["Anti", "Rey", false, "Antirrey"],
      ["Ex", "Villano", false, "Exvillano"],
      ["Neo", "Satélite", false, "Neosatélite"],
      ["Pos", "Edén", true, "Pos-Edén"],
    ])("%s + %s -> %s", (prefix, word, proper, want) => {
      expect(joinPrefixEs(prefix, word, proper)).toBe(want);
    });
  });

  it("joinPrefixEn hyphenates and keeps title case", () => {
    expect(joinPrefixEn("Anti", "Hero")).toBe("Anti-Hero");
    expect(joinPrefixEn("Neo", "Wolves")).toBe("Neo-Wolves");
  });

  describe("englishIndefiniteArticle", () => {
    it.each([
      ["Eternal", "an"],
      ["Oceanic", "an"],
      ["Ultra-Wolf", "an"],
      ["Unbreakable", "an"],
      ["Underground", "an"],
      ["Hour", "an"],
      ["Utopian", "a"],
      ["Unicorn", "a"],
      ["European", "a"],
      ["One", "a"],
      ["Wolf", "a"],
      ["Hyper-Dragon", "a"],
    ])("%s -> %s", (word, want) => {
      expect(englishIndefiniteArticle(word)).toBe(want);
    });
  });

  it("capitalizeFirst upper-cases only the first letter", () => {
    expect(capitalizeFirst("os lobos do abismo")).toBe("Os lobos do abismo");
    expect(capitalizeFirst("éden")).toBe("Éden");
  });
});
