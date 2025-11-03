import { parseContentToBlocks } from './lib/parseToBlocks';

const blocks = parseContentToBlocks(rawPostContentFromWP);
console.log(blocks);