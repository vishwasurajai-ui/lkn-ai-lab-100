import Image from "next/image";

// ===============================
// v0.0.0 — LKN AI Lab starter
// ===============================
// First local spin-up page.
// Students: find EDIT_ME below, change the text, save, then push.
// ===============================

// 👉 Search for EDIT_ME — change this string, then push to GitHub
const EDIT_ME = "Welcome to LKN AI Lab";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/lkn-wordmark.png"
          alt="LKN AI Lab"
          width={180}
          height={30}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            HELLO WORLD ABC
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Build and deploy your first AI-powered app.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <div className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background md:w-auto md:min-w-[158px]">
            <Image
              src="/lkn-icon.png"
              alt=""
              width={16}
              height={16}
            />
            Level 100
          </div>
          <div className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 dark:border-white/[.145] md:w-auto md:min-w-[158px]">
            {EDIT_ME}
          </div>
        </div>
      </main>
    </div>
  );
}
