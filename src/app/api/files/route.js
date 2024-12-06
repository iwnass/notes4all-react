// app/api/files/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const metadataDir = path.join(process.cwd(), 'public', 'metadata');
    
    // Ensure metadata directory exists
    await fs.mkdir(metadataDir, { recursive: true });

    const metadataFiles = await fs.readdir(metadataDir);
    
    const fileDetails = await Promise.all(
      metadataFiles.map(async (metadataFilename) => {
        if (!metadataFilename.endsWith('.json')) return null;
        
        const metadataPath = path.join(metadataDir, metadataFilename);
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        
        return JSON.parse(metadataContent);
      })
    );

    // Filter out any null values (non-JSON files)
    return NextResponse.json(fileDetails.filter(Boolean));
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { pathname } = new URL(request.url);
    const fileId = pathname.split('/').pop();

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const metadataDir = path.join(process.cwd(), 'public', 'metadata');

    const filePath = path.join(uploadDir, fileId);
    const metadataPath = path.join(metadataDir, `${fileId}.json`);
    
    // Delete file and its metadata
    await Promise.all([
      fs.unlink(filePath),
      fs.unlink(metadataPath)
    ]);

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}