export default {
  name: 'local',
  rules: {
    'no-uppercase-internal-tag': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              if (comment.value.includes('@Internal')) {
                context.report({
                  loc: comment.loc,
                  message: 'You are not allowed to use @Internal. Please use @internal.'
                });
              }
            }
          }
        };
      }
    }
  }
};
