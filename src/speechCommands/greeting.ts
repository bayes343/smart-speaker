import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../bot';
import { SpeechCommand } from './speechCommand';

const greetings = [
  'hi',
  'hello',
  'good morning',
  'good afternoon',
  'good evening'
];

@SpeechCommand
export class Greeting implements ISpeechCommand {
  constructor(
    private bot = Bot.Instance()
  ) { }

  Condition = (transcript: string) => greetings.some(w => transcript.toLowerCase().includes(w));
  Action = async () => {
    await this.bot.Speaker.Publish('Hello! What can I do for you?');
  };
}
