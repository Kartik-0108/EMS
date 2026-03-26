import Attendance from "../models/Attendance.js";


// ✅ GET all attendance (latest first + populated)
export const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("employeeId", "name email")
      .sort({ createdAt: -1 }); // 🔥 latest first

    res.json(data);

  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ ADD or UPDATE attendance (no duplicates per day)
export const addAttendance = async (req, res) => {
  try {
    const { employeeId, status } = req.body;

    // 🔍 Validation
    if (!employeeId || !status) {
      return res.status(400).json({
        message: "Employee and status are required ❌",
      });
    }

    // 🕒 Define today's range (00:00 → 23:59)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 🔍 Check if attendance already exists today
    const existing = await Attendance.findOne({
      employeeId,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // 🔁 UPDATE if exists
    if (existing) {
      existing.status = status;
      await existing.save();

      return res.json({
        message: "Attendance updated 🔄",
        attendance: existing,
      });
    }

    // ✅ CREATE new attendance
    const attendance = await Attendance.create({
      employeeId,
      status,
    });

    res.status(201).json({
      message: "Attendance marked successfully ✅",
      attendance,
    });

  } catch (error) {
    console.error("Add Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};