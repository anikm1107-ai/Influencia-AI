const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "Password must be at least 8 characters"
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (error) throw error;

        res.status(201).json({
            message: "Registration successful. Check your email for verification.",
            user: data.user,
            session: data.session
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) throw error;

        res.json({
            message: "Login successful",
            user: data.user,
            session: data.session
        });

    } catch (error) {
        res.status(401).json({
            error: error.message
        });
    }
});

// LOGOUT
router.post("/logout", async (req, res) => {
    res.json({
        message: "Logout endpoint ready. Client session cleanup will be handled next."
    });
});

module.exports = router;