import chalk from 'chalk';
import ora from 'ora';
import { getProfile, getBalance } from '../api.js';
import { store } from '../store.js';

export default async function balance() {
  const token = store.get('token');
  if (!token) {
    console.log(chalk.red('Please login first'));
    process.exit(1);
  }

  const spinner = ora('Fetching balance...').start();

  try {
    const profile = await getProfile(token);
    const balanceData = await getBalance(profile.did, token);
    
    spinner.stop();
    
    console.log('\nWallet Balance');
    console.log('─'.repeat(30));
    console.log(`DID: ${chalk.cyan(profile.did)}`);
    console.log(`Name: ${chalk.cyan(profile.name)}`);
    console.log(`Balance: ${chalk.green(balanceData.account_info[0].rbt_amount.toFixed(3))} RBT`);
    console.log(`Locked: ${chalk.yellow(balanceData.account_info[0].locked_rbt)} RBT`);
    console.log(`Pledged: ${chalk.yellow(balanceData.account_info[0].pledged_rbt)} RBT`);
  } catch (error: any) {
    spinner.fail(chalk.red(error.response?.data?.error || 'Failed to fetch balance'));
    process.exit(1);
  }
}