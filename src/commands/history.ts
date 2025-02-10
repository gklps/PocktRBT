import chalk from 'chalk';
import ora from 'ora';
import { getProfile, getTransactionHistory } from '../api.js';
import { store } from '../store.js';

export default async function history() {
  const token = store.get('token');
  if (!token) {
    console.log(chalk.red('Please login first'));
    process.exit(1);
  }

  const spinner = ora('Fetching transaction history...').start();

  try {
    const profile = await getProfile(token);
    const startDate = '2020-01-01';
    const endDate = new Date().toISOString().split('T')[0];

    const [sentTxns, receivedTxns] = await Promise.all([
      getTransactionHistory(profile.did, 'Sender', startDate, endDate, token),
      getTransactionHistory(profile.did, 'Receiver', startDate, endDate, token),
    ]);

    const allTransactions = [
      ...(sentTxns.TxnDetails || []),
      ...(receivedTxns.TxnDetails || []),
    ].sort((a, b) => new Date(b.DateTime).getTime() - new Date(a.DateTime).getTime());

    spinner.stop();

    console.log('\nTransaction History');
    console.log('─'.repeat(100));

    if (allTransactions.length === 0) {
      console.log(chalk.yellow('No transactions found'));
      return;
    }

    allTransactions.forEach((tx) => {
      const isSender = tx.SenderDID === profile.did;
      const date = new Date(tx.DateTime).toLocaleString();
      const amount = `${isSender ? '-' : '+'}${tx.Amount} RBT`;
      
      console.log(`${chalk.gray(date)}`);
      console.log(`Type: ${isSender ? chalk.red('Sent') : chalk.green('Received')}`);
      console.log(`Amount: ${isSender ? chalk.red(amount) : chalk.green(amount)}`);
      console.log(`${isSender ? 'To' : 'From'}: ${chalk.cyan(isSender ? tx.ReceiverDID : tx.SenderDID)}`);
      console.log(`Transaction ID: ${chalk.gray(tx.TransactionID)}`);
      console.log('─'.repeat(100));
    });
  } catch (error: any) {
    spinner.fail(chalk.red(error.response?.data?.error || 'Failed to fetch transaction history'));
    process.exit(1);
  }
}