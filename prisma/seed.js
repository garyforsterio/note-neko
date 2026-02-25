"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcryptjs_1 = require("bcryptjs");
var client_js_1 = require("../src/generated/prisma/client.js");
var prisma = new client_js_1.PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var passwordHash, user, people, locations, entries, i, date, mentions, entryLocations, entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, bcryptjs_1.hash)("password123", 10)];
                case 1:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "test@example.com" },
                            update: {},
                            create: {
                                email: "test@example.com",
                                passwordHash: passwordHash,
                            },
                        })];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, Promise.all([
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
                        ])];
                case 3:
                    people = _a.sent();
                    locations = [
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
                    entries = [];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < 30)) return [3 /*break*/, 7];
                    date = new Date();
                    date.setDate(date.getDate() - i);
                    mentions = people
                        .sort(function () { return Math.random() - 0.5; })
                        .slice(0, Math.floor(Math.random() * 2) + 1);
                    entryLocations = locations
                        .sort(function () { return Math.random() - 0.5; })
                        .slice(0, Math.floor(Math.random() * 3));
                    return [4 /*yield*/, prisma.diaryEntry.create({
                            data: {
                                content: "Today was a great day! ".concat(mentions
                                    .map(function (p) { return "I met with ".concat(p.name, " and we had a wonderful time."); })
                                    .join(" "), " ").concat(entryLocations.length > 0
                                    ? "We visited ".concat(entryLocations.map(function (l) { return l.name; }).join(" and "), ".")
                                    : ""),
                                date: date,
                                userId: user.id,
                                mentions: {
                                    create: mentions.map(function (person) { return ({
                                        personId: person.id,
                                    }); }),
                                },
                                locations: {
                                    create: entryLocations.map(function (location) { return ({
                                        name: location.name,
                                        placeId: location.placeId,
                                        lat: location.lat,
                                        lng: location.lng,
                                    }); }),
                                },
                            },
                        })];
                case 5:
                    entry = _a.sent();
                    entries.push(entry);
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    console.log("Seed data created successfully!");
                    console.log("Created ".concat(people.length, " people"));
                    console.log("Created ".concat(entries.length, " diary entries"));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
