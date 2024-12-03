import * as cxapi from "@aws-cdk/cx-api";
import type { Environment } from "@aws-cdk/cx-api";
import { AssetManifest } from "cdk-assets";
<<<<<<< HEAD
import { Mode } from "sst-aws-cdk/lib/api/aws-auth/credentials.js";
import type { SdkProvider } from "sst-aws-cdk/lib/api/aws-auth/sdk-provider.js";
import type { ISDK } from "sst-aws-cdk/lib/api/aws-auth/sdk.js";
import type { EnvironmentResources } from "sst-aws-cdk/lib/api/environment-resources.js";
=======
import { debug } from "sst-aws-cdk/lib/logging.js";
import {
  CloudFormationStack,
  TemplateParameters,
  waitForStackDelete,
} from "sst-aws-cdk/lib/api/util/cloudformation.js";
import { SDK } from "sst-aws-cdk/lib/api/aws-auth/sdk.js";
import { EnvironmentResources } from "sst-aws-cdk/lib/api/environment-resources.js";
import { addMetadataAssetsToManifest } from "sst-aws-cdk/lib/assets.js";
import { publishAssets } from "sst-aws-cdk/lib/util/asset-publishing.js";
import { SdkProvider } from "sst-aws-cdk/lib/api/aws-auth/sdk-provider.js";
import { AssetManifestBuilder } from "sst-aws-cdk/lib/util/asset-manifest-builder.js";
import { makeBodyParameter } from "sst-aws-cdk/lib/api/util/template-body-parameter.js";
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
import {
	CloudFormationStack,
	TemplateParameters,
	waitForStackDelete,
} from "sst-aws-cdk/lib/api/util/cloudformation.js";
import { makeBodyParameter } from "sst-aws-cdk/lib/api/util/template-body-parameter.js";
import { addMetadataAssetsToManifest } from "sst-aws-cdk/lib/assets.js";
import { debug } from "sst-aws-cdk/lib/logging.js";
import { AssetManifestBuilder } from "sst-aws-cdk/lib/util/asset-manifest-builder.js";
import { publishAssets } from "sst-aws-cdk/lib/util/asset-publishing.js";
import { lazy } from "../util/lazy.js";
<<<<<<< HEAD
import type { DeployStackOptions } from "./deploy-stack.js";
import {
	Deployments,
	type DeployStackOptions as PublishStackAssetsOptions,
} from "./deployments.js";
=======
import { StringWithoutPlaceholders } from "sst-aws-cdk/lib/api/util/placeholders.js";
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

export async function publishDeployAssets(
	sdkProvider: SdkProvider,
	options: PublishStackAssetsOptions,
) {
<<<<<<< HEAD
	const {
		deployment,
		envResources,
		stackSdk,
		resolvedEnvironment,
		cloudFormationRoleArn,
	} = await useDeployment().get(sdkProvider, options);

	// TODO
	// old
	//await deployment.publishStackAssets(options.stack, toolkitInfo, {
	//  buildAssets: options.buildAssets ?? true,
	//  publishOptions: {
	//    quiet: options.quiet,
	//    parallel: options.assetParallelism,
	//  },
	//});

	// new
	const assetArtifacts = options.stack.dependencies.filter(
		cxapi.AssetManifestArtifact.isAssetManifestArtifact,
	);
	for (const asset of assetArtifacts) {
		const manifest = AssetManifest.fromFile(asset.file);
		//await buildAssets(manifest, sdkProvider, resolvedEnvironment, {
		//});
		await publishAssets(manifest, sdkProvider, resolvedEnvironment, {
			buildAssets: true,
			quiet: options.quiet,
			parallel: options.assetParallelism,
		});
	}

	return deployStack({
		stack: options.stack,
		noMonitor: true,
		resolvedEnvironment,
		deployName: options.deployName,
		notificationArns: options.notificationArns,
		quiet: options.quiet,
		sdk: stackSdk,
		sdkProvider,
		roleArn: cloudFormationRoleArn,
		reuseAssets: options.reuseAssets,
		envResources,
		tags: options.tags,
		deploymentMethod: options.deploymentMethod,
		force: options.force,
		parameters: options.parameters,
		usePreviousParameters: options.usePreviousParameters,
		progress: options.progress,
		ci: options.ci,
		rollback: options.rollback,
		hotswap: options.hotswap,
		extraUserAgent: options.extraUserAgent,
		resourcesToImport: options.resourcesToImport,
		overrideTemplate: options.overrideTemplate,
		assetParallelism: options.assetParallelism,
	});
}

