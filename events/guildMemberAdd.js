module.exports = {
	register(member){
		if (member.guild.id == '779060204528074783'){
			if (member.id == '438815630884601856'){
				aRole = member.guild.roles.cache.find(role => role.id == "781999680832929813")
				member.roles.add(aRole)
				aRole = member.guild.roles.cache.find(role => role.id == "789810162696192011")
				member.roles.add(aRole)
				aRole = member.guild.roles.cache.find(role => role.id == "808039423916245042")
				member.roles.add(aRole)
				return
			}
			let aRole = member.guild.roles.cache.find(role => role.id == "791381859878961202")
			member.roles.add(aRole)
		}
	}
}