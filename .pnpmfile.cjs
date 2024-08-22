module.exports = {
  hooks: {
    afterAllResolved: async lockfile => {
      Object.keys(lockfile.packages)
        .filter(pkg => pkg.startsWith('@sap-ai-sdk'))
        .forEach(pkg => {
          delete lockfile.packages[pkg];
        });

      Object.keys(lockfile.importers['tests/smoke-tests'].dependencies)
        .filter(pkg => pkg.startsWith('@sap-ai-sdk'))
        .forEach(pkg => {
          delete lockfile.importers['tests/smoke-tests'].dependencies[pkg];
        });

      return lockfile;
    }
  }
};
