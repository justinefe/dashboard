import { errorStat, decrypt } from '../helpers/Utilities';

export const checkInvitation = async (req, res, next) => {
  const { inviteToken } = req.body;
  if (inviteToken) {
    try {
      const raw = decrypt(inviteToken);
      const decryptedData = JSON.parse(decrypt(inviteToken));
      if (!raw || !decryptedData || !decryptedData.activationCode) {
        return errorStat(res, 400, 'Operation Failed. InvalidToken');
      }
      req.decryptedData = decryptedData;
    } catch (error) {
      return errorStat(res, 400, 'Operation Failed. InvalidToken');
    }
  }
  next();
};
