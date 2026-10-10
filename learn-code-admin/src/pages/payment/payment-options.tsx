import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { PaystackButton } from "react-paystack";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useSelector } from "react-redux";
import { ArrowLeft, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout";
import { useCourses } from "@/hooks/use-courses";
import { upsertRegisteredCourse } from "@/helpers/course-database";

const publicKey = import.meta.env.VITE_APP_PAYSTACK_PUBLIC_KEY;
const publicKey2 = import.meta.env.VITE_APP_FLUTTERWAVE_PUBLIC_KEY;

function PaymentOptions() {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [_paymentResponse, setPaymentResponse] = useState(null);
  const [paystackPaymentSuccess, setPaystackPaymentSuccess] = useState(false);
  const [, params] = useRoute("/dashboard/my-courses/:id/payment");
  // const [, setLocation] = useLocation();
  const { getCourse, getRegisteredCourse } = useCourses();
  const { currentUser } = useSelector((state: any) => state?.authState);
  const course = params?.id ? getCourse(params.id) : undefined;
  const regCourse = params?.id ? getRegisteredCourse(params?.id) : undefined;

  if (!course) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="mb-6 mt-2 text-muted-foreground">
            We couldn&apos;t find the course you want to purchase.
          </p>
          <Link href="/dashboard/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const price = Number(course.price);
  const formattedPrice = Number.isFinite(price)
    ? price.toLocaleString("en-NG")
    : course.price;

  const componentProps = {
    email: currentUser?.email,
    amount: price * 100,
    metadata: {
      courseId: course?._id,
      userId: currentUser?._id,
      courseName: course?.name,
      custom_fields: [],
    },
    publicKey,
    className:
      "inline-flex cursor-pointer h-12 w-full items-center justify-center rounded-xl bg-[#0b4f9c] px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-[#093f7d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ba9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    onSuccess: () => setPaystackPaymentSuccess(true),
  };

  const config = {
    public_key: publicKey2,
    tx_ref: Date.now().toString(),
    amount: price,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: currentUser?.email,
      phone_number: currentUser?.phoneNumber ?? currentUser?.phone ?? "",
      name: currentUser?.firstName + " " + currentUser?.lastName,
    },
    meta: {
      courseId: course?._id,
      userId: currentUser?._id,
      email: currentUser?.email,
      courseName: course?.name,
    },
    customizations: {
      title: `Subcription to ${course?.name}`,
      description: "Payment for course subscription",
      logo: "https://example.com/logo.png", // Your store logo
    },
  };

  function onSuccess(response: any) {
    console.log(response);
  }

  const fwConfig = {
    ...config,
    className:
      "inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#f5a623] px-5 text-sm font-semibold text-white shadow-lg shadow-amber-950/20 transition hover:bg-[#df941d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc65c] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    callback: (response: any) => {
      setPaymentCompleted(true); // Set payment as completed
      setPaymentResponse(response); // Store payment response
      onSuccess(response); // Trigger the success handler
      closePaymentModal(); // Close the payment modal
    },
    onClose: () => {
      console.log("Payment modal closed");
    },
  };

  useEffect(() => {
    (async () => {
      if (paystackPaymentSuccess && regCourse) {
        await upsertRegisteredCourse({
          _id: regCourse?._id!,
          name: regCourse?.name,
          description: regCourse?.description,
          price: regCourse?.price,
          rating: regCourse?.rating,
          completed: regCourse?.completed,
          subscribers: regCourse?.subscribers,
          totalTopics: regCourse?.totalTopics,
          requiredDuration: regCourse?.requiredDuration,
          contents: regCourse?.contents,
          createdAt: regCourse?.createdAt,
          updatedAt: regCourse?.updatedAt,
          skills: regCourse?.skills,
          image: regCourse?.image,
          dateRegistered: new Date().toDateString(),
          completion: regCourse?.completion,
        });

        return (window.location.href = "/dashboard/my-courses");
      }

      if (paystackPaymentSuccess && course) {
        await upsertRegisteredCourse({
          _id: course?._id!,
          name: course?.name,
          description: course?.description,
          price: course?.price,
          rating: course?.rating,
          completed: course?.completed,
          subscribers: course?.subscribers,
          totalTopics: course?.totalTopics,
          requiredDuration: course?.requiredDuration,
          contents: course?.contents,
          createdAt: course?.createdAt,
          updatedAt: course?.updatedAt,
          skills: course?.skills,
          image: course?.image,
          dateRegistered: new Date().toDateString(),
          completion: regCourse?.completion || "0%",
        });

        return (window.location.href = "/dashboard/my-courses");
      }
    })();
  }, [paystackPaymentSuccess]);

  useEffect(() => {
    (async () => {
      if (paymentCompleted && regCourse) {
        await upsertRegisteredCourse({
          _id: regCourse?._id!,
          name: regCourse?.name,
          description: regCourse?.description,
          price: regCourse?.price,
          rating: regCourse?.rating,
          completed: regCourse?.completed,
          subscribers: regCourse?.subscribers,
          totalTopics: regCourse?.totalTopics,
          requiredDuration: regCourse?.requiredDuration,
          contents: regCourse?.contents,
          createdAt: regCourse?.createdAt,
          updatedAt: regCourse?.updatedAt,
          skills: regCourse?.skills,
          image: regCourse?.image,
          dateRegistered: new Date().toDateString(),
          completion: regCourse?.completion,
        });

        return (window.location.href = "/dashboard/my-courses");
      }
      if (paymentCompleted && course) {
        await upsertRegisteredCourse({
          _id: course?._id!,
          name: course?.name,
          description: course?.description,
          price: course?.price,
          rating: course?.rating,
          completed: course?.completed,
          subscribers: course?.subscribers,
          totalTopics: course?.totalTopics,
          requiredDuration: course?.requiredDuration,
          contents: course?.contents,
          createdAt: course?.createdAt,
          updatedAt: course?.updatedAt,
          skills: course?.skills,
          image: course?.image,
          dateRegistered: new Date().toDateString(),
          completion: regCourse?.completion || "0%",
        });

        window.location.href = "/dashboard/my-courses";
      }
    })();
  }, [paystackPaymentSuccess]);

  return (
    <DashboardLayout>
      <main className="mx-auto max-w-6xl space-y-8 pb-16">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to course
        </Link>

        <header>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            One step from learning
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Choose how you&apos;d like to pay
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Review your course details, then select a payment provider to
            continue.
          </p>
        </header>

        <div className="flex justify-center mt-20">
          <aside className="glass-panel w-full max-w-xl rounded-3xl border border-white/10 p-5 sm:p-7">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Your order</p>
              <h2 className="mt-1 text-xl font-bold">Course access</h2>
            </div>

            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="font-medium">{course.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  One-time course enrollment
                </p>
              </div>
              <p className="shrink-0 font-semibold">₦{formattedPrice}</p>
            </div>

            <div className="flex items-center justify-between py-5">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                ₦{formattedPrice}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold">Select a payment provider</p>

              <PaystackButton {...componentProps}>
                <CreditCard aria-hidden="true" className="mr-2 h-4 w-4" />
                Pay with Paystack
              </PaystackButton>
              <FlutterWaveButton {...fwConfig}>
                <CreditCard aria-hidden="true" className="mr-2 h-4 w-4" />
                Pay with Flutterwave
              </FlutterWaveButton>
            </div>

            <div className="mt-5 flex gap-3 rounded-xl border border-white/10 bg-background/40 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your payment is handled by the provider you choose. Learn Code
                does not store your card details.
              </p>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <LockKeyhole className="h-3.5 w-3.5" />
              Secure payment options
            </p>
          </aside>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default PaymentOptions;
