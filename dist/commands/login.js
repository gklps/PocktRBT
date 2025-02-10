import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { login as apiLogin } from '../api.js';
import { store } from '../store.js';
export default async function login() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Enter your email:',
            validate: (input) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(input) || 'Please enter a valid email address';
            }
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter your password:',
            mask: '*'
        }
    ]);
    const spinner = ora('Logging in...').start();
    try {
        const response = await apiLogin(answers.email, answers.password);
        if (!response || !response.token) {
            throw new Error('Invalid response from server');
        }
        store.set('token', response.token);
        spinner.succeed(chalk.green('Successfully logged in!'));
    }
    catch (error) {
        spinner.fail(chalk.red(error.response?.data?.error || error.message || 'Failed to login'));
        process.exit(1);
    }
}
