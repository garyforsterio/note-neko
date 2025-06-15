import { getGoogleMapsUrl } from './utils/maps';

interface SimplePerson {
  id: string;
  name: string;
  nickname?: string | null;
}

export const renderMarkdown = (
  content: string,
  mentions?: SimplePerson[],
  locations?: {
    name: string;
    placeId: string;
    lat: number;
    lng: number;
  }[]
) => {
  let transformedContent = content;

  // Replace person mentions with markdown links
  mentions?.forEach((person) => {
    if (person) {
      transformedContent = transformedContent.replace(
        new RegExp(`\\[person:${person.id}\\]`, 'g'),
        `[${person.nickname || person.name}](/en/people/${person.id})`
      );
    }
  });

  // Replace location mentions with markdown links
  locations?.forEach((location) => {
    transformedContent = transformedContent.replace(
      new RegExp(`\\[location:${location.placeId}\\]`, 'g'),
      `[${location.name}](${getGoogleMapsUrl(
        location.placeId,
        location.lat,
        location.lng
      )})`
    );
  });

  return transformedContent;
};
