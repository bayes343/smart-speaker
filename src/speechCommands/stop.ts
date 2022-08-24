import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { ISpeechSynthesizer } from 'tsbase/Utility/Speech/ISpeechSynthesizer';

const stopWords = [
  'stop',
  'halt',
  'goodbye'
];

export class Stop implements ISpeechCommand {
  constructor(
    private speechSynthesizer: ISpeechSynthesizer,
    private voice: SpeechSynthesisVoice,
    private stopFunction: () => void
  ) { }

  Condition = (transcript: string) => stopWords.some(w => transcript.toLowerCase().includes(w));
  Action = async () => {
    this.speechSynthesizer.Speak('Goodbye', this.voice);
    this.stopFunction();
  };
}
