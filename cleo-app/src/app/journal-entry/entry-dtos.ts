import {Entry} from "./entry.type";

export type GetEntriesResponseDTO = {
  count: number,
  journals: Entry[],
  page?: number,
  limit?: number,
};
