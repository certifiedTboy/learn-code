import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  MessageCircleCheck,
} from "lucide-react";
import { Link } from "wouter";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <MessageSquare className="h-6 w-6" />
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
      <main className="max-w-4xl mx-auto pt-32 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our courses, need technical support, or want to
            partner with us? We're here to help. Reach out to us through any of
            the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-muted-foreground text-sm mb-4">
              For general inquiries and support.
            </p>
            <a
              href="mailto:admin.learncode@gmail.com"
              className="text-primary font-medium hover:underline"
            >
              admin.learncode@gmail.com
            </a>
          </div>

          {/* Phone */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Mon-Fri from 8am to 5pm.
            </p>
            <a
              href="tel:+15551234567"
              className="text-primary font-medium hover:underline"
            >
              +234 (802) 467-3159
            </a>
          </div>

          {/* Office */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500">
              <MessageCircleCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Whatsapp</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Message us on Whatsapp, Avalable 24/7
            </p>
            <a
              href="tel:+15551234567"
              className="text-primary font-medium hover:underline"
            >
              +234 (802) 467-3159
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
