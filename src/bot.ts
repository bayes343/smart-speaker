import { AsyncObservable } from 'tsbase/Patterns/Observable/AsyncObservable';
import { Observable } from 'tsbase/Patterns/Observable/Observable';
import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { SpeechRecognizer, SpeechSynthesizer } from 'tsbase/Utility/Speech/module';
import { ListeningModes } from './listeningModes';

export class Bot {
  private static instance: Bot | null = null;
  public static Instance = (
    passiveSpeechRecognizer = new SpeechRecognizer(),
    activeSpeechRecognizer = new SpeechRecognizer(),
    speechSynthesizer = new SpeechSynthesizer()
  ): Bot => this.instance = this.instance || new Bot(passiveSpeechRecognizer, activeSpeechRecognizer, speechSynthesizer);
  public static Destroy = (): void => { this.instance = null; };

  public Speaker = new AsyncObservable<string>();
  public ActiveCommands: ISpeechCommand[] = [];
  public PassiveCommands: ISpeechCommand[] = [];
  public VoiceChanged = new Observable();
  private stopPassiveListening = false;
  private stopActiveListening = false;

  public get AvailableVoices(): Array<SpeechSynthesisVoice> {
    return speechSynthesis.getVoices().filter(v => v.localService && v.lang.startsWith('en'));
  }

  private voice: SpeechSynthesisVoice | null = null;
  public get Voice(): SpeechSynthesisVoice {
    return this.voice = this.voice || this.AvailableVoices[1];
  }
  public set Voice(v: SpeechSynthesisVoice) {
    this.voice = v;
    this.VoiceChanged.Publish();
  }

  private constructor(
    private passiveSpeechRecognizer: SpeechRecognizer,
    private activeSpeechRecognizer: SpeechRecognizer,
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

  public async Activate(mode = ListeningModes.Passive): Promise<void> {
    if (mode === ListeningModes.Passive) {
      await this.passiveSpeechRecognizer.HandleSpeechCommands(this.PassiveCommands, () => this.stopPassiveListening);
      this.stopPassiveListening = false;
    } else {
      await this.activeSpeechRecognizer.HandleSpeechCommands(this.ActiveCommands, () => this.stopActiveListening);
      this.stopActiveListening = false;
    }
  }

  public Deactivate(mode = ListeningModes.Passive): void {
    this.stopActiveListening = true;
    if (mode === ListeningModes.Active) {
      return;
    }
    this.stopPassiveListening = true;
  }
}
