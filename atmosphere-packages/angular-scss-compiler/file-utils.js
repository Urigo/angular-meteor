const path = Npm.require('path');

export const basePath = process.cwd().replace(/\\/g, '\/');

export function getMeteorPath(filePath) {
  if (filePath.startsWith(basePath)) {
    filePath = filePath.slice(basePath.length);
  }
  return getNoRooted(filePath);
}

const ROOTED = /^(\/|\\)/;

export function isRooted(filePath) {
  return ROOTED.test(filePath);
}

export function getNoRooted(filePath) {
  if (isRooted(filePath)) { 
    return filePath.slice(1);
  }
  return filePath;
}

export function getFullPath(filePath) {
  filePath = getMeteorPath(filePath);
  return path.join(basePath, filePath);
}

export function removeTsExtension(filePath) {
  if (filePath.endsWith('.ts')) {
    return filePath.slice(0, -3);
  }
  return filePath;
}
