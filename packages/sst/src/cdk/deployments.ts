// Copied from https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/lib/api/cloudformation-deployments.ts

import { randomUUID } from "crypto";
import * as cxapi from "@aws-cdk/cx-api";
import * as cdk_assets from "cdk-assets";
<<<<<<< HEAD
import { AssetManifest, type IManifestEntry } from "cdk-assets";
import { Mode } from "sst-aws-cdk/lib/api/aws-auth/credentials.js";
import type {
	CredentialsOptions,
	SdkForEnvironment,
	SdkProvider,
} from "sst-aws-cdk/lib/api/aws-auth/sdk-provider.js";
import type { ISDK } from "sst-aws-cdk/lib/api/aws-auth/sdk.js";
import {
	type EnvironmentResources,
	EnvironmentResourcesRegistry,
} from "sst-aws-cdk/lib/api/environment-resources.js";
import type { HotswapMode } from "sst-aws-cdk/lib/api/hotswap/common.js";
import {
	type RootTemplateWithNestedStacks,
	loadCurrentTemplate,
	loadCurrentTemplateWithNestedStacks,
=======
import { AssetManifest, IManifestEntry } from "cdk-assets";
import type { Tag } from "sst-aws-cdk/lib/cdk-toolkit.js";
import { debug, warning } from "sst-aws-cdk/lib/logging.js";
import { EnvironmentAccess } from "sst-aws-cdk/lib/api/environment-access.js";
import type { SdkProvider } from "sst-aws-cdk/lib/api/aws-auth/sdk-provider.js";
import {
  type DeploymentMethod,
  deployStack,
  DeployStackResult,
  destroyStack,
} from "./deploy-stack.js";
import { type EnvironmentResources } from "sst-aws-cdk/lib/api/environment-resources.js";
import { EnvironmentResourcesRegistry } from "sst-aws-cdk/lib/api/environment-resources.js";
import {
  HotswapMode,
  HotswapPropertyOverrides,
} from "sst-aws-cdk/lib/api/hotswap/common.js";
import {
  loadCurrentTemplateWithNestedStacks,
  loadCurrentTemplate,
  type RootTemplateWithNestedStacks,
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
} from "sst-aws-cdk/lib/api/nested-stack-helpers.js";
import { DEFAULT_TOOLKIT_STACK_NAME } from "sst-aws-cdk/lib/api/toolkit-info.js";
import { determineAllowCrossAccountAssetPublishing } from "sst-aws-cdk/lib/api/util/checks.js";
import {
<<<<<<< HEAD
	CloudFormationStack,
	type ResourceIdentifierSummaries,
	type ResourcesToImport,
	type Template,
} from "sst-aws-cdk/lib/api/util/cloudformation.js";
import type { StackActivityProgress } from "sst-aws-cdk/lib/api/util/cloudformation/stack-activity-monitor.js";
import { replaceEnvPlaceholders } from "sst-aws-cdk/lib/api/util/placeholders.js";
=======
  CloudFormationStack,
  type ResourceIdentifierSummaries,
  ResourcesToImport,
  stabilizeStack,
  Template,
  uploadStackTemplateAssets,
} from "sst-aws-cdk/lib/api/util/cloudformation.js";
import {
  StackActivityMonitor,
  StackActivityProgress,
} from "sst-aws-cdk/lib/api/util/cloudformation/stack-activity-monitor.js";
import { StackEventPoller } from "sst-aws-cdk/lib/api/util/cloudformation/stack-event-poller.js";
import { RollbackChoice } from "sst-aws-cdk/lib/api/util/cloudformation/stack-status.js";
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
import { makeBodyParameter } from "sst-aws-cdk/lib/api/util/template-body-parameter.js";
import type { Tag } from "sst-aws-cdk/lib/cdk-toolkit.js";
import { debug, error, warning } from "sst-aws-cdk/lib/logging.js";
import { AssetManifestBuilder } from "sst-aws-cdk/lib/util/asset-manifest-builder.js";
import {
<<<<<<< HEAD
	type BuildAssetsOptions,
	EVENT_TO_LOGGER,
	type PublishAssetsOptions,
	PublishingAws,
	buildAssets,
	publishAssets,
} from "sst-aws-cdk/lib/util/asset-publishing.js";
import {
	type DeployStackResult,
	type DeploymentMethod,
	deployStack,
	destroyStack,
} from "./deploy-stack.js";
import { callWithRetry } from "./util.js";

/**
 * SDK obtained by assuming the lookup role
 * for a given environment
 */
export interface PreparedSdkWithLookupRoleForEnvironment {
	/**
	 * The SDK for the given environment
	 */
	readonly sdk: ISDK;

	/**
	 * The resolved environment for the stack
	 * (no more 'unknown-account/unknown-region')
	 */
	readonly resolvedEnvironment: cxapi.Environment;

	/**
	 * Whether or not the assume role was successful.
	 * If the assume role was not successful (false)
	 * then that means that the 'sdk' returned contains
	 * the default credentials (not the assume role credentials)
	 */
	readonly didAssumeRole: boolean;

	/**
	 * An object for accessing the bootstrap resources in this environment
	 */
	readonly envResources: EnvironmentResources;
}
=======
  buildAssets,
  type BuildAssetsOptions,
  EVENT_TO_LOGGER,
  publishAssets,
  type PublishAssetsOptions,
  PublishingAws,
} from "sst-aws-cdk/lib/util/asset-publishing.js";
import { callWithRetry } from "./util.js";

const BOOTSTRAP_STACK_VERSION_FOR_ROLLBACK = 23;
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

export interface DeployStackOptions {
	/**
	 * Stack to deploy
	 */
	readonly stack: cxapi.CloudFormationStackArtifact;

	/**
	 * Execution role for the deployment (pass through to CloudFormation)
	 *
	 * @default - Current role
	 */
	readonly roleArn?: string;

	/**
	 * Topic ARNs to send a message when deployment finishes (pass through to CloudFormation)
	 *
	 * @default - No notifications
	 */
	readonly notificationArns?: string[];

	/**
	 * Override name under which stack will be deployed
	 *
	 * @default - Use artifact default
	 */
	readonly deployName?: string;

