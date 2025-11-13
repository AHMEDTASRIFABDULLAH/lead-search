"use client";
import { useState, useEffect } from "react";
import {
  UserPlus,
  Trash2,
  Edit,
  Loader2,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  AlertTriangle,
} from "lucide-react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
        )}
        <p className="text-sm text-zinc-900 dark:text-zinc-100 flex-1">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmDialog({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />
      <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg  font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Delete User
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Are you sure you want to delete{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {user.email}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onCancel}
            className="h-10 px-4 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-10 px-4 cursor-pointer bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateUserModal({ isOpen, onClose, user, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const isUpdateMode = !!user;

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setRole(user.role || "user");
      setPassword("");
    } else {
      setEmail("");
      setPassword("");
      setRole("user");
    }
  }, [user]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async () => {
    if (!email || (!isUpdateMode && !password)) {
      showToast(
        isUpdateMode
          ? "Email is required!"
          : "Email and password are required!",
        "error"
      );
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const url = isUpdateMode
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${user.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/create-user`;

      const body = isUpdateMode
        ? { email, role: role.toLowerCase(), ...(password && { password }) }
        : { email, password, role: role.toLowerCase() };

      const res = await fetch(url, {
        method: isUpdateMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          isUpdateMode
            ? "User updated successfully!"
            : "User created successfully!",
          "success"
        );
        setEmail("");
        setPassword("");
        setRole("user");
        if (onSuccess) onSuccess();
        setTimeout(() => onClose(), 1500);
      } else {
        showToast(data.error || "Something went wrong", "error");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
        <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {isUpdateMode ? "Update User" : "Create New User"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {isUpdateMode
                    ? "Update user information"
                    : "Add a new user to the system"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password {isUpdateMode && "(leave empty to keep current)"}
              </label>
              <input
                type="password"
                placeholder={
                  isUpdateMode ? "Enter new password" : "Enter password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-6 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="h-10 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUpdateMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  {isUpdateMode ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) setUsers(data.users || data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${deleteUser.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setToast({ message: "User deleted successfully!", type: "success" });
        fetchUsers();
      } else {
        setToast({
          message: data.error || "Failed to delete user",
          type: "error",
        });
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
    setDeleteUser(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg h-full flex flex-col">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {deleteUser && (
        <DeleteConfirmDialog
          user={deleteUser}
          onConfirm={handleDelete}
          onCancel={() => setDeleteUser(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Users
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="mt-3 cursor-pointer sm:mt-0 h-10 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:table-cell">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                    Loading users...
                  </p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No users found
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id || index}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {user.name || "Unknown"}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:hidden">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role?.toLowerCase() === "admin"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          : user.role?.toLowerCase() === "editor"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteUser(user)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
