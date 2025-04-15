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