	/**
	 * Don't show stack deployment events, just wait
	 *
	 * @default false
	 */
	readonly quiet?: boolean;

	/**
	 * Name of the toolkit stack, if not the default name
	 *
	 * @default 'CDKToolkit'
	 */
	readonly toolkitStackName?: string;

	/**
	 * List of asset IDs which should NOT be built or uploaded
	 *
	 * @default - Build all assets
	 */
	readonly reuseAssets?: string[];

	/**
	 * Stack tags (pass through to CloudFormation)
	 */
	readonly tags?: Tag[];

	/**
	 * Stage the change set but don't execute it
	 *
	 * @default - true
	 * @deprecated Use 'deploymentMethod' instead
	 */
	readonly execute?: boolean;

	/**
	 * Optional name to use for the CloudFormation change set.
	 * If not provided, a name will be generated automatically.
	 *
	 * @deprecated Use 'deploymentMethod' instead
	 */
	readonly changeSetName?: string;

	/**
	 * Select the deployment method (direct or using a change set)
	 *
	 * @default - Change set with default options
	 */
	readonly deploymentMethod?: DeploymentMethod;

	/**
	 * Force deployment, even if the deployed template is identical to the one we are about to deploy.
	 * @default false deployment will be skipped if the template is identical
	 */
	readonly force?: boolean;

	/**
	 * Extra parameters for CloudFormation
	 * @default - no additional parameters will be passed to the template
	 */
	readonly parameters?: { [name: string]: string | undefined };

	/**
	 * Use previous values for unspecified parameters
	 *
	 * If not set, all parameters must be specified for every deployment.
	 *
	 * @default true
	 */
	readonly usePreviousParameters?: boolean;

	/**
	 * Display mode for stack deployment progress.
	 *
	 * @default - StackActivityProgress.Bar - stack events will be displayed for
	 *   the resource currently being deployed.
	 */
	readonly progress?: StackActivityProgress;

	/**
	 * Whether we are on a CI system
	 *
	 * @default false
	 */
	readonly ci?: boolean;

	/**
	 * Rollback failed deployments
	 *
	 * @default true
	 */
	readonly rollback?: boolean;

	/*
	 * Whether to perform a 'hotswap' deployment.
	 * A 'hotswap' deployment will attempt to short-circuit CloudFormation
	 * and update the affected resources like Lambda functions directly.
	 *
	 * @default - `HotswapMode.FULL_DEPLOYMENT` for regular deployments, `HotswapMode.HOTSWAP_ONLY` for 'watch' deployments
	 */
	readonly hotswap?: HotswapMode;

<<<<<<< HEAD
	/**
	 * The extra string to append to the User-Agent header when performing AWS SDK calls.
	 *
	 * @default - nothing extra is appended to the User-Agent header
	 */
	readonly extraUserAgent?: string;
=======
  /**
   * Properties that configure hotswap behavior
   */
  readonly hotswapPropertyOverrides?: HotswapPropertyOverrides;

  /**
   * The extra string to append to the User-Agent header when performing AWS SDK calls.
   *
   * @default - nothing extra is appended to the User-Agent header
   */
  readonly extraUserAgent?: string;
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

	/**
	 * List of existing resources to be IMPORTED into the stack, instead of being CREATED
	 */
	readonly resourcesToImport?: ResourcesToImport;

	/**
	 * If present, use this given template instead of the stored one
	 *
	 * @default - Use the stored template
	 */
	readonly overrideTemplate?: any;

	/**
	 * Whether to build/publish assets in parallel
	 *
	 * @default true To remain backward compatible.
	 */
	readonly assetParallelism?: boolean;

	/**
	 * Whether to deploy if the app contains no stacks.
	 *
	 * @default false
	 */
	ignoreNoStacks?: boolean;
}

export interface RollbackStackOptions {
  /**
   * Stack to roll back
   */
  readonly stack: cxapi.CloudFormationStackArtifact;

  /**
   * Execution role for the deployment (pass through to CloudFormation)
   *
   * @default - Current role
   */
  readonly roleArn?: string;

  /**
   * Don't show stack deployment events, just wait
   *
   * @default false
   */
  readonly quiet?: boolean;

  /**
   * Whether we are on a CI system
   *
   * @default false
   */
  readonly ci?: boolean;

  /**
   * Name of the toolkit stack, if not the default name
   *
   * @default 'CDKToolkit'
   */
  readonly toolkitStackName?: string;

  /**
   * Whether to force a rollback or not
   *
   * Forcing a rollback will orphan all undeletable resources.
   *
   * @default false
   */
  readonly force?: boolean;

  /**
   * Orphan the resources with the given logical IDs
   *
   * @default - No orphaning
   */
  readonly orphanLogicalIds?: string[];

  /**
   * Display mode for stack deployment progress.
   *
   * @default - StackActivityProgress.Bar - stack events will be displayed for
   *   the resource currently being deployed.
   */
  readonly progress?: StackActivityProgress;

  /**
   * Whether to validate the version of the bootstrap stack permissions
   *
   * @default true
   */
  readonly validateBootstrapStackVersion?: boolean;
}

export interface RollbackStackResult {
  readonly notInRollbackableState?: boolean;
  readonly success?: boolean;
}

interface AssetOptions {
	/**
	 * Stack with assets to build.
	 */
	readonly stack: cxapi.CloudFormationStackArtifact;

<<<<<<< HEAD
	/**
	 * Name of the toolkit stack, if not the default name.
	 *
	 * @default 'CDKToolkit'
	 */
	readonly toolkitStackName?: string;

	/**
	 * Execution role for the building.
	 *
	 * @default - Current role
	 */
	readonly roleArn?: string;
=======
  /**
   * Execution role for the building.
   *
   * @default - Current role
   */
  readonly roleArn?: string;
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
}

export interface BuildStackAssetsOptions extends AssetOptions {
	/**
	 * Options to pass on to `buildAsests()` function
	 */
	readonly buildOptions?: BuildAssetsOptions;

	/**
	 * Stack name this asset is for
	 */
	readonly stackName?: string;
}

