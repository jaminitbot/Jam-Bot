module.exports = {
	register(member){
		if (member.guild.id == '779060204528074783'){
			let aRole = member.guild.roles.cache.find(role => role.id == "791381859878961202")
			member.roles.add(aRole)
		}
	}
}