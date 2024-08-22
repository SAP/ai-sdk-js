module.exports = {
  hooks: {
    afterAllResolved: async lockfile => {
      Object.keys(lockfile.packages)
        .filter(pkg => pkg.startsWith('@sap-ai-sdk'))
        .forEach(pkg => {
          delete lockfile.packages[pkg];
        });

      delete lockfile.importers['tests/smoke-tests'].dependencies[
        '@sap-ai-sdk/ai-core'
      ];
      delete lockfile.importers['tests/smoke-tests'].dependencies[
        '@sap-ai-sdk/gen-ai-hub'
      ];

      return lockfile;
    }
  }
};
