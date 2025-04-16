/**
 * Enum representing all supported Touhou games
 */
export enum TouhouGame {
  TH06 = 'th06', // Embodiment of Scarlet Devil
  TH07 = 'th07', // Perfect Cherry Blossom
  TH08 = 'th08', // Imperishable Night
  TH09 = 'th09', // Phantasmagoria of Flower View
  TH10 = 'th10', // Mountain of Faith
  TH11 = 'th11', // Subterranean Animism
  TH12 = 'th12', // Undefined Fantastic Object
  TH128 = 'th128', // Great Fairy Wars
  TH13 = 'th13', // Ten Desires
  TH14 = 'th14', // Double Dealing Character
  TH15 = 'th15', // Legacy of Lunatic Kingdom
  TH16 = 'th16', // Hidden Star in Four Seasons
  TH17 = 'th17', // Wily Beast and Weakest Creature
  TH18 = 'th18', // Unconnected Marketeers
}

/**
 * Game difficulty levels
 */
export enum Difficulty {
  EASY = 'Easy',
  NORMAL = 'Normal',
  HARD = 'Hard',
  LUNATIC = 'Lunatic',
  EXTRA = 'Extra',
  PHANTASM = 'Phantasm',
}

/**
 * Clear types for scoring
 */
export enum ClearType {
  NORMAL = 'Normal',
  NO_BOMB = 'NB', // No Bomb
  NO_MISS = 'NM', // No Miss
  NO_MISS_NO_BOMB = 'NMNB', // No Miss No Bomb
  PERFECT = 'Perfect',
  PACIFIST = 'Pacifist',
}

/**
 * Routes for Imperishable Night
 */
export enum Th8Route {
  FINAL_A = 'Final A',
  FINAL_B = 'Final B',
}

/**
 * Achievement types for scoring
 */
export enum AchievementType {
  LNN = 'LNN', // Lunatic No-miss No-bomb
  LNB_PLUS = 'LNB+', // Lunatic No-bomb No 3rd or 4th condition
  LNB = 'LNB', // Lunatic No-bomb
}

/**
 * Game's play region/location
 */
export enum Region {
  JP = 'JP',
  NA = 'NA',
  EU = 'EU',
  OTHER = 'Other',
}

/**
 * Game platform
 */
export enum Platform {
  PC = 'PC',
  PS4 = 'PS4',
  SWITCH = 'Switch',
  MOBILE = 'Mobile',
}

/**
 * Game name mapping for display purposes
 */
export const GAME_DISPLAY_NAMES: Record<TouhouGame, string> = {
  [TouhouGame.TH06]: 'The Embodiment of Scarlet Devil',
  [TouhouGame.TH07]: 'Perfect Cherry Blossom',
  [TouhouGame.TH08]: 'Imperishable Night',
  [TouhouGame.TH09]: 'Phantasmagoria of Flower View',
  [TouhouGame.TH10]: 'Mountain of Faith',
  [TouhouGame.TH11]: 'Subterranean Animism',
  [TouhouGame.TH12]: 'Undefined Fantastic Object',
  [TouhouGame.TH128]: 'Great Fairy Wars',
  [TouhouGame.TH13]: 'Ten Desires',
  [TouhouGame.TH14]: 'Double Dealing Character',
  [TouhouGame.TH15]: 'Legacy of Lunatic Kingdom',
  [TouhouGame.TH16]: 'Hidden Star in Four Seasons',
  [TouhouGame.TH17]: 'Wily Beast and Weakest Creature',
  [TouhouGame.TH18]: 'Unconnected Marketeers',
};

/**
 * Short game name mapping for display purposes when space is limited
 */
export const GAME_SHORT_NAMES: Record<TouhouGame, string> = {
  [TouhouGame.TH06]: 'Th6 - EoSD',
  [TouhouGame.TH07]: 'Th7 - PCB',
  [TouhouGame.TH08]: 'Th8 - IN',
  [TouhouGame.TH09]: 'Th9 - PoFV',
  [TouhouGame.TH10]: 'Th10 - MoF',
  [TouhouGame.TH11]: 'Th11 - SA',
  [TouhouGame.TH12]: 'Th12 - UFO',
  [TouhouGame.TH128]: 'Th12.8 - GFW',
  [TouhouGame.TH13]: 'Th13 - TD',
  [TouhouGame.TH14]: 'Th14 - DDC',
  [TouhouGame.TH15]: 'Th15 - LoLK',
  [TouhouGame.TH16]: 'Th16 - HSiFS',
  [TouhouGame.TH17]: 'Th17 - WBaWC',
  [TouhouGame.TH18]: 'Th18 - UM',
};

