const mongoose = require('mongoose');
const DepartmentSchema = require('../models/department');
const isNull = require('../../utilities/isNull');

function departmentMethodsFactory(departmentModelName) {
  if (isNull(departmentModelName)) {
    return {};
  }
  const Departments = DepartmentSchema(departmentModelName);

  const find = (query, fields = null, sorting = null, skip = 0, limit = 0) =>
    Departments.find(query, fields, { ...sorting, skip, limit }).exec();

  const findOne = (query, fields = null) =>
    Departments.findOne(query, fields).exec();

  const getDepartmentById = departmentId => {
    return Departments.findOne({
      _id: mongoose.Types.ObjectId(departmentId)
    }).exec();
  };

  const getAllDepartments = sorting => {
    return Departments.find({}, null, sorting).exec();
  };

  const postNewDepartment = department => {
    const newDepartment = new Departments(department);
    return new Promise((resolve, reject) => {
      newDepartment.save((err, addedDepartment) => {
        if (err) reject(err);
        resolve(addedDepartment);
      });
    });
  };

  const updateDepartment = (departmentId, newProps) => {
    return Departments.findOneAndUpdate(
      { _id: departmentId },
      { $set: newProps },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  };

  return {
    getDepartmentById,
    getAllDepartments,
    postNewDepartment,
    updateDepartment,
    find,
    findOne
  };
}

module.exports = departmentMethodsFactory;
