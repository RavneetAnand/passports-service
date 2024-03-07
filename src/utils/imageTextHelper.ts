import { Block } from '@aws-sdk/client-textract';

const findValueBlock = (
  keyBlock: Block,
  valueMap: Record<string, Block>,
): Block | undefined => {
  let valueBlock: Block | undefined;

  keyBlock.Relationships?.forEach((relationship) => {
    if (relationship.Type === 'VALUE' && relationship.Ids) {
      relationship.Ids.forEach((valueId) => {
        valueBlock = valueMap[valueId];
      });
    }
  });

  return valueBlock;
};

const getText = (block: Block, blocksMap: Record<string, Block>): string => {
  let text = '';

  block.Relationships?.forEach((relationship) => {
    if (relationship.Type === 'CHILD' && relationship.Ids) {
      relationship.Ids.forEach((childId) => {
        const word = blocksMap[childId];
        if (word.BlockType === 'WORD') {
          text += word.Text + ' ';
        }
      });
    }
  });

  return text.trim();
};

export const getKvMap = (blocks: Block[]) => {
  let keyMap: Record<string, Block> = {};
  let valueMap: Record<string, Block> = {};
  let blockMap: Record<string, Block> = {};

  // Get key and value maps
  blocks.forEach((block) => {
    const blockId = block.Id as string;
    blockMap[blockId] = block;

    if (block.BlockType === 'KEY_VALUE_SET') {
      if (block.EntityTypes && block.EntityTypes.includes('KEY')) {
        keyMap[blockId] = block;
      } else {
        valueMap[blockId] = block;
      }
    }
  });

  return { keyMap, valueMap, blockMap };
};

export const getKvRelationship = (
  keyMap: Record<string, Block>,
  valueMap: Record<string, Block>,
  blockMap: Record<string, Block>,
) => {
  const kvs: Record<string, string[]> = {};

  Object.entries(keyMap).forEach(([_, keyBlock]) => {
    const valueBlock = findValueBlock(keyBlock, valueMap) as Block;
    const key = getText(keyBlock, blockMap);
    const val = getText(valueBlock, blockMap);

    if (!kvs[key]) {
      kvs[key] = [];
    }
    kvs[key].push(val);
  });
  return kvs;
};
