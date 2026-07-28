export default {
  name: 'local',
  rules: {
    'no-uppercase-internal-tag': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        return {
          Program() {
            context.sourceCode
              .getAllComments()
              .filter(comment => comment.value.includes('@Internal'))
              .forEach(comment =>
                context.report({
                  loc: comment.loc,
                  message:
                    'You are not allowed to use @Internal. Please use @internal.'
                })
              );
          }
        };
      }
    }
  }
};
