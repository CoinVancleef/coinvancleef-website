import { TouhouGame, GAME_DISPLAY_NAMES } from '../touhou-types/enums';

export function getGameName(game: TouhouGame): string {
  return GAME_DISPLAY_NAMES[game] || 'Unknown Game';
}

export function formatShotType(game: TouhouGame, shotType: string): string {
  // Simple formatting for shot type strings
  return shotType.replace(/([A-Z])/g, ' $1').trim();
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const getShotTypes = (game: TouhouGame): string[] => {
  // This is a placeholder implementation
  // Replace with actual shot types for each game
  switch (game) {
    case TouhouGame.TH06:
      return ['ReimuA', 'ReimuB', 'MarisaA', 'MarisaB'];
    case TouhouGame.TH07:
      return ['ReimuA', 'ReimuB', 'MarisaA', 'MarisaB', 'SakuyaA', 'SakuyaB'];
    case TouhouGame.TH08:
      return [
        'Reimu & Yukari',
        'Marisa & Alice',
        'Sakuya & Remilia',
        'Youmu & Yuyuko',
        'Reimu',
        'Yukari',
        'Marisa',
        'Alice',
        'Sakuya',
        'Remilia',
        'Youmu',
        'Yuyuko',
      ];
    case TouhouGame.TH10:
      return ['ReimuA', 'ReimuB', 'ReimuC', 'MarisaA', 'MarisaB', 'MarisaC'];
    case TouhouGame.TH11:
      return ['ReimuA', 'ReimuB', 'ReimuC', 'MarisaA', 'MarisaB', 'MarisaC'];
    case TouhouGame.TH12:
      return ['ReimuA', 'ReimuB', 'MarisaA', 'MarisaB', 'SanaeA', 'SanaeB'];
    case TouhouGame.TH13:
      return ['Reimu', 'Marisa', 'Sanae', 'Youmu'];
    case TouhouGame.TH14:
      return ['ReimuA', 'ReimuB', 'MarisaA', 'MarisaB', 'SakuyaA', 'SakuyaB'];
    case TouhouGame.TH15:
      return ['Reimu', 'Marisa', 'Sanae', 'Reisen'];
    case TouhouGame.TH16:
      return ['Reimu', 'Marisa', 'Cirno', 'Aya'];
    case TouhouGame.TH17:
      return [
        'ReimuWolf',
        'ReimuOtter',
        'ReimuEagle',
        'MarisaWolf',
        'MarisaOtter',
        'MarisaEagle',
        'YoumuWolf',
        'YoumuOtter',
        'YoumuEagle',
      ];
    case TouhouGame.TH18:
      return ['Reimu', 'Marisa', 'Sakuya', 'Sanae'];
    default:
      return [];
  }
};
