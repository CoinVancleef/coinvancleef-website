import { TouhouGame } from '../touhou-types/enums';
import {
  TH06ShotType,
  TH07ShotType,
  TH08ShotTypeA,
  TH08ShotTypeB,
  TH09ShotType,
  TH10ShotType,
  TH11ShotType,
  TH12ShotType,
  TH128ShotType,
  TH13ShotType,
  TH14ShotType,
  TH15ShotType,
  TH16ShotType,
  TH17ShotType,
  TH18ShotType,
} from '../touhou-types/shotTypeEnums';

export const getTouhouGameOptions = () => {
  return Object.entries(TouhouGame).map(([key, value]) => ({
    value,
    label: key,
  }));
};

export const getShotTypeOptions = (game: TouhouGame) => {
  // Get the shot type enum for the selected game
  let shotTypeEnum;

  switch (game) {
    case TouhouGame.TH06:
      shotTypeEnum = TH06ShotType;
      break;
    case TouhouGame.TH07:
      shotTypeEnum = TH07ShotType;
      break;
    case TouhouGame.TH08:
      shotTypeEnum = { ...TH08ShotTypeA, ...TH08ShotTypeB };
      break;
    case TouhouGame.TH09:
      shotTypeEnum = TH09ShotType;
      break;
    case TouhouGame.TH10:
      shotTypeEnum = TH10ShotType;
      break;
    case TouhouGame.TH11:
      shotTypeEnum = TH11ShotType;
      break;
    case TouhouGame.TH12:
      shotTypeEnum = TH12ShotType;
      break;
    case TouhouGame.TH128:
      shotTypeEnum = TH128ShotType;
      break;
    case TouhouGame.TH13:
      shotTypeEnum = TH13ShotType;
      break;
    case TouhouGame.TH14:
      shotTypeEnum = TH14ShotType;
      break;
    case TouhouGame.TH15:
      shotTypeEnum = TH15ShotType;
      break;
    case TouhouGame.TH16:
      shotTypeEnum = TH16ShotType;
      break;
    case TouhouGame.TH17:
      shotTypeEnum = TH17ShotType;
      break;
    case TouhouGame.TH18:
      shotTypeEnum = TH18ShotType;
      break;
    default:
      return [];
  }

  // Convert the shot type enum to options
  return Object.entries(shotTypeEnum)
    .filter(([, value]) => typeof value === 'string')
    .map(([key, value]) => ({
      value: value as string,
      label: key.replace(/_/g, ' '), // Replace underscores with spaces for display
    }));
};
