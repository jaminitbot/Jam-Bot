import { GuildMember, PermissionString } from "discord.js"
/**
 * 
 * @param member Guild member to check
 * @param permissions Permissions required
 * @returns Boolean
 */
export function checkperm(member: GuildMember, permissions: Array<PermissionString>) {
	if (
		member.hasPermission(permissions) ||
		member.id == process.env.OWNERID
	) {
		return true
	}
	return false
}
