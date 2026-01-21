const router = require("express").Router();
const c = require("../controllers/schoolController");

router.get("/", c.getSchools);
router.put("/:id", c.updateSchool);
router.delete("/:id", c.deleteSchool);

module.exports = router;
