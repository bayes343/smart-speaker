import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';

const greetings = [
  'hi',
  'hello',
  'good morning',
  'good afternoon',
  'good evening'
];

export class Greeting implements ISpeechCommand {
  constructor(
    private speaker: AsyncObservable<string>
  ) { }

  Condition = (transcript: string) => greetings.some(w => transcript.toLowerCase().includes(w));
  Action = async () => {
    await this.speaker.Publish('Hello! What can I do for you?');
  };
}
