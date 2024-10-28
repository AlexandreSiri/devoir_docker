// controllers/houseController.js
const { House } = require('../models');

// Middleware pour étendre la Request
const authMiddleware = (req, res, next) => {
    // L'ID de l'utilisateur et autres informations devraient être définis
    // par votre middleware d'authentification JWT
    next();
};

// Liste des maisons
const listHouses = async (req, res) => {
    try {
        const houses = await House.findAll({
            attributes: [
                'id',
                'address',
                'city',
                'postalCode',
                'country',
                'price'
            ]
        });

        return res.status(200).json({
            success: true,
            data: houses
        });

    } catch (error) {
        console.error('List houses error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Création d'une maison
const createHouse = async (req, res) => {
    try {
        const { address, city, postalCode, country, price } = req.body;
        const userId = req.user.id; // Supposé être défini par le middleware d'auth

        // Validation des champs requis
        if (!address || !city || !postalCode || !country || !price) {
            return res.status(406).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Création de la maison
        const house = await House.create({
            address,
            city,
            postalCode,
            country,
            price: parseFloat(price),
            rating: 0,
            userId,
            available: true
        });

        return res.status(201).json({
            success: true,
            message: 'House created successfully',
            data: house
        });

    } catch (error) {
        console.error('Create house error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Mise à jour d'une maison
const updateHouse = async (req, res) => {
    try {
        const { address, city, postalCode, country, price, houseId, available } = req.body;
        const userId = req.user.id; // Supposé être défini par le middleware d'auth

        if (!houseId) {
            return res.status(406).json({
                success: false,
                message: 'House ID is required'
            });
        }

        // Vérification de l'existence de la maison et de la propriété
        const house = await House.findOne({
            where: {
                id: houseId,
                userId
            }
        });

        if (!house) {
            return res.status(404).json({
                success: false,
                message: 'House not found or unauthorized'
            });
        }

        // Mise à jour de la maison
        const updatedHouse = await house.update({
            address: address || house.address,
            city: city || house.city,
            postalCode: postalCode || house.postalCode,
            country: country || house.country,
            price: price ? parseFloat(price) : house.price,
            available: typeof available === 'boolean' ? available : house.available
        });

        return res.status(200).json({
            success: true,
            message: 'House updated successfully',
            data: updatedHouse
        });

    } catch (error) {
        console.error('Update house error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Suppression d'une maison
const deleteHouse = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user.id; // Supposé être défini par le middleware d'auth

        if (!id) {
            return res.status(406).json({
                success: false,
                message: 'House ID is required'
            });
        }

        // Vérification de l'existence de la maison et de la propriété
        const house = await House.findOne({
            where: {
                id,
                userId
            }
        });

        if (!house) {
            return res.status(404).json({
                success: false,
                message: 'House not found or unauthorized'
            });
        }

        // Suppression de la maison
        await house.destroy();

        return res.status(200).json({
            success: true,
            message: `House ${id} has been deleted successfully`
        });

    } catch (error) {
        console.error('Delete house error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    listHouses,
    createHouse,
    updateHouse,
    deleteHouse
};