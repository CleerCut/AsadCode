import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAutoReplyTemplates, // unused here but keeping pattern reference
  getBlockedBrands, // placeholder reference
} from "@/provider/features/users/users.slice";
import {
  getBriefTemplates,
  createBriefTemplate,
  updateBriefTemplate,
  deleteBriefTemplate,
  reset as usersReset,
} from "@/provider/features/users/users.slice"; // Will add these thunks below

export default function useBriefTemplate() {
  const dispatch = useDispatch();
  const {
    getBriefTemplates: getState,
    createBriefTemplate: createState,
    updateBriefTemplate: updateState,
    deleteBriefTemplate: deleteState,
  } = useSelector((state) => state.users);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    description: "",
    requirements: [""],
    deliverables: [""],
    timeline: "",
    notes: "",
  });
  const [showPreview, setShowPreview] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    dispatch(getBriefTemplates());
    return () => dispatch(usersReset());
  }, [dispatch]);

  useEffect(() => {
    const list = getState?.data?.data || [];
    setTemplates(list);
  }, [getState]);

  const handleInputChange = useCallback((field, value) => {
    setNewTemplate((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleArrayInputChange = useCallback((field, index, value) => {
    setNewTemplate((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  }, []);

  const addArrayItem = useCallback((field) => {
    setNewTemplate((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  }, []);

  const removeArrayItem = useCallback((field, index) => {
    setNewTemplate((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!newTemplate.name || !newTemplate.description) return;
    const payload = {
      ...newTemplate,
      requirements: newTemplate.requirements.filter((s) => s.trim()),
      deliverables: newTemplate.deliverables.filter((s) => s.trim()),
    };
    const created = await dispatch(createBriefTemplate(payload)).unwrap();
    if (created?.data?.data) {
      setTemplates((prev) => [created.data.data, ...prev]);
    }
    setNewTemplate({
      name: "",
      category: "",
      description: "",
      requirements: [""],
      deliverables: [""],
      timeline: "",
      notes: "",
    });
    dispatch(getBriefTemplates());
  }, [dispatch, newTemplate]);

  const handleDelete = useCallback(
    async (id) => {
      await dispatch(deleteBriefTemplate(id)).unwrap();
      dispatch(getBriefTemplates());
    },
    [dispatch]
  );

  return {
    // data
    templates,
    // state
    newTemplate,
    showPreview,
    isLoading:
      getState?.isLoading ||
      createState?.isLoading ||
      updateState?.isLoading ||
      deleteState?.isLoading,
    // setters
    setShowPreview,
    setNewTemplate,
    // handlers
    handleInputChange,
    handleArrayInputChange,
    addArrayItem,
    removeArrayItem,
    handleSave,
    handleDelete,
  };
}
