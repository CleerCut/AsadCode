import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, MoreVertical, Plus, Edit, Trash2, X } from "lucide-react";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import useMessageTemplatesModal from "./use-message-templates-modal.hook";

const MessageTemplatesModal = ({ isOpen, onClose, onSelectTemplate, creatorName }) => {
  const {
    templates,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    showForm,
    editingTemplate,
    formData,
    setFormData,
    menuOpenId,
    setMenuOpenId,
    menuPosition,
    setMenuPosition,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCancel,
    handleSelectTemplate,
  } = useMessageTemplatesModal(isOpen, onSelectTemplate, creatorName);

  const handleClose = () => {
    if (!isCreating && !isUpdating && !isDeleting) {
      handleCancel();
      onClose();
    }
  };

  return (
    <Modal show={isOpen} title="Message Templates" onClose={handleClose} size="md">
      <div className="space-y-4">
        {/* Create Button */}
        {!showForm && (
          <div className="flex justify-end">
            <CustomButton
              text="Create Template"
              className="btn-primary"
              onClick={handleCreate}
              startIcon={<Plus className="w-4 h-4" />}
            />
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name <span className="text-red-500">*</span>
              </label>
              <CustomInput
                type="text"
                name="name"
                placeholder="e.g., Initial Outreach – Paid"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isCreating || isUpdating}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Body <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">
                  (The greeting "Hey {creatorName || "{{creator_name}}"}," will be added automatically)
                </span>
              </label>
              <CustomInput
                type="textarea"
                name="body"
                placeholder="Enter your message here..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                disabled={isCreating || isUpdating}
                rows={6}
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <CustomButton
                text="Cancel"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={isCreating || isUpdating}
              />
              <CustomButton
                text={editingTemplate ? "Update" : "Create"}
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.body.trim() || isCreating || isUpdating}
                startIcon={isCreating || isUpdating ? <Loader loading={true} size="small" /> : null}
              />
            </div>
          </div>
        )}

        {/* Templates List */}
        {!showForm && (
          <div className="space-y-2 max-h-96 overflow-y-auto overflow-x-visible">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader loading={true} />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">No templates yet. Create your first template!</p>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="group relative p-3 bg-white border border-gray-200 rounded-md hover:border-primary hover:shadow-sm transition-all cursor-pointer overflow-visible"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {template.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {template.body}
                      </p>
                    </div>

                    {/* Three-dot Menu */}
                    <div className="relative ml-2 flex-shrink-0 z-50">
                      <button
                        ref={(el) => {
                          if (el && menuOpenId === template.id && !menuPosition) {
                            const rect = el.getBoundingClientRect();
                            setMenuPosition({
                              top: rect.bottom + window.scrollY + 4,
                              right: window.innerWidth - rect.right + window.scrollX,
                            });
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuPosition({
                            top: rect.bottom + window.scrollY + 4,
                            right: window.innerWidth - rect.right + window.scrollX,
                          });
                          setMenuOpenId(menuOpenId === template.id ? null : template.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Dropdown Menu Portal */}
      {menuOpenId && menuPosition && templates.find((t) => t.id === menuOpenId) && (
        <>
          {createPortal(
            <>
              <div
                className="fixed inset-0 z-[1400]"
                onClick={() => {
                  setMenuOpenId(null);
                  setMenuPosition(null);
                }}
              />
              <div
                className="fixed z-[1500] bg-white border border-gray-200 rounded-md shadow-xl min-w-[120px]"
                style={{
                  top: `${menuPosition.top}px`,
                  right: `${menuPosition.right}px`,
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const template = templates.find((t) => t.id === menuOpenId);
                    if (template) {
                      handleEdit(template);
                    }
                    setMenuOpenId(null);
                    setMenuPosition(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-md"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(menuOpenId);
                    setMenuOpenId(null);
                    setMenuPosition(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors last:rounded-b-md"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>,
            document.body
          )}
        </>
      )}
    </Modal>
  );
};

export default MessageTemplatesModal;
