import {Entry} from "./entry.type";

export type GetEntriesResponseDTO = {
  count: number,
  entries: Entry[],
  page?: number,
  limit?: number,
};