/**
 * Cover image URLs for each game
 */
export const GAME_COVER_IMAGES: Record<TouhouGame, string> = {
  [TouhouGame.TH06]: 'https://en.touhouwiki.net/images/8/8b/Th06cover.jpg',
  [TouhouGame.TH07]: 'https://en.touhouwiki.net/images/5/52/Th07cover.jpg',
  [TouhouGame.TH08]: 'https://en.touhouwiki.net/images/5/59/Th08cover.jpg',
  [TouhouGame.TH09]: 'https://en.touhouwiki.net/images/2/25/Th09cover.jpg',
  [TouhouGame.TH10]: 'https://en.touhouwiki.net/images/6/6b/Th10cover.jpg',
  [TouhouGame.TH11]: 'https://en.touhouwiki.net/images/7/75/Th11_Cover.jpg',
  [TouhouGame.TH12]: 'https://en.touhouwiki.net/images/a/ae/Th12cover.jpg',
  [TouhouGame.TH128]: 'https://en.touhouwiki.net/images/2/23/Th128cover.jpg',
  [TouhouGame.TH13]: 'https://en.touhouwiki.net/images/6/66/Th13cover.jpg',
  [TouhouGame.TH14]: 'https://en.touhouwiki.net/images/d/d7/Th14cover.jpg',
  [TouhouGame.TH15]: 'https://en.touhouwiki.net/images/d/d7/Th15front.jpg',
  [TouhouGame.TH16]: 'https://en.touhouwiki.net/images/5/5e/Th16front.jpg',
  [TouhouGame.TH17]: 'https://en.touhouwiki.net/images/9/90/Th17cover.png',
  [TouhouGame.TH18]: 'https://en.touhouwiki.net/images/2/2e/Th18cover.jpg',
};

/**
 * Achievement description mapping
 */
export const ACHIEVEMENT_DESCRIPTIONS: Record<AchievementType, string> = {
  [AchievementType.LNN]: 'Lunatic No Miss (No Deaths)',
  [AchievementType.LNB_PLUS]: 'Lunatic No Bomb No 3rd or 4th condition',
  [AchievementType.LNB]: 'Lunatic No Bomb',
};

/**
 * Maps which achievement type is used as the main "perfect" run type for each game
 */
export const GAME_PRIMARY_ACHIEVEMENT: Record<TouhouGame, AchievementType> = {
  [TouhouGame.TH06]: AchievementType.LNN,
  [TouhouGame.TH07]: AchievementType.LNN,
  [TouhouGame.TH08]: AchievementType.LNN,
  [TouhouGame.TH09]: AchievementType.LNN,
  [TouhouGame.TH10]: AchievementType.LNN,
  [TouhouGame.TH11]: AchievementType.LNN,
  [TouhouGame.TH12]: AchievementType.LNN,
  [TouhouGame.TH128]: AchievementType.LNN,
  [TouhouGame.TH13]: AchievementType.LNN,
  [TouhouGame.TH14]: AchievementType.LNN,
  [TouhouGame.TH15]: AchievementType.LNN,
  [TouhouGame.TH16]: AchievementType.LNN,
  [TouhouGame.TH17]: AchievementType.LNN,
  [TouhouGame.TH18]: AchievementType.LNN,
};

/**
 * Maps each game to its corresponding third condition code and description
 * TH07 - NBB (No Border Break)
 * TH08 - FS (Full Spell)
 * TH12 - NV (No UFO)
 * TH13 - NT (No Trance)
 * TH16 - NR (No Release)
 * TH17 - NH (No Hyper)
 * TH18 - NC (No Cards)
 */
export const GAME_THIRD_CONDITION = {
  [TouhouGame.TH06]: null,
  [TouhouGame.TH07]: { code: 'NBB', description: 'No Border Break' },
  [TouhouGame.TH08]: { code: 'FS', description: 'Full Spell' },
  [TouhouGame.TH09]: null,
  [TouhouGame.TH10]: null,
  [TouhouGame.TH11]: null,
  [TouhouGame.TH12]: { code: 'NV', description: 'No UFO summons' },
  [TouhouGame.TH128]: null,
  [TouhouGame.TH13]: { code: 'NT', description: 'No Trance' },
  [TouhouGame.TH14]: null,
  [TouhouGame.TH15]: null,
  [TouhouGame.TH16]: { code: 'NR', description: 'No Release' },
  [TouhouGame.TH17]: { code: 'NH', description: 'No Hyper' },
  [TouhouGame.TH18]: { code: 'NC', description: 'No Cards' },
};
