import { useEffect } from "react";
import type { ChangeEvent } from "react";
import { useRoute, useLocation } from "wouter";
import useForm from "../../hooks/useForm";
import {
  convertSkillsToArray,
  convertSkillsToString,
} from "../../helpers/course";
import { courseFormSchema } from "../../helpers/data-validator-schema";
import { DashboardLayout } from "../../components/layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { useToast } from "../../hooks/use-toast";
import { useCourses } from "../../hooks/use-courses";
import {
  useCreateNewCourseMutation,
  useUpdateCourseMutation,
} from "../../lib/apis/course-apis";
import Loader from "../../components/ui/loader";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Video,
  Save,
} from "lucide-react";

export default function CourseForm() {
  const [match, params] = useRoute("/dashboard/courses/:id/edit");
  const isEdit = match && params?.id !== "new";
  const courseId = params?.id;
  const [createCourseMutation, { isLoading, isSuccess, error, isError }] =
    useCreateNewCourseMutation();

  const [
    updateCourse,
    {
      isSuccess: isUpdateSuccess,
      error: updateError,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
    },
  ] = useUpdateCourseMutation();

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getCourse, updateCourse: updateLocalCourse } = useCourses();

  const {
    formData,
    handleInputChange,
    error: formError,
    appendContent,
    handleContentDataChange,
    appendLesson,
    handleLessonDataChange,
    markLessonIsVideo,
    removeLesson,
    removeContentFormInput,
    updateFormDataForContentUpdate,
  } = useForm(courseFormSchema);


  console.log(formData);

  const courseData = isEdit && courseId ? getCourse(courseId) : undefined;

  useEffect(() => {
    if (isEdit && courseId && courseData) {
      const { _id, __v, createdAt, updatedAt, ...rest } = courseData;
      updateFormDataForContentUpdate(rest);
    }
  }, [isEdit, courseId, courseData]);

  const onSubmit = () => {
    if (isEdit && courseId) {
      updateCourse({
        courseData: {
          ...formData,
          // skills: convertSkillsToArray(formData.skills),
          price: +formData.price,
          totalTopics: +formData.totalTopics,
          requiredDuration: +formData.requiredDuration,
          rating: formData.rating.toString(),
        },
        id: courseId,
      });
    } else {
      createCourseMutation({
        ...formData,
        skills: convertSkillsToArray(formData.skills),
        subscribers: 0,
        rating: "0.0",
        completed: 0,
        price: +formData.price,
        totalTopics: +formData.totalTopics,
        requiredDuration: +formData.requiredDuration,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast({ title: "Course created successfully", variant: "default" });

      setLocation("/dashboard/courses");
    }

    if (isError) {
      const message =
        error && "data" in error
          ? (error.data as any)?.message
          : "Something went wrong";
      toast({
        variant: "destructive",
        title: message,
      });
    }

    if (isUpdateSuccess) {
      toast({ title: "Course updated successfully", variant: "default" });
      updateLocalCourse(courseId!, formData);
      setLocation("/dashboard/courses");
    }

    if (isUpdateError) {
      const message =
        updateError && "data" in updateError
          ? (updateError.data as any)?.message
          : "Something went wrong";
      toast({
        variant: "destructive",
        title: message,
      });
    }
  }, [isSuccess, isError, isUpdateSuccess, isUpdateError]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="cursor-pointer"
              size="icon"
              onClick={() => setLocation("/dashboard/courses")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold">
                {isEdit ? "Edit Course" : "Create New Course"}
              </h1>
              <p className="text-muted-foreground mt-1">
                Design your curriculum and upload content.
              </p>
            </div>
          </div>

          <Button
            onClick={onSubmit}
            className="shadow-glow px-6 cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Save Changes" : "Publish Course"}
          </Button>
        </div>

        <form className="space-y-8">
          {/* Basic Info */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-display font-bold border-b border-border/50 pb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Course Name</Label>
                <Input
                  onChange={handleInputChange}
                  name="name"
                  value={formData?.name}
                  className="mt-1.5 bg-background/50"
                  placeholder="e.g. Advanced React Patterns"
                />
                {formError?.field === "name" && (
                  <p className="text-xs text-destructive mt-1">
                    {formError?.message}
                  </p>
                )}
              </div>

              {isLoading || (isUpdateLoading && <Loader />)}

              <div>
                <Label>Description</Label>
                <Textarea
                  onChange={handleInputChange}
                  name="description"
                  className="mt-1.5 bg-background/50 min-h-[100px]"
                  placeholder="What will students learn?"
                  value={formData?.description}
                />
                {formError?.field === "description" && (
                  <p className="text-xs text-destructive mt-1">
                    {formError?.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Cover Image URL (Optional)</Label>
                <Input
                  onChange={handleInputChange}
                  name="image"
                  className="mt-1.5 bg-background/50"
                  placeholder="https://..."
                  value={formData?.image}
                />
                {formError?.field === "image" && (
                  <p className="text-xs text-destructive mt-1">
                    {formError?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    onChange={handleInputChange}
                    name="price"
                    type="number"
                    step="0.01"
                    className="mt-1.5 bg-background/50"
                    value={formData?.price}
                  />
                  {formError?.field === "price" && (
                    <p className="text-xs text-destructive mt-1">
                      {formError?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Duration (Weeks)</Label>
                  <Input
                    type="number"
                    name="requiredDuration"
                    onChange={handleInputChange}
                    className="mt-1.5 bg-background/50"
                    value={formData?.requiredDuration}
                  />
                  {formError?.field === "requiredDuration" && (
                    <p className="text-xs text-destructive mt-1">
                      {formError?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Total Topics (Est.)</Label>
                  <Input
                    type="number"
                    name="totalTopics"
                    onChange={handleInputChange}
                    className="mt-1.5 bg-background/50"
                    value={formData?.totalTopics}
                  />
                  {formError?.field === "totalTopics" && (
                    <p className="text-xs text-destructive mt-1">
                      {formError?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="text-xl font-display font-bold">Curriculum</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-primary/50 cursor-pointer text-primary hover:bg-primary/10"
                onClick={() =>
                  appendContent({
                    mainTopic: "",
                    description: "",
                    subTopics: [{ title: "", contentURI: "", isVideo: false }],
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Add Section
              </Button>
            </div>

            <div className="space-y-6">
              {/* @ts-ignore */}
              {formData?.contents?.map((content: any, index: number) => (
                <div
                  key={index}
                  className="bg-background/40 border border-white/5 rounded-xl p-5 relative group"
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeContentFormInput(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-2 text-muted-foreground cursor-grab">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label>Section {index + 1} Title</Label>
                        <Input
                          // {...register(`contents.${index}.mainTopic`)}
                          onChange={(event) =>
                            handleContentDataChange(event, index)
                          }
                          name="mainTopic"
                          value={content?.mainTopic}
                          className="mt-1.5 bg-card/50"
                          placeholder="e.g. Getting Started"
                        />
                        {/* {errors.contents?.[index]?.mainTopic && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.contents[index]?.mainTopic?.message}
                          </p>
                        )} */}
                      </div>
                      <div>
                        <Label>Section Description</Label>
                        <Input
                          onChange={(event) =>
                            handleContentDataChange(event, index)
                          }
                          name="description"
                          value={content?.description}
                          className="mt-1.5 bg-card/50"
                          placeholder="Brief overview of this section"
                        />
                      </div>
                      <SubTopicsField
                        index={index}
                        appendLesson={appendLesson}
                        lessons={content?.subTopics}
                        handleLessonDataChange={handleLessonDataChange}
                        markLessonIsVideo={markLessonIsVideo}
                        removeLesson={removeLesson}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-display font-bold border-b border-border/50 pb-4">
              Additional Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Obtainable Skills</Label>
                <Input
                  onChange={handleInputChange}
                  className="mt-1.5 bg-background/50"
                  placeholder="e.g. Advanced React Patterns"
                  name="skills"
                  value={
                    isEdit && Array.isArray(formData?.skills)
                      ? convertSkillsToString(formData?.skills)
                      : formData?.skills
                  }
                />
                {/* {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.name.skills}
                  </p>
                )} */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

function SubTopicsField({
  index,
  appendLesson,
  lessons,
  handleLessonDataChange,
  markLessonIsVideo,
  removeLesson,
}: {
  index: number;
  appendLesson: (lesson: any, index: number) => void;
  lessons: any[];
  handleLessonDataChange: (
    event: ChangeEvent<HTMLInputElement>,
    contentIndex: number,
    lessonIndex: number,
  ) => void;

  markLessonIsVideo: (
    isVideo: boolean,
    contentIndex: number,
    lessonIndex: number,
  ) => void;
  removeLesson: (contentIndex: number, lessonIndex: number) => void;
}) {
  return (
    <div className="mt-6 pt-4 border-t border-white/5">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-muted-foreground uppercase tracking-wider text-xs">
          Lessons
        </Label>
      </div>
      <div className="space-y-3">
        {lessons && lessons?.length > 0 && lessons?.map((subField, subIndex) => {
          return (
            <div
              key={subIndex}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-card/40 p-3 rounded-lg border border-white/5"
            >
              <div className="flex-1 w-full space-y-1">
                <Input
                  name="title"
                  value={subField?.title}
                  onChange={(event) =>
                    handleLessonDataChange(event, index, subIndex)
                  }
                  placeholder="Lesson Title"
                  className="h-9 bg-background/50 text-sm"
                />
                {/* {errors.contents?.[contentIndex]?.subTopics?.[subIndex]
                  ?.title && (
                  <p className="text-[10px] text-destructive">
                    {
                      errors.contents[contentIndex].subTopics[subIndex].title
                        .message
                    }
                  </p>
                )} */}
              </div>

              <div className="flex-1 w-full space-y-1">
                <Input
                  onChange={(event) =>
                    handleLessonDataChange(event, index, subIndex)
                  }
                  name="contentURI"
                  value={subField?.contentURI}
                  placeholder="URL to content or video"
                  className="h-9 bg-background/50 text-sm"
                />
                {/* {errors.contents?.[contentIndex]?.subTopics?.[subIndex]
                  ?.contentURI && (
                  <p className="text-[10px] text-destructive">
                    {
                      errors.contents[contentIndex].subTopics[subIndex]
                        .contentURI.message
                    }
                  </p>
                )} */}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-md border border-white/5">
                  <Switch
                    onCheckedChange={(val: boolean) =>
                      markLessonIsVideo(val, index, subIndex)
                    }
                    checked={subField?.isVideo}
                  />
                  <Label className="text-xs flex items-center gap-1 cursor-pointer">
                    <Video className="w-3 h-3" /> Video
                  </Label>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeLesson(index, subIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-3 text-xs cursor-pointer text-muted-foreground hover:text-primary"
        onClick={() =>
          appendLesson({ title: "", contentURI: "", isVideo: false }, index)
        }
      >
        <Plus className="w-3 h-3 mr-1" /> Add Lesson
      </Button>
    </div>
  );
}
