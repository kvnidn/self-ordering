
const Menu = require('../models/menuModel');

// MASIH SEMENTARA KARENA TIDAK TERDETEKSI PROBLEM, untuk masalah [UPDATED]
exports.create = (req, res) => {
    const { id, name, price, image, type } = req.body;

    if (id) {
        Menu.findByIdAndUpdate(id, { name, price, image, type }, { new: true })
            .then(updatedMenu => {
                if (!updatedMenu) {
                    return res.status(404).send({ message: `Menu with id ${id} not found.` });
                }
                res.redirect('/dashboard');
            })
            .catch(error => {
                res.status(500).send({ message: "Error updating menu." });
            });
    } else {
        const menu = new Menu({ name, price, image, type });

        menu.save()
            .then(data => {
                res.redirect('/dashboard');
            })
            .catch(err => {
                if (err.name === 'ValidationError') {
                    const errors = {};
                    for (const field in err.errors) {
                        errors[field] = err.errors[field].message;
                    }
                    // Render the form with validation errors
                    return res.render('add_menus', { title: "Dashboard", layout: "layouts/main-layout.ejs", user: "", script: "", errors, formData: req.body });
                } else {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the menu."
                    });
                }
            });
    }
};

exports.find = (req, res) => {
    // FIND 1 MENU or ALL MENU
    if(req.query.id) {
        const id = req.query.id;
        Menu.findById(id)
        .then(menu => {
            if (menu) {
                res.send(menu);
              } else {
                res.status(404).send({ message: `Cannot find menu with id ${id}` });
              }
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving menus." });
        });
    } else {
        Menu.find()
            .then(menu => {
                res.send(menu);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving menus."
                });
            })
    }

}

exports.update = (req, res) => {
    if(!req.body){
        return res
            .status(400)
            .send({ message: "Content cannot be empty!"});
    }
    const id = req.params.id;
    Menu.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message: `Cannot Update User with id ${id}`});
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Errorr Update" });
        })
}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedMenu = await Menu.deleteOne({ _id: id });

        if (deletedMenu.deletedCount === 0) {
            res.status(404).send({ message: `Cannot delete menu with id ${id}` });
        } else {
            res.status(200).send({ message: `Menu with id ${id} has been deleted successfully` });
        }
    } catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).send({ message: "Error deleting menu item" });
    }
}

