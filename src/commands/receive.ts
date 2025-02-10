import chalk from 'chalk';
import ora from 'ora';
import { getProfile } from '../api.js';
import { store } from '../store.js';

export default async function receive() {
  const token = store.get('token');
  if (!token) {
    console.log(chalk.red('Please login first'));
    process.exit(1);
  }

  const spinner = ora('Fetching wallet address...').start();

  try {
    const profile = await getProfile(token);
    spinner.stop();
    
    console.log('\nYour Wallet Address (DID)');
    console.log('─'.repeat(50));
    console.log(chalk.cyan(profile.did));
    console.log('\nShare this address with others to receive RBT tokens');
  } catch (error: any) {
    spinner.fail(chalk.red(error.response?.data?.error || 'Failed to fetch wallet address'));
    process.exit(1);
  }
}