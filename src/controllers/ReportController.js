const User = require("../models/User");
const Tech = require("../models/Tech");
const { Op } = require("sequelize");

module.exports = {
  async show(req, res) {
    console.clear();
    const users = await User.findAll({
      where: {
        email: {
          [Op.iLike]: "%@novo.com"
        }
      },
      include: [
        {
          association: "user_addresses",
          where: { street: "Rua da Hora" }
        },
        {
          association: "techs",
          required: false,
          where: {
            name: {
              [Op.iLike]: "React%"
            }
          }
        }
      ]
    });
    return res.json(users);
  },

  async store(req, res) {
    console.clear();
    const { user_id } = req.params;
    const { name } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) return res.status(400).json({ error: "User not found" });

    const [tech, created] = await Tech.findOrCreate({
      where: {
        name: name
      }
    });

    await user.addTech(tech);

    return res.json({
      tech: tech,
      message: created ? "Technology created" : "Technology added"
    });
  },

  async delete(req, res) {
    const { user_id } = req.params;
    const { name } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) return res.status(400).json({ error: "User not found" });

    const tech = await Tech.findOne({
      where: {
        name: name
      }
    });

    await user.removeTech(tech);

    return res.json();
  }
};
