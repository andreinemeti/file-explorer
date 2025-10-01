import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { app } from '../src/app.js';
import request from 'supertest';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

let tmpRoot = '';
const oldEnv = process.env.ROOT_DIR;

beforeAll(async () => {
  tmpRoot = await fsp.mkdtemp(path.join(os.tmpdir(), 'fe-test-'));
  // create structure
  fs.mkdirSync(path.join(tmpRoot, 'dirA'));
  fs.writeFileSync(path.join(tmpRoot, 'file1.txt'), 'hello');
  fs.writeFileSync(path.join(tmpRoot, 'dirA', 'nested.txt'), 'nested');

  // point app to our temp root for the duration of tests
  process.env.ROOT_DIR = tmpRoot;
});

afterAll(async () => {
  // cleanup
  process.env.ROOT_DIR = oldEnv;
  // recursive delete
  await fsp.rm(tmpRoot, { recursive: true, force: true });
});

describe('GET /', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('ok');
  });
});

describe('GET /api/files', () => {
  it('lists root directory', async () => {
    const res = await request(app).get('/api/files');
    expect(res.status).toBe(200);
    expect(res.body.entries.some((e: any) => e.name === 'dirA' && e.type === 'directory')).toBe(true);
    expect(res.body.entries.some((e: any) => e.name === 'file1.txt' && e.type === 'file')).toBe(true);
  });

  it('returns 400 for non-directory path', async () => {
    const res = await request(app).get('/api/files').query({ path: 'file1.txt' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not a directory/i);
  });

  it('navigates into a subdirectory', async () => {
    const res = await request(app).get('/api/files').query({ path: 'dirA' });
    expect(res.status).toBe(200);
    expect(res.body.entries.some((e: any) => e.name === 'nested.txt')).toBe(true);
  });

  it('rejects traversal outside root', async () => {
    const res = await request(app).get('/api/files').query({ path: '../../etc' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid path/i);
  });
});

describe('GET /api/file', () => {
  it('returns file metadata', async () => {
    const res = await request(app).get('/api/file').query({ path: 'file1.txt' });
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('file');
    expect(res.body.size).toBe(5);
  });

  it('returns 404 for missing entry', async () => {
    const res = await request(app).get('/api/file').query({ path: 'nope.txt' });
    expect(res.status).toBe(404);
  });
});
