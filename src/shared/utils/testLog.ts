import { existsSync } from 'fs';
import readline from 'readline';

const replaceTestFilePath = async () => {
  if (process.env.NODE_ENV === 'dev') {
    const [
      npm,
      npmCommandLine,
    ] = process.argv;

    const readable = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readable.question("Que module de Test deseja executar?\n",
      function (answer: string) {
        const testFilePath = answer.replace(/\\/g, '/');
        const ensureFilePathExists: boolean = existsSync(testFilePath);

        if (ensureFilePathExists === false) {
          readable.close();
          console.error('File not found!');
        }

        console.log('The correct Test File Path: ' + testFilePath);
      });
  }
}

replaceTestFilePath();
