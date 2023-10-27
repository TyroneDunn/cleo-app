import {Journal, JournalSortOption} from "./journal.type";

export type GetJournalsDTO = {
  name?: string,
  nameRegex?: string,
  sort?: JournalSortOption,
  order?: 1 | -1,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number,
};

export type GetJournalsResponseDTO = {
  count: number,
  items: Journal[],
  page?: number,
  limit?: number,
};

export type CreateJournalDTO = {
  name: string,
};

export type UpdateJournalDTO = {
  id: string,
  name?: string,
};
