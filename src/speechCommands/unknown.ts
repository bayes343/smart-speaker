import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../bot';
import { SpeechCommand } from './speechCommand';

@SpeechCommand()
export class Unknown implements ISpeechCommand {
  private currentTranscript = '';

  constructor(
    private bot = Bot.Instance()
  ) { }

  Condition = (transcript: string) => {
    this.currentTranscript = transcript;
    return transcript.length > 3;
  };

  Action = async () => await this.bot.Speaker.Publish(
    `Sorry, I don't know how to react to, "${this.currentTranscript}"`);
}
