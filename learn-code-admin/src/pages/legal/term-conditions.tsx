import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            <span className="font-display font-bold text-lg text-foreground">
              Learn Code
            </span>
          </div>
          <Link href="/">
            <span className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pt-32 px-6">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Background Icon */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <FileText className="w-64 h-64" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 text-foreground">
              Terms and Conditions
            </h1>
            <p className="text-primary mb-10 font-medium">
              Last updated:{" "}
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using the Learn Code platform, you agree to be
                  bound by these Terms and Conditions. If you do not agree with
                  any part of these terms, you may not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  2. User Accounts and Authentication
                </h2>
                <p className="mb-3">
                  To use most features of Learn Code, you must register for an
                  account either by using the registration form or byusing
                  Google Authentication.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account.
                  </li>
                  <li>
                    You agree to provide accurate and complete information
                    during registration.
                  </li>
                  <li>
                    Account sharing is strictly prohibited and may result in
                    account termination.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  3. Course Content and Intellectual Property
                </h2>
                <p>
                  All content provided on Learn Code, including videos, text,
                  code snippets, and downloadable materials, is the intellectual
                  property of Learn Code or its content creators. You are
                  granted a limited, non-exclusive, non-transferable license to
                  access the content for personal, non-commercial educational
                  purposes only. Unauthorized distribution, copying, or resale
                  of course materials is strictly forbidden.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  4. Payments, Subscriptions, and Refunds
                </h2>
                <p>
                  Course enrollments and subscriptions are processed through
                  trusted third-party payment gateways (Paystack and
                  Flutterwave). Learn Code does not store or process your
                  payment details directly.
                  <br />
                  <br />
                  All sales are considered final. Refund requests may be
                  evaluated on a case-by-case basis at the sole discretion of
                  Learn Code administration, typically within 7 days of
                  purchase, provided the course has not been significantly
                  consumed.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  5. Optional Cloud Backup
                </h2>
                <p>
                  Learn Code offers an optional feature to back up your learning
                  progress using your Google Drive AppData folder. If you choose
                  to enable this feature, you grant us permission to store and
                  retrieve data from this isolated folder. We are not
                  responsible for any data loss resulting from you revoking this
                  permission or modifying files within your Google Drive.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  6. Termination
                </h2>
                <p>
                  We reserve the right to suspend or terminate your account at
                  any time, without prior notice or liability, for any reason
                  whatsoever, including without limitation if you breach these
                  Terms and Conditions. Upon termination, your right to use the
                  service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  7. Changes to Terms
                </h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. We will try to provide at
                  least 30 days' notice prior to any new terms taking effect.
                  What constitutes a material change will be determined at our
                  sole discretion.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
