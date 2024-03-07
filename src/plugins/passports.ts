import {
  AnalyzeDocumentCommand,
  AnalyzeDocumentCommandOutput,
  Block,
  FeatureType,
  TextractClient,
} from '@aws-sdk/client-textract';
import { fetchJson } from '../utils/fetchJson';
import { getKvMap, getKvRelationship } from '../utils/imageTextHelper';

/**
 * Get the passports details from the image.
 * @returns Data object list of the passports.
 */
const getPassportDetails = async (image: any) => {
  const textractClient = new TextractClient();
  let dateOfBirth: string | undefined = undefined;
  let dateOfExpiry: string | undefined = undefined;

  const params = {
    Document: {
      Bytes: image,
    },
    FeatureTypes: [FeatureType.FORMS],
  };

  try {
    /* const analyzeDoc = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(analyzeDoc); */

    const response = (await fetchJson(
      'passport.json',
    )) as unknown as AnalyzeDocumentCommandOutput;

    if (!response.Blocks) {
      throw new Error('No blocks found in the response');
    }

    const blocks = response.Blocks;
    const { keyMap, valueMap, blockMap } = getKvMap(blocks);

    const kvs = getKvRelationship(keyMap, valueMap, blockMap);

    Object.entries(kvs).forEach(([key, value]) => {
      if (key.toLowerCase().includes('birth')) {
        dateOfBirth = value[0];
      } else if (key.toLowerCase().includes('expiry')) {
        dateOfExpiry = value[0];
      }
    });

    return { dateOfBirth, dateOfExpiry };
  } catch (err: any) {
    console.error('Could not fetch the passport details' + err.message);
  }
};

export const passportsService = () => {
  return {
    getPassportDetails,
  };
};