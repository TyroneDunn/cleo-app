export type Journal = {
  _id: string,
  name: string,
  lastUpdated: Date,
  dateOfCreation: Date,
};

export type JournalSortOption = 'name' | 'lastUpdated' | 'dateCreated';
