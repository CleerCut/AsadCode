import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/provider/features/message-templates/message-templates.slice";

const useMessageTemplatesModal = (isOpen, onSelectTemplate, creatorName) => {
  const dispatch = useDispatch();
  const { templates, getAllTemplates: getAllTemplatesState } = useSelector(
    (state) => state.messageTemplates
  );

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({ name: "", body: "" });
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const isLoading = getAllTemplatesState.isLoading;
  const isCreating = useSelector((state) => state.messageTemplates.createTemplate.isLoading);
  const isUpdating = useSelector((state) => state.messageTemplates.updateTemplate.isLoading);
  const isDeleting = useSelector((state) => state.messageTemplates.deleteTemplate.isLoading);

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllTemplates());
    }
  }, [isOpen, dispatch]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: "", body: "" });
      setMenuOpenId(null);
      setMenuPosition(null);
    }
  }, [isOpen]);

  const handleCreate = useCallback(() => {
    setShowForm(true);
    setEditingTemplate(null);
    setFormData({ name: "", body: "" });
  }, []);

  const handleEdit = useCallback((template) => {
    setEditingTemplate(template);
    setFormData({ name: template.name, body: template.body });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    async (templateId) => {
      if (window.confirm("Are you sure you want to delete this template?")) {
        try {
          await dispatch(deleteTemplate(templateId)).unwrap();
        } catch (error) {
          console.error("Failed to delete template:", error);
        }
      }
    },
    [dispatch]
  );

  const handleSubmit = useCallback(async () => {
    if (!formData.name.trim() || !formData.body.trim()) {
      return;
    }

    try {
      if (editingTemplate) {
        await dispatch(
          updateTemplate({
            templateId: editingTemplate.id,
            templateData: { name: formData.name.trim(), body: formData.body.trim() },
          })
        ).unwrap();
      } else {
        await dispatch(
          createTemplate({ name: formData.name.trim(), body: formData.body.trim() })
        ).unwrap();
      }

      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: "", body: "" });
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  }, [formData, editingTemplate, dispatch]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({ name: "", body: "" });
  }, []);

  const handleSelectTemplate = useCallback(
    (template) => {
      // Replace {{creator_name}} with actual creator name or keep placeholder
      const greeting = `Hey ${creatorName || "{{creator_name}}"},`;
      const fullMessage = `${greeting} ${template.body}`;
      onSelectTemplate(fullMessage);
    },
    [creatorName, onSelectTemplate]
  );

  return {
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
  };
};

export default useMessageTemplatesModal;
