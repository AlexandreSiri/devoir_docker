// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Création de compte
const createAccount = async (req, res) => {
    try {
        const { email, password, pseudo, phoneNumber } = req.body;

        // Validation des champs requis
        if (!email || !password || !pseudo || !phoneNumber) {
            return res.status(406).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = await User.create({
            email,
            password: hashedPassword,
            pseudo,
            phoneNumber,
            role: 'user',
            banned: false
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully'
        });

    } catch (error) {
        console.error('Create account error:', error);
        
        // Gestion des erreurs de contrainte unique
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Email or pseudo already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Connexion
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des champs requis
        if (!email || !password) {
            return res.status(406).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Recherche de l'utilisateur
        const user = await User.findOne({
            where: { email }
        });

        // Vérification de l'existence de l'utilisateur
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Account does not exist'
            });
        }

        // Vérification du statut du compte
        if (user.banned) {
            return res.status(403).json({
                success: false,
                message: 'This account is banned'
            });
        }

        // Vérification du mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Génération du token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                pseudo: user.pseudo
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Liste des utilisateurs
const listUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Exclusion du mot de passe
        });

        return res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('List users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    createAccount,
    login,
    listUsers
};