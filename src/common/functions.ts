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
