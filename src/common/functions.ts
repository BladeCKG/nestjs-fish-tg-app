import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export function getRandomFile(folderPath: string): string | null {
    try {
        // Read the contents of the folder
        const files = fs.readdirSync(folderPath);

        // Filter out directories (if any)
        const fileNames = files.filter((fileName) => fs.statSync(path.join(folderPath, fileName)).isFile());

        // Check if there are any files in the folder
        if (fileNames.length === 0) {
            console.error('No files found in the folder.');
            return null;
        }

        // Choose a random file
        const randomIndex = Math.floor(Math.random() * fileNames.length);
        const randomFile = fileNames[randomIndex];

        // Return the full path to the random file
        return path.join(folderPath, randomFile);
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

// // Example: Get a random file from the specified folder
// const folderPath = '/path/to/your/folder';
// const randomFile = getRandomFile(folderPath);

// if (randomFile) {
//     console.log('Random file:', randomFile);
// } else {
//     console.log('Failed to find a random file.');
// }

export function folderExists(folderPath: string): boolean {
    try {
        // Check if the folder exists
        return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
    } catch (error) {
        // Handle potential errors
        console.error('Error:', error.message);
        return false;
    }
}

// // Example: Check if a folder exists
// const folderPath = '/path/to/your/folder';
// const exists = folderExists(folderPath);

// if (exists) {
//     console.log('The folder exists.');
// } else {
//     console.log('The folder does not exist.');
// }

async function downloadFile(url: string, destinationPath: string): Promise<void> {
    try {
        // Make a GET request to the file URL
        const response = await axios.get(url, { responseType: 'stream' });

        // Create a write stream to save the file
        const writer = fs.createWriteStream(destinationPath);

        // Pipe the response stream into the writer
        response.data.pipe(writer);

        // Wait for the writer to finish writing the file
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log(`File downloaded and saved to: ${destinationPath}`);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

function bytesToFile(bytes: Uint8Array, filePath: string): void {
    try {
        // Create a write stream to save the file
        const writer = fs.createWriteStream(filePath);

        // Write the bytes to the file
        writer.write(Buffer.from(bytes));

        // End the writing process
        writer.end();

        console.log(`File saved to: ${filePath}`);
    } catch (error) {
        console.error('Error saving file:', error);
    }
}
