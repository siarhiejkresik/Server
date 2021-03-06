const mongoose = require('mongoose');

const { Schema } = mongoose;

const TopicSchema = new Schema({
  //  Состояние события.
  //  Если админ скрыл событие или одиночное событие прошло, то переводим флаг в false
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  // Название события
  title: {
    type: String,
    required: true
  },
  //  Описание события
  description: {
    type: String,
    required: true
  },
  //  Координаты места проведения
  //  Формат: [7.1854773, 1.9979411]
  location: {
    type: Array,
    required: true
  },
  //  Адррес места проведения
  address: {
    type: String,
    required: false
  },
  // Является ли событие повторяющимся
  cyclic: {
    type: Boolean,
    required: true,
    default: false
  },
  //  День недели, начиная с воскресенья, в который проводится событие
  //  Для одиночного события – не имеет значения
  weekDay: {
    type: Number,
    required: false
  },
  // Время, когда будут проходить ивенты (в формате 15:42)
  time: {
    type: String,
    required: false
  },
  //  Даты следующих событий, пересчитывается отдельным скриптом перед работой рандомайзера
  //  Если создаётся одиночное событие, то этот параметр ему выставляется сразу, один элементом массива
  //  Дата добавления события в БД
  created: {
    type: Number,
    default: new Date().getTime(),
    required: false
  },
  // Дата проведения единоразового события
  singleDate: {
    type: Number,
    required: false
  },
  // Дата последней генерации ивентов
  lastEventsCreationDate: {
    type: Number,
    required: false
  }
});

module.exports = modelName => mongoose.model(modelName, TopicSchema);
