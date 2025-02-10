import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getProfile, sendTokens } from '../api.js';
import { store } from '../store.js';

export default async function send() {
  const token = store.get('token');
  if (!token) {
    console.log(chalk.red('Please login first'));
    process.exit(1);
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'receiverDid',
      message: 'Enter receiver DID:',
      validate: (input) => input.length > 0 || 'Receiver DID is required'
    },
    {
      type: 'number',
      name: 'amount',
      message: 'Enter amount to send (RBT):',
      validate: (input) => input > 0 || 'Amount must be greater than 0'
    }
  ]);

  const spinner = ora('Sending tokens...').start();

  try {
    const profile = await getProfile(token);
    const response = await sendTokens(
      profile.did,
      answers.receiverDid,
      answers.amount,
      token
    );
    
    spinner.succeed(chalk.green('Transaction completed successfully'));
    console.log('\nTransaction Details');
    console.log('─'.repeat(30));
    console.log(chalk.cyan(JSON.stringify(response, null, 2)));
  } catch (error: any) {
    spinner.fail(chalk.red(error.response?.data?.error || 'Failed to send tokens'));
    process.exit(1);
  }
}