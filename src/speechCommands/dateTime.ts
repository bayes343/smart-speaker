import { Strings } from 'tsbase/System/Strings';
import { Queryable } from 'tsbase/Collections/Queryable';
import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';

enum RequestType {
  Time = 'time',
  Date = 'date',
  DateTime = 'date and time'
}

const promptKeywords = [
  'what is',
  'whats the',
  'tell me',
  'do you know'
];

export class DateTime implements ISpeechCommand {
  private requestType = RequestType.DateTime;

  constructor(
    private speaker: AsyncObservable<string>
  ) { }

  Condition = (transcript: string) => {
    let result = false;
    transcript = transcript.replace(/[^a-zA-Z0-9 ]/g, Strings.Empty);

    if (transcript) {
      const isPrompt = Queryable.From(promptKeywords).Search(transcript.toLowerCase(), 3).length;
      const dayIncluded = ['date', 'day'].some(d => transcript.includes(d));
      const timeIncluded = transcript.includes('time');
      result = dayIncluded || timeIncluded;

      if (isPrompt && result) {
        this.setRequestType(dayIncluded, timeIncluded);
      }
    }
    return result;
  };

  Action = async () => {
    const currentDateTime = new Date();
    const requestTypeString: Record<RequestType, string> = {
      [RequestType.Date]: currentDateTime.toLocaleDateString(),
      [RequestType.Time]: currentDateTime.toLocaleTimeString(),
      [RequestType.DateTime]: currentDateTime.toLocaleString()
    };

    await this.speaker.Publish(`The local ${this.requestType} is: ${requestTypeString[this.requestType]}.`);
  };

  private setRequestType(dayIncluded: boolean, timeIncluded: boolean): void {
    if (dayIncluded && timeIncluded) {
      this.requestType = RequestType.DateTime;
    } else {
      this.requestType = dayIncluded ? RequestType.Date : RequestType.Time;
    }
  }
}
