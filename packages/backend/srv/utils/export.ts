import { get, IncomingMessage } from 'http';
import { writeFileSync, readFileSync } from 'fs';

enum ExportFormat {
  JSON = 'json',
  XML = 'xml',
}

const exportEntries: { filename: string; url: string; format: ExportFormat }[] = [
  {
    filename: 'metadata.xml',
    url: 'http://localhost:4004/odata/v2/browse/$metadata',
    format: ExportFormat.XML,
  },
  {
    filename: 'Cv.json',
    url: 'http://localhost:4004/odata/v2/browse/Cv(1)',
    format: ExportFormat.JSON,
  },
  {
    filename: 'Certifications.json',
    url: 'http://localhost:4004/odata/v2/browse/Cv(1)/Certifications',
    format: ExportFormat.JSON,
  },
  {
    filename: 'Degrees.json',
    url: 'http://localhost:4004/odata/v2/browse/Cv(1)/Degrees',
    format: ExportFormat.JSON,
  },
  {
    filename: 'Jobs.json',
    url: 'http://localhost:4004/odata/v2/browse/Cv(1)/Jobs',
    format: ExportFormat.JSON,
  },
  {
    filename: 'Projects.json',
    url: 'http://localhost:4004/odata/v2/browse/Cv(1)/Projects',
    format: ExportFormat.JSON,
  },
  {
    filename: 'Tags.json',
    url: 'http://localhost:4004/odata/v2/browse/Tags',
    format: ExportFormat.JSON,
  },
];

(async () => {
  for (const exportEntry of exportEntries) {
    const { filename } = exportEntry;

    console.log('saving', filename);
    const rawData = await getJSON(exportEntry.url);

    let content: string;

    // json format handling
    if (exportEntry.format === ExportFormat.JSON) {
      const data = JSON.parse(rawData);
      // depending on the odate v2 query we may get an object or an array
      content = JSON.stringify(data.d.results || [data.d], null, 2);
    }
    // xml format handling
    else {
      content = rawData;
    }

    const parentPath = '../frontend/display/webapp/localService';
    const fullPath = filename.endsWith('.xml') ? `${parentPath}/metadata.xml` : `${parentPath}/mockdata/${filename}`;

    writeFileSync(fullPath, content, { encoding: 'utf8' });
    console.log('DONE');
  }

  console.log('export complete');
})();

function getJSON(url: string): Promise<any> {
  const result = new Promise((resolve, reject) => {
    get(url, (res: IncomingMessage) => {
      const { statusCode } = res;

      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        reject(new Error('Request Failed.\n' + `Status Code: ${statusCode}`));
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          resolve(rawData);
        } catch (e) {
          reject(e);
        }
      });
    });
  });

  return result;
}
