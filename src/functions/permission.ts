
export function checkperm(member, permissions) {
	if (
		member.hasPermission(permissions) ||
		member.id == process.env.OWNERID
	) {
		return true
	}
	return false
}
