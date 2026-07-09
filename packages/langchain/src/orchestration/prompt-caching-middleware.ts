import { createLogger } from '@sap-cloud-sdk/util';
import { createMiddleware, anthropicPromptCachingMiddleware } from 'langchain';
import type { AgentMiddleware, PromptCachingMiddlewareConfig } from 'langchain';

const logger = createLogger({
  package: 'langchain',
  messageContext: 'prompt-caching-middleware'
});

/**
 * Configuration options for {@link orchestrationPromptCachingMiddleware}.
 * Mirrors {@link PromptCachingMiddlewareConfig} from `langchain`.
 */
export type OrchestrationPromptCachingMiddlewareConfig =
  PromptCachingMiddlewareConfig;

class OrchestrationPromptCachingMiddlewareError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrchestrationPromptCachingMiddlewareError';
  }
}

/**
 * Creates a prompt caching middleware for the Orchestration `OrchestrationClient`
 * by delegating to the upstream `anthropicPromptCachingMiddleware`.
 *
 * When the conversation reaches the configured message threshold the upstream
 * middleware injects `cache_control` into `request.modelSettings`. The
 * {@link OrchestrationClient} then applies a single cache breakpoint to the
 * last cacheable text block of the last message before the request is sent.
 *
 * Prompt caching is supported by Anthropic Claude and Amazon Nova model
 * families served through Orchestration; other models simply ignore the
 * directive. See the
 * {@link https://help.sap.com/docs/sap-ai-core/generative-ai/prompt-caching | SAP AI Core prompt caching docs}
 * for the current matrix of supported models and breakpoint limits.
 * @param middlewareOptions - Configuration options forwarded verbatim to `anthropicPromptCachingMiddleware`. See {@link PromptCachingMiddlewareConfig}.
 * @returns A middleware instance that can be passed to `createAgent`.
 * @example
 * Basic usage with default settings
 * ```typescript
 * import { createAgent } from 'langchain';
 * import { OrchestrationClient } from '@sap-ai-sdk/langchain';
 * import { orchestrationPromptCachingMiddleware } from '@sap-ai-sdk/langchain/orchestration/prompt-caching-middleware';
 *
 * const agent = createAgent({
 *   model: new OrchestrationClient({
 *     promptTemplating: { model: { name: 'anthropic--claude-4.5-haiku' } }
 *   }),
 *   middleware: [orchestrationPromptCachingMiddleware()]
 * });
 * ```
 * @example
 * Longer TTL with a higher message threshold
 * ```typescript
 * orchestrationPromptCachingMiddleware({ ttl: '1h', minMessagesToCache: 5 });
 * ```
 */
export function orchestrationPromptCachingMiddleware(
  middlewareOptions?: OrchestrationPromptCachingMiddlewareConfig
): AgentMiddleware {
  const parentMiddleware = anthropicPromptCachingMiddleware(middlewareOptions);
  const contextSchema = parentMiddleware.contextSchema;
  if (!contextSchema) {
    throw new OrchestrationPromptCachingMiddlewareError(
      'Failed to extract contextSchema from langchain anthropicPromptCachingMiddleware.'
    );
  }

  return {
    name: 'OrchestrationPromptCachingMiddleware',
    contextSchema,
    wrapModelCall: (request, handler) => {
      if (!request.model) {
        return handler(request);
      }

      const realModel = request.model;
      const modelName = realModel.getName();
      const unsupportedModelBehavior =
        request.runtime.context?.unsupportedModelBehavior ??
        middlewareOptions?.unsupportedModelBehavior ??
        'warn';

      if (modelName !== 'OrchestrationClient') {
        const errorMessage =
          `Unsupported model '${modelName}'. ` +
          'orchestrationPromptCachingMiddleware requires an ' +
          'OrchestrationClient (e.g., `new OrchestrationClient(...)`).';

        if (unsupportedModelBehavior === 'raise') {
          throw new OrchestrationPromptCachingMiddlewareError(errorMessage);
        }

        if (unsupportedModelBehavior === 'warn') {
          logger.warn(
            `Skipping prompt caching for model '${modelName}'. ` +
              'orchestrationPromptCachingMiddleware only applies to OrchestrationClient.'
          );
        }

        return handler(request);
      }

      // Proxy the model so the upstream middleware's class-identity check sees
      // "ChatAnthropic" and proceeds.
      const proxiedModel = new Proxy(realModel, {
        get(target, prop, receiver) {
          if (prop === 'getName') {
            return () => 'ChatAnthropic';
          }
          return Reflect.get(target, prop, receiver);
        }
      });

      const middleware = createMiddleware({
        name: 'OrchestrationPromptCachingMiddleware',
        contextSchema,
        wrapModelCall: proxiedRequestHandler =>
          parentMiddleware.wrapModelCall!(proxiedRequestHandler, req =>
            handler({ ...req, model: realModel })
          )
      });

      return middleware.wrapModelCall!(
        { ...request, model: proxiedModel } as Parameters<
          NonNullable<typeof middleware.wrapModelCall>
        >[0],
        handler
      );
    }
  };
}
