using {ui5.generator as my} from '../db/schema';

@path: 'browse'
service CvService {
  entity Cv as projection on my.Cv {
    *
  }
  entity Degrees as projection on my.Degrees order by Degrees.startYear desc;
  entity Jobs as projection on my.Jobs order by Jobs.startDate desc;
  entity Certifications as projection on my.Certifications order by Certifications.issuedOn desc;
  entity Projects as projection on my.Projects order by Projects.order;
}