import { createHash } from 'node:crypto';
import { mkdir, cp, rm, readFile, writeFile } from 'node:fs/promises';
await rm('dist', {recursive:true, force:true});
await mkdir('dist', {recursive:true});
await cp('index.html', 'dist/index.html');
await cp('src', 'dist/src', {recursive:true});
await cp('public', 'dist', {recursive:true});
// Content versions prevent cached scripts/styles from surviving a new deployment.
const version = async file => createHash('sha256').update(await readFile(file)).digest('hex').slice(0,12);
const mediaVersion = await version('dist/src/project-media.js');
const main = (await readFile('dist/src/main.js','utf8')).replace("'./project-media.js'", `'./project-media.js?v=${mediaVersion}'`);
await writeFile('dist/src/main.js',main);
let html=await readFile('dist/index.html','utf8');
for(const file of ['styles.css','refinement.css','hero.css','main.js']){
  html=html.replace(`/src/${file}`,`/src/${file}?v=${await version('dist/src/'+file)}`);
}
await writeFile('dist/index.html',html);
console.log('Production site built in dist/');
