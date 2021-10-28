import { CommandInteraction, Message } from "discord.js";
import { Collection, MongoClient } from "mongodb";
let totalMessagesCreated = 0;
let totalMessagesDeleted = 0;
let totalMessagesEdited = 0;
let totalSlashCommandsCreated = 0;
// eslint-disable-next-line prefer-const
let dbObject = {};
export async function connectToSatsCollection(databaseClient: MongoClient) {
	this.db = databaseClient.db(process.env.databaseName);
	const newDb: Collection = this.db.collection("stats");
	newDb.createIndex({ date: 1 }, { expireAfterSeconds: 86400 });
}

export function storeMessageCreate(message: Message) {
	totalMessagesCreated += 1;
	const guildId = message.guild ? message.guild.id : 0;
	if (!dbObject[guildId]) dbObject[guildId] = {};
	let prevMessagesCreated = 0;
	if (dbObject[guildId] && dbObject[guildId].totalMessagesCreated) {
		prevMessagesCreated = dbObject[guildId].totalMessagesCreated;
	}
	dbObject[guildId].guildId = guildId;
	dbObject[guildId].totalMessagesCreated = prevMessagesCreated + 1;
}

export function storeMessageDelete(message: Message) {
	totalMessagesDeleted += 1;
	const guildId = message.guild ? message.guild.id : 0;
	if (!dbObject[guildId]) dbObject[guildId] = {};
	let prevMessagesDeleted = 0;
	if (dbObject[guildId] && dbObject[guildId].totalMessagesDeleted) {
		prevMessagesDeleted = dbObject[guildId].totalMessagesDeleted;
	}
	dbObject[guildId].guildId = guildId;
	dbObject[guildId].totalMessagesDeleted = prevMessagesDeleted + 1;
}

export function storeMessageEdit(newMessage: Message) {
	totalMessagesEdited += 1;
	const guildId = newMessage.guild ? newMessage.guild.id : 0;
	if (!dbObject[guildId]) dbObject[guildId] = {};
	let prevMessagesEdited = 0;
	if (dbObject[guildId] && dbObject[guildId].totalMessagesEdited) {
		prevMessagesEdited = dbObject[guildId].totalMessagesEdited;
	}
	dbObject[guildId].guildId = guildId;
	dbObject[guildId].totalMessagesEdited = prevMessagesEdited + 1;
}
export function storeSlashCommandCreate(interaction: CommandInteraction) {
	totalSlashCommandsCreated += 1;
	const guildId = interaction.guild ? interaction.guild.id : 0;
	let prevSlashCommandsCreated = 0;
	if (!dbObject[guildId]) dbObject[guildId] = {};
	if (dbObject[guildId] && dbObject[guildId].totalSlashCommandsCreated) {
		prevSlashCommandsCreated = dbObject[guildId].totalSlashCommandsCreated;
	}
	dbObject[guildId].guildId = guildId;
	dbObject[guildId].totalSlashCommandsCreated = prevSlashCommandsCreated + 1;
}
export async function saveStatsToDB() {
	const mongoDbObject = {
		date: new Date(),
		totalMessagesCreated: totalMessagesCreated,
		totalMessagesDeleted: totalMessagesDeleted,
		totalMessagesEdited: totalMessagesEdited,
		totalSlashCommandsCreated: totalSlashCommandsCreated,
		guildStats: dbObject,
	};
	const db = this.db.collection("stats");
	db.insertOne(mongoDbObject);
	dbObject = {};
	totalMessagesCreated = 0;
	totalMessagesDeleted = 0;
	totalMessagesEdited = 0;
	totalSlashCommandsCreated = 0;
}
