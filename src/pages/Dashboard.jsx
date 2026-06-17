import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editId) {
        await api.put(`/employees/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Employee Updated");
        setEditId(null);
      } else {
        await api.post("/employees", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Employee Added");
      }

      setFormData({
        name: "",
        email: "",
        department: "",
        salary: "",
      });

      fetchEmployees();
    } catch (error) {
      console.log(error);
      alert("Operation Failed");
    }
  };

  const handleEdit = (employee) => {
    setEditId(employee._id);

    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: employee.salary,
    });
  };

  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchEmployees();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Employee Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Employee Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Employee Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 md:col-span-2"
            >
              {editId ? "Update Employee" : "Add Employee"}
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <input
            type="text"
            placeholder="Search Employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 text-lg">
              No employees found
            </div>
          ) : (
            filteredEmployees.map((employee) => (
              <div
                key={employee._id}
                className="bg-white rounded-xl shadow-md p-5"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {employee.name}
                </h2>

                <p className="text-slate-600 mb-1">
                  📧 {employee.email}
                </p>

                <p className="text-slate-600 mb-1">
                  🏢 {employee.department}
                </p>

                <p className="text-slate-600 mb-4">
                  💰 ₹{employee.salary}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEmployee(employee._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;