/**
 * This file is used to run code after all tests have been run.
 */
export default async function tearDown() {
  delete process.env.AICORE_SERVICE_KEY;
}
