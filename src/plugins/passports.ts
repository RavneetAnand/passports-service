import {
  AnalyzeDocumentCommand,
  FeatureType,
  TextractClient,
} from '@aws-sdk/client-textract';
import { getKvMap, getKvRelationship } from '../utils/imageTextHelper';
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' });

/**
 * Get the passports details from the image.
 * @returns Data object list of the passports.
 */
const getPassportDetails = async (image: Uint8Array) => {
  const textractClient = new TextractClient({ region: 'us-east-1' });

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

    // Parse the response to extract blocks of text and their relationships.
    const blocks = response.Blocks;
    const { keyMap, valueMap, blockMap } = getKvMap(blocks);

    // Get the  maps of keys, values, and their relationships.
    const kvs = getKvRelationship(keyMap, valueMap, blockMap);

    // Iterate over the key-value pairs to identify and extract the values for `dateOfBirth` and `dateOfExpiry`.
    Object.entries(kvs).forEach(([key, value]) => {
      if (key.toLowerCase().includes('birth')) {
        dateOfBirth = value[0];
      } else if (key.toLowerCase().includes('expiry')) {
        dateOfExpiry = value[0];
      }
    });

    // If either date is not found, an error is thrown indicating the missing data.
    // This is done to ensure that the image is of the best possible quality.
    if (!dateOfBirth || !dateOfExpiry) {
      throw new Error('Could not find the date of birth or date of expiry');
    }

    return { dateOfBirth, dateOfExpiry };
  } catch (err: any) {
    throw new Error(JSON.stringify({ message: err.message }));
  }
};

export const passportsService = () => {
  return {
    getPassportDetails,
  };
};
