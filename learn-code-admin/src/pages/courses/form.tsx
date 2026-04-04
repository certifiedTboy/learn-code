import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "../../components/layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { useToast } from "../../hooks/use-toast";
import { useCourses } from "../../hooks/use-courses";
import { useCreateNewCourseMutation } from "../../lib/apis/course-apis";
import Loader from "../../components/ui/loader";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Video,
  Save,
} from "lucide-react";

const subTopicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contentURI: z.string().min(1, "URI is required"),
  isVideo: z.boolean().default(false),
});

const courseContentSchema = z.object({
  mainTopic: z.string().min(1, "Main topic is required"),
  description: z.string().min(1, "Description is required"),
  subTopics: z.array(subTopicSchema).min(1, "At least one sub-topic required"),
});

const courseFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description is required"),
  image: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be positive"),
  totalTopics: z.coerce.number().min(1, "Must have at least 1 topic"),
  requiredDuration: z.coerce.number().min(1, "Duration required (weeks)"),
  contents: z.array(courseContentSchema).optional(),
  skills: z.string(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

function formatSkills(skills: string[]) {
  let concatenatedSkills = "";
  for (let skill of skills) {
    concatenatedSkills += `${skill} `;
  }
  return concatenatedSkills;
}

export default function CourseForm() {
  const [match, params] = useRoute("/dashboard/courses/:id/edit");
  const isEdit = match && params?.id !== "new";
  const courseId = params?.id;
  const [createCourseMutation, { isLoading, isSuccess, error, isError }] =
    useCreateNewCourseMutation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getCourse } = useCourses();

  const courseData = isEdit && courseId ? getCourse(courseId) : undefined;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: 0,
      totalTopics: 1,
      requiredDuration: 4,
      skills: "",
      contents: [
        {
          mainTopic: "",
          description: "",
          subTopics: [{ title: "", contentURI: "", isVideo: false }],
        },
      ],
    },
  });

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
  } = useFieldArray({
    control,
    name: "contents",
  });

  useEffect(() => {
    if (isEdit && courseData) {
      reset({
        name: courseData?.name,
        description: courseData?.description,
        image: courseData?.image || "",
        price: courseData?.price,
        totalTopics: courseData?.totalTopics,
        requiredDuration: courseData?.requiredDuration,
        skills:
          (Array.isArray(courseData?.skills) &&
            formatSkills(courseData?.skills || [])) ||
          "",
        contents:
          courseData?.contents && courseData?.contents.length > 0
            ? courseData.contents
            : [
                {
                  mainTopic: "",
                  description: "",
                  subTopics: [{ title: "", contentURI: "", isVideo: false }],
                },
              ],
      });
    }
  }, [isEdit, courseData, reset]);

  const onSubmit = (data: CourseFormValues) => {
    // return console.log(data.skills.split(","));
    const payload = {
      ...data,
      skills: data?.skills.split(","),
      rating: "0.0",
      image: data.image === "" ? undefined : data.image,
      contents: data.contents || [],
      subscribers: 0,
      completed: 0,
    };

    if (isEdit && courseId) {
      // updateCourse(courseId, payload);
    } else {
      createCourseMutation(payload);
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
  }, [isSuccess, isError]);

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
            onClick={handleSubmit(onSubmit)}
            className="shadow-glow px-6 cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Save Changes" : "Publish Course"}
          </Button>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-display font-bold border-b border-border/50 pb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Course Name</Label>
                <Input
                  {...register("name")}
                  className="mt-1.5 bg-background/50"
                  placeholder="e.g. Advanced React Patterns"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.name?.message}
                  </p>
                )}
              </div>

              {isLoading && <Loader />}

              <div>
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  className="mt-1.5 bg-background/50 min-h-[100px]"
                  placeholder="What will students learn?"
                />
                {errors.description && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Cover Image URL (Optional)</Label>
                <Input
                  {...register("image")}
                  className="mt-1.5 bg-background/50"
                  placeholder="https://..."
                />
                {errors.image && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="mt-1.5 bg-background/50"
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Duration (Weeks)</Label>
                  <Input
                    type="number"
                    {...register("requiredDuration")}
                    className="mt-1.5 bg-background/50"
                  />
                  {errors.requiredDuration && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.requiredDuration.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Total Topics (Est.)</Label>
                  <Input
                    type="number"
                    {...register("totalTopics")}
                    className="mt-1.5 bg-background/50"
                  />
                  {errors.totalTopics && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.totalTopics.message}
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
                className="border-primary/50 text-primary hover:bg-primary/10"
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
              {contentFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-background/40 border border-white/5 rounded-xl p-5 relative group"
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeContent(index)}
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
                          {...register(`contents.${index}.mainTopic`)}
                          className="mt-1.5 bg-card/50"
                          placeholder="e.g. Getting Started"
                        />
                        {errors.contents?.[index]?.mainTopic && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.contents[index]?.mainTopic?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Section Description</Label>
                        <Input
                          {...register(`contents.${index}.description`)}
                          className="mt-1.5 bg-card/50"
                          placeholder="Brief overview of this section"
                        />
                      </div>
                      <SubTopicsField
                        control={control}
                        register={register}
                        watch={watch}
                        setValue={setValue}
                        contentIndex={index}
                        errors={errors}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {contentFields.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground mb-4">
                    No sections added yet.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendContent({
                        mainTopic: "",
                        description: "",
                        subTopics: [
                          { title: "", contentURI: "", isVideo: false },
                        ],
                      })
                    }
                  >
                    Add First Section
                  </Button>
                </div>
              )}
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
                  {...register("skills")}
                  className="mt-1.5 bg-background/50"
                  placeholder="e.g. Advanced React Patterns"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.name.skills}
                  </p>
                )}
              </div>

              {/* <div>
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  className="mt-1.5 bg-background/50 min-h-[100px]"
                  placeholder="What will students learn?"
                />
                {errors.description && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div> */}

              {/* <div>
                <Label>Cover Image URL (Optional)</Label>
                <Input
                  {...register("image")}
                  className="mt-1.5 bg-background/50"
                  placeholder="https://..."
                />
                {errors.image && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div> */}

              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="mt-1.5 bg-background/50"
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Duration (Weeks)</Label>
                  <Input
                    type="number"
                    {...register("requiredDuration")}
                    className="mt-1.5 bg-background/50"
                  />
                  {errors.requiredDuration && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.requiredDuration.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Total Topics (Est.)</Label>
                  <Input
                    type="number"
                    {...register("totalTopics")}
                    className="mt-1.5 bg-background/50"
                  />
                  {errors.totalTopics && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.totalTopics.message}
                    </p>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

function SubTopicsField({
  control,
  register,
  watch,
  setValue,
  contentIndex,
  errors,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `contents.${contentIndex}.subTopics`,
  });

  return (
    <div className="mt-6 pt-4 border-t border-white/5">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-muted-foreground uppercase tracking-wider text-xs">
          Lessons
        </Label>
      </div>
      <div className="space-y-3">
        {fields.map((subField, subIndex) => {
          const isVideoVal = watch(
            `contents.${contentIndex}.subTopics.${subIndex}.isVideo`,
          );
          return (
            <div
              key={subField.id}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-card/40 p-3 rounded-lg border border-white/5"
            >
              <div className="flex-1 w-full space-y-1">
                <Input
                  {...register(
                    `contents.${contentIndex}.subTopics.${subIndex}.title`,
                  )}
                  placeholder="Lesson Title"
                  className="h-9 bg-background/50 text-sm"
                />
                {errors.contents?.[contentIndex]?.subTopics?.[subIndex]
                  ?.title && (
                  <p className="text-[10px] text-destructive">
                    {
                      errors.contents[contentIndex].subTopics[subIndex].title
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="flex-1 w-full space-y-1">
                <Input
                  {...register(
                    `contents.${contentIndex}.subTopics.${subIndex}.contentURI`,
                  )}
                  placeholder="URL to content or video"
                  className="h-9 bg-background/50 text-sm"
                />
                {errors.contents?.[contentIndex]?.subTopics?.[subIndex]
                  ?.contentURI && (
                  <p className="text-[10px] text-destructive">
                    {
                      errors.contents[contentIndex].subTopics[subIndex]
                        .contentURI.message
                    }
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-md border border-white/5">
                  <Switch
                    checked={!!isVideoVal}
                    onCheckedChange={(val) =>
                      setValue(
                        `contents.${contentIndex}.subTopics.${subIndex}.isVideo`,
                        val,
                      )
                    }
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
                  onClick={() => remove(subIndex)}
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
        className="mt-3 text-xs text-muted-foreground hover:text-primary"
        onClick={() => append({ title: "", contentURI: "", isVideo: false })}
      >
        <Plus className="w-3 h-3 mr-1" /> Add Lesson
      </Button>
    </div>
  );
}
