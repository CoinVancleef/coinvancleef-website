import { TouhouGame } from './enums';

/**
 * Shot types for TH06 (Embodiment of Scarlet Devil)
 */
export enum TH06ShotType {
  REIMU_A = 'ReimuA',
  REIMU_B = 'ReimuB',
  MARISA_A = 'MarisaA',
  MARISA_B = 'MarisaB',
}

/**
 * Shot types for TH07 (Perfect Cherry Blossom)
 */
export enum TH07ShotType {
  REIMU_A = 'ReimuA',
  REIMU_B = 'ReimuB',
  MARISA_A = 'MarisaA',
  MARISA_B = 'MarisaB',
  SAKUYA_A = 'SakuyaA',
  SAKUYA_B = 'SakuyaB',
}

/**
 * Shot types for TH08 (Imperishable Night) - Final A
 */
export enum TH08ShotTypeA {
  BORDER_TEAM = 'Border Team (Final A)',
  MAGIC_TEAM = 'Magic Team (Final A)',
  SCARLET_TEAM = 'Scarlet Team (Final A)',
  GHOST_TEAM = 'Ghost Team (Final A)',
  REIMU = 'Reimu (Final A)',
  YUKARI = 'Yukari (Final A)',
  MARISA = 'Marisa (Final A)',
  ALICE = 'Alice (Final A)',
  SAKUYA = 'Sakuya (Final A)',
  REMILIA = 'Remilia (Final A)',
  YOUMU = 'Youmu (Final A)',
  YUYUKO = 'Yuyuko (Final A)',
}

/**
 * Shot types for TH08 (Imperishable Night) - Final B
 */
export enum TH08ShotTypeB {
  BORDER_TEAM = 'Border Team (Final B)',
  MAGIC_TEAM = 'Magic Team (Final B)',
  SCARLET_TEAM = 'Scarlet Team (Final B)',
  GHOST_TEAM = 'Ghost Team (Final B)',
  REIMU = 'Reimu (Final B)',
  YUKARI = 'Yukari (Final B)',
  MARISA = 'Marisa (Final B)',
  ALICE = 'Alice (Final B)',
  SAKUYA = 'Sakuya (Final B)',
  REMILIA = 'Remilia (Final B)',
  YOUMU = 'Youmu (Final B)',
  YUYUKO = 'Yuyuko (Final B)',
}

/**
 * Shot types for TH09 (Phantasmagoria of Flower View)
 */
export enum TH09ShotType {
  REIMU = 'Reimu',
  MARISA = 'Marisa',
  SAKUYA = 'Sakuya',
  YOUMU = 'Youmu',
  REISEN = 'Reisen',
  CIRNO = 'Cirno',
  LYRICA = 'Lyrica',
  MYSTIA = 'Mystia',
  TEWI = 'Tewi',
  AYA = 'Aya',
  MEDICINE = 'Medicine',
  YUUKA = 'Yuuka',
  KOMACHI = 'Komachi',
  EIKI = 'Eiki',
}

/**
 * Shot types for TH10 (Mountain of Faith)
 */
export enum TH10ShotType {
  REIMU_A = 'ReimuA',
  REIMU_B = 'ReimuB',
  REIMU_C = 'ReimuC',
  MARISA_A = 'MarisaA',
  MARISA_B = 'MarisaB',
  MARISA_C = 'MarisaC',
}

/**
 * Shot types for TH11 (Subterranean Animism)
 */
export enum TH11ShotType {
  REIMU_A = 'ReimuA',
  REIMU_B = 'ReimuB',
  REIMU_C = 'ReimuC',
  MARISA_A = 'MarisaA',
  MARISA_B = 'MarisaB',
  MARISA_C = 'MarisaC',
}

/**
 * Shot types for TH12 (Undefined Fantastic Object)
 */
export enum TH12ShotType {
  REIMU_A = 'ReimuA',
  REIMU_B = 'ReimuB',
  MARISA_A = 'MarisaA',
  MARISA_B = 'MarisaB',
  SANAE_A = 'SanaeA',
  SANAE_B = 'SanaeB',
}

