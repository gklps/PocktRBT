#!/usr/bin/env node
import { program } from 'commander';
import { login, register, balance, send, receive, history, settings } from './commands/index.js';
// Set up CLI program
program
    .name('rubix')
    .description('Rubix Wallet CLI')
    .version('1.0.0');
// Login command
program
    .command('login')
    .description('Login to your Rubix wallet')
    .action(login);
// Register command
program
    .command('register')
    .description('Create a new Rubix wallet')
    .action(register);
// Balance command
program
    .command('balance')
    .description('Check your wallet balance')
    .action(balance);
// Send command
program
    .command('send')
    .description('Send RBT tokens')
    .action(send);
// Receive command
program
    .command('receive')
    .description('Show your wallet address')
    .action(receive);
// History command
program
    .command('history')
    .description('View transaction history')
    .action(history);
// Settings command
program
    .command('settings')
    .description('Manage wallet settings')
    .action(settings);
// Error handling
program.showHelpAfterError();
// Parse command line arguments
program.parse();
