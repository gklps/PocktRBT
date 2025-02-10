import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getProfile, registerDid } from '../api.js';
import { store } from '../store.js';
export default async function settings() {
    const token = store.get('token');
    if (!token) {
        console.log(chalk.red('Please login first'));
        process.exit(1);
    }
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: 'Register DID', value: 'register' },
                { name: 'View Profile', value: 'profile' },
                { name: 'Logout', value: 'logout' }
            ]
        }
    ]);
    switch (answers.action) {
        case 'register': {
            const spinner = ora('Registering DID...').start();
            try {
                const profile = await getProfile(token);
                const response = await registerDid(profile.did, token);
                spinner.succeed(chalk.green('DID registered successfully'));
            }
            catch (error) {
                spinner.fail(chalk.red(error.response?.data?.error || 'Failed to register DID'));
            }
            break;
        }
        case 'profile': {
            const spinner = ora('Fetching profile...').start();
            try {
                const profile = await getProfile(token);
                spinner.stop();
                console.log('\nProfile Information');
                console.log('─'.repeat(30));
                console.log(`Name: ${chalk.cyan(profile.name)}`);
                console.log(`Email: ${chalk.cyan(profile.email)}`);
                console.log(`DID: ${chalk.cyan(profile.did)}`);
            }
            catch (error) {
                spinner.fail(chalk.red(error.response?.data?.error || 'Failed to fetch profile'));
            }
            break;
        }
        case 'logout': {
            store.clear();
            console.log(chalk.green('Logged out successfully'));
            break;
        }
    }
}
