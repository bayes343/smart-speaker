import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { SpeechRecognizer, SpeechSynthesizer } from 'tsbase/Utility/Speech/module';

export class Bot {
  private static instance: Bot | null = null;
  public static Instance = (
    activeSpeechRecognizer = new SpeechRecognizer(),
    // passiveSpeechRecognizer = new SpeechRecognizer(),
    speechSynthesizer = new SpeechSynthesizer()
  ): Bot => this.instance = this.instance || new Bot(activeSpeechRecognizer, speechSynthesizer);
  public static Destroy = (): void => { this.instance = null; };

  public Speaker = new AsyncObservable<string>();
  public Commands: ISpeechCommand[] = [];
  private stopListening = false;

  private voice: SpeechSynthesisVoice | null = null;
  public get Voice(): SpeechSynthesisVoice {
    return this.voice = this.voice || speechSynthesis.getVoices().filter(v => v.localService && v.lang.startsWith('en'))[1];
  }
  public set Voice(v: SpeechSynthesisVoice) {
    this.voice = v;
  }

  private constructor(
    private activeSpeechRecognizer: SpeechRecognizer,
    // private passiveSpeechRecognizer: SpeechRecognizer,
    private speechSynthesizer: SpeechSynthesizer
  ) {
    setTimeout(() => { // push this sub to below the one in welcome
      this.Speaker.Subscribe(async (transcript) => {
        if (transcript) {
          await this.speechSynthesizer.Speak(transcript, this.Voice);
        }
      });
    });
  }

  public async Activate(): Promise<void> {
    await this.activeSpeechRecognizer.HandleSpeechCommands(this.Commands, () => this.stopListening);
    this.stopListening = false;
  }

  public Deactivate(): void {
    this.stopListening = true;
  }
}
