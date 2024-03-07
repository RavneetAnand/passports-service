import { passportsService as service } from '../src/plugins/passports';

const { getPassportDetails } = service();

let controllers = {
  getPassportDetails: async (req: any, res: any) => {
    if (!req.body) {
      res.status(400).send('Invalid request');
      return;
    }

    try {
      const data = await getPassportDetails(req.body);
      res.json(data);
    } catch (err: any) {
      console.error(err.message);
    }
  },
};

export default controllers;
