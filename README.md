![GitHub](https://img.shields.io/github/license/a1sabau/openui5-cv-generator%20)
[![Build Status](https://github.com/a1sabau/openui5-cv-generator/workflows/Tests/badge.svg)](https://github.com/a1sabau/openui5-cv-generator/actions?query=workflow%3ATests)
[![Coverage Status](https://coveralls.io/repos/github/a1sabau/openui5-cv-generator/badge.svg?branch=main)](https://coveralls.io/github/a1sabau/openui5-cv-generator?branch=main)

## OpenUI5 Curriculum Vitae Generator

Generate HTML and PDF versions of your CV with a SAPUI5 style look using SAP OpenUI5 components. \
See a generated example at [asabau.com/sapui5/](https://asabau.com/sapui5/).

Each CV section (experience, education, etc..) corresponds to a separate CDS entry. Just modify the existing initial data (csv files) with your own.

### Install

```
npm ci
```

### Start backend

```
cd packages/backend
npm start
```

One cds entity per CV section. Definitions compatible with both OData v2 and v4.
Starts on port `4040`, contains the [odata-v2-adapter](https://github.com/cap-js-community/odata-v2-adapter) so that the generated CV can be deployed as static html files and mocked data json files as only OData v2 calls can be mocked client side.

### Start frontend

```
cd packages/frontend
npm start
```

Watch live changes (frontend and backend) at `http://localhost:8080`.

### Export metadata.xml and database content as mock data

```
cd packages/backend
npm run export
```

The corresponding files will be generated under `packages/frontend/webapp/localService`.

### Enable usage of mock data

In `initMockServer.ts` update the `enableMockServer` flag

```
const enableMockServer = true;
```

### Build a self-contained static html version

```
cd packages/frontend
npm run build:opt
npm run build:clean
```

The final files are available under `packages/frontend/bundle`.

### Build a PDF version

Just print the html version, print related css definitions have been added.
To avoid some minor inconsistencies make sure you're at the top of the page otherwise some header related gaps may appear.
