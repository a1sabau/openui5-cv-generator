namespace ui5.generator;

using {
    cuid,
    managed,
} from '@sap/cds/common';

/*
OData v2 vs OData v4 considerations
-----------------------------
The final, published html version of the generated cv should work without any backend service.
It is just a collection of static html/css/js files + mocked json data recorded from the development backend service.
Only OData v2 has a mock library on client side - sap/ui/core/util/MockServer, Odata v4 is mocked on server side.
So we're forced to use OData v2 and can't make use of the following annotations:
    - @odata.singleton for Cv
    - many String(200) for Projects.links

OData v2 also has the advantage of being compatible with SmartForm and SmartTable controls.


i18n backend vs i18n frontend considerations
---------------------------------------------
Annotated i18n texts under the format '{i18n>key}' are translated on backend.
Annotated i18n texts under the format 'i18n>key' are translated on frontend via custom `replaceLabelsFromI18n` fnc.
*/
entity Cv {
    /*
    don't use auto-generated UUIDs in order to use simple integer IDs in the csv files containing the initial data
    DO use UUIDs in any production environment, don't rely on:
    - a single db instance autoincrement capability for a primary key
    - a single cds service instance
    key ID: String(36) default cuid();
    */
    key ID: UInt8;

    @Common.Label: 'i18n>firstName'
    firstName: String(200);

    @Common.Label: '{i18n>lastName}'
    lastName: String(200);

    fullName : String = firstName || ' ' || lastName;
    
    @Common.Label: 'i18n>description'
    description: String(400);

    @UI.multiLineText: true
    @Common.Label: 'i18n>about'
    about: String(1500);

    @Common.Label: 'i18n>email'
    email: String(200);

    @Common.Label: 'i18n>phone'
    phone: String(200);

    linkedInUrl: String(200);
    githubUrl: String(200);
    imageUrl: String(200);
    

    Certifications : Composition of many Certifications on Certifications.parent = $self;
    Projects : Composition of many Projects on Projects.parent = $self;
    Degrees : Composition of many Degrees on Degrees.parent = $self;
    Jobs : Composition of many Jobs on Jobs.parent = $self;
}

entity Certifications {
    key parent : Association to Cv;

    /*
    Unlike the other composition 'contained-in' relationships (Projects, Degrees, Jobs)
    Certifications references Tags via an association.

    If parent and title are set as keys, in order to uniquely identify a certification like in the other composition relationships,
    the Tags entities would end up containing both owner_parent_ID and owner_title columns.

    Initially title was used as a part of the composite (parent, title) key.
    To simplify the Tags structure, use an UInt8 key ID, for this small project don't use UUIDs, 
    CSV files with initial data would have to be based on them

    This results in CREATE TABLE _Certifications (
        parent_ID TINYINT NOT NULL,
        ID TINYINT NOT NULL,
        ...
        PRIMARY KEY(parent_ID, ID)
    )
    */
    key ID: UInt8;

    title: String(200);
    description: String(1500);
    issuedBy: String(200);
    issuedOn: Date;
    link: String(200);
    tags: String(200);
}

/*
A link entity would be the optimal solution for a manu-to-many association between Certifications and Tags
with the help of a linkage table

    Certifications.tags  : Association to many Cert2Tag on tags.cert = $self;
    entity Cert2Tag {
    key cert : Association to Certifications;
    key tag : Association to Tags;
    }

but it makes filling cv info in cvs file harder

    Cert2Tag.csv would be something like:
    cert_parent_ID;cert_ID;tag_id;
    1;;1;1
    1;;1;2

instead, just have a tags column in Certifications with values separated by ','
    this makes it easier to update certifications tags in the csv files
*/

entity Tags {
    key name: String(50);
    order: UInt8;
}

entity Projects {
    key parent : Association to Cv;
    key title: String(200);
    description: String(1500);
    links: String(200);
    order: UInt8;
}

entity Degrees {
    key parent : Association to Cv;
    key school: String(200);
    key name: String(200);
    description: String(1500);
    startYear: String(4);
    endYear: String(4);
}

entity Jobs {
    key parent : Association to Cv;
    key company: String(200);
    key title: String(200);
    description: String(1500);
    startDate: Date;
    endDate: Date;
}