import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { Eye, MessageSquare, Save, Send } from "lucide-react";
import useAutoReplyTemplate from "./use-auto-reply-template.hook";

const AutoReplyTemplate = () => {
  const {
    templates,
    newTemplate,
    showPreview,
    isLoading,
    setShowPreview,
    handleInputChange,
    handleSave,
    handleActivate,
    handleDeactivate,
    handleDelete,
  } = useAutoReplyTemplate();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Auto-Reply Templates</h1>
        <p className="text-sm mt-1">Create automatic response messages for campaign applications</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create New Template */}
        <div className="bg-white rounded-lg shadow-sm p-5 border">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <MessageSquare className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Create Template</h3>
          </div>

          <div className="space-y-4">
            <CustomInput
              label="Template Name"
              name="templateName"
              type="text"
              placeholder="e.g., Welcome Message"
              value={newTemplate.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <CustomInput
              label="Email Subject (Optional)"
              name="emailSubject"
              type="text"
              placeholder="Thank you for your interest!"
              value={newTemplate.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
            />

            <div>
              <TextArea
                label="Message Template"
                placeholder="Hi [Influencer Name]&#10;&#10;Thank you for your interest in our campaign..."
                value={newTemplate.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use [Influencer Name], [Campaign Name] as placeholders
              </p>
            </div>

            <CustomButton
              text="Save Template"
              className="btn-primary w-full"
              icon={Save}
              onClick={handleSave}
              disabled={!newTemplate.name || !newTemplate.message}
            />
          </div>
        </div>

        {/* Saved Templates */}
        <div className="bg-white rounded-lg shadow-sm p-5 border">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Send className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Saved Templates</h3>
          </div>

          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      {template.is_active && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    {template.subject && (
                      <p className="text-sm text-gray-600 mb-1">Subject: {template.subject}</p>
                    )}
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {template.message.substring(0, 100)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={() => setShowPreview(template.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </button>
                  {template.is_active ? (
                    <button
                      onClick={() => handleDeactivate(template.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(template.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal show={showPreview} title="Template Preview" onClose={() => setShowPreview(null)}>
        <div className="">
          {templates.find((t) => t.id === showPreview) && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Subject:</label>
                <p className="text-sm text-gray-900">
                  {templates.find((t) => t.id === showPreview).subject || "No subject"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Message:</label>
                <div className="mt-1 p-3 bg-gray-50 rounded border text-sm text-gray-900 whitespace-pre-wrap">
                  {templates.find((t) => t.id === showPreview).message}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <CustomButton
              text="Close"
              onClick={() => setShowPreview(null)}
              className="btn-cancel"
            />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AutoReplyTemplate;