interface PublishStackAssetsOptions extends AssetOptions {
	/**
	 * Options to pass on to `publishAsests()` function
	 */
	readonly publishOptions?: Omit<PublishAssetsOptions, "buildAssets">;

	/**
	 * Stack name this asset is for
	 */
	readonly stackName?: string;
}

export interface DestroyStackOptions {
	stack: cxapi.CloudFormationStackArtifact;
	deployName?: string;
	roleArn?: string;
	quiet?: boolean;
	force?: boolean;
	ci?: boolean;
}

export interface StackExistsOptions {
	stack: cxapi.CloudFormationStackArtifact;
	deployName?: string;
	tryLookupRole?: boolean;
}

export interface DeploymentsProps {
	sdkProvider: SdkProvider;
	readonly toolkitStackName?: string;
	readonly quiet?: boolean;
}

/**
<<<<<<< HEAD
 * SDK obtained by assuming the deploy role
 * for a given environment
 */
export interface PreparedSdkForEnvironment {
	/**
	 * The SDK for the given environment
	 */
	readonly stackSdk: ISDK;

	/**
	 * The resolved environment for the stack
	 * (no more 'unknown-account/unknown-region')
	 */
	readonly resolvedEnvironment: cxapi.Environment;
	/**
	 * The Execution Role that should be passed to CloudFormation.
	 *
	 * @default - no execution role is used
	 */
	readonly cloudFormationRoleArn?: string;

	/**
	 * Access class for environmental resources to help the deployment
	 */
	readonly envResources: EnvironmentResources;
}

/**
=======
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
 * Scope for a single set of deployments from a set of Cloud Assembly Artifacts
 *
 * Manages lookup of SDKs, Bootstrap stacks, etc.
 */
export class Deployments {
<<<<<<< HEAD
	private readonly sdkProvider: SdkProvider;
	private readonly sdkCache = new Map<string, SdkForEnvironment>();
	private readonly publisherCache = new Map<
		AssetManifest,
		cdk_assets.AssetPublishing
	>();
	private readonly environmentResources: EnvironmentResourcesRegistry;

	constructor(private readonly props: DeploymentsProps) {
		this.sdkProvider = props.sdkProvider;
		this.environmentResources = new EnvironmentResourcesRegistry(
			props.toolkitStackName,
		);
	}

	/**
	 * Resolves the environment for a stack.
	 */
	public async resolveEnvironment(
		stack: cxapi.CloudFormationStackArtifact,
	): Promise<cxapi.Environment> {
		return this.sdkProvider.resolveEnvironment(stack.environment);
	}

	public async readCurrentTemplateWithNestedStacks(
		rootStackArtifact: cxapi.CloudFormationStackArtifact,
		retrieveProcessedTemplate = false,
	): Promise<RootTemplateWithNestedStacks> {
		const sdk = (await this.prepareSdkWithLookupOrDeployRole(rootStackArtifact))
			.stackSdk;
		return loadCurrentTemplateWithNestedStacks(
			rootStackArtifact,
			sdk,
			retrieveProcessedTemplate,
		);
	}

	public async readCurrentTemplate(
		stackArtifact: cxapi.CloudFormationStackArtifact,
	): Promise<Template> {
		debug(`Reading existing template for stack ${stackArtifact.displayName}.`);
		const sdk = (await this.prepareSdkWithLookupOrDeployRole(stackArtifact))
			.stackSdk;
		return loadCurrentTemplate(stackArtifact, sdk);
	}

	public async resourceIdentifierSummaries(
		stackArtifact: cxapi.CloudFormationStackArtifact,
	): Promise<ResourceIdentifierSummaries> {
		debug(
			`Retrieving template summary for stack ${stackArtifact.displayName}.`,
		);
		// Currently, needs to use `deploy-role` since it may need to read templates in the staging
		// bucket which have been encrypted with a KMS key (and lookup-role may not read encrypted things)
		const { stackSdk, resolvedEnvironment, envResources } =
			await this.prepareSdkFor(stackArtifact, undefined, Mode.ForReading);
		const cfn = stackSdk.cloudFormation();

		// Upload the template, if necessary, before passing it to CFN
		const cfnParam = await makeBodyParameter(
			stackArtifact,
			resolvedEnvironment,
			new AssetManifestBuilder(),
			envResources,
			stackSdk,
		);

		const response = await cfn.getTemplateSummary(cfnParam).promise();
		if (!response.ResourceIdentifierSummaries) {
			debug(
				'GetTemplateSummary API call did not return "ResourceIdentifierSummaries"',
			);
		}
		return response.ResourceIdentifierSummaries ?? [];
	}
=======
  public readonly envs: EnvironmentAccess;

  /**
   * SDK provider for asset publishing (do not use for anything else).
   *
   * This SDK provider is only allowed to be used for that purpose, nothing else.
   *
   * It's not a different object, but the field name should imply that this
   * object should not be used directly, except to pass to asset handling routines.
   */
  private readonly assetSdkProvider: SdkProvider;

  /**
   * SDK provider for passing to deployStack
   *
   * This SDK provider is only allowed to be used for that purpose, nothing else.
   *
   * It's not a different object, but the field name should imply that this
   * object should not be used directly, except to pass to `deployStack`.
   */
  private readonly deployStackSdkProvider: SdkProvider;

  private readonly publisherCache = new Map<
    AssetManifest,
    cdk_assets.AssetPublishing
  >();

  private _allowCrossAccountAssetPublishing: boolean | undefined;

  constructor(private readonly props: DeploymentsProps) {
    this.assetSdkProvider = props.sdkProvider;
    this.deployStackSdkProvider = props.sdkProvider;
    this.envs = new EnvironmentAccess(
      props.sdkProvider,
      props.toolkitStackName ?? DEFAULT_TOOLKIT_STACK_NAME
    );
  }

  /**
   * Resolves the environment for a stack.
   */
  public async resolveEnvironment(
    stack: cxapi.CloudFormationStackArtifact
  ): Promise<cxapi.Environment> {
    return this.envs.resolveStackEnvironment(stack);
  }

