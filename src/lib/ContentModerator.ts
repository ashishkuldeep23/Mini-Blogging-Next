// ContentModerator.ts
import leoProfanity from "leo-profanity";

export class ContentModerator {
  private static customWords: string[] = [
    // Sexual / Explicit
    "porn",
    "xxx",
    "nude",
    "fetish",
    "bdsm",
    "orgy",
    "gangbang",
    "rape",
    "incest",
    "child porn",
    "bestiality",
    "pedophile",

    // Drugs / Illegal
    "weed",
    "marijuana",
    "cocaine",
    "heroin",
    "lsd",
    "meth",
    "crack",
    "drug",
    "narcotics",
    "opium",

    // Violence / Terrorism
    "kill",
    "murder",
    "suicide",
    "terrorist",
    "bomb",
    "shoot",
    "gun",
    "knife",
    "attack",
    "blood",
    "execute",

    // Hate / Slurs (you can extend/remove based on your policy)
    "nigger",
    "chink",
    "faggot",
    "tranny",
    "retard",
    "kike",
    "spic",
    "paki",
    "raghead",

    // // // Adding more random words ------------->>
    "sex",
    "rapey",
    "rapee",
    "rapist",
    "pedo",
    "pedophile",
    "pedophilia",
    "incest",
    "incesty",
    "incestuous",
    "nudity",
    "nude",
    "naked",
    "nudism",
    "nudist",
    "nudity",
    "pornstar",
    "porno",
    "pornography",
    "xxx",
    "sexting",
    "sexism",
    "sexist",
    "sexploitation",
    "sexploited",
    "sexploiter",
    "sexploiting",
    "sexually",
    "sexually-explicit",
    "sexually-orientated",
    "sensual",
    "sensuality",
    "sensually",
    "erotica",
    "erotic",
    "erotically",
    "erogenous",
    "eroticism",
    "erotomania",
    "erotomaniac",
    "erotomanic",
    "masturbate",
    "masturbation",
    "masturbator",
    "masturbatory",
    "masturbates",
    "masturbated",
    "masturbating",

    "fuck",
    "f*ck",
    "f**k",
    "shit",
    "sh*t",
    "bitch",
    "b*tch",
    "asshole",
    "a**hole",
    "bastard",
    "dumbass",

    "sex",
    "nude",
    "n*de",
    "porn",
    "p*rn",
    "xxx",
    "slut",
    "whore",
    "hooker",
    "stripper",

    "fuk",
    "phuck",
    "shet",
    "b!tch",
    "azzhole",
    "porn0",
    "p0rn",
  ];

  constructor(language: "en" | "fr" | "ru" = "en") {
    // Load default dictionary
    leoProfanity.loadDictionary(language);

    // Add custom words
    leoProfanity.add(ContentModerator.customWords);
  }

  /**
   * Check if text contains profanity or banned words
   */
  public check(text: string): boolean {
    return leoProfanity.check(text);
  }

  /**
   * Clean text by replacing banned words with *
   */
  public clean(text: string, replaceWith: string = "*"): string {
    return leoProfanity.clean(text, replaceWith);
  }

  /**
   * Add custom banned words dynamically
   */
  public addCustomWords(words: string[] | string): void {
    leoProfanity.add(words);
  }

  /**
   * Remove words from banned list
   */
  public removeWords(words: string[] | string): void {
    leoProfanity.remove(words);
  }

  /**
   * Get current active banned words
   */
  //   public getBannedList(): string[] {
  //     return leoProfanity.getList();
  //   }

  /**
   * Reset dictionary to default
   */
  public reset(): void {
    leoProfanity.reset();
    leoProfanity.add(ContentModerator.customWords); // re-add custom words
  }
}
