import { GuildMember, PermissionString } from "discord.js"

export function checkperm(member: GuildMember, permissions: Array<PermissionString>) {
	if (
		member.hasPermission(permissions) ||
		member.id == process.env.OWNERID
	) {
		return true
	}
	return false
}
