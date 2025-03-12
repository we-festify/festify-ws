import fs from 'fs';
import path from 'path';

// Path to your handlers directory
const HANDLERS_DIR = path.resolve(__dirname, './api/handlers');
// Path to output the generated index file
const OUTPUT_FILE = path.resolve(__dirname, './api/handlers/index.ts');

const toCamelCase = (str: string) => {
  return str
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
};

function generateHandlersIndex() {
  const startTimer = Date.now();

  try {
    const files = fs.readdirSync(HANDLERS_DIR);

    const handlerFiles = files
      .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))
      .filter((file) => file !== 'index.ts' && file !== 'index.js');

    const imports =
      handlerFiles
        .map((file) => {
          const baseName = path.basename(file, path.extname(file));
          return `export * as ${toCamelCase(baseName)} from './${baseName}';`;
        })
        .join('\n') + '\n';

    fs.writeFileSync(OUTPUT_FILE, imports);

    console.log(
      `[Bridge] Prebuild: Generated handlers index (${handlerFiles.length} files, ${Date.now() - startTimer}ms)`,
    );
  } catch (err) {
    console.error('[Bridge] Prebuild: Error generating handlers index:', err);
    process.exit(1);
  }
}

generateHandlersIndex();
