import MyWorkoutsPage from "./MyWorkoutsPage";

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
