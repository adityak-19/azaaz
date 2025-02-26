import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  const event = await params.event;
  const filePath = path.join(process.cwd(), 'public/writeups', event, 'about.md');

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const metadataMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
    const metadata = {};

    if (metadataMatch) {
      const metadataContent = metadataMatch[1];
      metadataContent.split('\n').forEach(line => {
        if (!line.trim()) return;
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        const cleanKey = key.replace(/^-\s*/, '').toLowerCase().replace(/\s+/g, '_');
        const cleanValue = value.replace(/^"|"$/g, '');
        metadata[cleanKey] = cleanValue;
      });
    }

    return Response.json({ metadata });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}