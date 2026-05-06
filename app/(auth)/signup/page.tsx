import { SignupForm } from "@/components/form/singup-form";

export default function SignupPage() {
  return (
    <div className="bg-background flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
