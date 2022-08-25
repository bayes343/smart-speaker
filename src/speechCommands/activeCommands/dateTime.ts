import { Queryable } from 'tsbase/Collections/Queryable';
import { SpeechCommand } from '../speechCommand';
import { ActiveCommand } from './activeCommand';
import { removeSpecialCharacters } from '../../util/removeSpecialCharacters';

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
export class DateTime extends ActiveCommand {
  private requestType = RequestType.DateTime;

  Condition = (transcript: string) => {
    let result = false;
    transcript = removeSpecialCharacters(transcript);

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

  action = async () => {
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
