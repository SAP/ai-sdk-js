import { promises as fs } from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { createLogger } from '@sap-cloud-sdk/util';

const logger = createLogger('generate-zod-config');

// Define the type for the ts-to-zod configuration
interface TsToZodConfig {
  name: string;
  input: string;
  output: string;
};

async function main(args: string[]) {
  if (args.length !== 3) {
    logger.error('Usage: node --loader ts-node/esm generate-zod-config.ts <input> <output-schema> <output-config>');
    process.exit(1);
  }

  const [input, outputSchema, outputConfig] = args;
  try {
    // Find all .ts files based on the glob path provided
    const files = glob.sync(input);

    const config: TsToZodConfig[] = files.map(file => {
      const configName = path.basename(file, '.ts');
      const relativeInputPath = path.relative(process.cwd(), file);
      const outputFilePath = path.join(outputSchema, `${configName}.zod.ts`);
      return {
        name: configName,
        input: relativeInputPath,
        output: outputFilePath
      };
    });

    const configContent = `/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = ${JSON.stringify(config, null, 2)};
`;

    // Write the config file to the specified outputConfig path
    const configFilePath = path.join(outputConfig, 'ts-to-zod.config.cjs');
    await fs.writeFile(configFilePath, configContent, 'utf8');

    logger.info(`Configuration file generated at ${configFilePath}`);
  } catch (error) {
    logger.error('Error while generating configuration file:', error);
  }
}

// Run the main function
main(process.argv.slice(2));
