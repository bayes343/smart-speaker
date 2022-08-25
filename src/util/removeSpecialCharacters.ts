import { Regex } from 'tsbase/System/Regex';
import { Strings } from 'tsbase/System/Strings';

export const removeSpecialCharacters = (original: string): string =>
  original.replace(Regex.NonAlphaNumeric, Strings.Empty);
