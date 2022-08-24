import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';

export class Unknown implements ISpeechCommand {
  private currentTranscript = '';

  constructor(
    private speaker: AsyncObservable<string>
  ) { }

  Condition = (transcript: string) => {
    this.currentTranscript = transcript;
    return transcript.length > 3;
  };
  Action = async () => await this.speaker.Publish(
    `Sorry, I don't know how to react to: "${this.currentTranscript}"`);
}
