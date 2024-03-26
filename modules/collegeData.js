const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length > 0) {
            // Filter students by the given course
            const studentsInCourse = dataCollection.students.filter(student => student.course === course);

            if (studentsInCourse.length > 0) {
                // If there are students in the course, resolve with the array
                resolve(studentsInCourse);
            } else {
                // If no students found for the given course, reject with a meaningful message
                reject(`No students found for course ${course}`);
            }
        } else {
            // If no students or an empty array, reject with a meaningful message
            reject("No results returned for getStudentsByCourse");
        }
    });
}

module.exports.getStudentByNum = function(num) {
    return new Promise((resolve, reject) => {
        // Check if dataCollection and students array exist
        if (dataCollection.students.length > 0) {
            // Find the student with the given studentNum
            const student = dataCollection.students.find(student => student.studentNum === num);

            if (student) {
                // If a student is found, resolve with the student object
                resolve(student);
            } else {
                // If no student found for the given studentNum, reject with a meaningful message
                reject(`No student found with studentNum ${num}`);
            }
        } else {
            // If no students or an empty array, reject with a meaningful message
            reject("No results returned for getStudentByNum");
        }
    });
}

module.exports.addStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        // If studentData.TA is undefined, set it to false, otherwise set it to true
        studentData.TA = studentData.TA === undefined ? false : true;

        // Set the studentNum property of studentData to be the length of the "dataCollection.students" array plus one
        studentData.studentNum = dataCollection.students.length + 1;

        // Push the updated studentData object onto the "dataCollection.students" array
        dataCollection.students.push(studentData);

        // Resolve the promise
        resolve();
    });
};

module.exports.getCourseById = function(id) {
    return new Promise(function (resolve, reject) {
        var course = null;

        for (let i = 0; i < dataCollection.courses.length; i++) {
            if (dataCollection.courses[i].courseId == id) {
                course = dataCollection.courses[i];
            }
        }

        if (!course) {
            reject("query returned 0 results");
            return;
        }

        resolve(course);
    });
};

module.exports.updateStudent = function(studentData) {
    return new Promise(function (resolve, reject) {
        let updated = false;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == studentData.studentNum) {
                // Handle the "TA" checkbox data
                studentData.TA = studentData.TA ? true : false;

                // Overwrite the student with the new data
                dataCollection.students[i] = studentData;
                updated = true;
                break;
            }
        }

        if (updated) {
            resolve();
        } else {
            reject("unable to find student");
        }
    });
};