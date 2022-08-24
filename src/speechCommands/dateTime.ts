import { Strings } from 'tsbase/System/Strings';
import { Queryable } from 'tsbase/Collections/Queryable';
import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';

const timeKeywords = [
  'what is',
  'whats the',
  'time',
  'tell me',
  'do you know'
];

const dayKeywords = timeKeywords.map(tr => tr.replace('time', 'date'))
  .concat(timeKeywords.map(tr => tr.replace('time', 'day')));

export class Time implements ISpeechCommand {
  private requestType: 'time' | 'day' = 'day';

  constructor(
    private speaker: AsyncObservable<string>
  ) { }

  Condition = (transcript: string) => {
    transcript = transcript.replace(/[^a-zA-Z0-9 ]/g, Strings.Empty);
    if (transcript) {
      if (Queryable.From(timeKeywords).Search(transcript.toLowerCase(), 3).length > 1) {
        this.requestType = 'time';
        return true;
      } else if (Queryable.From(dayKeywords).Search(transcript.toLowerCase(), 3).length > 1) {
        this.requestType = 'day';
        return true;
      }
    }
    return false;
  };
  Action = async () => {
    await this.speaker.Publish(`The local ${this.requestType} is: ${this.requestType === 'time' ?
      new Date().toLocaleTimeString() : new Date().toLocaleDateString()}.`);
  };
}
