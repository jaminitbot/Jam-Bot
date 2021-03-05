module.exports = {
	async register(member) {
		if (member.guild.id == '779060204528074783') {
			let aRole
			if (member.id == '438815630884601856' || member.id == '265933873358045185' || member.id == '724842710221193217' || member.id == '312272690473992202') {
				aRole = await member.guild.roles.cache.find(role => role.id == "781999680832929813")
				member.roles.add(aRole)
				aRole = await member.guild.roles.cache.find(role => role.id == "789810162696192011")
				member.roles.add(aRole)
				aRole = await member.guild.roles.cache.find(role => role.id == "808039423916245042")
				member.roles.add(aRole)
			} else {
				aRole = await member.guild.roles.cache.find(role => role.id == "791381859878961202")
				member.roles.add(aRole)
			}

		}
	}
}