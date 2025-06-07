import chalk from "chalk";

const Logger = {
   error: (error) => {
      console.log(chalk.red(`🚀:::====ERROR: ${error}`));
   },
   log: (body) => {
      console.log(chalk.blue(body));
   },
   verbose: (body) => {
      console.log(chalk.cyan(body));
   },
};

export default Logger;
