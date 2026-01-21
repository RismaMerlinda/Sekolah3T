const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const School = require("../models/School");

// ================= REGISTER =================
exports.registerSchool = async (req, res) => {
    try {
        const { schoolName, npsn, email, password } = req.body;

        if (!schoolName || !npsn || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib diisi",
            });
        }

        const existingEmail = await School.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email sudah terdaftar",
            });
        }

        const existingNpsn = await School.findOne({ npsn });
        if (existingNpsn) {
            return res.status(400).json({
                success: false,
                message: "NPSN sudah terdaftar",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const school = await School.create({
            schoolName,
            npsn,
            email,
            password: hashedPassword,
            role: "school",
        });

        return res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            user: {
                id: school._id,
                schoolName: school.schoolName,
                email: school.email,
                npsn: school.npsn,
                role: school.role,
            },
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ================= LOGIN =================
exports.loginSekolah = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email & password wajib diisi",
            });
        }

        const school = await School.findOne({ email });
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "Akun tidak ditemukan",
            });
        }

        const isMatch = await bcrypt.compare(password, school.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password salah",
            });
        }

        const token = jwt.sign(
            { id: school._id, role: school.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // ubah true kalau https
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login berhasil",
            token,
            user: {
                id: school._id,
                schoolName: school.schoolName,
                email: school.email,
                npsn: school.npsn,
                role: school.role,
            },
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
