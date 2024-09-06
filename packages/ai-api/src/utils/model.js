function isFoundationModel(model) {
    return typeof model === 'object' && 'name' in model;
}
/**
 * Get the model information from a deployment.
 * @param deployment - AI core model deployment.
 * @returns The model information.
 * @internal
 */
export function extractModel(deployment) {
    // this workaround fixes an error in AI Core, where the API spec calls it "backendDetails" but the service returns "backend_details
    // TODO: remove this workaround once fixed in AI Core (AIWDF-2124)
    const model = (deployment.details?.resources?.backendDetails ||
        deployment.details?.resources?.backend_details)?.model;
    if (isFoundationModel(model)) {
        return model;
    }
}
//# sourceMappingURL=model.js.map