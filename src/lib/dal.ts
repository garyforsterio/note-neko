import { db } from '#lib/db';

export interface PersonData {
  id: string;
  name: string;
  birthday?: string | null;
  howWeMet?: string | null;
  interests?: string[];
  notes?: string | null;
}

export interface DiaryData {
  content: string;
  date: string;
  mentions?: string[];
  locations?: Array<{
    name: string;
    placeId: string;
    lat: number;
    lng: number;
  }>;
}

export async function getPeople() {
  return db.person.findMany({
    orderBy: { name: 'asc' },
    include: {
      mentions: {
        include: {
          diaryEntry: true,
        },
      },
    },
  });
}

export async function getPerson(id: string) {
  return db.person.findUnique({
    where: { id },
    include: {
      mentions: {
        include: {
          diaryEntry: true,
        },
      },
    },
  });
}

export async function createPerson(data: PersonData) {
  return db.person.create({
    data: {
      name: data.name,
      birthday: data.birthday ? new Date(data.birthday) : null,
      howWeMet: data.howWeMet,
      interests: data.interests,
      notes: data.notes,
    },
  });
}

export async function updatePerson(id: string, data: PersonData) {
  return db.person.update({
    where: { id },
    data: {
      name: data.name,
      birthday: data.birthday ? new Date(data.birthday) : null,
      howWeMet: data.howWeMet,
      interests: data.interests,
      notes: data.notes,
    },
  });
}

export async function deletePerson(id: string) {
  return db.person.delete({
    where: { id },
  });
}

export async function getDiaryEntries() {
  return db.diaryEntry.findMany({
    orderBy: { date: 'desc' },
    include: {
      mentions: {
        include: {
          person: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      locations: true,
    },
  });
}

export async function getDiaryEntry(id: string) {
  return db.diaryEntry.findUnique({
    where: { id },
    include: {
      mentions: {
        include: {
          person: true,
        },
      },
      locations: true,
    },
  });
}

export async function createDiaryEntry(data: DiaryData) {
  return db.diaryEntry.create({
    data: {
      content: data.content,
      date: new Date(data.date),
      mentions: {
        create: data.mentions?.map((personId) => ({
          person: {
            connect: { id: personId },
          },
        })),
      },
      locations: {
        create: data.locations?.map((location) => ({
          name: location.name,
          placeId: location.placeId,
          lat: location.lat,
          lng: location.lng,
        })),
      },
    },
    include: {
      mentions: {
        include: {
          person: true,
        },
      },
      locations: true,
    },
  });
}

export async function updateDiaryEntry(id: string, data: DiaryData) {
  // First, delete all existing mentions and locations
  await db.diaryMention.deleteMany({
    where: { diaryEntryId: id },
  });
  await db.diaryLocation.deleteMany({
    where: { diaryEntryId: id },
  });

  // Then update the entry with new data
  return db.diaryEntry.update({
    where: { id },
    data: {
      content: data.content,
      date: new Date(data.date),
      mentions: {
        create: data.mentions?.map((personId) => ({
          person: {
            connect: { id: personId },
          },
        })),
      },
      locations: {
        create: data.locations?.map((location) => ({
          name: location.name,
          placeId: location.placeId,
          lat: location.lat,
          lng: location.lng,
        })),
      },
    },
    include: {
      mentions: {
        include: {
          person: true,
        },
      },
      locations: true,
    },
  });
}

export async function deleteDiaryEntry(id: string) {
  return db.diaryEntry.delete({
    where: { id },
  });
}
