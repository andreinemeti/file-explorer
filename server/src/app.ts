import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import { FileSystemEntry } from './types.js';
import type { Stats, Dirent } from 'fs';

export const app = express();
app.use(cors());

export const getRoot = () => process.env.ROOT_DIR || process.cwd();

function toFileSystemEntryJson(
  entryName: string,
  entryRelativePath: string,
  fileSystemStats: fssync.Stats
): FileSystemEntry {
  const isDirectory = fileSystemStats.isDirectory();
  return {
    name: entryName,
    path: entryRelativePath.replace(/\\/g, '/'),
    type: isDirectory ? 'directory' : 'file',
    size: isDirectory ? undefined : fileSystemStats.size,
    createdAt: fileSystemStats.birthtime?.toISOString?.() ?? new Date().toISOString(),
    modifiedAt: fileSystemStats.mtime?.toISOString?.() ?? new Date().toISOString(),
  };
}

// health
app.get('/', (_request, response) => response.send('ok'));

// GET /api/files?path=some/relative/path
app.get('/api/files', async (request, response) => {
  const rootDirectoryAbsolutePath = path.resolve(getRoot());

  try {
    const requestedRelativePath = String(request.query.path ?? '');
    const resolvedTargetDirectoryPath = path.resolve(rootDirectoryAbsolutePath, requestedRelativePath || '');

    // Block path traversal: ensure resolvedTargetDirectoryPath stays inside rootDirectoryAbsolutePath
    const relativeFromRootToTarget = path.relative(rootDirectoryAbsolutePath, resolvedTargetDirectoryPath);
    const targetEscapesRoot =
      relativeFromRootToTarget.startsWith('..') || path.isAbsolute(relativeFromRootToTarget);

    if (targetEscapesRoot) {
      return response.status(400).json({ error: 'Invalid path' });
    }

    // Ensure the resolved path is a directory
    let targetDirectoryStats: Stats;
    try {
      targetDirectoryStats = await fs.stat(resolvedTargetDirectoryPath);
    } catch (fileSystemError: any) {
      if (fileSystemError?.code === 'ENOENT') return response.status(404).json({ error: 'Not found' });
      if (fileSystemError?.code === 'EACCES' || fileSystemError?.code === 'EPERM') {
        return response.status(403).json({ error: 'Permission denied' });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }

    if (!targetDirectoryStats.isDirectory()) {
      return response.status(400).json({ error: 'Path is not a directory' });
    }

    // Read directory entries
    let directoryEntries: Dirent[];
    try {
      directoryEntries = (await fs.readdir(resolvedTargetDirectoryPath, {
        withFileTypes: true,
      })) as unknown as Dirent[];
    } catch (fileSystemError: any) {
      if (fileSystemError?.code === 'ENOENT') return response.status(404).json({ error: 'Not found' });
      if (fileSystemError?.code === 'EACCES' || fileSystemError?.code === 'EPERM') {
        return response.status(403).json({ error: 'Permission denied' });
      }
      return response.status(500).json({ error: 'Unable to read directory' });
    }


    const directoryEntryJsonList: FileSystemEntry[] = [];

    for (const directoryEntry of directoryEntries) {
      const childAbsolutePath = path.join(resolvedTargetDirectoryPath, directoryEntry.name);
      const childRelativePath = path.posix.join(requestedRelativePath || '', directoryEntry.name);

      try {
        const childStats = await fs.stat(childAbsolutePath);
        directoryEntryJsonList.push(
          toFileSystemEntryJson(directoryEntry.name, childRelativePath, childStats)
        );
      } catch (fileSystemError: any) {
        // Skip unreadable or vanished entries
        if (
          fileSystemError?.code === 'ENOENT' ||
          fileSystemError?.code === 'EACCES' ||
          fileSystemError?.code === 'EPERM'
        ) {
          continue;
        }
        console.error('[files child]', fileSystemError);
        return response.status(500).json({ error: 'Internal server error' });
      }
    }

    // Sorting directories first, then alphabetical by name
    directoryEntryJsonList.sort((leftEntry, rightEntry) => {
      const bothSameType = leftEntry.type === rightEntry.type;
      if (bothSameType) return leftEntry.name.localeCompare(rightEntry.name);
      return leftEntry.type === 'directory' ? -1 : 1;
    });

    const currentDirectoryEntry = toFileSystemEntryJson(
      path.basename(resolvedTargetDirectoryPath) || '/',
      requestedRelativePath || '',
      targetDirectoryStats
    );

    return response.json({ current: currentDirectoryEntry, entries: directoryEntryJsonList });
  } catch (unhandledError) {
    console.error('[files]', unhandledError);
    return response.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/file?path=some/relative/path
app.get('/api/file', async (request, response) => {
  const rootDirectoryAbsolutePath = path.resolve(getRoot());

  try {
    const requestedRelativePath = String(request.query.path ?? '');
    const resolvedTargetFilePath = path.resolve(rootDirectoryAbsolutePath, requestedRelativePath || '');

    // Prevent path traversal: the resolved path must stay inside rootDirectoryAbsolutePath
    const relativeFromRootToTarget = path.relative(rootDirectoryAbsolutePath, resolvedTargetFilePath);
    const targetEscapesRoot =
      relativeFromRootToTarget.startsWith('..') || path.isAbsolute(relativeFromRootToTarget);

    if (targetEscapesRoot) {
      return response.status(400).json({ error: 'Invalid path' });
    }

    // Stat the target path
    let targetFileStats: Stats;
    try {
      targetFileStats = await fs.stat(resolvedTargetFilePath);
    } catch (fileSystemError: any) {
      if (fileSystemError?.code === 'ENOENT') return response.status(404).json({ error: 'Not found' });
      if (fileSystemError?.code === 'EACCES' || fileSystemError?.code === 'EPERM') {
        return response.status(403).json({ error: 'Permission denied' });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }

    const targetEntryName = path.basename(resolvedTargetFilePath) || '/';
    return response.json(
      toFileSystemEntryJson(targetEntryName, requestedRelativePath, targetFileStats)
    );
  } catch (unhandledError) {
    console.error('[file]', unhandledError);
    return response.status(500).json({ error: 'Internal server error' });
  }
});
