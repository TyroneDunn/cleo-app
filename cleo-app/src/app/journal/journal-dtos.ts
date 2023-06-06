export type GetJournalsDTO = {
  name?: string,
  nameRegex?: string,
  sort?: 'name' | 'dateCreated' | 'lastUpdated',
  order?: 1 | -1,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number,
};

export type UpdateJournalDTO = {
  id: string,
  name?: string,
};
