/**
 * This file is used to run code after all tests have been run.
 */
export default async function () {
  delete process.env.AICORE_SERVICE_KEY;
}
