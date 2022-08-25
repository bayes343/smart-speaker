import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../../bot';
import { ListeningModes } from '../../listeningModes';

export abstract class ActiveCommand implements ISpeechCommand {
  constructor(
    protected bot = Bot.Instance()
  ) { }

  abstract Condition: (transcript: string) => boolean
  protected abstract action: () => void;
  Action = async () => {
    this.action();
    this.bot.Deactivate(ListeningModes.Active);
  }
}
