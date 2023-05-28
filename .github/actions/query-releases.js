const { Octokit } = require("@octokit/action");
const { paginateGraphql } = require("@octokit/plugin-paginate-graphql");

const OctokitP = Octokit.plugin(paginateGraphql);

const octokit = new OctokitP();

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

const { result } = octokit.graphql.paginate(`
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

console.log(result);
