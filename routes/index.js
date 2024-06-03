var express = require('express');
var router = express.Router();
const models = require('../models');
const { where, Op } = require('sequelize');

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, offset, keyword = '', sort = "ASC" } = req.query

    const { count, rows } = await models.User.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } }
        ]
      },
      limit,
      order: [['name', sort]],
      offset: (page - 1) * limit
    })
    const pages = Math.ceil(count / limit)
    res.status(200).json({ Phonebooks: rows, page: Number(page), limit, pages, count })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, phone } = req.body
    const user = await models.User.create({ name, phone })
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, phone } = req.body
    const user = await models.User.update({ name, phone }, {
      where: {
        id: req.params.id
      },
      returning: true,
      plain: true
    })
    res.status(201).json(user[1])
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await models.User.findOne({ where: { id: req.params.id } })
    const userDelete = await models.User.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

module.exports = router;
