const School = require("../models/School");

exports.getSchools = async (req, res) => {
    try {
        const schools = await School.find().sort({ createdAt: -1 });
        res.json(schools);
    } catch (err) {
        console.error("getSchools error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateSchool = async (req, res) => {
    try {
        const updated = await School.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: "Data tidak ditemukan" });
        res.json(updated);
    } catch (err) {
        console.error("updateSchool error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteSchool = async (req, res) => {
    try {
        const deleted = await School.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Data tidak ditemukan" });
        res.json({ message: "Berhasil dihapus" });
    } catch (err) {
        console.error("deleteSchool error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
