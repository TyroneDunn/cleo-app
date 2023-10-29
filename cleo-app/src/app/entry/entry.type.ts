export type Entry = {
  _id: string;
  title: string;
  body: string;
  journal: string,
  lastUpdated: Date;
  dateCreated: Date,
};

export type EntrySortOption = 'title' | 'body' | 'lastUpdated' | 'dateCreated';
