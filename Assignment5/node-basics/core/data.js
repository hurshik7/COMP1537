let someData = "<ul><li>Monday</li><li>Tuesday</li><li>Wednesday</li><li>Thursday</li><li>Friday</li><li>Saturday</li><li>Sunday</li></ul>";

let someOtherData = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

let coursesJSON = [
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"},
    {number: "COMP1536", name: "Intro to Web Development", credits: "3.0", instructor: "Arron Ferguson", CRN: "334455"}
];

module.exports = {
  getHTML: function () {
      console.log("called: getHTML");
      // Note: this could be from a DB, for now it's just hard-coded
      someOtherFunction();
      return someData;
  },
  getJSON: function () {
      console.log("called: getJSON");
      // Note: this could be from a DB, for now it's just hard-coded
      return someOtherData;
  },

  getJSONCourses: function() {
      console.log("called: Courses JSON");
      return coursesJSON;
  }
};



// which is private
var someOtherFunction = function () {
    console.log("Can't touch this!");
}
