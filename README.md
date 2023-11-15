![GitHub](https://img.shields.io/github/license/a1sabau/openui5-cv-generator%20)
[![Build Status](https://github.com/a1sabau/openui5-cv-generator/workflows/Tests/badge.svg)](https://github.com/a1sabau/openui5-cv-generator/actions?query=workflow%3ATests)
[![Coverage Status](https://coveralls.io/repos/github/a1sabau/openui5-cv-generator/badge.svg?branch=main)](https://coveralls.io/github/a1sabau/openui5-cv-generator?branch=main)

## OpenUI5 Curriculum Vitae Generator

Generate HTML and PDF versions of your CV with a SAPUI5 style look using SAP OpenUI5 components. \
See a generated example at [asabau.com/sapui5/](https://asabau.com/sapui5/).

Each CV section (experience, education, etc..) corresponds to a separate CDS entry. Just modify the existing initial data (csv files) with your own.

You can deploy the project as a:

- Multi-Target Application (MTA) in SAP BTP supporting both display and edit mode (edit mode not completed yet)
- standalone static site bundle containing just html/css/js files together with OData content exported as json files. Only supports display mode but can be hosted on any web server.

### Install

```
npm ci
```

This will install dependencies for all monorepo packages available under `/packages`:

- /packages/backend
- /packages/frontend/display
- /packages/frontend/edit

### Start CAP backend

```
npm run watch:dev:backend
```

Monitors changes, available under `localhost:4004/`. Contains the [odata-v2-adapter](https://github.com/cap-js-community/odata-v2-adapter) so that the service endpoints are available both under OData v2 and v4.

### Start OpenUI5 frontend

Each frontend npm workspace corresponds to a BTP Work Zone (Launchpad) app.

Generate typescript types based on backend cds.

```
npm run -w packages/backend generate:types
```

Generate and monitor typescript types for the custom controls in frontend npm workspaces.

```
npm run watch:interface:generator
```

Start and monitors changes in frontend npm workspaces:

- `frontend:display`: `localhost:8080/index.html`
- `frontend:edit`: `localhost:8081/index.html`

```
npm run watch:dev:frontend
```

Under the `Cv` semantic object, the sapui5 app linked to the `display` action uses OData v2 to load the corresponding data. Because v2 can be mocked on client side, the project offers the possibility to bundle the `Cv-display` app in just html, js and css files with OData v2 content exported as json files. In this standalone mode you can interact with the app without hosting a CAP backend.

### Deploy in SAP BTP as MTA

Run from the root project

```bash
cf login
npm run build
npm run deploy
```

If you need to remove the MTA

```
npm run undeploy
```

### Deploy as standalone static application

Export metadata and content from the OData v2 available service points in `/packages/frontend/display/webapp/localService`. Local CAP backend needs to be available for this to succeed.

```
npm run -w packages/backend export:odata
```

Build UI5 self contained `dist` version.

```
npm run -w packages/frontend/display build:opt
```

Construct a bundle with a subset of `dist`, only the js bundle without individual js files.

```
npm run -w packages/frontend/display build:bundle
```

Copy the generated `/packages/frontend/display/bundle` dir to any web server without requiring a CAP backend.

### Build a PDF version

Just open the app from the BTP Work Zone (formerly Launchpad) or the standalone html page and print it as pdf. Print related css definitions have been added to handle inconsistencies between HTML and PDF mediums.

Note: To avoid some minor glitches make sure you're at the top of the page otherwise some header related gaps may appear.

### Continuous Integration & Delivery

#### Github Actions

Unit tests, integration tests run under the [test workflow](./actions/workflows/test.yml).
Security checks run under the [audit workflow](./actions/workflows/audit.yml).

#### BTP

A CI/CD BTP job is triggered by a Github webhook triggered by a `workflow completed` event. It uses MTA to redeploy the app under a SAP BTP trial account.
