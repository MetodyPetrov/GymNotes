import MyWorkoutsPage from "@/app/components/Workouts/PersonalPage/MyWorkoutsPage";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <>
            <MyWorkoutsPage />
            {children}
        </>
    );
}