const useDeployment = lazy(() => {
	const state = new Map<
		string,
		{
			deployment: Deployments;
			envResources: EnvironmentResources;
			stackSdk: ISDK;
			resolvedEnvironment: Environment;
			cloudFormationRoleArn?: string;
		}
	>();
	return {
		async get(sdkProvider: SdkProvider, options: PublishStackAssetsOptions) {
			const region = options.stack.environment.region;
			if (!state.has(region)) {
				const deployment = new Deployments({ sdkProvider });
				const {
					stackSdk,
					resolvedEnvironment,
					cloudFormationRoleArn,
					envResources,
				} = await deployment.prepareSdkFor(
					options.stack,
					options.roleArn,
					Mode.ForWriting,
				);
=======
  const {
    deployment,
    envResources,
    stackSdk,
    resolvedEnvironment,
    executionRoleArn,
  } = await useDeployment().get(sdkProvider, options);

  const assetArtifacts = options.stack.dependencies.filter(
    cxapi.AssetManifestArtifact.isAssetManifestArtifact
  );
  for (const asset of assetArtifacts) {
    const manifest = AssetManifest.fromFile(asset.file);
    await publishAssets(manifest, sdkProvider, resolvedEnvironment, {
      buildAssets: true,
      allowCrossAccount: true,
      quiet: options.quiet,
      parallel: options.assetParallelism,
    });
  }

  return deployStack({
    stack: options.stack,
    noMonitor: true,
    resolvedEnvironment,
    deployName: options.deployName,
    notificationArns: options.notificationArns,
    quiet: options.quiet,
    sdk: stackSdk,
    sdkProvider,
    roleArn: executionRoleArn,
    reuseAssets: options.reuseAssets,
    envResources,
    tags: options.tags,
    deploymentMethod: options.deploymentMethod,
    force: options.force,
    parameters: options.parameters,
    usePreviousParameters: options.usePreviousParameters,
    progress: options.progress,
    ci: options.ci,
    rollback: options.rollback,
    hotswap: options.hotswap,
    extraUserAgent: options.extraUserAgent,
    resourcesToImport: options.resourcesToImport,
    overrideTemplate: options.overrideTemplate,
    assetParallelism: options.assetParallelism,
  });
}

const useDeployment = lazy(() => {
  const state = new Map<
    string,
    {
      deployment: Deployments;
      envResources: EnvironmentResources;
      stackSdk: SDK;
      resolvedEnvironment: Environment;
      executionRoleArn?: StringWithoutPlaceholders;
    }
  >();
  return {
    async get(sdkProvider: SdkProvider, options: PublishStackAssetsOptions) {
      const region = options.stack.environment.region;
      if (!state.has(region)) {
        const deployment = new Deployments({ sdkProvider });
        const env = await deployment.envs.accessStackForMutableStackOperations(
          options.stack
        );
        const envResources = env.resources;
        const executionRoleArn = await env.replacePlaceholders(
          options.roleArn ?? options.stack.cloudFormationExecutionRoleArn
        );
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

				// Do a verification of the bootstrap stack version
				await deployment.validateBootstrapStackVersion(
					options.stack.stackName,
					options.stack.requiresBootstrapStackVersion,
					options.stack.bootstrapStackVersionSsmParameter,
					envResources,
				);

<<<<<<< HEAD
				state.set(region, {
					deployment,
					envResources,
					stackSdk,
					resolvedEnvironment,
					cloudFormationRoleArn,
				});
			}
			return state.get(region)!;
		},
	};
=======
        state.set(region, {
          deployment,
          envResources,
          stackSdk: env.sdk,
          resolvedEnvironment: env.resolvedEnvironment,
          executionRoleArn,
        });
      }
      return state.get(region)!;
    },
  };
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
});

async function deployStack(options: DeployStackOptions): Promise<any> {
	const stackArtifact = options.stack;

	const stackEnv = options.resolvedEnvironment;

	options.sdk.appendCustomUserAgent(options.extraUserAgent);
	const cfn = options.sdk.cloudFormation();
	const deployName = options.deployName || stackArtifact.stackName;

	let cloudFormationStack = await CloudFormationStack.lookup(cfn, deployName);

<<<<<<< HEAD
	if (cloudFormationStack.stackStatus.isCreationFailure) {
		debug(
			`Found existing stack ${deployName} that had previously failed creation. Deleting it before attempting to re-create it.`,
		);
		await cfn.deleteStack({ StackName: deployName }).promise();
		const deletedStack = await waitForStackDelete(cfn, deployName);
		if (deletedStack && deletedStack.stackStatus.name !== "DELETE_COMPLETE") {
			throw new Error(
				`Failed deleting stack ${deployName} that had previously failed creation (current state: ${deletedStack.stackStatus})`,
			);
		}
		// Update variable to mark that the stack does not exist anymore, but avoid
		// doing an actual lookup in CloudFormation (which would be silly to do if
		// we just deleted it).
		cloudFormationStack = CloudFormationStack.doesNotExist(cfn, deployName);
	}
=======
  if (cloudFormationStack.stackStatus.isCreationFailure) {
    debug(
      `Found existing stack ${deployName} that had previously failed creation. Deleting it before attempting to re-create it.`
    );
    await cfn.deleteStack({ StackName: deployName });
    const deletedStack = await waitForStackDelete(cfn, deployName);
    if (deletedStack && deletedStack.stackStatus.name !== "DELETE_COMPLETE") {
      throw new Error(
        `Failed deleting stack ${deployName} that had previously failed creation (current state: ${deletedStack.stackStatus})`
      );
    }
    // Update variable to mark that the stack does not exist anymore, but avoid
    // doing an actual lookup in CloudFormation (which would be silly to do if
    // we just deleted it).
    cloudFormationStack = CloudFormationStack.doesNotExist(cfn, deployName);
  }
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

	// Detect "legacy" assets (which remain in the metadata) and publish them via
	// an ad-hoc asset manifest, while passing their locations via template
	// parameters.
	const legacyAssets = new AssetManifestBuilder();
	const assetParams = await addMetadataAssetsToManifest(
		stackArtifact,
		legacyAssets,
		options.envResources,
		options.reuseAssets,
	);

	const finalParameterValues = { ...options.parameters, ...assetParams };

	const templateParams = TemplateParameters.fromTemplate(
		stackArtifact.template,
	);
	const stackParams = options.usePreviousParameters
		? templateParams.updateExisting(
				finalParameterValues,
				cloudFormationStack.parameters,
			)
		: templateParams.supplyAll(finalParameterValues);

<<<<<<< HEAD
	const bodyParameter = await makeBodyParameter(
		stackArtifact,
		options.resolvedEnvironment,
		legacyAssets,
		options.envResources,
		options.sdk,
		options.overrideTemplate,
	);
	await publishAssets(
		legacyAssets.toManifest(stackArtifact.assembly.directory),
		options.sdkProvider,
		stackEnv,
		{
			parallel: options.assetParallelism,
		},
	);
=======
  const bodyParameter = await makeBodyParameter(
    stackArtifact,
    options.resolvedEnvironment,
    legacyAssets,
    options.envResources,
    options.overrideTemplate
  );
  await publishAssets(
    legacyAssets.toManifest(stackArtifact.assembly.directory),
    options.sdkProvider,
    stackEnv,
    {
      parallel: options.assetParallelism,
      allowCrossAccount: true,
    }
  );
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

	return {
		isUpdate:
			cloudFormationStack.exists &&
			cloudFormationStack.stackStatus.name !== "REVIEW_IN_PROGRESS",
		params: {
			StackName: deployName,
			TemplateBody: bodyParameter.TemplateBody,
			TemplateURL: bodyParameter.TemplateURL,
			Parameters: stackParams.apiParameters,
			Capabilities: [
				"CAPABILITY_IAM",
				"CAPABILITY_NAMED_IAM",
				"CAPABILITY_AUTO_EXPAND",
			],
			Tags: options.tags,
		},
	};
}
