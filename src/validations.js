const Joi = require('joi');

const customMsg = (action, key) => `Gagal ${action} buku. Mohon isi ${key} buku`;

const addBookValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({ 'any.required': customMsg('menambahkan', 'nama') }),
    year: Joi.number().required().messages({ 'any.required': customMsg('menambahkan', 'year') }),
    author: Joi.string().required().messages({ 'any.required': customMsg('menambahkan', 'author') }),
    summary: Joi.string().required().messages({ 'any.required': customMsg('menambahkan', 'summary') }),
    publisher: Joi.string().messages({ 'any.required': customMsg('menambahkan', 'published') }),
    pageCount: Joi.number().required().messages({ 'any.required': customMsg('menambahkan', 'pageCount') }),
    readPage: Joi.number().required().messages({ 'any.required': customMsg('menambahkan', 'readPage') }),
    reading: Joi.boolean().required().messages({ 'any.required': customMsg('menambahkan', 'reading') }),
  });

  return schema.validate(data);
};

const editBookValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({ 'any.required': customMsg('memperbarui', 'nama') }),
    year: Joi.number().required().messages({ 'any.required': customMsg('memperbarui', 'year') }),
    author: Joi.string().required().messages({ 'any.required': customMsg('memperbarui', 'author') }),
    summary: Joi.string().required().messages({ 'any.required': customMsg('memperbarui', 'summary') }),
    publisher: Joi.string().messages({ 'any.required': customMsg('memperbarui', 'published') }),
    pageCount: Joi.number().required().messages({ 'any.required': customMsg('memperbarui', 'pageCount') }),
    readPage: Joi.number().required().messages({ 'any.required': customMsg('memperbarui', 'readPage') }),
    reading: Joi.boolean().required().messages({ 'any.required': customMsg('memperbarui', 'reading') }),
  });

  return schema.validate(data);
};

module.exports = { addBookValidation, editBookValidation };
