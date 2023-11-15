import cds from '@sap/cds';
import { Request, Service } from '@sap/cds/apis/services';

export = (srv: Service) => {
  const { Cv } = srv.entities;

  /*
  just retrieve the image directly from the url: /Cv/ID/photo
  no need to worry about content-type as it's defined (fixed) in cds

  srv.on('getPhoto', Cv, async (req: Request) => {
    const [ID] = req.params;
    const [{ photo, lastName }] = await SELECT(['photo', 'lastName']).from(Cv).where({ ID });

    return [
      {
        value: photo,
        $mediaContentType: 'image/png',
      },
    ];
  });
  */

  srv.on('savePhoto', Cv, async (req: Request) => {
    const ID = req.params[0];
    const { photo } = req.data;

    await UPDATE(Cv, ID).with({ photo: Buffer.from(photo, 'base64') });

    return true;
  });

  /*
  https://blogs.sap.com/2021/08/21/cheat-sheet-for-uri-patterns-for-calling-odata-actions-and-functions/

  OData V4 patterns:
    Bound Action: pathToService/EntitySet(key)/ServiceName.actionName
    Unbound Action: pathToService/actionName

    Bound function: pathToService/EntitySet(key)/ServiceName.functionName(paramName1=<value>,paramName2=<value>)
    Unbound function: pathToService/functionName(paramName1=<value>,paramName2=<value>)

  OData V2 patterns:
    Bound Action (pattern1): pathToService/EntitySet(key)/ServiceName.actionName
    Bound Action (pattern2): pathToService/EntitySet_actionName?key=<value>
    Unbound Action: pathToService/actionName
    
    Bound function: pathToService/EntitySet_functionName?key=<value>&paramName1=<value>&paramName2=<value>
    Unbound function: pathToService/functionName?paramName1=<value>&paramName2=<value>


  available v2 and v4 endpoints: 
    http://localhost:4004/odata/v2/browse/Cv/1/CvService.getInfo()
    http://localhost:4004/odata/v2/browse/Cv/1/getInfo()
    http://localhost:4004/odata/v4/browse/Cv/1/photo
  */
};
