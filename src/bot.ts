import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { SpeechRecognizer, SpeechSynthesizer } from 'tsbase/Utility/Speech/module';
import { Stop, Unknown } from './speechCommands/module';

speechSynthesis.getVoices(); // bug with web api? - doesn't find voices on line 9 without this

export class Bot {
  private get voice() {
    return speechSynthesis.getVoices().filter(v => v.lang === 'en-US')[2];
  }
  private stopListening = false;
  private commands: ISpeechCommand[] = [
    new Stop(this.ss, this.voice, () => this.stopListening = true),
    new Unknown(this.ss, this.voice)
  ];

  constructor(
    private sr = new SpeechRecognizer(),
    private ss = new SpeechSynthesizer()
  ) { }

  public async Activate(): Promise<void> {
    await this.sr.HandleSpeechCommands(this.commands, () => this.stopListening);
  }
}
