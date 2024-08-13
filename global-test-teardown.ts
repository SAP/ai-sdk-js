/**
 * This file is used to run code after all tests have been run.
 */
export default async function tearDown(): Promise<void> {
    delete process.env.aicore;
}
