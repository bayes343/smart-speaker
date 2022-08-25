import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../bot';
import { SpeechCommand } from './speechCommand';

const stopWords = [
  'stop',
  'halt',
  'goodbye'
];

@SpeechCommand
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
