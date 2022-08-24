import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { ISpeechSynthesizer } from 'tsbase/Utility/Speech/ISpeechSynthesizer';

const greetings = [
  'hi',
  'hello',
  'good morning',
  'good afternoon',
  'good evening'
];

export class Greeting implements ISpeechCommand {
  constructor(
    private speechSynthesizer: ISpeechSynthesizer,
    private voice: SpeechSynthesisVoice
  ) { }

  Condition = (transcript: string) => greetings.some(w => transcript.toLowerCase().includes(w));
  Action = async () => {
    await this.speechSynthesizer.Speak('Hello! What can I do for you?', this.voice);
  };
}
