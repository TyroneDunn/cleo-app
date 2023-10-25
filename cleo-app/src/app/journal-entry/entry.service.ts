import {Observable} from "rxjs";
import {
  GetEntriesDTO,
  GetEntriesResponseDTO,
  CreateEntryDTO,
  UpdateEntryDTO
} from "./entry-dtos";
import {Entry} from "./entry.type";

export interface EntryService {
  getEntry$: (id: string) => Observable<Entry | null>;
  getEntries$: (dto: GetEntriesDTO) => Observable<GetEntriesResponseDTO>;
  createEntry$: (dto: CreateEntryDTO) => Observable<Entry>;
  updateEntry$: (dto: UpdateEntryDTO) => Observable<Entry>;
  deleteEntry$: (id: string) => Observable<Entry>;
}
