import { GraphQLString, GraphQLNonNull, GraphQLObjectType } from "graphql"
import { mutationWithClientMutationId } from "graphql-relay"
import GraphQLJSON from "graphql-type-json"
import { ResolverContext } from "types/graphql"
import { StaticPathLoader } from "lib/loaders/api/loader_interface"

export const GeminiEntryType = new GraphQLObjectType<any, ResolverContext>({
  name: "GeminiEntry",
  description: "An entry from gemini",
  fields: {
    token: {
      description: "The token that represents the gemini entry.",
      type: new GraphQLNonNull(GraphQLString),
    },
    // TODO: skipping image_urls due to not needing them right now
    // https://github.com/artsy/gemini/blob/master/app/models/entry_version.rb
  },
})

export default mutationWithClientMutationId<
  {
    templateKey: string
    sourceKey: string
    sourceBucket: string
    metadata: any
  },
  StaticPathLoader<any> | null,
  ResolverContext
>({
  name: "CreateGeminiEntryForAsset",
  description: "Attach an gemini asset to a consignment submission",
  inputFields: {
    sourceKey: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The path to the file",
    },
    templateKey: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The template key, this is `name` in the asset request",
    },
    sourceBucket: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The S3 bucket where the file was uploaded",
    },
    metadata: {
      type: new GraphQLNonNull(GraphQLJSON),
      description:
        "Additional JSON data to pass through gemini, should definitely contain an `id` and a `_type`",
    },
  } /*
  FIXME: Generated by the snake_case to camelCase codemod.
         Either use this to fix inputs and/or remove this comment.
  {
    const {
      sourceKey,
      templateKey,
      sourceBucket,
      ..._newFields
    } = newFields;
    const oldFields = {
      sourceKey: source_key,
      templateKey: template_key,
      sourceBucket: source_bucket,
      ..._newFields
    };
  }
  */,
  outputFields: {
    asset: {
      type: GeminiEntryType,
      resolve: credentials => credentials,
    },
  },
  mutateAndGetPayload: (
    {
      templateKey: template_key,
      sourceKey: source_key,
      sourceBucket: source_bucket,
      metadata,
    },
    { createNewGeminiEntryAssetLoader }
  ) => {
    if (!createNewGeminiEntryAssetLoader) return null
    return createNewGeminiEntryAssetLoader({
      template_key,
      source_key,
      source_bucket,
      metadata,
    })()
  },
})
