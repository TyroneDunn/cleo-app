export type Journal = {
  _id: string,
  name: string,
  lastUpdated: Date,
  dateCreated: Date,
};

export type JournalSortOption = 'name' | 'lastUpdated' | 'dateCreated';
