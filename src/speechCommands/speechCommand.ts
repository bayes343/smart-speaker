import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../bot';

export enum Modes {
  Active,
  Passive
}

export function SpeechCommand(mode = Modes.Active) {
  return (target: { new(): ISpeechCommand }) => {
    const bot = Bot.Instance();
    const commandsReference = mode === Modes.Active ? bot.ActiveCommands : bot.PassiveCommands;
    commandsReference.push(new target());
  };
}
