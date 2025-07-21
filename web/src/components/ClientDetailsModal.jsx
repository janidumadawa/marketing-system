import { useState } from "react";
import {
  X,
  Edit3,
  Trash2,
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import axios from "axios";

const ClientDetailsModal = ({ client, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: client.clientName || "",
    contact: {
      emails: client.contact?.emails || [""],
      phones: client.contact?.phones || [""],
    },
    address: client.address || "",
    notes: client.notes || "",
    isActive: client.isActive ?? true,
  });

  if (!client) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (type, index, value) => {
    setFormData((prev) => {
      const updated = [...prev.contact[type]];
      updated[index] = value;
      return {
        ...prev,
        contact: {
          ...prev.contact,
          [type]: updated,
        },
      };
    });
  };

  const addField = (type) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [type]: [...prev.contact[type], ""],
      },
    }));
  };

  const removeField = (type, index) => {
    if (formData.contact[type].length > 1) {
      setFormData((prev) => {
        const updated = prev.contact[type].filter((_, i) => i !== index);
        return {
          ...prev,
          contact: {
            ...prev.contact,
            [type]: updated,
          },
        };
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // API call to update client
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/clients/${client._id}`,
        formData
      );
      onUpdate(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update client:", error);
      alert("Failed to update client. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // API call to delete client
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/clients/${client._id}`);
      onDelete(client._id);
      onClose();
    } catch (error) {
      console.error("Failed to delete client:", error);
      alert("Failed to delete client. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-4xl rounded-3xl shadow-2xl shadow-blue-500/20 relative transform animate-in zoom-in-95 duration-500 max-h-[95vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 backdrop-blur-sm px-8 py-8 border-b border-gray-100/50 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-500/30">
                {client.clientName?.charAt(0) || "C"}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                  formData.isActive
                    ? "bg-gradient-to-r from-blue-500 to-teal-500"
                    : "bg-gradient-to-r from-red-500 to-pink-500"
                }`}
              >
                {formData.isActive ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <div>
              <p className="text-gray-600 font-medium flex items-center gap-2 mt-1">
                Client Name
              </p>
              <h2 className="text-3xl font-bold bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                {formData.clientName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-white transition-all duration-200 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
          {/* Client Name & Status */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <User size={18} className="text-blue-600" />
              Client Name
            </label>
            {isEditing ? (
              <input
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            ) : (
              <p className="text-gray-900 text-lg font-medium">
                {formData.clientName}
              </p>
            )}
            {/* Insert toggle here */}
            {isEditing && (
              <div className="flex items-center gap-3 mt-2">
                <label
                  htmlFor="isActive"
                  className="relative inline-flex items-center cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div
                    className="w-14 h-8 bg-gray-300 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 
                   peer-checked:bg-gradient-to-r peer-checked:from-blue-100 peer-checked:to-blue-200 
                   transition-colors duration-300"
                  ></div>
                  <div
                    className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md 
                   peer-checked:translate-x-6 peer-checked:bg-gradient-to-br peer-checked:from-blue-600 peer-checked:to-purple-700 
                   transition-transform duration-300"
                  ></div>
                </label>
                <span className="text-gray-700 font-medium select-none">
                  Active
                </span>
              </div>
            )}
          </div>

          {/* Emails */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <Mail size={18} className="text-blue-600" />
              Emails
            </label>
            {formData.contact.emails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      placeholder={`Email ${index + 1}`}
                      value={email}
                      onChange={(e) =>
                        handleArrayChange("emails", index, e.target.value)
                      }
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {formData.contact.emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField("emails", index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-opacity duration-200"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-900">{email || "Not provided"}</p>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                type="button"
                onClick={() => addField("emails")}
                className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <Plus size={18} />
                Add Email
              </button>
            )}
          </div>

          {/* Phones */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <Phone size={18} className="text-blue-600" />
              Phones
            </label>
            {formData.contact.phones.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      placeholder={`Phone ${index + 1}`}
                      value={phone}
                      onChange={(e) =>
                        handleArrayChange("phones", index, e.target.value)
                      }
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {formData.contact.phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField("phones", index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-opacity duration-200"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-900">{phone || "Not provided"}</p>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                type="button"
                onClick={() => addField("phones")}
                className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <Plus size={18} />
                Add Phone
              </button>
            )}
          </div>

          {/* Address */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <MapPin size={18} className="text-blue-600" />
              Address
            </label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-line">
                {formData.address || "Not provided"}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FileText size={18} className="text-blue-600" />
              Notes
            </label>
            {isEditing ? (
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-line">
                {formData.notes || "No notes"}
              </p>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between items-center gap-4">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors duration-200 ${
              isDeleting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete
              </>
            )}
          </button>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                    isSaving
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
              >
                <Edit3 size={18} />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
