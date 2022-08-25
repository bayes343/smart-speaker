import { ISpeechCommand } from 'tsbase/Utility/Speech/ISpeechCommand';
import { Bot } from '../bot';

export function SpeechCommand(target: { new(): ISpeechCommand }) {
  Bot.Instance().Commands.push(new target());
}
