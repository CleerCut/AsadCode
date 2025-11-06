import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAutoReplyTemplates,
  createAutoReplyTemplate,
  updateAutoReplyTemplate,
  deleteAutoReplyTemplate,
  reset as usersReset,
} from "@/provider/features/users/users.slice";

export default function useAutoReplyTemplate() {
  const dispatch = useDispatch();
  const {
    getAutoReplyTemplates: getState,
    createAutoReplyTemplate: createState,
    updateAutoReplyTemplate: updateState,
    deleteAutoReplyTemplate: deleteState,
  } = useSelector((state) => state.users);

  const [newTemplate, setNewTemplate] = useState({ name: "", subject: "", message: "" });
  const [showPreview, setShowPreview] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    dispatch(getAutoReplyTemplates());
    return () => dispatch(usersReset());
  }, [dispatch]);

  // sync local templates from redux
  useEffect(() => {
    const list = getState?.data?.data || [];
    setTemplates(list);
  }, [getState]);

  const handleInputChange = useCallback((field, value) => {
    setNewTemplate((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!newTemplate.name || !newTemplate.message) return;
    const created = await dispatch(createAutoReplyTemplate(newTemplate)).unwrap();
    // optimistic add
    if (created?.data?.data) {
      setTemplates((prev) => [created.data.data, ...prev]);
    }
    setNewTemplate({ name: "", subject: "", message: "" });
    dispatch(getAutoReplyTemplates());
  }, [dispatch, newTemplate]);

  const handleActivate = useCallback(
    async (id) => {
      await dispatch(updateAutoReplyTemplate({ id, is_active: true })).unwrap();
      dispatch(getAutoReplyTemplates());
    },
    [dispatch]
  );

  const handleDeactivate = useCallback(
    async (id) => {
      await dispatch(updateAutoReplyTemplate({ id, is_active: false })).unwrap();
      dispatch(getAutoReplyTemplates());
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (id) => {
      await dispatch(deleteAutoReplyTemplate(id)).unwrap();
      dispatch(getAutoReplyTemplates());
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
    // handlers
    handleInputChange,
    handleSave,
    handleActivate,
    handleDeactivate,
    handleDelete,
  };
}
