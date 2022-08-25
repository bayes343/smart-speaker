import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../../bot';
import { ListeningModes } from '../../listeningModes';
import { SpeechCommand } from '../speechCommand';

@SpeechCommand(ListeningModes.Passive)
export class Start implements ISpeechCommand {
  constructor(
    private bot = Bot.Instance()
  ) { }

  Condition = (transcript: string) => transcript.toLowerCase().includes(this.bot.Voice.name.toLowerCase());

  Action = async () => {
    await this.bot.Speaker.Publish('I\'m listening');
    await this.bot.Activate(ListeningModes.Active);
  };
}
