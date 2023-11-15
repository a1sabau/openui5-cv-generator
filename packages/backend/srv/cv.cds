using {ui5.generator as my} from '../db/schema';

@path: 'browse'
service CvService {
  entity Cv as select from my.Cv
   actions {
      action savePhoto(photo:LargeString) returns Boolean;
    }

  entity Degrees as projection on my.Degrees order by Degrees.startYear desc;
  entity Jobs as projection on my.Jobs order by Jobs.startDate desc;
  entity Certifications as projection on my.Certifications order by Certifications.issuedOn desc;
  entity Projects as projection on my.Projects order by Projects.order;
  entity Tags as projection on my.Tags;
}