import Task from "../models/Task.js";

// ✅ GET tasks (filter by employeeId)
export const getTasks = async (req, res) => {
  try {
    const { employeeId } = req.query;

    let filter = {};

    // 🔥 If employeeId passed → only their tasks
    if (employeeId) {
      filter.assignedTo = employeeId;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ ADD task (HR/Admin)
export const addTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    // validation
    if (!title || !assignedTo) {
      return res.status(400).json({
        message: "Title and employee are required ❌",
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
    });

    res.status(201).json({
      message: "Task assigned successfully ✅",
      task,
    });

  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ UPDATE task status (Employee)
export const updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: "Task updated successfully 🔄",
      task,
    });

  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ DELETE task (Admin/HR optional)
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted 🗑️" });

  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};