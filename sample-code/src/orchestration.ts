import {
  OrchestrationClient,
  azureContentFilter
} from '@sap-ai-sdk/orchestration';

/**
 * Create different types of orchestration requests.
 * @param sampleCase - Name of the sample case to orchestrate.
 * @returns The message content from the orchestration service in the generative AI hub.
 */
export async function orchestrationCompletion(
  sampleCase: string
): Promise<string | undefined> {
  switch (sampleCase) {
    case 'simple':
      return orchestrationCompletionSimple();
    case 'template':
      return orchestrationCompletionTemplate();
    case 'filtering':
      return orchestrationCompletionFiltering();
    case 'requestConfig':
      return orchestrationCompletionRequestConfig();
    case 'masking':
      return orchestrationCompletionMasking();
    default:
      return undefined;
  }
}

/**
 * Ask about the capital of France.
 * @returns The message content from the orchestration service in the generative AI hub.
 */
async function orchestrationCompletionSimple(): Promise<string | undefined> {
  const orchestrationClient = new OrchestrationClient({
    llm: {
      model_name: 'gpt-4-32k',
      model_params: {}
    },
    templating: {
      template: [{ role: 'user', content: 'What is the capital of France?' }]
    }
  });

  // Call the orchestration service.
  const response = await orchestrationClient.chatCompletion();
  // Access the response content.
  return response.getContent();
}

/**
 * Ask about the capital of any country using a template.
 * @returns The message content from the orchestration service in the generative AI hub.
 */
async function orchestrationCompletionTemplate(): Promise<string | undefined> {
  const orchestrationClient = new OrchestrationClient({
    llm: {
      model_name: 'gpt-4-32k',
      model_params: {}
    },
    templating: {
      template: [
        { role: 'user', content: 'What is the capital of {{?country}}?' }
      ]
    }
  });

  // Call the orchestration service.
  const response = await orchestrationClient.chatCompletion({
    inputParams: { country: 'France' }
  });
  // Access the response content.
  return response.getContent();
}

/**
 * Allow any user input and apply input and output filters.
 * Handles the case where the input or output are filtered:
 * - In case the input was filtered the response has a non 200 status code.
 * - In case the output was filtered `response.getContent()` throws an error.
 * @returns The message content from the orchestration service in the generative AI hub.
 */
async function orchestrationCompletionFiltering(): Promise<string | undefined> {
  const filter = azureContentFilter({ Hate: 0, Violence: 0 });
  const orchestrationClient = new OrchestrationClient({
    llm: {
      model_name: 'gpt-4-32k',
      model_params: {}
    },
    templating: {
      template: [{ role: 'user', content: '{{?input}}' }]
    },
    filtering: {
      input: filter,
      output: filter
    }
  });

  try {
    // Call the orchestration service.
    const response = await orchestrationClient.chatCompletion({
      inputParams: { input: 'I hate you!' }
    });
    // Access the response content.
    return response.getContent();
  } catch (error: any) {
    // Handle the case where the output was filtered.
    return `Error: ${error.message}`;
  }
}

/**
 * Ask to write an email while masking personal information.
 * @returns The message content from the orchestration service in the generative AI hub.
 */
export async function orchestrationCompletionMasking(): Promise<
  string | undefined
> {
  const orchestrationClient = new OrchestrationClient({
    llm: {
      model_name: 'gpt-4-32k',
      model_params: {}
    },
    templating: {
      template: [
        {
          role: 'user',
          content:
            'Please write an email to {{?user}} ({{?email}}), informing them about the amazing capabilities of generative AI! Be brief and concise, write at most 6 sentences.'
        }
      ]
    },
    masking: {
      masking_providers: [
        {
          type: 'sap_data_privacy_integration',
          method: 'pseudonymization',
          entities: [{ type: 'profile-email' }, { type: 'profile-person' }]
        }
      ]
    }
  });

  const response = await orchestrationClient.chatCompletion({
    inputParams: { user: 'Alice Anderson', email: 'alice.anderson@sap.com' }
  });
  return response.getContent();
}
/**
 * Ask about the capital of France and send along custom request configuration.
 * @returns The message content from the orchestration service in the generative AI hub.
 */
async function orchestrationCompletionRequestConfig(): Promise<
  string | undefined
> {
  const orchestrationClient = new OrchestrationClient({
    llm: {
      model_name: 'gpt-4-32k',
      model_params: {}
    },
    templating: {
      template: [{ role: 'user', content: 'What is the capital of France?' }]
    }
  });

  // Call the orchestration service.
  const response = await orchestrationClient.chatCompletion(undefined, {
    headers: { 'x-custom-header': 'custom-value' }
  });
  // Access the response content.
  return response.getContent();
}
