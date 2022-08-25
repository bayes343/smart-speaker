import { Strings } from 'tsbase/System/Strings';
import { Queryable } from 'tsbase/Collections/Queryable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../bot';
import { SpeechCommand } from './speechCommand';

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

@SpeechCommand()
export class DateTime implements ISpeechCommand {
  private requestType = RequestType.DateTime;

  constructor(
    private bot = Bot.Instance()
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

    await this.bot.Speaker.Publish(`The local ${this.requestType} is: ${requestTypeString[this.requestType]}.`);
  };

  private setRequestType(dayIncluded: boolean, timeIncluded: boolean): void {
    if (dayIncluded && timeIncluded) {
      this.requestType = RequestType.DateTime;
    } else {
      this.requestType = dayIncluded ? RequestType.Date : RequestType.Time;
    }
  }
}
