import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../../bot';
import { ListeningModes } from '../../listeningModes';
import { SpeechCommand } from '../speechCommand';

const stopWords = [
  'power down',
  'stop listening',
  'deactivate',
  'power off',
  'turn off',
  'turn yourself off'
];

@SpeechCommand(ListeningModes.Passive)
export class Stop implements ISpeechCommand {
  constructor(
    private bot = Bot.Instance()
  ) { }

  Condition = (transcript: string) => stopWords.some(w => transcript.toLowerCase().includes(w));
  Action = async () => {
    await this.bot.Speaker.Publish('Goodbye');
    this.bot.Deactivate();
  };
}
