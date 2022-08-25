import { ActiveCommand } from './activeCommand';
import { SpeechCommand } from '../speechCommand';

const greetings = [
  'hi',
  'hello',
  'good morning',
  'good afternoon',
  'good evening'
];

@SpeechCommand()
export class Greeting extends ActiveCommand {
  private greeting = '';

  Condition = (transcript: string) => {
    return greetings.some(w => {
      if (transcript.toLowerCase().includes(w)) {
        this.greeting = w;
        return true;
      }
      return false;
    });
  };

  action = async () => await this.bot.Speaker.Publish(this.greeting);
}
