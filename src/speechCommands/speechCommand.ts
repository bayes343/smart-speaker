import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../bot';
import { ListeningModes } from '../listeningModes';

export function SpeechCommand(mode = ListeningModes.Active) {
  return (target: { new(): ISpeechCommand }) => {
    const bot = Bot.Instance();
    const commandsReference = mode === ListeningModes.Active ? bot.ActiveCommands : bot.PassiveCommands;
    commandsReference.push(new target());
  };
}
