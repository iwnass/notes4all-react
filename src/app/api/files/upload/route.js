// app/api/files/upload/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file');
    const filename = formData.get('filename');
    const description = formData.get('description');
    const category = formData.get('category');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create uploads and metadata directories if they don't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const metadataDir = path.join(process.cwd(), 'public', 'metadata');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(metadataDir, { recursive: true });

    // Generate a unique filename for storage
    const uniqueFilename = `${uuidv4()}_${file.name}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));

    // Prepare file details for metadata
    const fileDetails = {
      id: uniqueFilename,
      filename: filename, // Use the name entered by user
      description,
      category,
      originalFilename: file.name,
      path: `/uploads/${uniqueFilename}`,
      uploadDate: new Date().toISOString()
    };

    // Write metadata to JSON file
    const metadataPath = path.join(metadataDir, `${uniqueFilename}.json`);
    await fs.writeFile(metadataPath, JSON.stringify(fileDetails, null, 2));

    return NextResponse.json(fileDetails, { status: 201 });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}