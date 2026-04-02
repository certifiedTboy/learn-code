import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

interface InputTypeState {
  passwordType: "password" | "text";
  confirmPasswordType: "password" | "text";
}

interface ErrorState {
  message: string;
  field: string;
}

interface FormDataState {
  [key: string]: string;
}

const useForm = (validatorSchema: any) => {
  const [formData, setFormData] = useState<FormDataState>({});
  const [error, setError] = useState<ErrorState>({ message: "", field: "" });
  const [inputType, setInputType] = useState<InputTypeState>({
    passwordType: "password",
    confirmPasswordType: "password",
  });

  /**
   * @function handleInputChange
   * handle form input changes
   */
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordTypeChange = (field: string): void => {
    setInputType({
      ...inputType,
      [field]:
        inputType[field as keyof InputTypeState] === "password"
          ? "text"
          : "password",
    });
  };

  useEffect(() => {
    (async () => {
      try {
        await validatorSchema.validate(formData, { abortEarly: false });

        setError({ message: "", field: "" });
      } catch (error: unknown) {
        const err = error as any;
        setError({
          message: err.inner[0].message,
          field: err.inner[0].path,
        });
      }
    })();
  }, [formData]);

  return {
    handleInputChange,
    formData,
    error,
    inputType,
    handlePasswordTypeChange,
  };
};

export default useForm;
