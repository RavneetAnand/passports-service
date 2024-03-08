import {
  AnalyzeDocumentCommand,
  FeatureType,
  TextractClient,
} from '@aws-sdk/client-textract';
import { getKvMap, getKvRelationship } from '../utils/imageTextHelper';

/**
 * Get the passports details from the image.
 * @returns Data object list of the passports.
 */
const getPassportDetails = async (image: Uint8Array) => {
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
    const analyzeDoc = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(analyzeDoc);

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

    if (!dateOfBirth || !dateOfExpiry) {
      throw new Error('Could not find the date of birth or date of expiry');
    }

    return { dateOfBirth, dateOfExpiry };
  } catch (err: any) {
    throw new Error('Could not fetch the passport details: ' + err.message);
  }
};

export const passportsService = () => {
  return {
    getPassportDetails,
  };
};
