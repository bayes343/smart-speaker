import { SpeechRecognizer } from 'tsbase/Utility/Speech/SpeechRecognizer';
import { removeSpecialCharacters } from '../../util/removeSpecialCharacters';
import { SpeechCommand } from '../speechCommand';
import { ActiveCommand } from './activeCommand';

const promptKeywords = [
  'pick a new voice',
  'change the voice',
  'change your voice'
];

@SpeechCommand()
export class ChangeVoice extends ActiveCommand {
  constructor(
    private speechRecognizer = new SpeechRecognizer()
  ) {
    super();
  }

  Condition = (transcript: string) => promptKeywords.some(k => transcript.toLowerCase().includes(k));;

  action = async () => {
    const voiceNames = this.bot.AvailableVoices.map(a => a.name).join(', ');
    await this.bot.Speaker.Publish(`Ok, please choose one of the following: ${voiceNames}`);

    const input = removeSpecialCharacters(await this.speechRecognizer.Listen());
    const newVoiceName = voiceNames.split(', ').find(v => v.toLowerCase().includes(input.toLowerCase()));

    if (newVoiceName) {
      const newVoice = this.bot.AvailableVoices.find(v => v.name === newVoiceName) as SpeechSynthesisVoice;
      this.bot.Voice = newVoice;
      await this.bot.Speaker.Publish(`Successfully changed voice to, "${newVoice.name}"`);
    } else {
      await this.bot.Speaker.Publish(`Sorry, I could not change my voice to, "${input}"`);
    }
  };
}
