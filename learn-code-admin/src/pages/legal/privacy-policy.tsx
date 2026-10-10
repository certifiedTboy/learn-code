import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-6 w-6" />
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
            <Shield className="w-64 h-64" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 text-foreground">
              Privacy Policy
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
                  1. Introduction
                </h2>
                <p>
                  Welcome to Learn Code. We value your privacy and are committed
                  to protecting your personal data. This Privacy Policy explains
                  how we collect, use, and safeguard your information when you
                  use our application.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  2. Information We Collect
                </h2>
                <p className="mb-3">
                  Our application utilizes Google Authentication to provide a
                  seamless and secure sign-in experience. When you authenticate
                  via Google, we exclusively collect the following basic profile
                  information:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                  <li>Email address</li>
                  <li>First name</li>
                  <li>Last name</li>
                  <li>Profile picture</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  3. Google Drive AppData Access (Progress Backup)
                </h2>
                <p className="mb-3">
                  To ensure that your learning progress is safely backed up and
                  synchronized across your devices, our application requests
                  access to your Google Drive AppData folder.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                  <li>
                    <strong>Optional Permission:</strong> Granting this
                    permission is strictly optional.
                  </li>
                  <li>
                    <strong>Usage:</strong> If granted, we will only use this
                    isolated app folder to store and retrieve your course
                    progress data. We do not have access to your personal files
                    on Google Drive.
                  </li>
                  <li>
                    <strong>Consequences of Denial:</strong> If you choose to
                    deny this permission, please note that your learning
                    progress will not be recorded or backed up across devices.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  4. Payment Processing
                </h2>
                <p>
                  We partner with trusted third-party payment gateways,
                  specifically <strong>Paystack</strong> and{" "}
                  <strong>Flutterwave</strong>, to securely process your
                  transactions for course subscriptions and purchases.
                  <br />
                  <br />
                  <strong>Important:</strong> At no point does Learn Code
                  collect, process, or keep a record of your credit card
                  numbers, bank account details, or any other sensitive payment
                  information on our servers. All payment data is securely
                  handled directly by these payment processors in accordance
                  with their strict security and privacy standards.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  5. Push Notifications
                </h2>
                <p>
                  With your permission, we may send push notifications or in-app
                  notifications to your selected devices. These notifications
                  may include course updates, reminders, promotional offers, and
                  other relevant information. You can opt-out of receiving these
                  notifications at any time by adjusting the permissions in your
                  device settings or within the application settings.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
