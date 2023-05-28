const { GitHub, getOctokitOptions } = require("@actions/github/lib/utils");
const { paginateGraphql } = require("@octokit/plugin-paginate-graphql");
const octokit = GitHub.plugin(paginateGraphql)
const core = require('@actions/core');

const myOctokit = new octokit(getOctokitOptions())
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

async function query() {
  const response = await myOctokit.graphql.paginate(`
  query paginate($cursor: String, $owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
    releases(
        first: 2
        after: $cursor
        orderBy: {field: CREATED_AT, direction: ASC}
    ) {
        edges {
        node {
            name
            isPrerelease
            description
            createdAt
            releaseAssets(last: 100) {
            nodes {
                createdAt
                name
                size
                downloadUrl
            }
            }
        }
        }
        pageInfo {
        endCursor
        hasNextPage
        }
    }
  }
}`,
{
  owner: owner,
  name: repo
}
);

  console.log("${response}");
  core.setOutput('response', response);

}

query();
