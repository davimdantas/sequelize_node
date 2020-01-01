const Tech = require("../models/Tech");
const User = require("../models/User");

module.exports = {
    async index(req, res) {
        console.clear();
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, { 
            // include: {association: 'techs',attributes: ['id', 'name'], through: {attributes: ['user_id']}}
            include: {association: 'techs',attributes: ['id', 'name'], through: {attributes: []}}
        });
    
        return res.json(user.techs );
    
    },

    async  store(req, res) {
        console.clear();
        const { user_id } = req.params;
        const { name} = req.body;
        
        const user = await User.findByPk(user_id)

        if (!user) return res.status(400).json({ error: "User not found" });

    
        const [tech, created] = await Tech.findOrCreate({where: {
            name: name
        }});

        await user.addTech(tech);

        return res.json({tech: tech, message: created ? 'Technology created' : 'Technology added'});
    },

    async delete(req, res) {
        const { user_id } = req.params;
        const { name} = req.body;
        
        const user = await User.findByPk(user_id)

        if (!user) return res.status(400).json({ error: "User not found" });

        const tech = await Tech.findOne({where: {
            name: name
        }});

        await user.removeTech(tech);

        return res.json();


    }
}