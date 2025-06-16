import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	// Create a test user
	const passwordHash = await hash("password123", 10);
	const user = await prisma.user.upsert({
		where: { email: "test@example.com" },
		update: {},
		create: {
			email: "test@example.com",
			passwordHash,
		},
	});

	// Create some test people
	const people = await Promise.all([
		prisma.person.create({
			data: {
				name: "John Doe",
				nickname: "Johnny",
				interests: ["coding", "hiking", "photography"],
				howWeMet: "Met at a tech conference",
				userId: user.id,
			},
		}),
		prisma.person.create({
			data: {
				name: "Jane Smith",
				nickname: "Janie",
				interests: ["reading", "cooking", "travel"],
				howWeMet: "Met through mutual friends",
				userId: user.id,
			},
		}),
		prisma.person.create({
			data: {
				name: "Bob Wilson",
				nickname: "Bobby",
				interests: ["sports", "music", "gaming"],
				howWeMet: "Met at a local meetup",
				userId: user.id,
			},
		}),
	]);

	// Sample locations
	const locations = [
		{
			name: "Central Park",
			placeId: "ChIJaXQRsBm3woAR3KC-5oK5mXY",
			lat: 40.7829,
			lng: -73.9654,
		},
		{
			name: "Times Square",
			placeId: "ChIJaXQRsBm3woAR3KC-5oK5mXY",
			lat: 40.758,
			lng: -73.9855,
		},
		{
			name: "Empire State Building",
			placeId: "ChIJaXQRsBm3woAR3KC-5oK5mXY",
			lat: 40.7484,
			lng: -73.9857,
		},
	];

	// Generate diary entries for the last 30 days
	const entries = [];
	for (let i = 0; i < 30; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);

		// Randomly select 1-2 people to mention
		const mentions = people
			.sort(() => Math.random() - 0.5)
			.slice(0, Math.floor(Math.random() * 2) + 1);

		// Randomly select 0-2 locations
		const entryLocations = locations
			.sort(() => Math.random() - 0.5)
			.slice(0, Math.floor(Math.random() * 3));

		const entry = await prisma.diaryEntry.create({
			data: {
				content: `Today was a great day! ${mentions
					.map((p) => `I met with ${p.name} and we had a wonderful time.`)
					.join(" ")} ${
					entryLocations.length > 0
						? `We visited ${entryLocations.map((l) => l.name).join(" and ")}.`
						: ""
				}`,
				date,
				userId: user.id,
				mentions: {
					create: mentions.map((person) => ({
						personId: person.id,
					})),
				},
				locations: {
					create: entryLocations.map((location) => ({
						name: location.name,
						placeId: location.placeId,
						lat: location.lat,
						lng: location.lng,
					})),
				},
			},
		});

		entries.push(entry);
	}

	console.log("Seed data created successfully!");
	console.log(`Created ${people.length} people`);
	console.log(`Created ${entries.length} diary entries`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
