/**
 * Reference to the location of the artifact.
 * Note, the credentials will be found in a secret called
 * 'some_bucket-object_store_secret'. If not provided, a default will be assumed.
 *
 * @example "s3://some_bucket/some_path"
 * Max Length: 1024.
 * Pattern: "([a-z0-9-]+):\\/\\/.+".
 */
export type RTAArtifactUrl = string;
//# sourceMappingURL=rta-artifact-url.d.ts.map