import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { SpeechRecognizer, SpeechSynthesizer } from 'tsbase/Utility/Speech/module';
import { Greeting, Stop, Unknown } from './speechCommands/module';
import { Time } from './speechCommands/dateTime';

speechSynthesis.getVoices(); // bug with web api? - doesn't find voices on line 9 without this

export class Bot {
  public Speaker = new AsyncObservable<string>();
  private get voice() {
    return speechSynthesis.getVoices().filter(v => v.lang === 'en-US')[2];
  }
  private stopListening = false;
  private commands: ISpeechCommand[] = [
    new Stop(this.Speaker, () => this.stopListening = true),
    new Greeting(this.Speaker),
    new Time(this.Speaker),
    new Unknown(this.Speaker)
  ];

  constructor(
    private sr = new SpeechRecognizer(),
    private ss = new SpeechSynthesizer()
  ) {
    setTimeout(() => { // push this sub to below the one in welcome
      this.Speaker.Subscribe(async (transcript) => {
        if (transcript) {
          await this.ss.Speak(transcript, this.voice);
        }
      });
    });
  }

  public async Activate(): Promise<void> {
    await this.sr.HandleSpeechCommands(this.commands, () => this.stopListening);
    this.stopListening = false;
  }
}
