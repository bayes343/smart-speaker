import { ListeningModes } from '../../listeningModes';
import { SpeechCommand } from '../speechCommand';
import { ActiveCommand } from './activeCommand';

const cancelWords = [
  'stop',
  'nevermind',
  'never mind',
  'cancel'
];

@SpeechCommand()
export class Cancel extends ActiveCommand {
  Condition = (transcript: string) => cancelWords.some(w => transcript.toLowerCase().includes(w));
  action = async () => {
    await this.bot.Speaker.Publish('Ok');
    this.bot.Deactivate(ListeningModes.Active);
  };
}
