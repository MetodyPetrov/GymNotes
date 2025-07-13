import WorkoutManager from "@/app/components/Workouts/Manager/WorkoutManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <>
            <WorkoutManager />
            {children}
        </>
    );
}
