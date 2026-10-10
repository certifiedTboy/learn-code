import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type TourStep = {
  target: string;
  title: string;
  description: string;
};

type TargetPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const adminSteps: TourStep[] = [
  {
    target: "dashboard-heading",
    title: "Your admin dashboard",
    description:
      "Start here for a quick overview of your Learn Code platform and its activity.",
  },
  {
    target: "dashboard-stats",
    title: "Track platform performance",
    description:
      "These cards summarize your courses, active subscribers, average rating, and estimated revenue.",
  },
  {
    target: "create-course",
    title: "Create a course",
    description:
      "Use this button to add a course and publish learning content for your learners.",
  },
  {
    target: "dashboard-courses",
    title: "Manage your courses",
    description:
      "Recent courses appear here. Open a course to review its details or manage its content.",
  },
  {
    target: "nav-courses",
    title: "Course catalog",
    description:
      "Open Courses from the sidebar to browse and manage your full course catalog.",
  },
  {
    target: "nav-users",
    title: "Registered users",
    description:
      "Visit Registered Users to see the learners who have joined your platform.",
  },
  {
    target: "nav-settings",
    title: "Account settings",
    description: "Update your profile and account preferences here.",
  },
];

const learnerSteps: TourStep[] = [
  {
    target: "dashboard-heading",
    title: "Welcome to Learn Code",
    description:
      "Your dashboard is the starting point for discovering courses and continuing your learning.",
  },
  {
    target: "dashboard-courses",
    title: "Discover courses",
    description:
      "Browse the available courses here and open one to learn more or enroll.",
  },
  {
    target: "nav-my-courses",
    title: "Your learning",
    description:
      "My Courses keeps your enrolled courses together so you can pick up where you left off.",
  },
  {
    target: "cloud-backup",
    title: "Back up your learning data",
    description:
      "Use the cloud button to back up your data or restore it on this account.",
  },
  {
    target: "nav-settings",
    title: "Account settings",
    description: "Update your profile and account preferences here.",
  },
];

function getTourStorageKey(role: string, email: string) {
  if (!email || (role !== "admin" && role !== "user")) {
    return null;
  }

  return `learn-code:dashboard-product-tour:v1:${role}:${email.toLowerCase()}`;
}

export function DashboardScreenMap() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState<TargetPosition | null>(
    null,
  );
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const tourTriggerRef = useRef<HTMLButtonElement>(null);
  const steps = user.role === "admin" ? adminSteps : learnerSteps;
  const storageKey = getTourStorageKey(user.role, user.email);
  const step = steps[currentStep];

  const finishTour = useCallback(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, "seen");
    }
    window.dispatchEvent(
      new CustomEvent("learn-code:tour-mobile-menu", { detail: false }),
    );
    setIsOpen(false);
    setTargetPosition(null);
    tourTriggerRef.current?.focus();
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) {
      setIsOpen(false);
      return;
    }

    setCurrentStep(0);
    setIsOpen(localStorage.getItem(storageKey) !== "seen");
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen || !step) {
      setTargetPosition(null);
      return;
    }

    const isNavigationStep = step.target.startsWith("nav-");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    window.dispatchEvent(
      new CustomEvent("learn-code:tour-mobile-menu", {
        detail: isMobile && isNavigationStep,
      }),
    );

    let measureTimeout: number | undefined;
    const measureTarget = () => {
      const target = document.querySelector<HTMLElement>(
        `[data-tour="${step.target}"]`,
      );
      if (!target) {
        setTargetPosition(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      setTargetPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    const target = document.querySelector<HTMLElement>(
      `[data-tour="${step.target}"]`,
    );
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    measureTimeout = window.setTimeout(
      measureTarget,
      isMobile && isNavigationStep ? 350 : 150,
    );
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, true);

    return () => {
      window.clearTimeout(measureTimeout);
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget, true);
    };
  }, [currentStep, isOpen, step]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        finishTour();
        return;
      }

      if (event.key === "Tab") {
        const dialog = document.querySelector<HTMLElement>(
          '[role="dialog"][aria-label="Product and service tour"]',
        );
        const focusableElements =
          dialog?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ) ?? [];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (
          event.shiftKey &&
          firstElement &&
          document.activeElement === firstElement
        ) {
          event.preventDefault();
          lastElement?.focus();
        } else if (
          !event.shiftKey &&
          lastElement &&
          document.activeElement === lastElement
        ) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishTour, isOpen]);

  useEffect(() => {
    if (isOpen) {
      nextButtonRef.current?.focus();
    }
  }, [currentStep, isOpen]);

  const advanceTour = () => {
    if (currentStep === steps.length - 1) {
      finishTour();
      return;
    }

    setCurrentStep((current) => current + 1);
  };

  const cardWidth = Math.min(400, window.innerWidth - 32);
  const cardTop = targetPosition
    ? targetPosition.top + targetPosition.height + 16 + 260 <=
      window.innerHeight
      ? targetPosition.top + targetPosition.height + 16
      : Math.max(16, targetPosition.top - 276)
    : Math.max(16, (window.innerHeight - 260) / 2);
  const cardLeft = targetPosition
    ? Math.max(
        16,
        Math.min(
          targetPosition.left + targetPosition.width / 2 - cardWidth / 2,
          window.innerWidth - cardWidth - 16,
        ),
      )
    : Math.max(16, (window.innerWidth - cardWidth) / 2);

  return (
    <>
      {isOpen &&
        step &&
        createPortal(
          <div className="fixed inset-0 z-[70]" aria-live="polite">
            <div className="absolute inset-0 bg-black/10" />
            {targetPosition && (
              <div
                className="pointer-events-none fixed z-[71] rounded-xl border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.72),0_0_28px_rgba(0,188,212,0.45)] transition-all duration-200"
                style={{
                  top: targetPosition.top - 6,
                  left: targetPosition.left - 6,
                  width: targetPosition.width + 12,
                  height: targetPosition.height + 12,
                }}
              />
            )}
            <section
              aria-label="Product and service tour"
              aria-modal="true"
              role="dialog"
              className="fixed z-[72] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6"
              style={{
                top: cardTop,
                left: cardLeft,
                width: cardWidth,
              }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Product & service tour · {currentStep + 1} of {steps.length}
                </p>
                <button
                  type="button"
                  aria-label="Close product tour"
                  onClick={finishTour}
                  className="rounded-md p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-xl font-display font-bold">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <Button variant="ghost" onClick={finishTour}>
                  Skip tour
                </Button>
                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep((current) => current - 1)}
                    >
                      Back
                    </Button>
                  )}
                  <Button ref={nextButtonRef} onClick={advanceTour}>
                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
