import { db } from '#lib/db';
import { Prisma } from '@prisma/client';
import { requireAuth } from '#lib/auth';
import { cache } from 'react';

export interface PersonData {
  id?: string;
  name: string;
  nickname?: string;
  birthday?: string;
  howWeMet?: string;
  interests: string[];
  notes?: string;
}

export interface DiaryData {
  content: string;
  date: string;
  mentions: string[];
  locations?: Array<{
    name: string;
    placeId: string;
    lat: number;
    lng: number;
  }>;
}

export type PersonWithMentions = Prisma.PersonGetPayload<{
  include: {
    mentions: {
      include: {
        diaryEntry: {
          include: {
            mentions: {
              include: {
                person: true;
              };
            };
            locations: true;
          };
        };
      };
    };
  };
}>;

export type DiaryEntryWithRelations = Prisma.DiaryEntryGetPayload<{
  include: {
    mentions: {
      include: {
        person: true;
      };
    };
    locations: true;
  };
}>;

export const getPeople = cache(async (): Promise<PersonWithMentions[]> => {
  const user = await requireAuth();
  return db.person.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
    include: {
      mentions: {
        include: {
          diaryEntry: {
            include: {
              mentions: {
                include: {
                  person: true,
                },
              },
              locations: true,
            },
          },
        },
      },
    },
  });
});

export const getPerson = cache(
  async (id: string): Promise<PersonWithMentions | null> => {
    const user = await requireAuth();
    return db.person.findFirst({
      where: { id, userId: user.id },
      include: {
        mentions: {
          include: {
            diaryEntry: {
              include: {
                mentions: {
                  include: {
                    person: true,
                  },
                },
                locations: true,
              },
            },
          },
        },
      },
    });
  }
);

export async function createPerson(data: PersonData) {
  const user = await requireAuth();
  return db.person.create({
    data: {
      name: data.name,
      nickname: data.nickname,
      birthday: data.birthday ? new Date(data.birthday) : null,
      howWeMet: data.howWeMet,
      interests: data.interests,
      notes: data.notes,
      userId: user.id,
    },
  });
}

export async function updatePerson(id: string, data: PersonData) {
  const user = await requireAuth();
  return db.person.update({
    where: { id, userId: user.id },
    data: {
      name: data.name,
      nickname: data.nickname,
      birthday: data.birthday ? new Date(data.birthday) : null,
      howWeMet: data.howWeMet,
      interests: data.interests,
      notes: data.notes,
      userId: user.id,
    },
  });
}

export async function deletePerson(id: string) {
  const user = await requireAuth();
  return db.person.delete({
    where: { id, userId: user.id },
  });
}

export interface DiaryEntriesOptions {
  page?: number;
  pageSize?: number;
  startDate?: Date;
  endDate?: Date;
}

export const getDiaryEntries = cache(
  async (
    options: DiaryEntriesOptions = {}
  ): Promise<{
    entries: DiaryEntryWithRelations[];
    total: number;
  }> => {
    const user = await requireAuth();
    const { page = 1, pageSize = 10, startDate, endDate } = options;

    const where = {
      userId: user.id,
      ...(startDate && endDate
        ? {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }
        : {}),
    };

    const [entries, total] = await Promise.all([
      db.diaryEntry.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          mentions: {
            include: {
              person: true,
            },
          },
          locations: true,
        },
      }),
      db.diaryEntry.count({ where }),
    ]);

    return { entries, total };
  }
);

export const getDiaryEntry = cache(
  async (id: string): Promise<DiaryEntryWithRelations | null> => {
    const user = await requireAuth();
    return db.diaryEntry.findFirst({
      where: { id, userId: user.id },
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
);

export async function createDiaryEntry(data: DiaryData) {
  const user = await requireAuth();
  return db.diaryEntry.create({
    data: {
      content: data.content,
      date: new Date(data.date),
      userId: user.id,
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
  const user = await requireAuth();
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
      userId: user.id,
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
  const user = await requireAuth();
  return db.diaryEntry.delete({
    where: { id, userId: user.id },
  });
}
