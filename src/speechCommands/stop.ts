import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';

const stopWords = [
  'stop',
  'halt',
  'goodbye'
];

export class Stop implements ISpeechCommand {
  constructor(
    private speaker: AsyncObservable<string>,
    private stopFunction: () => void
  ) { }

  Condition = (transcript: string) => stopWords.some(w => transcript.toLowerCase().includes(w));
  Action = async () => {
    await this.speaker.Publish('Goodbye');
    this.stopFunction();
  };
}
