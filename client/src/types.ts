export type EntryType = 'file' | 'directory';


export interface FileSystemEntry {
name: string;
path: string; 
type: EntryType;
size?: number;
createdAt: string;
modifiedAt: string;
}


export interface ListingResponse {
current: FileSystemEntry;
entries: FileSystemEntry[];
}