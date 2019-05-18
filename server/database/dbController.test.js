/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const config = require('./../config/config');
const connectDatabase = require('../lib/connectDatabase.js');
const ClassController = require('./dbController.js');

const userMethods = [
  'getAllUsers',
  'getUserByTelegramId',
  'getUserById',
  'putUserTelegramChatId',
  'putUserDepartment',
  'postNewUser',
  'getAllUsersByEventId',
  'querySearch',
  'putUserBan'
];

const eventMethods = ['getAllEvents', 'getEventById', 'postNewEvent'];
const departmentMethods = [
  'getDepartmentById',
  'getAllDepartments',
  'postNewDepartment'
];
const randomizerMethods = [
  'updateEventPairs',
  'insertEventPairs',
  'removeEventPairs',
  'getEventPairsById',
  'insertPair'
];

const controller = new ClassController();
const testData = {
  userTelegramId: undefined,
  eventId: undefined,
  departmentId: undefined
};
connectDatabase();

describe('dbController tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('tests done, May the Force be with you young Jedi');
  });

  test('Has all methods in default case', done => {
    const controllerMethods = Object.keys(controller).sort();
    const testMethods = userMethods
      .concat(eventMethods, departmentMethods, randomizerMethods)
      .sort();
    expect(controllerMethods.length).toEqual(testMethods.length);

    controllerMethods.forEach(method => {
      expect(testMethods.includes(method)).toBeTruthy();
    });
    done();
  });

  test('Get all Events', done => {
    function cb(data) {
      testData.eventId = data[0]['_id'];
      expect(data).toHaveLength(5);
      done();
    }

    controller.getAllEvents().then(events => {
      cb(events);
    });
  });

  test('Get all Users', done => {
    function cb(controllerUsers, mongoUsersCount) {
      testData.userTelegramId = controllerUsers[0].telegramUserId;
      testData.userId = controllerUsers[0]['_id'];
      expect(controllerUsers).toHaveLength(mongoUsersCount);
      done();
    }

    //  Send mongodb driver's query for comparing results
    MongoClient.connect(
      config.database,
      (err, client) => {
        client
          .db('demoproject')
          .collection('demo_users')
          .find({})
          .count((errr, mongoUsersCount) => {
            client.close();
            controller.getAllUsers().then(controllerUsers => {
              cb(controllerUsers, mongoUsersCount);
            });
          });
      }
    );
  });

  test('Get all Departments', done => {
    function cb(data) {
      testData.departmentId = data[0]['_id'];

      expect(data).toHaveLength(6);
      done();
    }

    controller.getAllDepartments().then(department => {
      cb(department);
    });
  });

  test('GET User by telegram id', done => {
    function cb(user) {
      expect(user).toHaveProperty('username');
      done();
    }

    controller.getUserByTelegramId(testData.userTelegramId).then(user => {
      cb(user);
    });
  });

  test('GET User by _id', done => {
    function cb(user) {
      expect(user).toHaveProperty('username');
      done();
    }

    controller.getUserById(testData.userId).then(user => {
      cb(user);
    });
  });

  test('GET Event by _id', done => {
    function cb(event) {
      expect(event).toHaveProperty('description');
      done();
    }

    controller.getEventById(testData.eventId).then(event => {
      cb(event);
    });
  });

  test('GET Department by _id', done => {
    function cb(department) {
      expect(department).toHaveProperty('description');
      done();
    }

    controller.getDepartmentById(testData.departmentId).then(department => {
      cb(department);
    });
  });

  test('POST new Department', done => {
    const newDepartmentParams = {
      title: 'New Department',
      description: 'Just another Department'
    };

    function cb(newDepartment) {
      expect(newDepartment.description).toMatch(
        newDepartmentParams.description
      );

      //  Send mongodb driver's query for deleting test Department
      MongoClient.connect(
        config.database,
        (err, client) => {
          client
            .db('demoproject')
            .collection('demo_departments')
            .deleteOne({ _id: newDepartment['_id'] }, () => {
              client.close();
              done();
            });
        }
      );
    }

    controller.postNewDepartment(newDepartmentParams).then(newDepartment => {
      cb(newDepartment);
    });
  });
});

describe('dbController tests with "user" argument passed in', () => {
  const userController = new ClassController('user');
  it('config test', () => {
    expect(userController).toBeTruthy();
  });

  test('Has all user methods', done => {
    userMethods.forEach(method => {
      expect(userController).toHaveProperty(method);
    });
    done();
  });

  test('Has no event methods', done => {
    eventMethods.forEach(method => {
      expect(userController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no department methods', done => {
    departmentMethods.forEach(method => {
      expect(userController).not.toHaveProperty(method);
    });
    done();
  });
});

describe('dbController tests with "event" argument passed in', () => {
  const eventController = new ClassController('event');
  it('config test', () => {
    expect(eventController).toBeTruthy();
  });

  test('Has no user methods', done => {
    userMethods.forEach(method => {
      expect(eventController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has all event methods', done => {
    eventMethods.forEach(method => {
      expect(eventController).toHaveProperty(method);
    });
    done();
  });

  test('Has no department methods', done => {
    departmentMethods.forEach(method => {
      expect(eventController).not.toHaveProperty(method);
    });
    done();
  });
});

describe('dbController tests with "department" argument passed in', () => {
  const departmentController = new ClassController('department');
  it('config test', () => {
    expect(departmentController).toBeTruthy();
  });

  test('Has no user methods', done => {
    userMethods.forEach(method => {
      expect(departmentController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no event methods', done => {
    eventMethods.forEach(method => {
      expect(departmentController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has all department methods', done => {
    departmentMethods.forEach(method => {
      expect(departmentController).toHaveProperty(method);
    });
    done();
  });
});

describe('dbController tests with plural arguments passed in', () => {
  const departmentController = new ClassController('user', 'department');
  it('config test', () => {
    expect(departmentController).toBeTruthy();
  });

  test('Has user methods', done => {
    userMethods.forEach(method => {
      expect(departmentController).toHaveProperty(method);
    });
    done();
  });

  test('Has no event methods', done => {
    eventMethods.forEach(method => {
      expect(departmentController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has department methods', done => {
    departmentMethods.forEach(method => {
      expect(departmentController).toHaveProperty(method);
    });
    done();
  });
});

describe("dbController's argument should be a string", () => {
  test('Number as an argument throws TypeError', done => {
    function cb() {
      return new ClassController(42);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Array as an argument throws TypeError', done => {
    function cb() {
      return new ClassController([42]);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Undefined as an argument throws TypeError', done => {
    function cb() {
      return new ClassController(undefined);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Null as an argument throws TypeError', done => {
    function cb() {
      return new ClassController(null);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Boolean as an argument throws TypeError', done => {
    function cb() {
      return new ClassController(true);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Object as an argument throws TypeError', done => {
    function cb() {
      return new ClassController({
        'Bruce Willis': 'yipikaye, motherf*cker'
      });
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
});

describe('dbController takes wrong string argument', () => {
  test('Should throw SyntaxError', done => {
    function cb() {
      return new ClassController('wg_forge_power!');
    }
    expect(cb).toThrowError(SyntaxError);
    done();
  });
});

describe('dbController takes over 1 argument', () => {
  test('Should throw SyntaxError', done => {
    function cb() {
      return new ClassController('there', 'must', 'be', 'only', 'one');
    }
    expect(cb).toThrowError(SyntaxError);
    done();
  });
});