  public async readCurrentTemplateWithNestedStacks(
    rootStackArtifact: cxapi.CloudFormationStackArtifact,
    retrieveProcessedTemplate: boolean = false
  ): Promise<RootTemplateWithNestedStacks> {
    const env = await this.envs.accessStackForLookupBestEffort(
      rootStackArtifact
    );
    return loadCurrentTemplateWithNestedStacks(
      rootStackArtifact,
      env.sdk,
      retrieveProcessedTemplate
    );
  }

  public async readCurrentTemplate(
    stackArtifact: cxapi.CloudFormationStackArtifact
  ): Promise<Template> {
    debug(`Reading existing template for stack ${stackArtifact.displayName}.`);
    const env = await this.envs.accessStackForLookupBestEffort(stackArtifact);
    return loadCurrentTemplate(stackArtifact, env.sdk);
  }

  public async resourceIdentifierSummaries(
    stackArtifact: cxapi.CloudFormationStackArtifact
  ): Promise<ResourceIdentifierSummaries> {
    debug(
      `Retrieving template summary for stack ${stackArtifact.displayName}.`
    );
    // Currently, needs to use `deploy-role` since it may need to read templates in the staging
    // bucket which have been encrypted with a KMS key (and lookup-role may not read encrypted things)
    const env = await this.envs.accessStackForReadOnlyStackOperations(
      stackArtifact
    );
    const cfn = env.sdk.cloudFormation();

    // @ts-ignore
    await uploadStackTemplateAssets(stackArtifact, this);

    // Upload the template, if necessary, before passing it to CFN
    const builder = new AssetManifestBuilder();
    const cfnParam = await makeBodyParameter(
      stackArtifact,
      env.resolvedEnvironment,
      builder,
      env.resources
    );

    // If the `makeBodyParameter` before this added assets, make sure to publish them before
    // calling the API.
    const addedAssets = builder.toManifest(stackArtifact.assembly.directory);
    for (const entry of addedAssets.entries) {
      await this.buildSingleAsset("no-version-validation", addedAssets, entry, {
        stack: stackArtifact,
      });
      await this.publishSingleAsset(addedAssets, entry, {
        stack: stackArtifact,
      });
    }

    const response = await cfn.getTemplateSummary(cfnParam);
    if (!response.ResourceIdentifierSummaries) {
      debug(
        'GetTemplateSummary API call did not return "ResourceIdentifierSummaries"'
      );
    }
    return response.ResourceIdentifierSummaries ?? [];
  }
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

