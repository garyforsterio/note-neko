import { fn } from '@storybook/test';
import * as actual from './db';

export * from './db';

export const getPeople = fn(actual.getPeople).mockName('getPeople');
export const getPerson = fn(actual.getPerson).mockName('getPerson');
export const createPerson = fn(actual.createPerson).mockName('createPerson');
export const updatePerson = fn(actual.updatePerson).mockName('updatePerson');
export const deletePerson = fn(actual.deletePerson).mockName('deletePerson');

export const getDiaryEntries = fn(actual.getDiaryEntries).mockName(
  'getDiaryEntries'
);
export const getDiaryEntry = fn(actual.getDiaryEntry).mockName('getDiaryEntry');
export const createDiaryEntry = fn(actual.createDiaryEntry).mockName(
  'createDiaryEntry'
);
export const updateDiaryEntry = fn(actual.updateDiaryEntry).mockName(
  'updateDiaryEntry'
);
export const deleteDiaryEntry = fn(actual.deleteDiaryEntry).mockName(
  'deleteDiaryEntry'
);
