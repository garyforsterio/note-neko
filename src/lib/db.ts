import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export interface CreatePersonData {
  name: string;
  birthday?: string | null;
  howWeMet?: string | null;
  interests?: string[];
  notes?: string | null;
}

export interface UpdatePersonData {
  name?: string;
  birthday?: string | null;
  howWeMet?: string | null;
  interests?: string[];
  notes?: string | null;
}

export async function getPeople() {
  return prisma.person.findMany({
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
  return prisma.person.findUnique({
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

export async function createPerson(data: {
  name: string;
  birthday: string | null;
  howWeMet: string | null;
  interests: string[];
  notes: string | null;
}) {
  return prisma.person.create({
    data: {
      name: data.name,
      birthday: data.birthday ? new Date(data.birthday) : null,
      howWeMet: data.howWeMet,
      interests: data.interests,
      notes: data.notes,
    },
  });
}

export async function updatePerson(
  id: string,
  data: {
    name?: string;
    birthday?: string | null;
    howWeMet?: string | null;
    interests?: string[];
    notes?: string | null;
  }
) {
  return prisma.person.update({
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
  return prisma.person.delete({
    where: { id },
  });
}

export async function getDiaryEntries() {
  return prisma.diaryEntry.findMany({
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
  return prisma.diaryEntry.findUnique({
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

export async function createDiaryEntry(data: {
  content: string;
  date: string;
  mentions?: string[];
  locations?: Array<{
    name: string;
    placeId: string;
    lat: number;
    lng: number;
  }>;
}) {
  return prisma.diaryEntry.create({
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

export async function updateDiaryEntry(
  id: string,
  data: {
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
) {
  // First, delete all existing mentions and locations
  await prisma.diaryMention.deleteMany({
    where: { diaryEntryId: id },
  });
  await prisma.diaryLocation.deleteMany({
    where: { diaryEntryId: id },
  });

  // Then update the entry with new data
  return prisma.diaryEntry.update({
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
  return prisma.diaryEntry.delete({
    where: { id },
  });
}
