import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { changePassword } from "@/provider/features/auth/auth.slice";
import { useEffect } from "react";

// Validation schema for password change
const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    )
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

function useSecuritySettings() {
  // Redux State
  const dispatch = useDispatch();

  const {
    isLoading: changePasswordLoading,
    isSuccess: changePasswordSuccess,
    isError: changePasswordError,
    message: changePasswordMessage,
  } = useSelector((state) => state.auth.changePassword || {});

  // Form setup
  const formMethods = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, reset } = formMethods;

  // Reset form on success
  useEffect(() => {
    if (changePasswordSuccess) {
      reset();
    }
  }, [changePasswordSuccess, reset]);

  // Handlers
  const onSubmit = useCallback(
    async (data) => {
      await dispatch(
        changePassword({
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      );
    },
    [dispatch]
  );

  return {
    // Form methods
    ...formMethods,
    handleSubmit,
    onSubmit,

    // Redux state
    changePasswordLoading,
    changePasswordSuccess,
    changePasswordError,
    changePasswordMessage,
  };
}

export default useSecuritySettings;
