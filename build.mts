import * as fsPromise from 'fs/promises';
import * as fs from 'fs';
import { tmpdir } from 'node:os';
import archiver from 'archiver';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDirPath = path.resolve(__dirname, 'dist');
const workingDirPath = await makeWorkingDir();
console.log(`Working directory: ${workingDirPath}`);
const firefoxPackagePath = path.resolve(outputDirPath, 'package_firefox.zip');
const sourceRootDirPath = path.resolve(__dirname, 'TUAT-Autofill-Extension');
const baseManifestPath = path.resolve(sourceRootDirPath, 'manifest.json');
const firefoxManifestPath = path.resolve(sourceRootDirPath, 'manifest_firefox.json');
const firefoxDebugManifestPath = path.resolve(sourceRootDirPath, 'manifest_firefox_debug.json');

async function makeWorkingDir(): Promise<string> {
  return await fsPromise.mkdtemp(path.join(tmpdir(), 'tuat-autofill-extension-'));
}

function mergeManifests(base: any, extension: any) {
  for (const key in extension) {
    if (typeof extension[key] === 'object') {
      if (base[key] === undefined) {
        base[key] = extension[key];
      } else {
        mergeManifests(base[key], extension[key]);
      }
    } else {
      base[key] = extension[key];
    }
  }
}

async function deleteOldPackage() {
  try {
    await fsPromise.access(firefoxPackagePath);
    await fsPromise.unlink(firefoxPackagePath);
  } catch (e) {
    // TODO filter exceptions.
  }
}

async function prepareFirefoxManifest(): Promise<string> {
  const baseManifest = JSON.parse(await fsPromise.readFile(baseManifestPath, 'utf-8'));
  const firefoxManifest = JSON.parse(await fsPromise.readFile(firefoxManifestPath, 'utf-8'));
  mergeManifests(baseManifest, firefoxManifest);
  const tempManifestPath = path.resolve(workingDirPath, 'manifest.json');
  await fsPromise.writeFile(tempManifestPath, JSON.stringify(baseManifest, null, 2));
  return tempManifestPath;
}

async function createPackage(manifestPath: string) {
  const output = fs.createWriteStream(firefoxPackagePath);
  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  });
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });
  output.on('end', function () {
    console.log('Data has been drained');
  });
  archive.on('error', function (err) {
    throw err;
  });
  archive.pipe(output);
  const entries = await fsPromise.readdir(sourceRootDirPath);
  for (const entry of entries) {
    if (
      entry !== '.' &&
      entry !== 'node_modules' &&
      entry !== 'build.mjs' &&
      entry !== 'package.json' &&
      entry !== 'package-lock.json' &&
      entry !== 'tsconfig.json' &&
      entry !== '.gitignore' &&
      !entry.startsWith('manifest') &&
      !entry.endsWith('.zip')
    ) {
      const fullPath = path.join(sourceRootDirPath, entry);
      const stats = await fsPromise.stat(fullPath);
      if (stats.isDirectory()) {
        await recursiveAppend(archive, `${entry}`, fullPath);
      } else {
      console.log(`Append ${entry}`);
      archive.append(fs.createReadStream(fullPath), {
        name: `${entry}`
      });
      }
    }
  }
  console.log(`Append manifest.json`);
  archive.append(fs.createReadStream(manifestPath), {
    name: `manifest.json`
  });
  archive.finalize();
}

async function recursiveAppend(archive: archiver.Archiver, internalPath: string, dirPath: string) {
  const entries = await fsPromise.readdir(dirPath);
  for (const entry of entries) {
    if (
      !(entry !== '.') &&
      !entry.endsWith('.map') &&
      !entry.endsWith('.ts')
    ) {
      const fullPath = path.join(dirPath, entry);
      const stats = await fsPromise.stat(fullPath);
      if (stats.isDirectory()) {
        await recursiveAppend(archive, `${internalPath}/${entry}`, fullPath);
      } else {
        console.log(`Append ${internalPath}/${entry}`);
        archive.append(fs.createReadStream(fullPath), {
          name: `${internalPath}/${entry}`
        });
      }
    }
  }
}

console.log(process.argv);

const buildFirefox = process.argv.includes('--firefox');

if (!buildFirefox) {
  console.error('NOW SUPPORTS ONLY FIREFOX BUILD');
  console.log('Usage: build.mjs --firefox [--debug]');
  process.exit(1);
}

const debugMode = process.argv.includes('--debug');

if (debugMode) {
  console.log('Debug mode');
  const baseManifest = JSON.parse(await fsPromise.readFile(baseManifestPath, 'utf-8'));
  const firefoxManifest = JSON.parse(await fsPromise.readFile(firefoxManifestPath, 'utf-8'));
  mergeManifests(baseManifest, firefoxManifest);
  await fsPromise.writeFile(firefoxDebugManifestPath, JSON.stringify(baseManifest, null, 2));
} else {
  const manifestPath = await prepareFirefoxManifest();
  await deleteOldPackage();
  await createPackage(manifestPath);
}

