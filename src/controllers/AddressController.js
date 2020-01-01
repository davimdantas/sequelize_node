const Address = require("../models/Address");
const User = require("../models/User");

module.exports = {
  async index(req, res) {
    console.clear();

    // const user = await User.findByPk(user_id);

    // if (!user) return res.status(400).json({ error: "User not found" });

    // const addresses = await Address.findAll({
    //   where: { user_id: user_id }
    // });
    // return res.json(addresses);

    const { user_id } = req.params;

    const user = await User.findByPk(user_id, { 
        include: {association: 'user_addresses'}
    });

    return res.json(user);
  },


  async store(req, res) {
    console.clear();
    const { user_id } = req.params;
    const { zipcode, street, number } = req.body;
    const user = await User.findByPk(user_id);

    if (!user) return res.status(400).json({ error: "User not found" });

    const address = await Address.create({
      zipcode,
      street,
      number,
      user_id
    });


    return res.json(address);
  }
};
