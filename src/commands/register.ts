import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { signup } from '../api.js';

export default async function register() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter your full name:',
      validate: (input) => input.length > 0 || 'Name is required'
    },
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
      mask: '*',
      validate: (input) => {
        const errors = [];
        if (input.length < 8) errors.push('at least 8 characters');
        if (!/[A-Z]/.test(input)) errors.push('one uppercase letter');
        if (!/[a-z]/.test(input)) errors.push('one lowercase letter');
        if (!/[0-9]/.test(input)) errors.push('one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(input)) errors.push('one special character');
        return errors.length === 0 || `Password must contain ${errors.join(', ')}`;
      }
    }
  ]);

  const spinner = ora('Creating account...').start();

  try {
    const response = await signup(answers.email, answers.password, answers.name);
    spinner.succeed(chalk.green('Account created successfully! Please login to continue.'));
  } catch (error: any) {
    spinner.fail(chalk.red(error.response?.data?.error || 'Failed to create account'));
    process.exit(1);
  }
}