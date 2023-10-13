namespace ui5.generator;

using {
    cuid,
    managed
} from '@sap/cds/common';

// @odata.singleton
entity Cv {
    key ID: UInt8;
    firstName: String(200);
    lastName: String(200);
    fullName : String = firstName || ' ' || lastName;
    description: String(400);
    email: String(200);
    phone: String(200);
    linkedInUrl: String(200);
    githubUrl: String(200);
    imageUrl: String(200);
    about: String(400);

    Certifications : Composition of many Certifications on Certifications.parent = $self;
    Projects : Composition of many Projects on Projects.parent = $self;
    Degrees : Composition of many Degrees on Degrees.parent = $self;
    Jobs : Composition of many Jobs on Jobs.parent = $self;
}


entity Certifications {
    key parent : Association to Cv;
    key title: String(200);
    description: String(400);
    issuedBy: String(200);
    issuedOn: Date;
    link: String(200);
}

entity Projects {
    key parent : Association to Cv;
    key title: String(200);
    description: String(400);
    // links: many String(200);
    links: String(200);
    order: Integer;
}

entity Degrees {
    key parent : Association to Cv;
    key school: String(200);
    key name: String(200);
    description: String(400);
    startYear: String(4);
    endYear: String(4);
}

entity Jobs {
    key parent : Association to Cv;
    key company: String(200);
    key title: String(200);
    description: String(400);
    startDate: Date;
    endDate: Date;
}