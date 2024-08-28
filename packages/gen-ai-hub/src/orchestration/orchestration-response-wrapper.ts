import { HttpResponse } from "@sap-cloud-sdk/http-client";
import { CompletionPostResponse } from "./client/api/schema/index.js";

 // Define a wrapper class to expose utility methods and properties
 export class OrchestrationResponse {
    private rawResponse: HttpResponse;
    private orchestrationResponse: CompletionPostResponse;
  
    constructor(response: HttpResponse) {
      this.rawResponse = response;
      this.orchestrationResponse = response.data;
    }
  
    // Utility function to get specific choice's content and finish_reason by index
    getChoiceFields(choiceIndex: number = 0): { content: string; finish_reason: string } {
      const choices = this.orchestrationResponse.orchestration_result.choices;
      if (choiceIndex < 0 || choiceIndex >= choices.length) {
        console.warn('Invalid choice index provided.');
        throw new Error('Invalid choice index.');
      }
      const choice = choices[choiceIndex];
      return {
        content: choice.message.content,
        finish_reason: choice.finish_reason,
      };
    }

    getResponse(): CompletionPostResponse {
      return this.orchestrationResponse;
    }
  
    getRawResponse(): HttpResponse {
      return this.rawResponse;
    }
  
    // Direct getters for orchestration_result properties
    get id() {
      return this.orchestrationResponse.orchestration_result.id;
    }
  
    get object() {
      return this.orchestrationResponse.orchestration_result.object;
    }
  
    get created() {
      return this.orchestrationResponse.orchestration_result.created;
    }
  
    get model() {
      return this.orchestrationResponse.orchestration_result.model;
    }
  
    get choices() {
      return this.orchestrationResponse.orchestration_result.choices;
    }
  
    get usage() {
      return this.orchestrationResponse.orchestration_result.usage;
    }
  }
  