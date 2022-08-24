import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';

const timeRequests = [
  'what time is it',
  'what\'s the time',
  'what is the time',
  'tell me the time'
];

const dayRequests = timeRequests.map(tr => tr.replace('time', 'date'))
  .concat(timeRequests.map(tr => tr.replace('time', 'day')));

export class Time implements ISpeechCommand {
  private requestType: 'time' | 'day' = 'day';

  constructor(
    private speaker: AsyncObservable<string>
  ) { }

  Condition = (transcript: string) => {
    if (timeRequests.some(t => transcript.toLowerCase().includes(t))) {
      this.requestType = 'time';
      return true;
    } else if (dayRequests.some(t => transcript.toLowerCase().includes(t))) {
      return true;
    } else {
      return false;
    }

  };
  Action = async () => {
    await this.speaker.Publish(`The local ${this.requestType} is: ${this.requestType === 'time' ?
      new Date().toLocaleTimeString() : new Date().toLocaleDateString()}.`);
  };
}
