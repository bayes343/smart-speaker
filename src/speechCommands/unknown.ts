import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { ISpeechSynthesizer } from 'tsbase/Utility/Speech/ISpeechSynthesizer';

export class Unknown implements ISpeechCommand {
  private currentTranscript = '';

  constructor(
    private speechSynthesizer: ISpeechSynthesizer,
    private voice: SpeechSynthesisVoice
  ) { }

  Condition = (transcript: string) => {
    this.currentTranscript = transcript;
    return transcript.length > 3;
  };
  Action = async () => await this.speechSynthesizer.Speak(
    `Sorry, I don't know how to react to: "${this.currentTranscript}"`, this.voice);
}
