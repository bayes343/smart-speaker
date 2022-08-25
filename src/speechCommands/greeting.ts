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

@SpeechCommand()
export class Greeting implements ISpeechCommand {
  private greeting = '';

  constructor(
    private bot = Bot.Instance()
  ) { }

  Condition = (transcript: string) => {
    return greetings.some(w => {
      if (transcript.toLowerCase().includes(w)) {
        this.greeting = w;
        return true;
      }
      return false;
    });
  };
  Action = async () => {
    await this.bot.Speaker.Publish(this.greeting);
  };
}
