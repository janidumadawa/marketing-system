import { useState } from "react";
import { ChevronRight, ChevronLeft,X, Plus, Minus, User, Mail, Phone, MapPin, FileText, Check, Loader2 } from "lucide-react";
import axios from "axios";

const AddClientForm = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    contact: {
      emails: [""],
      phones: [""],
    },
    address: "",
    notes: "",
    isActive: true,
    logoUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const response = await axios.post(`${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/clients`, formData);
    onAdd(response.data);  // send the saved client (with _id etc) back to parent
    onClose();
  } catch (err) {
    console.error("Failed to add client", err);
    alert("Error: Could not save client.");
  } finally {
    setIsSubmitting(false);
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

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl relative transform animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-6 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-600 rounded-xl p-3 shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Client</h2>
                <p className="text-blue-600 text-sm">Create a comprehensive client profile</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-white transition-all duration-200 hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-8 pt-4 pb-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {['basic', 'contact', 'details', 'review'].map((step) => (
              <button
                key={step}
                onClick={() => setActiveSection(step)}
                className={`flex flex-col items-center relative ${activeSection === step ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ${
                  activeSection === step 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-gray-100 border border-gray-200'
                }`}>
                  {step === 'basic' && <User size={16} />}
                  {step === 'contact' && <Mail size={16} />}
                  {step === 'details' && <MapPin size={16} />}
                  {step === 'review' && <Check size={16} />}
                </div>
                <span className="text-xs font-medium capitalize">{step}</span>
                {step !== 'review' && (
                  <div className="absolute top-5 right-0 left-full w-8 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User size={16} className="text-blue-500" />
                  Client Name *
                </label>
                <input
                  name="clientName"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection('contact')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  Continue to Contact
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" />
                  Email Addresses
                </label>
                <div className="space-y-3">
                  {formData.contact.emails.map((email, index) => (
                    <div key={index} className="flex gap-3 items-center group">
                      <div className="flex-1 relative">
                        <input
                          type="email"
                          placeholder={`Email ${index + 1}`}
                          value={email}
                          onChange={(e) => handleArrayChange("emails", index, e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
                        />
                      </div>
                      {formData.contact.emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("emails", index)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Minus size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField("emails")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <Plus size={16} />
                    Add Email
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone size={16} className="text-blue-500" />
                  Phone Numbers
                </label>
                <div className="space-y-3">
                  {formData.contact.phones.map((phone, index) => (
                    <div key={index} className="flex gap-3 items-center group">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder={`Phone ${index + 1}`}
                          value={phone}
                          onChange={(e) => handleArrayChange("phones", index, e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
                        />
                      </div>
                      {formData.contact.phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("phones", index)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Minus size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField("phones")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <Plus size={16} />
                    Add Phone
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection('basic')}
                  className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('details')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  Continue to Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeSection === 'details' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  Address
                </label>
                <textarea
                  name="address"
                  placeholder="Enter client address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  placeholder="Add any additional notes about the client"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white resize-none"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection('contact')}
                  className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('review')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  Review Information
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeSection === 'review' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Client Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl p-3">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Client Name</h4>
                      <p className="text-gray-900">{formData.clientName || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl p-3">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Email Addresses</h4>
                      {formData.contact.emails.map((email, index) => (
                        <p key={index} className="text-gray-900">{email || "Not provided"}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl p-3">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Phone Numbers</h4>
                      {formData.contact.phones.map((phone, index) => (
                        <p key={index} className="text-gray-900">{phone || "Not provided"}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl p-3">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Address</h4>
                      <p className="text-gray-900">{formData.address || "Not provided"}</p>
                    </div>
                  </div>

                  {formData.notes && (
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl p-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Notes</h4>
                        <p className="text-gray-900">{formData.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection('details')}
                  className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.clientName.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Confirm & Save
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClientForm;