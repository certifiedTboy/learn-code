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
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles password type change
   */
  const handlePasswordTypeChange = (field: string): void => {
    setInputType({
      ...inputType,
      [field]:
        inputType[field as keyof InputTypeState] === "password"
          ? "text"
          : "password",
    });
  };

  /**
   * validate form inputs for any error based on yup schema provided
   */
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

  /**
   * add new main content input form
   */
  const appendContent = (content: any) => {
    setFormData((prev: any) => ({
      ...prev,
      contents: [...(prev.contents || []), content],
    }));
  };

  /**
   * handle main conent data change
   */
  const handleContentDataChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      // @ts-ignore
      contents: prev.contents.map((content: any, i: any) => {
        if (i === index) {
          return {
            ...content,
            [event.target.name]: event.target.value,
          };
        }
        return content;
      }),
    }));
  };

  /**
   * remove content form inputs
   */
  const removeContentFormInput = (contentIndex: number) => {
    setFormData((prev: any) => ({
      ...prev,
      contents: prev.contents.filter(
        (_: any, idx: number) => idx !== contentIndex,
      ),
    }));
  };

  /**
   * add new lesson input form
   */
  const appendLesson = (lesson: any, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      contents: prev.contents.map((item: any, i: number) =>
        i === index
          ? {
              ...item,
              subTopics: [...item.subTopics, lesson],
            }
          : item,
      ),
    }));
  };

  /**
   * handle lesson content data change
   */
  const handleLessonDataChange = (
    event: ChangeEvent<HTMLInputElement>,
    contentIndex: number,
    lessonIndex: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      // @ts-ignore
      contents: prev.contents.map((content: any, i: number) => {
        if (i === contentIndex) {
          return {
            ...content,
            subTopics: content.subTopics.map((lesson: any, j: number) => {
              if (j === lessonIndex) {
                return {
                  ...lesson,
                  [event.target.name]: event.target.value,
                };
              }

              return lesson;
            }),
          };
        }
      }),
    }));
  };

  /**
   * toggle mark lesson content has video
   */
  const markLessonIsVideo = (
    isVideo: boolean,
    contentIndex: number,
    lessonIndex: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      // @ts-ignore
      contents: prev.contents.map((content: any, i: number) => {
        if (i === contentIndex) {
          return {
            ...content,
            subTopics: content.subTopics.map((lesson: any, j: number) => {
              if (j === lessonIndex) {
                return {
                  ...lesson,
                  isVideo,
                };
              }

              return lesson;
            }),
          };
        }
      }),
    }));
  };

  /**
   * remove lesson content input form
   */
  const removeLesson = (contentIndex: number, lessonIndex: number) => {
    setFormData((prev: any) => ({
      ...prev,
      contents: prev.contents.map((content: any, i: number) =>
        i === contentIndex
          ? {
              ...content,
              subTopics: content.subTopics.filter(
                (_: any, idx: number) => idx !== lessonIndex,
              ),
            }
          : content,
      ),
    }));
  };

  /**
   * update form data for content update
   */
  const updateFormDataForContentUpdate = (data: any) => {
    setFormData(data);
  };

  return {
    handleInputChange,
    formData,
    error,
    inputType,
    handlePasswordTypeChange,
    appendContent,
    handleContentDataChange,
    appendLesson,
    handleLessonDataChange,
    markLessonIsVideo,
    removeLesson,
    removeContentFormInput,
    updateFormDataForContentUpdate,
  };
};

export default useForm;
