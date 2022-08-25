import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { SpeechRecognizer, SpeechSynthesizer } from 'tsbase/Utility/Speech/module';

speechSynthesis.getVoices(); // bug with web api? - doesn't find voices on line 9 without this

export class Bot {
  private static instance: Bot | null = null;
  public static Instance = (
    sr = new SpeechRecognizer(),
    ss = new SpeechSynthesizer()
  ): Bot => this.instance = this.instance || new Bot(sr, ss);
  public static Destroy = (): void => { this.instance = null; };

  public Speaker = new AsyncObservable<string>();
  public Commands: ISpeechCommand[] = [];
  private get voice() {
    return speechSynthesis.getVoices().filter(v => v.lang === 'en-US')[2];
  }
  private stopListening = false;

  private constructor(
    private sr: SpeechRecognizer,
    private ss: SpeechSynthesizer
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
    await this.sr.HandleSpeechCommands(this.Commands, () => this.stopListening);
    this.stopListening = false;
  }

  public Deactivate(): void {
    this.stopListening = true;
  }
}
