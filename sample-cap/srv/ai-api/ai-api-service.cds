@path: 'ai-api'
service AiApiService {
  // Technically, it should return an array of AiDeployment entity if we define it in the model.
  action getDeployments() returns array of String;
}
