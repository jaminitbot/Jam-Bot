import { VoiceState } from "discord.js";
import {randomInt} from '../functions/util'
import {snipeLifetime} from "../functions/snipe";
export default function register(oldState: VoiceState, newState: VoiceState) {
	if (newState.member.user.bot) return
	if (newState.channelID) {
		if (newState.member.id == '261222439512440832' || newState.member.id == '582305080200396811' || newState.member.id == '230460974400929793' || newState.member.id == '707313027485270067') {
			if (randomInt(1, 15) == 7) {
				try {
					setTimeout(() => newState.kick('One in 15 chance of being disconnected, sadly you got disconnected'), randomInt(1,10) * 1000)
				} catch {
					// eslint-disable-next-line no-empty
					{}
				}

			}
		}
	}
}