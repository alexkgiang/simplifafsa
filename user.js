class User {
  constructor(firstName, lastName, email, phone, phoneType, address, country, resume, linkedin) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.phoneType = phoneType
    this.address = address;
    this.country = country;
    this.resume = resume;
    this.linkedin = linkedin;
  }

}

module.exports = User;

