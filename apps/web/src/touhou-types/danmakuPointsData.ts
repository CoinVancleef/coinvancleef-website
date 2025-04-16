import { TouhouGame } from './enums';
import { DanmakuPointsData } from './interfaces';

/**
 * Complete database of all shot types and their point values across all games
 * Data derived from: https://docs.google.com/spreadsheets/d/e/2PACX-1vRwW1XWgTwrJAipFxjGnStVXk6BuMtTVxZqdokriEHeFZC1d03DBBW9Fyye3AJUZvHYucAApyZBFdIw/pubhtml
 */
export const DANMAKU_POINTS_DATABASE: DanmakuPointsData[] = [
  // TH06 - Embodiment of Scarlet Devil
  { game: TouhouGame.TH06, shotType: 'ReimuA', lnn: 360, lnbPlus: 30, lnb: 30, l1cc: 21 },
  { game: TouhouGame.TH06, shotType: 'ReimuB', lnn: 300, lnbPlus: 29, lnb: 29, l1cc: 21 },
  { game: TouhouGame.TH06, shotType: 'MarisaA', lnn: 540, lnbPlus: 30, lnb: 30, l1cc: 21 },
  { game: TouhouGame.TH06, shotType: 'MarisaB', lnn: 360, lnbPlus: 30, lnb: 30, l1cc: 21 },

  // TH07 - Perfect Cherry Blossom
  { game: TouhouGame.TH07, shotType: 'ReimuA', lnn: 120, lnbPlus: 30, lnb: 27, l1cc: 19 },
  { game: TouhouGame.TH07, shotType: 'ReimuB', lnn: 90, lnbPlus: 29, lnb: 26, l1cc: 18 },
  { game: TouhouGame.TH07, shotType: 'MarisaA', lnn: 100, lnbPlus: 30, lnb: 26, l1cc: 19 },
  { game: TouhouGame.TH07, shotType: 'MarisaB', lnn: 140, lnbPlus: 31, lnb: 28, l1cc: 20 },
  { game: TouhouGame.TH07, shotType: 'SakuyaA', lnn: 150, lnbPlus: 31, lnb: 28, l1cc: 20 },
  { game: TouhouGame.TH07, shotType: 'SakuyB', lnn: 80, lnbPlus: 29, lnb: 26, l1cc: 18 },

  // TH08 - Imperishable Night (Final A)
  {
    game: TouhouGame.TH08,
    shotType: 'Border Team (Final A)',
    lnn: 200,
    lnbPlus: 28,
    lnb: 28,
    l1cc: 17,
  },
  {
    game: TouhouGame.TH08,
    shotType: 'Magic Team (Final A)',
    lnn: 230,
    lnbPlus: 29,
    lnb: 29,
    l1cc: 18,
  },
  {
    game: TouhouGame.TH08,
    shotType: 'Scarlet Team (Final A)',
    lnn: 240,
    lnbPlus: 29,
    lnb: 29,
    l1cc: 18,
  },
  {
    game: TouhouGame.TH08,
    shotType: 'Ghost Team (Final A)',
    lnn: 210,
    lnbPlus: 29,
    lnb: 29,
    l1cc: 18,
  },
  { game: TouhouGame.TH08, shotType: 'Reimu (Final A)', lnn: 420, lnbPlus: 33, lnb: 33, l1cc: 22 },
  { game: TouhouGame.TH08, shotType: 'Yukari (Final A)', lnn: 210, lnbPlus: 30, lnb: 30, l1cc: 19 },
  { game: TouhouGame.TH08, shotType: 'Marisa (Final A)', lnn: 310, lnbPlus: 31, lnb: 31, l1cc: 20 },
  { game: TouhouGame.TH08, shotType: 'Alice (Final A)', lnn: 380, lnbPlus: 35, lnb: 35, l1cc: 24 },
  { game: TouhouGame.TH08, shotType: 'Sakuya (Final A)', lnn: 550, lnbPlus: 35, lnb: 35, l1cc: 24 },
  {
    game: TouhouGame.TH08,
    shotType: 'Remilia (Final A)',
    lnn: 240,
    lnbPlus: 31,
    lnb: 31,
    l1cc: 20,
  },
  { game: TouhouGame.TH08, shotType: 'Youmu (Final A)', lnn: 200, lnbPlus: 28, lnb: 28, l1cc: 17 },
  { game: TouhouGame.TH08, shotType: 'Yuyuko (Final A)', lnn: 320, lnbPlus: 32, lnb: 32, l1cc: 21 },

  // TH08 - Imperishable Night (Final B)
  {
    game: TouhouGame.TH08,
    shotType: 'Border Team (Final B)',
    lnn: 210,
    lnbPlus: 28,
    lnb: 28,
    l1cc: 17,
  },
  {
    game: TouhouGame.TH08,
    shotType: 'Magic Team (Final B)',
    lnn: 230,
    lnbPlus: 29,
    lnb: 29,
    l1cc: 18,
  },
  {
    game: TouhouGame.TH08,
    shotType: 'Scarlet Team (Final B)',
    lnn: 240,
    lnbPlus: 29,
    lnb: 29,
    l1cc: 18,
  },
  {
    game: TouhouGame.TH08,
    shotType: 'Ghost Team (Final B)',
    lnn: 220,
    lnbPlus: 29,
    lnb: 29,
    l1cc: 18,
  },
  { game: TouhouGame.TH08, shotType: 'Reimu (Final B)', lnn: 430, lnbPlus: 33, lnb: 33, l1cc: 22 },
  { game: TouhouGame.TH08, shotType: 'Yukari (Final B)', lnn: 220, lnbPlus: 30, lnb: 30, l1cc: 19 },
  { game: TouhouGame.TH08, shotType: 'Marisa (Final B)', lnn: 340, lnbPlus: 31, lnb: 31, l1cc: 20 },
  { game: TouhouGame.TH08, shotType: 'Alice (Final B)', lnn: 400, lnbPlus: 36, lnb: 36, l1cc: 25 },
  { game: TouhouGame.TH08, shotType: 'Sakuya (Final B)', lnn: 500, lnbPlus: 36, lnb: 36, l1cc: 25 },
  {
    game: TouhouGame.TH08,
    shotType: 'Remilia (Final B)',
    lnn: 250,
    lnbPlus: 31,
    lnb: 31,
    l1cc: 20,
  },
  { game: TouhouGame.TH08, shotType: 'Youmu (Final B)', lnn: 210, lnbPlus: 28, lnb: 28, l1cc: 17 },
  { game: TouhouGame.TH08, shotType: 'Yuyuko (Final B)', lnn: 320, lnbPlus: 32, lnb: 32, l1cc: 21 },

  // TH09 - Phantasmagoria of Flower View
  { game: TouhouGame.TH09, shotType: 'Reimu', lnn: 600, lnbPlus: 19, lnb: 19, l1cc: 19 },
  { game: TouhouGame.TH09, shotType: 'Marisa', lnn: 800, lnbPlus: 19, lnb: 19, l1cc: 19 },
  { game: TouhouGame.TH09, shotType: 'Sakuya', lnn: 800, lnbPlus: 25, lnb: 25, l1cc: 25 },
  { game: TouhouGame.TH09, shotType: 'Youmu', lnn: 800, lnbPlus: 20, lnb: 20, l1cc: 20 },
  { game: TouhouGame.TH09, shotType: 'Reisen', lnn: 1000, lnbPlus: 20, lnb: 20, l1cc: 20 },
  { game: TouhouGame.TH09, shotType: 'Cirno', lnn: 900, lnbPlus: 20, lnb: 20, l1cc: 20 },
  { game: TouhouGame.TH09, shotType: 'Lyrica', lnn: 1000, lnbPlus: 25, lnb: 24, l1cc: 24 },
  { game: TouhouGame.TH09, shotType: 'Mystia', lnn: 1000, lnbPlus: 24, lnb: 24, l1cc: 24 },
  { game: TouhouGame.TH09, shotType: 'Tewi', lnn: 900, lnbPlus: 25, lnb: 25, l1cc: 25 },
  { game: TouhouGame.TH09, shotType: 'Aya', lnn: 560, lnbPlus: 8, lnb: 8, l1cc: 8 },
  { game: TouhouGame.TH09, shotType: 'Medicine', lnn: 580, lnbPlus: 8, lnb: 8, l1cc: 8 },
  { game: TouhouGame.TH09, shotType: 'Yuuka', lnn: 900, lnbPlus: 21, lnb: 21, l1cc: 21 },
  {
    game: TouhouGame.TH09,
    shotType: 'Komachi',
    lnn: 1000,
    lnbPlus: 21,
    lnb: 21,
    l1cc: 21,
  },
  { game: TouhouGame.TH09, shotType: 'Eiki', lnn: 600, lnbPlus: 21, lnb: 21, l1cc: 21 },

  // TH10 - Mountain of Faith
  { game: TouhouGame.TH10, shotType: 'ReimuA', lnn: 100, lnbPlus: 30, lnb: 30, l1cc: 18 },
  { game: TouhouGame.TH10, shotType: 'ReimuB', lnn: 90, lnbPlus: 28, lnb: 28, l1cc: 16 },
  { game: TouhouGame.TH10, shotType: 'ReimuC', lnn: 110, lnbPlus: 30, lnb: 30, l1cc: 18 },
  { game: TouhouGame.TH10, shotType: 'MarisaA', lnn: 280, lnbPlus: 33, lnb: 33, l1cc: 21 },
  { game: TouhouGame.TH10, shotType: 'MarisaB', lnn: 40, lnbPlus: 12, lnb: 12, l1cc: 8 },
  { game: TouhouGame.TH10, shotType: 'MarisaC', lnn: 100, lnbPlus: 29, lnb: 29, l1cc: 17 },

  // TH11 - Subterranean Animism
  { game: TouhouGame.TH11, shotType: 'ReimuA', lnn: 120, lnbPlus: 28, lnb: 28, l1cc: 21 },
  { game: TouhouGame.TH11, shotType: 'ReimuB', lnn: 130, lnbPlus: 30, lnb: 30, l1cc: 23 },
  { game: TouhouGame.TH11, shotType: 'ReimuC', lnn: 110, lnbPlus: 28, lnb: 28, l1cc: 21 },
  { game: TouhouGame.TH11, shotType: 'MarisaA', lnn: 150, lnbPlus: 31, lnb: 31, l1cc: 24 },
  { game: TouhouGame.TH11, shotType: 'MarisaB', lnn: 160, lnbPlus: 31, lnb: 31, l1cc: 24 },
  { game: TouhouGame.TH11, shotType: 'MarisaC', lnn: 280, lnbPlus: 33, lnb: 33, l1cc: 25 },

  // TH12 - Undefined Fantastic Object
  { game: TouhouGame.TH12, shotType: 'ReimuA', lnn: 220, lnbPlus: 37, lnb: 32, l1cc: 25 },
  { game: TouhouGame.TH12, shotType: 'ReimuB', lnn: 260, lnbPlus: 41, lnb: 33, l1cc: 26 },
  { game: TouhouGame.TH12, shotType: 'MarisaA', lnn: 280, lnbPlus: 43, lnb: 34, l1cc: 26 },
  { game: TouhouGame.TH12, shotType: 'MarisaB', lnn: 360, lnbPlus: 51, lnb: 36, l1cc: 28 },
  { game: TouhouGame.TH12, shotType: 'SanaeA', lnn: 300, lnbPlus: 45, lnb: 35, l1cc: 26 },
  { game: TouhouGame.TH12, shotType: 'SanaeB', lnn: 240, lnbPlus: 39, lnb: 33, l1cc: 24 },

  // TH12.8 - Great Fairy Wars
  { game: TouhouGame.TH128, shotType: 'A1', lnn: 35, lnbPlus: 20, lnb: 20, l1cc: 14 },
  { game: TouhouGame.TH128, shotType: 'A2', lnn: 37, lnbPlus: 22, lnb: 22, l1cc: 16 },
  { game: TouhouGame.TH128, shotType: 'B1', lnn: 41, lnbPlus: 24, lnb: 24, l1cc: 18 },
  { game: TouhouGame.TH128, shotType: 'B2', lnn: 39, lnbPlus: 23, lnb: 23, l1cc: 17 },
  { game: TouhouGame.TH128, shotType: 'C1', lnn: 42, lnbPlus: 25, lnb: 25, l1cc: 19 },
  { game: TouhouGame.TH128, shotType: 'C2', lnn: 39, lnbPlus: 23, lnb: 23, l1cc: 17 },

  // TH13 - Ten Desires
  { game: TouhouGame.TH13, shotType: 'Reimu', lnn: 90, lnbPlus: 29, lnb: 25, l1cc: 20 },
  { game: TouhouGame.TH13, shotType: 'Marisa', lnn: 170, lnbPlus: 30, lnb: 26, l1cc: 21 },
  { game: TouhouGame.TH13, shotType: 'Sanae', lnn: 200, lnbPlus: 32, lnb: 28, l1cc: 22 },
  { game: TouhouGame.TH13, shotType: 'Youmu', lnn: 80, lnbPlus: 28, lnb: 24, l1cc: 19 },

  // TH14 - Double Dealing Character
  { game: TouhouGame.TH14, shotType: 'ReimuA', lnn: 130, lnbPlus: 28, lnb: 28, l1cc: 20 },
  { game: TouhouGame.TH14, shotType: 'ReimuB', lnn: 500, lnbPlus: 35, lnb: 35, l1cc: 24 },
  { game: TouhouGame.TH14, shotType: 'MarisaA', lnn: 1000, lnbPlus: 39, lnb: 39, l1cc: 27 },
  { game: TouhouGame.TH14, shotType: 'MarisaB', lnn: 350, lnbPlus: 32, lnb: 32, l1cc: 22 },
  { game: TouhouGame.TH14, shotType: 'SakuyaA', lnn: 70, lnbPlus: 27, lnb: 27, l1cc: 19 },
  { game: TouhouGame.TH14, shotType: 'SakuyaB', lnn: 1000, lnbPlus: 40, lnb: 40, l1cc: 28 },

  // TH15 - Legacy of Lunatic Kingdom
  { game: TouhouGame.TH15, shotType: 'Reimu', lnn: 320, lnbPlus: 32, lnb: 32, l1cc: 26 },
  { game: TouhouGame.TH15, shotType: 'Marisa', lnn: 880, lnbPlus: 35, lnb: 35, l1cc: 27 },
  { game: TouhouGame.TH15, shotType: 'Sanae', lnn: 640, lnbPlus: 33, lnb: 33, l1cc: 20 },
  { game: TouhouGame.TH15, shotType: 'Reisen', lnn: 800, lnbPlus: 34, lnb: 34, l1cc: 19 },

  // TH16 - Hidden Star in Four Seasons
  { game: TouhouGame.TH16, shotType: 'ReimuSp', lnn: 360, lnbPlus: 32, lnb: 27, l1cc: 21 },
  { game: TouhouGame.TH16, shotType: 'CirnoSp', lnn: 400, lnbPlus: 33, lnb: 28, l1cc: 22 },
  { game: TouhouGame.TH16, shotType: 'AyaSp', lnn: 500, lnbPlus: 34, lnb: 29, l1cc: 23 },
  { game: TouhouGame.TH16, shotType: 'MarisaSp', lnn: 340, lnbPlus: 32, lnb: 27, l1cc: 21 },
  { game: TouhouGame.TH16, shotType: 'ReimuSu', lnn: 360, lnbPlus: 32, lnb: 27, l1cc: 21 },
  { game: TouhouGame.TH16, shotType: 'CirnoSu', lnn: 410, lnbPlus: 33, lnb: 28, l1cc: 22 },
  { game: TouhouGame.TH16, shotType: 'AyaSu', lnn: 500, lnbPlus: 34, lnb: 29, l1cc: 23 },
  { game: TouhouGame.TH16, shotType: 'MarisaSu', lnn: 340, lnbPlus: 32, lnb: 27, l1cc: 21 },
  { game: TouhouGame.TH16, shotType: 'ReimuAu', lnn: 100, lnbPlus: 29, lnb: 24, l1cc: 18 },
  { game: TouhouGame.TH16, shotType: 'CirnoAu', lnn: 130, lnbPlus: 30, lnb: 25, l1cc: 19 },
  { game: TouhouGame.TH16, shotType: 'AyaAu', lnn: 160, lnbPlus: 31, lnb: 26, l1cc: 20 },
  { game: TouhouGame.TH16, shotType: 'MarisaAu', lnn: 100, lnbPlus: 29, lnb: 24, l1cc: 18 },
  { game: TouhouGame.TH16, shotType: 'ReimuW', lnn: 110, lnbPlus: 29, lnb: 24, l1cc: 18 },
  { game: TouhouGame.TH16, shotType: 'CirnoW', lnn: 140, lnbPlus: 30, lnb: 25, l1cc: 19 },
  { game: TouhouGame.TH16, shotType: 'AyaW', lnn: 170, lnbPlus: 31, lnb: 26, l1cc: 20 },
  { game: TouhouGame.TH16, shotType: 'MarisaW', lnn: 120, lnbPlus: 29, lnb: 24, l1cc: 18 },

  // TH17 - Wily Beast and Weakest Creature
  { game: TouhouGame.TH17, shotType: 'ReimuW', lnn: 100, lnbPlus: 27, lnb: 24, l1cc: 19 },
  { game: TouhouGame.TH17, shotType: 'ReimuO', lnn: 260, lnbPlus: 30, lnb: 27, l1cc: 16 },
  { game: TouhouGame.TH17, shotType: 'ReimuE', lnn: 250, lnbPlus: 30, lnb: 27, l1cc: 20 },
  { game: TouhouGame.TH17, shotType: 'MarisaW', lnn: 70, lnbPlus: 26, lnb: 23, l1cc: 16 },
  { game: TouhouGame.TH17, shotType: 'MarisaO', lnn: 210, lnbPlus: 29, lnb: 26, l1cc: 16 },
  { game: TouhouGame.TH17, shotType: 'MarisaE', lnn: 110, lnbPlus: 27, lnb: 24, l1cc: 17 },
  { game: TouhouGame.TH17, shotType: 'YoumuW', lnn: 60, lnbPlus: 25, lnb: 22, l1cc: 17 },
  { game: TouhouGame.TH17, shotType: 'YoumuO', lnn: 60, lnbPlus: 25, lnb: 23, l1cc: 16 },
  { game: TouhouGame.TH17, shotType: 'YoumuE', lnn: 180, lnbPlus: 28, lnb: 25, l1cc: 18 },

  // TH18 - Unconnected Marketeers
  { game: TouhouGame.TH18, shotType: 'Reimu', lnn: 300, lnbPlus: 34, lnb: 18, l1cc: 16 },
  { game: TouhouGame.TH18, shotType: 'Marisa', lnn: 600, lnbPlus: 36, lnb: 19, l1cc: 17 },
  { game: TouhouGame.TH18, shotType: 'Sakuya', lnn: 180, lnbPlus: 34, lnb: 18, l1cc: 16 },
  { game: TouhouGame.TH18, shotType: 'Sanae', lnn: 240, lnbPlus: 35, lnb: 18, l1cc: 16 },
];