/**
 * Shot types for TH12.8 (Great Fairy Wars)
 */
export enum TH128ShotType {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

/**
 * Shot types for TH13 (Ten Desires)
 */
export enum TH13ShotType {
  REIMU = 'Reimu',
  MARISA = 'Marisa',
  SANAE = 'Sanae',
  YOUMU = 'Youmu',
}

/**
 * Shot types for TH14 (Double Dealing Character)
 */
export enum TH14ShotType {
  REIMU_A = 'ReimuA',
  REIMU_B = 'ReimuB',
  MARISA_A = 'MarisaA',
  MARISA_B = 'MarisaB',
  SAKUYA_A = 'SakuyaA',
  SAKUYA_B = 'SakuyaB',
}

/**
 * Shot types for TH15 (Legacy of Lunatic Kingdom)
 */
export enum TH15ShotType {
  REIMU = 'Reimu',
  MARISA = 'Marisa',
  SANAE = 'Sanae',
  REISEN = 'Reisen',
}

/**
 * Shot types for TH16 (Hidden Star in Four Seasons)
 * Season prefixes: Sp = Spring, Su = Summer, Au = Autumn, W = Winter
 */
export enum TH16ShotType {
  REIMU_SPRING = 'ReimuSp',
  CIRNO_SPRING = 'CirnoSp',
  AYA_SPRING = 'AyaSp',
  MARISA_SPRING = 'MarisaSp',
  REIMU_SUMMER = 'ReimuSu',
  CIRNO_SUMMER = 'CirnoSu',
  AYA_SUMMER = 'AyaSu',
  MARISA_SUMMER = 'MarisaSu',
  REIMU_AUTUMN = 'ReimuAu',
  CIRNO_AUTUMN = 'CirnoAu',
  AYA_AUTUMN = 'AyaAu',
  MARISA_AUTUMN = 'MarisaAu',
  REIMU_WINTER = 'ReimuW',
  CIRNO_WINTER = 'CirnoW',
  AYA_WINTER = 'AyaW',
  MARISA_WINTER = 'MarisaW',
}

/**
 * Shot types for TH17 (Wily Beast and Weakest Creature)
 * Animal spirit prefixes: W = Wolf, O = Otter, E = Eagle
 */
export enum TH17ShotType {
  REIMU_WOLF = 'ReimuW',
  REIMU_OTTER = 'ReimuO',
  REIMU_EAGLE = 'ReimuE',
  MARISA_WOLF = 'MarisaW',
  MARISA_OTTER = 'MarisaO',
  MARISA_EAGLE = 'MarisaE',
  YOUMU_WOLF = 'YoumuW',
  YOUMU_OTTER = 'YoumuO',
  YOUMU_EAGLE = 'YoumuE',
}

/**
 * Shot types for TH18 (Unconnected Marketeers)
 */
export enum TH18ShotType {
  REIMU = 'Reimu',
  MARISA = 'Marisa',
  SAKUYA = 'Sakuya',
  SANAE = 'Sanae',
}

/**
 * Maps each game to its corresponding shot type enum
 */
export const GAME_SHOT_TYPE_MAP = {
  [TouhouGame.TH06]: TH06ShotType,
  [TouhouGame.TH07]: TH07ShotType,
  [TouhouGame.TH08]: { ...TH08ShotTypeA, ...TH08ShotTypeB },
  [TouhouGame.TH09]: TH09ShotType,
  [TouhouGame.TH10]: TH10ShotType,
  [TouhouGame.TH11]: TH11ShotType,
  [TouhouGame.TH12]: TH12ShotType,
  [TouhouGame.TH128]: TH128ShotType,
  [TouhouGame.TH13]: TH13ShotType,
  [TouhouGame.TH14]: TH14ShotType,
  [TouhouGame.TH15]: TH15ShotType,
  [TouhouGame.TH16]: TH16ShotType,
  [TouhouGame.TH17]: TH17ShotType,
  [TouhouGame.TH18]: TH18ShotType,
};
