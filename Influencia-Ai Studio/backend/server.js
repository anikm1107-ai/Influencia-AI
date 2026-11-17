const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth")
const aiRoutes = require("./routes/ai");
const supabase = require("./config/supabase");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
// Authentication routes
app.use("/api/auth", authRoutes);
// Homepage test route
app.get("/", (req, res) => {
    res.json({
        project: "Influencia",
        message: "Welcome to Influencia AI Backend!",
        status: "Running successfully"
    });
});

// Supabase connection test
app.get("/api/auth/status", async (req, res) => {
    try {
        const { error } = await supabase.auth.getSession();

        if (error) throw error;

        res.json({
            message: "Supabase client initialized successfully",
            connected: true
        });

    } catch (error) {
        res.status(500).json({
            message: "Supabase connection setup failed",
            error: error.message
        });
    }
});

// Existing AI health-check route
app.get("/api/ai/status", (req, res) => {
    res.json({
        message: "Influencia AI service is ready for integration",
        aiConnected: false
    });
});

// Server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("     INFLUENCIA BACKEND");
    console.log("--------------------------------");
    console.log(`Server running at http://localhost:${PORT}`);
});