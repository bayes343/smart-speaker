import { SpeechCommand } from '../speechCommand';
import { ActiveCommand } from './activeCommand';

@SpeechCommand()
export class Unknown extends ActiveCommand {
  private currentTranscript = '';

  Condition = (transcript: string) => {
    this.currentTranscript = transcript;
    return transcript.length > 3;
  };

  action = async () => await this.bot.Speaker.Publish(
    `Sorry, I don't know how to react to, "${this.currentTranscript}"`);
}
