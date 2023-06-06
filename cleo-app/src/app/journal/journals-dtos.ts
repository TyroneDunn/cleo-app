export type Journals$Dto = {
  name?: string,
  nameRegex?: string,
  sort?: 'name' | 'dateCreated' | 'lastUpdated',
  order?: 1 | -1,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number,
};
