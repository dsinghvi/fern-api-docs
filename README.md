# DevRev API

Tagging a release on this repository will update the following clients:

- [Node.js SDK repo -- public](https://github.com/fern-devrev/devrev-node)
- [Node.js SDK repo -- beta](https://github.com/fern-devrev/devrev-node-beta)
- [API Docs](https://devrev.docs.buildwithfern.com)

## What is in this repository?

This repository contains

- DevRev's `Public` OpenAPI spec & `Beta` OpenAPI spec
- Fern configuration

## What is in the API Definition?

The API Definition contains an OpenAPI specification adapted to be compatible with Fern.

To make sure that the definition is valid, you can use the Fern CLI.

```bash
npm install -g fern-api # Installs CLI
fern check # Checks if the definition is valid
```

## What are generators?

Generators read in your API Definition and output artifacts (e.g. the TypeScript SDK Generator) and are tracked in [generators.yml](./fern/api/generators.yml).

To trigger the generators run:

```bash
# publish generated files
fern generate --version <version>
```

## Upgrading Fern
You can use the following command to upgrade fern to the latest version:
```bash
fern upgrade --rc
```

### Troubleshooting

If you run into errors, you can add the ` --log-level debug` flag to get more information.

If you get a 403 error, you may need to first run `fern login`. You might also need to be added
to the Vellum org in Fern, which requires contacting the fern team in #fern-x-vellum in Slack.
