import Conf from 'conf';
export const store = new Conf({
    projectName: 'rubix-cli',
    encryptionKey: 'your-encryption-key', // Change this in production
});
