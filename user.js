class VoluntarySelfIdentification {
  constructor(gender = '', sexual_orientation = '', race = '', disability = '', veteran = '') {
      this.gender = gender;
      this.sexual_orientation = sexual_orientation;
      this.race = race;
      this.disability = disability;
      this.veteran = veteran;
  }

  toString() {
      return JSON.stringify(this);
  }
}

class Personal {
  constructor(first_name = '', middle_name = '', last_name = '', phone_number = '', phone_type = '', email = '', country = '', resume = '', available_to_start_work = '') {
      this.first_name = first_name;
      this.middle_name = middle_name;
      this.last_name = last_name;
      this.phone_number = phone_number;
      this.phone_type = phone_type;
      this.email = email;
      this.country = country;
      this.resume = resume;
      this.available_to_start_work = available_to_start_work;
  }

  toString() {
      return JSON.stringify(this);
  }
}

class WorkExperience {
  constructor(work_start_date = '', work_end_date = '', work_type = '') {
      this.work_start_date = work_start_date;
      this.work_end_date = work_end_date;
      this.work_type = work_type;
  }

  toString() {
      return JSON.stringify(this);
  }
}

class Legal {
  constructor(notice_period = '', immigration_sponsorship = '', current_student = '', other_job_considerations = '', previously_employed = '', receive_notifications = '') {
      this.notice_period = notice_period;
      this.immigration_sponsorship = immigration_sponsorship;
      this.current_student = current_student;
      this.other_job_considerations = other_job_considerations;
      this.previously_employed = previously_employed;
      this.receive_notifications = receive_notifications;
  }

  toString() {
      return JSON.stringify(this);
  }
}

class Address {
  constructor(street = '', postal_code = '', city = '', state = '', country = '') {
      this.street = street;
      this.postal_code = postal_code;
      this.city = city;
      this.state = state;
      this.country = country;
  }

  toString() {
      return JSON.stringify(this);
  }
}

class Education {
  constructor(school = '', major = '', degree = '', GPA = '') {
      this.school = school;
      this.major = major;
      this.degree = degree;
      this.GPA = GPA;
  }

  toString() {
      return JSON.stringify(this);
  }
}

class User {
  constructor(personal, address, education, work_experience, legal, self_identification) {
      this.personal = personal;
      this.address = address;
      this.education = education;
      this.work_experience = work_experience;
      this.legal = legal;
      this.self_identification = self_identification;
  }

  toString() {
      let user_info = { 
          ...JSON.parse(this.personal.toString()),
          ...JSON.parse(this.address.toString()), 
          ...JSON.parse(this.work_experience.toString()),
          ...JSON.parse(this.education.toString()),
          ...JSON.parse(this.legal.toString()),
          ...JSON.parse(this.self_identification.toString())
      }

      let user_rep = `
          Name:
          - First Name: ${user_info.first_name} 
          - Middle Name: ${user_info.middle_name} 
          - Last Name: ${user_info.last_name}

          Contact Information:
          - Phone Number: ${user_info.phone_number}
          - Contact Type: ${user_info.phone_type}
          - Email Address: ${user_info.email}
          - Address: ${user_info.street}, ${user_info.city}, ${user_info.state} ${user_info.postal_code}, ${user_info.country}

          Availability:
          - Available to Start Work: ${user_info.available_to_start_work}
          - Available to Work Until: ${user_info.work_end_date}
          - Notice Period: ${user_info.notice_period}

          Education:
          - School: ${user_info.school}
          - Major: ${user_info.major}
          - Degree: ${user_info.degree}
          - GPA: ${user_info.GPA}

          Experience:
          - Work Type: ${user_info.work_type}
          - Previously Employed at: ${user_info.previously_employed}

          Additional Information:
          - Needs Immigration Sponsorship: ${user_info.immigration_sponsorship}
          - Current Student: ${user_info.current_student}
          - Consider for Other Job Postings: ${user_info.other_job_considerations}
          - Allow SMS/Email Notifications: ${user_info.receive_notifications}
          - Gender: ${user_info.gender}
          - Sexual Orientation: ${user_info.sexual_orientation}
          - Race: ${user_info.race}
          - Disability: ${user_info.disability}
          - Veteran: ${user_info.veteran}

          Resume:
          - ${user_info.resume}
          `

      return user_rep;
  }
}

let self_identification = new VoluntarySelfIdentification('male', 'heterosexual', 'asian', '', 'no');
let personal = new Personal('Jane', '', 'Doe', '9728443577', 'mobile', 'janedoe@cornell.edu', 'United States', 'resume_sample.pdf', 'Immediately');
let work_experience = new WorkExperience('6/01/2023', '8/31/2023', 'intern');
let address = new Address('27 appleberry ln.', '07464', 'montvale', 'new jersey', 'United States');
let legal = new Legal('immediately', 'no', 'yes', 'yes', ['rapstudy'], 'yes');
let education = new Education('cornell university', 'computer science', 'bachelors of science', '2.0');

let user = new User(personal, address, education, work_experience, legal, self_identification);

module.exports = { User, Personal, Address, Education, WorkExperience, Legal, VoluntarySelfIdentification, user };
