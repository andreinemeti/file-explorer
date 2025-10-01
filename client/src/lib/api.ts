import type { FileSystemEntry, ListingResponse } from '../types';


export async function getFiles(path: string): Promise<ListingResponse> {
    const url = new URL('/api/files', window.location.origin);
    if (path) url.searchParams.set('path', path);
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}


export async function getFileDetails(path: string): Promise<FileSystemEntry> {
    const url = new URL('/api/file', window.location.origin);
    if (path) url.searchParams.set('path', path);
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}