import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getContactMethods,
  addContactMethod,
  updateContactMethod,
  deleteContactMethod,
  verifyContactMethod,
  setPrimaryContactMethod,
  reset as usersReset,
} from "@/provider/features/users/users.slice";

// Validation schemas
const emailSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

const phoneSchema = yup.object().shape({
  phone: yup.string().required("Phone number is required"),
});

export default function useEmailPhone() {
  const dispatch = useDispatch();
  const {
    getContactMethods: getState,
    addContactMethod: addState,
    updateContactMethod: updateState,
    deleteContactMethod: deleteState,
    verifyContactMethod: verifyState,
    setPrimaryContactMethod: setPrimaryState,
  } = useSelector((s) => s.users || {});

  const [editingMethod, setEditingMethod] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [methodToVerify, setMethodToVerify] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState(null);

  const contactMethods = useMemo(() => getState?.data?.data || [], [getState?.data?.data]);
  const emailMethods = useMemo(() => {
    return (contactMethods || []).filter((m) => m.type === "email");
  }, [contactMethods]);

  const phoneMethods = useMemo(() => {
    return (contactMethods || []).filter((m) => m.type === "phone");
  }, [contactMethods]);

  useEffect(() => {
    dispatch(getContactMethods());
    return () => {
      dispatch(usersReset());
    };
  }, [dispatch]);

  const refresh = useCallback(() => dispatch(getContactMethods()), [dispatch]);

  const onAddEmail = useCallback(
    async ({ email }) => {
      await dispatch(addContactMethod({ email })).unwrap();
      setShowEmailForm(false);
      setEditingMethod(null);
      refresh();
    },
    [dispatch, refresh]
  );

  const onAddPhone = useCallback(
    async ({ phone }) => {
      await dispatch(addContactMethod({ phone })).unwrap();
      setShowPhoneForm(false);
      setEditingMethod(null);
      refresh();
    },
    [dispatch, refresh]
  );

  const onEdit = useCallback((method) => {
    setEditingMethod(method);
    if (method.type === "email") setShowEmailForm(true);
    else setShowPhoneForm(true);
  }, []);

  const onUpdate = useCallback(
    async ({ id, email, phone }) => {
      await dispatch(updateContactMethod({ id, email, phone })).unwrap();
      setShowEmailForm(false);
      setShowPhoneForm(false);
      setEditingMethod(null);
      refresh();
    },
    [dispatch, refresh]
  );

  const onDelete = useCallback(
    async (id) => {
      await dispatch(deleteContactMethod(id)).unwrap();
      refresh();
    },
    [dispatch, refresh]
  );

  const onVerify = useCallback(
    async (id, code) => {
      await dispatch(verifyContactMethod({ id, code })).unwrap();
      refresh();
    },
    [dispatch, refresh]
  );

  const onSetPrimary = useCallback(
    async (id) => {
      await dispatch(setPrimaryContactMethod(id)).unwrap();
      refresh();
    },
    [dispatch, refresh]
  );

  const handleVerifyClick = useCallback((method) => {
    setMethodToVerify(method);
    setShowVerifyModal(true);
  }, []);

  const handleVerifySubmit = useCallback(async () => {
    if (verificationCode && methodToVerify) {
      await onVerify(methodToVerify.id, verificationCode);
      setShowVerifyModal(false);
      setVerificationCode("");
      setMethodToVerify(null);
    }
  }, [verificationCode, methodToVerify, onVerify]);

  const handleCancelVerify = useCallback(() => {
    setShowVerifyModal(false);
    setVerificationCode("");
    setMethodToVerify(null);
  }, []);

  const handleDelete = useCallback((method) => {
    setMethodToDelete(method);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (methodToDelete) {
      await onDelete(methodToDelete.id);
      setShowDeleteModal(false);
      setMethodToDelete(null);
    }
  }, [methodToDelete, onDelete]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setMethodToDelete(null);
  }, []);

  // Email form
  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Phone form
  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const onSubmitAddEmail = useCallback(
    async (data) => {
      await onAddEmail({ email: data.email });
      emailForm.reset();
    },
    [emailForm, onAddEmail]
  );

  const onSubmitAddPhone = useCallback(
    async (data) => {
      await onAddPhone({ phone: data.phone });
      phoneForm.reset();
    },
    [phoneForm, onAddPhone]
  );

  const handleEdit = useCallback(
    (method) => {
      onEdit(method);
      if (method.type === "email") emailForm.setValue("email", method.value);
      else phoneForm.setValue("phone", method.value);
    },
    [emailForm, phoneForm, onEdit]
  );

  const handleSetPrimary = useCallback(
    async (id) => {
      await onSetPrimary(id);
    },
    [onSetPrimary]
  );

  const handleOpenAddEmailForm = useCallback(() => {
    setEditingMethod(null);
    emailForm.reset();
    setShowEmailForm(true);
  }, [emailForm, setShowEmailForm, setEditingMethod]);

  const handleOpenAddPhoneForm = useCallback(() => {
    setEditingMethod(null);
    phoneForm.reset();
    setShowPhoneForm(true);
  }, [phoneForm, setShowPhoneForm, setEditingMethod]);

  const handleCloseEmailForm = useCallback(() => {
    setShowEmailForm(false);
    setEditingMethod(null);
    emailForm.reset();
  }, [emailForm, setShowEmailForm, setEditingMethod]);

  const handleClosePhoneForm = useCallback(() => {
    setShowPhoneForm(false);
    setEditingMethod(null);
    phoneForm.reset();
  }, [phoneForm, setShowPhoneForm, setEditingMethod]);

  return {
    // state
    emailMethods,
    phoneMethods,
    editingMethod,
    showEmailForm,
    showPhoneForm,
    showVerifyModal,
    methodToVerify,
    verificationCode,
    showDeleteModal,
    methodToDelete,
    loading:
      getState?.isLoading ||
      addState?.isLoading ||
      updateState?.isLoading ||
      deleteState?.isLoading ||
      verifyState?.isLoading ||
      setPrimaryState?.isLoading,
    // actions
    setShowEmailForm,
    setShowPhoneForm,
    setEditingMethod,
    setVerificationCode,
    onAddEmail,
    onAddPhone,
    onEdit,
    onUpdate,
    onDelete,
    onVerify,
    onSetPrimary,
    handleVerifyClick,
    handleVerifySubmit,
    handleCancelVerify,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    // form-related
    emailForm,
    phoneForm,
    onSubmitAddEmail,
    onSubmitAddPhone,
    handleEdit,
    handleSetPrimary,
    handleOpenAddEmailForm,
    handleOpenAddPhoneForm,
    handleCloseEmailForm,
    handleClosePhoneForm,
  };
}
