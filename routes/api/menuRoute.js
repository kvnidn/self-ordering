const {Router} = require('express')
const router = Router()
const menuModel = require('../../models/menuModel.js')


router.get('/', async (req, res) => {
    try {
        const menuItems = await menuModel.find()
        if (!menuItems) {
            return res.status(404).json({message: 'Not found'})
        }const sorted = menuItems.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
        res.status(200).json(sorted)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


router.post('/', async (req, res) => {
    const menuItems = new menuModel(req.body)

    try {
        const newMenuItem = await menuItems.save()
        if (!newMenuItem) {
            return res.status(400).json({message: 'Bad request'})
        }
        res.status(201).json(newMenuItem)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
  


router.delete('/:id', async (req, res) => {
    try
    {
        const deletedMenuItem = await menuModel.findByIdAndDelete(req.params.id)
        if (!deletedMenuItem) {
            return res.status(404).json({message: 'Not found'})
        }
        res.status(200).json(deletedMenuItem)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
})


router.put('/:id', async (req, res) => {
    
    try {
        const updatedMenuItem = await menuModel.findByIdAndUpdate(req.params.id, req.body)
        if (!updatedMenuItem) {
            return res.status(404).json({message: 'Not found'})
        }
        const update = {...updatedMenuItem._doc, ...req.body}
        res.status(200).json(update)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
})

module.exports = router