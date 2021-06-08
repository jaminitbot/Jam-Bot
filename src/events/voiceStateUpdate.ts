import { VoiceState } from "discord.js";
import {randomInt} from '../functions/util'
export default function register(oldState: VoiceState, newState: VoiceState) {
	if (newState.member.user.bot) return
	if (newState.channelID) {
		if (newState.member.id == '261222439512440832') {
			if (randomInt(1, 5) == 3) {
				try {
					newState.kick('One in 5 chance of being disconnected, sadly you got disconnected')
				} catch {
					// eslint-disable-next-line no-empty
					{}
				}

			}
		}
	}
}