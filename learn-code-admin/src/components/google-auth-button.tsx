import { Button } from "./ui/button";

interface GoogleAuthButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export default function GoogleAuthButton({
  isLoading,
  onClick,
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading}
      onClick={onClick}
      className="h-12 w-full cursor-pointer gap-3 rounded-xl border-white/15 bg-white text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-white/30 hover:bg-slate-100 disabled:opacity-70"
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#4285F4"
          d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"
        />
        <path
          fill="#34A853"
          d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9V33C9.3 39.7 16.1 44 24 44Z"
        />
        <path
          fill="#FBBC05"
          d="M12.8 27.7a12 12 0 0 1 0-7.4v-5.3H5.9a20 20 0 0 0 0 18l6.9-5.3Z"
        />
        <path
          fill="#EA4335"
          d="M24 12.1c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.9 29.5 4 24 4 16.1 4 9.3 8.3 5.9 15l6.9 5.3c1.6-4.7 6-8.2 11.2-8.2Z"
        />
      </svg>
      {isLoading ? "Connecting to Google..." : "Continue with Google"}
    </Button>
  );
}
