export type Entry = {
  _id: string;
  body: string;
  journal: string,
  lastUpdated: Date;
  dateCreated: Date,
};

export type EntrySortOption = 'body' | 'lastUpdated' | 'dateCreated';
