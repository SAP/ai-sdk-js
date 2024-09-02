import { HttpResponse } from "@sap-cloud-sdk/http-client";
import { CompletionPostResponse } from "./client/api/schema/index.js";

 // Define a wrapper class to expose utility methods and properties
 export class OrchestrationResponse {
    private rawResponse: HttpResponse;
  
    constructor(response: HttpResponse) {
      this.rawResponse = response;
    }
  
    // Utility function to get specific choice's content and finish_reason by index
    getChoiceFields(choiceIndex: number = 0): { content: string; finish_reason: string } {
      const choices = this.getResponse().orchestration_result.choices;
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
      return this.rawResponse.data;
    }
  
    getRawResponse(): HttpResponse {
      return this.rawResponse;
    }
  
    // Direct getters for orchestration_result properties
    get id() {
      return this.getResponse().orchestration_result.id;
    }
  
    get object() {
      return this.getResponse().orchestration_result.object;
    }
  
    get created() {
      return this.getResponse().orchestration_result.created;
    }
  
    get model() {
      return this.getResponse().orchestration_result.model;
    }
  
    get choices() {
      return this.getResponse().orchestration_result.choices;
    }
  
    get usage() {
      return this.getResponse().orchestration_result.usage;
    }
  }
  