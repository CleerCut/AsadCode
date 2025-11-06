import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { Eye, FileText, Plus, Save, Trash2 } from "lucide-react";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import useBriefTemplate from "./use-brief-template.hook";

const BriefTemplate = () => {
  const {
    templates,
    newTemplate,
    showPreview,
    isLoading,
    setShowPreview,
    setNewTemplate,
    handleInputChange,
    handleArrayInputChange,
    addArrayItem,
    removeArrayItem,
    handleSave,
    handleDelete,
  } = useBriefTemplate();

  const categories = [
    "Social Media",
    "Blog Post",
    "Video Content",
    "Product Review",
    "Event Coverage",
    "Brand Awareness",
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Content Brief Templates</h1>
        <p className="text-sm mt-1">Create reusable content briefs to speed up campaign creation</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create New Template */}
        <div className="bg-white rounded-lg shadow-sm p-5 border">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Create Brief Template</h3>
          </div>

          <div className="space-y-4">
            <CustomInput
              label="Template Name"
              name="templateName"
              type="text"
              placeholder="e.g., Instagram Post Campaign"
              value={newTemplate.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <div>
              <SimpleSelect
                label="Category"
                placeHolder="Select category"
                options={categories.map((c) => ({ value: c, label: c }))}
                value={
                  newTemplate.category
                    ? { value: newTemplate.category, label: newTemplate.category }
                    : null
                }
                onChange={(selected) => {
                  const value = typeof selected === "object" ? selected?.value : selected;
                  handleInputChange("category", value || "");
                }}
              />
            </div>

            <div>
              <TextArea
                label="Campaign Description"
                placeholder="Describe the campaign objectives and goals..."
                value={newTemplate.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              {newTemplate.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <CustomInput
                    placeholder="Add requirement"
                    value={req}
                    onChange={(e) => handleArrayInputChange("requirements", index, e.target.value)}
                  />
                  {newTemplate.requirements.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("requirements", index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem("requirements")}
                className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deliverables</label>
              {newTemplate.deliverables.map((del, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <CustomInput
                    placeholder="Add deliverable"
                    value={del}
                    onChange={(e) => handleArrayInputChange("deliverables", index, e.target.value)}
                  />
                  {newTemplate.deliverables.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("deliverables", index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem("deliverables")}
                className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Deliverable
              </button>
            </div>

            <CustomInput
              label="Timeline"
              name="timeline"
              type="text"
              placeholder="e.g., 7 days"
              value={newTemplate.timeline}
              onChange={(e) => handleInputChange("timeline", e.target.value)}
            />

            <div>
              <TextArea
                label="Additional Notes"
                placeholder="Any additional information or special instructions..."
                value={newTemplate.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>

            <CustomButton
              text="Save Template"
              className="btn-primary w-full"
              icon={Save}
              onClick={handleSave}
              disabled={!newTemplate.name || !newTemplate.description}
            />
          </div>
        </div>{" "}
        bdf 1{/* Saved Templates */}
        <div className="bg-white rounded-lg shadow-sm p-5 border">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Saved Templates</h3>
          </div>

          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mt-1">
                      {template.category}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPreview(template.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        show={showPreview}
        title="Template Preview"
        onClose={() => setShowPreview(null)}
        size="lg"
      >
        <div>
          {templates.find((t) => t.id === showPreview) && (
            <div className="space-y-5">
              {(() => {
                const template = templates.find((t) => t.id === showPreview);
                return (
                  <>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{template.name}</h4>
                          {template.category && (
                            <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-medium rounded mt-1">
                              {template.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="rounded-lg border border-gray-200 p-3 bg-white">
                          <div className="text-[11px] text-gray-500">Description</div>
                          <p className="text-sm text-gray-900 mt-0.5 leading-relaxed">
                            {template.description}
                          </p>
                        </div>
                        {template.timeline && (
                          <div className="rounded-lg border border-gray-200 p-3 bg-white">
                            <div className="text-[11px] text-gray-500">Timeline</div>
                            <div className="text-sm text-gray-900 mt-0.5">{template.timeline}</div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        {template.notes && (
                          <div className="rounded-lg border border-gray-200 p-3 bg-white">
                            <div className="text-[11px] text-gray-500">Notes</div>
                            <div className="text-sm text-gray-900 mt-0.5 leading-relaxed">
                              {template.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-gray-200 p-3 bg-white">
                        <div className="text-[11px] text-gray-500">Requirements</div>
                        <ul className="text-sm text-gray-900 mt-1 list-disc list-inside space-y-1">
                          {template.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-3 bg-white">
                        <div className="text-[11px] text-gray-500">Deliverables</div>
                        <ul className="text-sm text-gray-900 mt-1 list-disc list-inside space-y-1">
                          {template.deliverables.map((del, index) => (
                            <li key={index}>{del}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                );
              })()}
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

export default BriefTemplate;