	public async deployStack(
		options: DeployStackOptions,
	): Promise<DeployStackResult | undefined> {
		let deploymentMethod = options.deploymentMethod;
		if (options.changeSetName || options.execute !== undefined) {
			if (deploymentMethod) {
				throw new Error(
					"You cannot supply both 'deploymentMethod' and 'changeSetName/execute'. Supply one or the other.",
				);
			}
			deploymentMethod = {
				method: "change-set",
				changeSetName: options.changeSetName,
				execute: options.execute,
			};
		}

<<<<<<< HEAD
		const {
			stackSdk,
			resolvedEnvironment,
			cloudFormationRoleArn,
			envResources,
		} = await this.prepareSdkFor(
			options.stack,
			options.roleArn,
			Mode.ForWriting,
		);

		// Do a verification of the bootstrap stack version
		await this.validateBootstrapStackVersion(
			options.stack.stackName,
			options.stack.requiresBootstrapStackVersion,
			options.stack.bootstrapStackVersionSsmParameter,
			envResources,
		);

		// Deploy assets
		const assetArtifacts = options.stack.dependencies.filter(
			cxapi.AssetManifestArtifact.isAssetManifestArtifact,
		);
		for (const asset of assetArtifacts) {
			const manifest = AssetManifest.fromFile(asset.file);
			await publishAssets(manifest, this.sdkProvider, resolvedEnvironment, {
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
			sdkProvider: this.sdkProvider,
			roleArn: cloudFormationRoleArn,
			reuseAssets: options.reuseAssets,
			envResources,
			tags: options.tags,
			deploymentMethod,
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

	public async destroyStack(options: DestroyStackOptions): Promise<void> {
		const { stackSdk, cloudFormationRoleArn: roleArn } =
			await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);

		return destroyStack({
			sdk: stackSdk,
			roleArn,
			stack: options.stack,
			deployName: options.deployName,
			quiet: options.quiet,
			ci: options.ci,
		});
	}

	public async stackExists(options: StackExistsOptions): Promise<boolean> {
		let stackSdk;
		if (options.tryLookupRole) {
			stackSdk = (await this.prepareSdkWithLookupOrDeployRole(options.stack))
				.stackSdk;
		} else {
			stackSdk = (
				await this.prepareSdkFor(options.stack, undefined, Mode.ForReading)
			).stackSdk;
		}
		const stack = await CloudFormationStack.lookup(
			stackSdk.cloudFormation(),
			options.deployName ?? options.stack.stackName,
		);
		return stack.exists;
	}

	public async prepareSdkWithDeployRole(
		stackArtifact: cxapi.CloudFormationStackArtifact,
	): Promise<PreparedSdkForEnvironment> {
		return this.prepareSdkFor(stackArtifact, undefined, Mode.ForWriting);
	}

	private async prepareSdkWithLookupOrDeployRole(
		stackArtifact: cxapi.CloudFormationStackArtifact,
	): Promise<PreparedSdkForEnvironment> {
		// try to assume the lookup role
		try {
			const result = await this.prepareSdkWithLookupRoleFor(stackArtifact);
			if (result.didAssumeRole) {
				return {
					resolvedEnvironment: result.resolvedEnvironment,
					stackSdk: result.sdk,
					envResources: result.envResources,
				};
			}
		} catch {}
		// fall back to the deploy role
		return this.prepareSdkFor(stackArtifact, undefined, Mode.ForReading);
	}

	/**
	 * Get the environment necessary for touching the given stack
	 *
	 * Returns the following:
	 *
	 * - The resolved environment for the stack (no more 'unknown-account/unknown-region')
	 * - SDK loaded with the right credentials for calling `CreateChangeSet`.
	 * - The Execution Role that should be passed to CloudFormation.
	 */
	public async prepareSdkFor(
		stack: cxapi.CloudFormationStackArtifact,
		roleArn: string | undefined,
		mode: Mode,
	): Promise<PreparedSdkForEnvironment> {
		if (!stack.environment) {
			throw new Error(
				`The stack ${stack.displayName} does not have an environment`,
			);
		}

		const resolvedEnvironment = await this.resolveEnvironment(stack);

		// Substitute any placeholders with information about the current environment
		const arns = await replaceEnvPlaceholders(
			{
				assumeRoleArn: stack.assumeRoleArn,

				// Use the override if given, otherwise use the field from the stack
				cloudFormationRoleArn: roleArn ?? stack.cloudFormationExecutionRoleArn,
			},
			resolvedEnvironment,
			this.sdkProvider,
		);

		const stackSdk = await this.cachedSdkForEnvironment(
			resolvedEnvironment,
			mode,
			{
				assumeRoleArn: arns.assumeRoleArn,
				assumeRoleExternalId: stack.assumeRoleExternalId,
				assumeRoleAdditionalOptions: stack.assumeRoleAdditionalOptions,
			},
		);

		return {
			stackSdk: stackSdk.sdk,
			resolvedEnvironment,
			cloudFormationRoleArn: arns.cloudFormationRoleArn,
			envResources: this.environmentResources.for(
				resolvedEnvironment,
				stackSdk.sdk,
			),
		};
	}

	/**
	 * Try to use the bootstrap lookupRole. There are two scenarios that are handled here
	 *  1. The lookup role may not exist (it was added in bootstrap stack version 7)
	 *  2. The lookup role may not have the correct permissions (ReadOnlyAccess was added in
	 *      bootstrap stack version 8)
	 *
	 * In the case of 1 (lookup role doesn't exist) `forEnvironment` will either:
	 *   1. Return the default credentials if the default credentials are for the stack account
	 *   2. Throw an error if the default credentials are not for the stack account.
	 *
	 * If we successfully assume the lookup role we then proceed to 2 and check whether the bootstrap
	 * stack version is valid. If it is not we throw an error which should be handled in the calling
	 * function (and fallback to use a different role, etc)
	 *
	 * If we do not successfully assume the lookup role, but do get back the default credentials
	 * then return those and note that we are returning the default credentials. The calling
	 * function can then decide to use them or fallback to another role.
	 */
	public async prepareSdkWithLookupRoleFor(
		stack: cxapi.CloudFormationStackArtifact,
	): Promise<PreparedSdkWithLookupRoleForEnvironment> {
		const resolvedEnvironment = await this.sdkProvider.resolveEnvironment(
			stack.environment,
		);

		// Substitute any placeholders with information about the current environment
		const arns = await replaceEnvPlaceholders(
			{
				lookupRoleArn: stack.lookupRole?.arn,
			},
			resolvedEnvironment,
			this.sdkProvider,
		);

		// try to assume the lookup role
		const warningMessage = `Could not assume ${arns.lookupRoleArn}, proceeding anyway.`;
		try {
			// Trying to assume lookup role and cache the sdk for the environment
			const stackSdk = await this.cachedSdkForEnvironment(
				resolvedEnvironment,
				Mode.ForReading,
				{
					assumeRoleArn: arns.lookupRoleArn,
					assumeRoleExternalId: stack.lookupRole?.assumeRoleExternalId,
					assumeRoleAdditionalOptions:
						stack.lookupRole?.assumeRoleAdditionalOptions,
				},
			);

			const envResources = this.environmentResources.for(
				resolvedEnvironment,
				stackSdk.sdk,
			);

			// if we succeed in assuming the lookup role, make sure we have the correct bootstrap stack version
			if (
				stackSdk.didAssumeRole &&
				stack.lookupRole?.bootstrapStackVersionSsmParameter &&
				stack.lookupRole.requiresBootstrapStackVersion
			) {
				const version = await envResources.versionFromSsmParameter(
					stack.lookupRole.bootstrapStackVersionSsmParameter,
				);
				if (version < stack.lookupRole.requiresBootstrapStackVersion) {
					throw new Error(
						`Bootstrap stack version '${stack.lookupRole.requiresBootstrapStackVersion}' is required, found version '${version}'. To get rid of this error, please upgrade to bootstrap version >= ${stack.lookupRole.requiresBootstrapStackVersion}`,
					);
				}
			} else if (!stackSdk.didAssumeRole) {
				const lookUpRoleExists = stack.lookupRole ? true : false;
				warning(
					`Lookup role ${
						lookUpRoleExists ? "exists but" : "does not exist, hence"
					} was not assumed. Proceeding with default credentials.`,
				);
			}
			return { ...stackSdk, resolvedEnvironment, envResources };
		} catch (e: any) {
			debug(e);

			// only print out the warnings if the lookupRole exists
			if (stack.lookupRole) {
				warning(warningMessage);
			}

			// This error should be shown even if debug mode is off
			if (e instanceof Error && e.message.includes("Bootstrap stack version")) {
				error(e.message);
			}

			throw e;
		}
	}

	private async prepareAndValidateAssets(
		asset: cxapi.AssetManifestArtifact,
		options: AssetOptions,
	) {
		const { envResources } = await this.prepareSdkFor(
			options.stack,
			options.roleArn,
			Mode.ForWriting,
		);
		await this.validateBootstrapStackVersion(
			options.stack.stackName,
			asset.requiresBootstrapStackVersion,
			asset.bootstrapStackVersionSsmParameter,
			envResources,
		);
=======
    const env = await this.envs.accessStackForMutableStackOperations(
      options.stack
    );

    // Do a verification of the bootstrap stack version
    await this.validateBootstrapStackVersion(
      options.stack.stackName,
      options.stack.requiresBootstrapStackVersion,
      options.stack.bootstrapStackVersionSsmParameter,
      env.resources
    );

    const executionRoleArn = await env.replacePlaceholders(
      options.roleArn ?? options.stack.cloudFormationExecutionRoleArn
    );

    // Deploy assets
    const assetArtifacts = options.stack.dependencies.filter(
      cxapi.AssetManifestArtifact.isAssetManifestArtifact
    );
    for (const asset of assetArtifacts) {
      const manifest = AssetManifest.fromFile(asset.file);
      await publishAssets(
        manifest,
        this.deployStackSdkProvider,
        env.resolvedEnvironment,
        {
          buildAssets: true,
          allowCrossAccount: true,
          quiet: options.quiet,
          parallel: options.assetParallelism,
        }
      );
    }

    return deployStack({
      stack: options.stack,
      noMonitor: true,
      resolvedEnvironment: env.resolvedEnvironment,
      deployName: options.deployName,
      notificationArns: options.notificationArns,
      quiet: options.quiet,
      sdk: env.sdk,
      sdkProvider: this.deployStackSdkProvider,
      roleArn: executionRoleArn,
      reuseAssets: options.reuseAssets,
      envResources: env.resources,
      tags: options.tags,
      deploymentMethod,
      force: options.force,
      parameters: options.parameters,
      usePreviousParameters: options.usePreviousParameters,
      progress: options.progress,
      ci: options.ci,
      rollback: options.rollback,
      hotswap: options.hotswap,
      hotswapPropertyOverrides: options.hotswapPropertyOverrides,
      extraUserAgent: options.extraUserAgent,
      resourcesToImport: options.resourcesToImport,
      overrideTemplate: options.overrideTemplate,
      assetParallelism: options.assetParallelism,
    });
  }

  public async rollbackStack(
    options: RollbackStackOptions
  ): Promise<RollbackStackResult> {
    let resourcesToSkip: string[] = options.orphanLogicalIds ?? [];
    if (options.force && resourcesToSkip.length > 0) {
      throw new Error("Cannot combine --force with --orphan");
    }

    const env = await this.envs.accessStackForMutableStackOperations(
      options.stack
    );

    if (options.validateBootstrapStackVersion ?? true) {
      // Do a verification of the bootstrap stack version
      await this.validateBootstrapStackVersion(
        options.stack.stackName,
        BOOTSTRAP_STACK_VERSION_FOR_ROLLBACK,
        options.stack.bootstrapStackVersionSsmParameter,
        env.resources
      );
    }

    const cfn = env.sdk.cloudFormation();
    const deployName = options.stack.stackName;

    // We loop in case of `--force` and the stack ends up in `CONTINUE_UPDATE_ROLLBACK`.
    let maxLoops = 10;
    while (maxLoops--) {
      let cloudFormationStack = await CloudFormationStack.lookup(
        cfn,
        deployName
      );

      const executionRoleArn = await env.replacePlaceholders(
        options.roleArn ?? options.stack.cloudFormationExecutionRoleArn
      );

      switch (cloudFormationStack.stackStatus.rollbackChoice) {
        case RollbackChoice.NONE:
          warning(
            `Stack ${deployName} does not need a rollback: ${cloudFormationStack.stackStatus}`
          );
          return { notInRollbackableState: true };

        case RollbackChoice.START_ROLLBACK:
          debug(`Initiating rollback of stack ${deployName}`);
          await cfn.rollbackStack({
            StackName: deployName,
            RoleARN: executionRoleArn,
            ClientRequestToken: randomUUID(),
            // Enabling this is just the better overall default, the only reason it isn't the upstream default is backwards compatibility
            RetainExceptOnCreate: true,
          });
          break;

        case RollbackChoice.CONTINUE_UPDATE_ROLLBACK:
          if (options.force) {
            // Find the failed resources from the deployment and automatically skip them
            // (Using deployment log because we definitely have `DescribeStackEvents` permissions, and we might not have
            // `DescribeStackResources` permissions).
            const poller = new StackEventPoller(cfn, {
              stackName: deployName,
              stackStatuses: [
                "ROLLBACK_IN_PROGRESS",
                "UPDATE_ROLLBACK_IN_PROGRESS",
              ],
            });
            await poller.poll();
            resourcesToSkip = poller.resourceErrors
              .filter(
                (r) => !r.isStackEvent && r.parentStackLogicalIds.length === 0
              )
              .map((r) => r.event.LogicalResourceId ?? "");
          }

          const skipDescription =
            resourcesToSkip.length > 0
              ? ` (orphaning: ${resourcesToSkip.join(", ")})`
              : "";
          warning(
            `Continuing rollback of stack ${deployName}${skipDescription}`
          );
          await cfn.continueUpdateRollback({
            StackName: deployName,
            ClientRequestToken: randomUUID(),
            RoleARN: executionRoleArn,
            ResourcesToSkip: resourcesToSkip,
          });
          break;

        case RollbackChoice.ROLLBACK_FAILED:
          warning(
            `Stack ${deployName} failed creation and rollback. This state cannot be rolled back. You can recreate this stack by running 'cdk deploy'.`
          );
          return { notInRollbackableState: true };

        default:
          throw new Error(
            `Unexpected rollback choice: ${cloudFormationStack.stackStatus.rollbackChoice}`
          );
      }

      const monitor = options.quiet
        ? undefined
        : StackActivityMonitor.withDefaultPrinter(
            cfn,
            deployName,
            options.stack,
            {
              ci: options.ci,
            }
          ).start();

      let stackErrorMessage: string | undefined = undefined;
      let finalStackState = cloudFormationStack;
      try {
        const successStack = await stabilizeStack(cfn, deployName);

        // This shouldn't really happen, but catch it anyway. You never know.
        if (!successStack) {
          throw new Error(
            "Stack deploy failed (the stack disappeared while we were rolling it back)"
          );
        }
        finalStackState = successStack;

        const errors = monitor?.errors?.join(", ");
        if (errors) {
          stackErrorMessage = errors;
        }
      } catch (e: any) {
        stackErrorMessage = suffixWithErrors(e.message, monitor?.errors);
      } finally {
        await monitor?.stop();
      }
      if (finalStackState.stackStatus.isRollbackSuccess || !stackErrorMessage) {
        return { success: true };
      }

      // Either we need to ignore some resources to continue the rollback, or something went wrong
      if (
        finalStackState.stackStatus.rollbackChoice ===
          RollbackChoice.CONTINUE_UPDATE_ROLLBACK &&
        options.force
      ) {
        // Do another loop-de-loop
        continue;
      }
      throw new Error(
        `${stackErrorMessage} (fix problem and retry, or orphan these resources using --orphan or --force)`
      );
    }
    throw new Error(
      "Rollback did not finish after a large number of iterations; stopping because it looks like we're not making progress anymore. You can retry if rollback was progressing as expected."
    );
  }

  public async destroyStack(options: DestroyStackOptions): Promise<void> {
    const env = await this.envs.accessStackForMutableStackOperations(
      options.stack
    );
    const executionRoleArn = await env.replacePlaceholders(
      options.roleArn ?? options.stack.cloudFormationExecutionRoleArn
    );

    return destroyStack({
      sdk: env.sdk,
      roleArn: executionRoleArn,
      stack: options.stack,
      deployName: options.deployName,
      quiet: options.quiet,
      ci: options.ci,
    });
  }

  public async stackExists(options: StackExistsOptions): Promise<boolean> {
    let env;
    if (options.tryLookupRole) {
      env = await this.envs.accessStackForLookupBestEffort(options.stack);
    } else {
      env = await this.envs.accessStackForReadOnlyStackOperations(
        options.stack
      );
    }
    const stack = await CloudFormationStack.lookup(
      env.sdk.cloudFormation(),
      options.deployName ?? options.stack.stackName
    );
    return stack.exists;
  }

  public async prepareAndValidateAssets(
    asset: cxapi.AssetManifestArtifact,
    options: AssetOptions
  ) {
    const env = await this.envs.accessStackForMutableStackOperations(
      options.stack
    );
    await this.validateBootstrapStackVersion(
      options.stack.stackName,
      asset.requiresBootstrapStackVersion,
      asset.bootstrapStackVersionSsmParameter,
      env.resources
    );
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

		const manifest = AssetManifest.fromFile(asset.file);

<<<<<<< HEAD
		return { manifest, stackEnv: envResources.environment };
	}

	/**
	 * Build all assets in a manifest
	 *
	 * @deprecated Use `buildSingleAsset` instead
	 */
	public async buildAssets(
		asset: cxapi.AssetManifestArtifact,
		options: BuildStackAssetsOptions,
	) {
		const { manifest, stackEnv } = await this.prepareAndValidateAssets(
			asset,
			options,
		);
		await buildAssets(
			manifest,
			this.sdkProvider,
			stackEnv,
			options.buildOptions,
		);
	}

	/**
	 * Publish all assets in a manifest
	 *
	 * @deprecated Use `publishSingleAsset` instead
	 */
	public async publishAssets(
		asset: cxapi.AssetManifestArtifact,
		options: PublishStackAssetsOptions,
	) {
		const { manifest, stackEnv } = await this.prepareAndValidateAssets(
			asset,
			options,
		);
		await publishAssets(
			manifest,
			this.sdkProvider,
			stackEnv,
			options.publishOptions,
		);
	}

	/**
	 * Build a single asset from an asset manifest
	 */
	// eslint-disable-next-line max-len
	public async buildSingleAsset(
		assetArtifact: cxapi.AssetManifestArtifact,
		assetManifest: AssetManifest,
		asset: IManifestEntry,
		options: BuildStackAssetsOptions,
	) {
		const { resolvedEnvironment, envResources } = await this.prepareSdkFor(
			options.stack,
			options.roleArn,
			Mode.ForWriting,
		);

		await this.validateBootstrapStackVersion(
			options.stack.stackName,
			assetArtifact.requiresBootstrapStackVersion,
			assetArtifact.bootstrapStackVersionSsmParameter,
			envResources,
		);
=======
    return { manifest, stackEnv: env.resolvedEnvironment };
  }

  /**
   * Build all assets in a manifest
   *
   * @deprecated Use `buildSingleAsset` instead
   */
  public async buildAssets(
    asset: cxapi.AssetManifestArtifact,
    options: BuildStackAssetsOptions
  ) {
    const { manifest, stackEnv } = await this.prepareAndValidateAssets(
      asset,
      options
    );
    await buildAssets(
      manifest,
      this.assetSdkProvider,
      stackEnv,
      options.buildOptions
    );
  }

  /**
   * Publish all assets in a manifest
   *
   * @deprecated Use `publishSingleAsset` instead
   */
  public async publishAssets(
    asset: cxapi.AssetManifestArtifact,
    options: PublishStackAssetsOptions
  ) {
    const { manifest, stackEnv } = await this.prepareAndValidateAssets(
      asset,
      options
    );
    await publishAssets(manifest, this.assetSdkProvider, stackEnv, {
      ...options.publishOptions,
      allowCrossAccount: await this.allowCrossAccountAssetPublishingForEnv(
        options.stack
      ),
    });
  }

  /**
   * Build a single asset from an asset manifest
   *
   * If an assert manifest artifact is given, the bootstrap stack version
   * will be validated according to the constraints in that manifest artifact.
   * If that is not necessary, `'no-version-validation'` can be passed.
   */
  // eslint-disable-next-line max-len
  public async buildSingleAsset(
    assetArtifact: cxapi.AssetManifestArtifact | "no-version-validation",
    assetManifest: AssetManifest,
    asset: IManifestEntry,
    options: BuildStackAssetsOptions
  ) {
    if (assetArtifact !== "no-version-validation") {
      const env = await this.envs.accessStackForReadOnlyStackOperations(
        options.stack
      );
      await this.validateBootstrapStackVersion(
        options.stack.stackName,
        assetArtifact.requiresBootstrapStackVersion,
        assetArtifact.bootstrapStackVersionSsmParameter,
        env.resources
      );
    }

    const resolvedEnvironment = await this.envs.resolveStackEnvironment(
      options.stack
    );
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

		const publisher = this.cachedPublisher(
			assetManifest,
			resolvedEnvironment,
			options.stackName,
		);
		await publisher.buildEntry(asset);
	}

<<<<<<< HEAD
	/**
	 * Publish a single asset from an asset manifest
	 */
	// eslint-disable-next-line max-len
	public async publishSingleAsset(
		assetManifest: AssetManifest,
		asset: IManifestEntry,
		options: PublishStackAssetsOptions,
	) {
		const { resolvedEnvironment: stackEnv } = await this.prepareSdkFor(
			options.stack,
			options.roleArn,
			Mode.ForWriting,
		);

		// No need to validate anymore, we already did that during build
		const publisher = this.cachedPublisher(
			assetManifest,
			stackEnv,
			options.stackName,
		);
		await publisher.publishEntry(asset);
	}

	/**
	 * Return whether a single asset has been published already
	 */
	public async isSingleAssetPublished(
		assetManifest: AssetManifest,
		asset: IManifestEntry,
		options: PublishStackAssetsOptions,
	) {
		const { resolvedEnvironment: stackEnv } = await this.prepareSdkFor(
			options.stack,
			options.roleArn,
			Mode.ForWriting,
		);
		const publisher = this.cachedPublisher(
			assetManifest,
			stackEnv,
			options.stackName,
		);
		return publisher.isEntryPublished(asset);
	}
=======
  /**
   * Publish a single asset from an asset manifest
   */
  // eslint-disable-next-line max-len
  public async publishSingleAsset(
    assetManifest: AssetManifest,
    asset: IManifestEntry,
    options: PublishStackAssetsOptions
  ) {
    const stackEnv = await this.envs.resolveStackEnvironment(options.stack);

    // No need to validate anymore, we already did that during build
    const publisher = this.cachedPublisher(
      assetManifest,
      stackEnv,
      options.stackName
    );
    // eslint-disable-next-line no-console
    await publisher.publishEntry(asset, {
      allowCrossAccount: await this.allowCrossAccountAssetPublishingForEnv(
        options.stack
      ),
    });
    if (publisher.hasFailures) {
      throw new Error(`Failed to publish asset ${asset.id}`);
    }
  }

  private async allowCrossAccountAssetPublishingForEnv(
    stack: cxapi.CloudFormationStackArtifact
  ): Promise<boolean> {
    if (this._allowCrossAccountAssetPublishing === undefined) {
      const env = await this.envs.accessStackForReadOnlyStackOperations(stack);
      this._allowCrossAccountAssetPublishing =
        await determineAllowCrossAccountAssetPublishing(
          env.sdk,
          this.props.toolkitStackName
        );
    }
    return this._allowCrossAccountAssetPublishing;
  }

  /**
   * Return whether a single asset has been published already
   */
  public async isSingleAssetPublished(
    assetManifest: AssetManifest,
    asset: IManifestEntry,
    options: PublishStackAssetsOptions
  ) {
    const stackEnv = await this.envs.resolveStackEnvironment(options.stack);
    const publisher = this.cachedPublisher(
      assetManifest,
      stackEnv,
      options.stackName
    );
    return publisher.isEntryPublished(asset);
  }
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff

	/**
	 * Validate that the bootstrap stack has the right version for this stack
	 *
	 * Call into envResources.validateVersion, but prepend the stack name in case of failure.
	 */
	public async validateBootstrapStackVersion(
		stackName: string,
		requiresBootstrapStackVersion: number | undefined,
		bootstrapStackVersionSsmParameter: string | undefined,
		envResources: EnvironmentResources,
	) {
		try {
			await envResources.validateVersion(
				requiresBootstrapStackVersion,
				bootstrapStackVersionSsmParameter,
			);
		} catch (e: any) {
			throw new Error(`${stackName}: ${e.message}`);
		}
	}

<<<<<<< HEAD
	private async cachedSdkForEnvironment(
		environment: cxapi.Environment,
		mode: Mode,
		options?: CredentialsOptions,
	) {
		const cacheKeyElements = [
			environment.account,
			environment.region,
			`${mode}`,
			options?.assumeRoleArn ?? "",
			options?.assumeRoleExternalId ?? "",
		];

		if (options?.assumeRoleAdditionalOptions) {
			cacheKeyElements.push(
				JSON.stringify(options.assumeRoleAdditionalOptions),
			);
		}

		const cacheKey = cacheKeyElements.join(":");
		const existing = this.sdkCache.get(cacheKey);
		if (existing) {
			return existing;
		}
		const ret = await this.sdkProvider.forEnvironment(
			environment,
			mode,
			options,
		);
		this.sdkCache.set(cacheKey, ret);
		return ret;
	}

	private cachedPublisher(
		assetManifest: cdk_assets.AssetManifest,
		env: cxapi.Environment,
		stackName?: string,
	) {
		const existing = this.publisherCache.get(assetManifest);
		if (existing) {
			return existing;
		}
		const prefix = stackName ? `${stackName}: ` : "";
		const publisher = new cdk_assets.AssetPublishing(assetManifest, {
			aws: new PublishingAws(this.sdkProvider, env),
			progressListener: new ParallelSafeAssetProgress(
				prefix,
				this.props.quiet ?? false,
			),
		});
		this.publisherCache.set(assetManifest, publisher);
		return publisher;
	}
=======
  private cachedPublisher(
    assetManifest: cdk_assets.AssetManifest,
    env: cxapi.Environment,
    stackName?: string
  ) {
    const existing = this.publisherCache.get(assetManifest);
    if (existing) {
      return existing;
    }
    const prefix = stackName ? `${stackName}: ` : "";
    const publisher = new cdk_assets.AssetPublishing(assetManifest, {
      // The AssetPublishing class takes care of role assuming etc, so it's okay to
      // give it a direct `SdkProvider`.
      aws: new PublishingAws(this.assetSdkProvider, env),
      progressListener: new ParallelSafeAssetProgress(
        prefix,
        this.props.quiet ?? false
      ),
    });
    this.publisherCache.set(assetManifest, publisher);
    return publisher;
  }
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
}

/**
 * Asset progress that doesn't do anything with percentages (currently)
 */
class ParallelSafeAssetProgress implements cdk_assets.IPublishProgressListener {
	constructor(
		private readonly prefix: string,
		private readonly quiet: boolean,
	) {}

	public onPublishEvent(
		type: cdk_assets.EventType,
		event: cdk_assets.IPublishProgress,
	): void {
		const handler =
			this.quiet && type !== "fail" ? debug : EVENT_TO_LOGGER[type];
		handler(`${this.prefix}${type}: ${event.message}`);
	}
}

function suffixWithErrors(msg: string, errors?: string[]) {
  return errors && errors.length > 0 ? `${msg}: ${errors.join(", ")}` : msg;
}
