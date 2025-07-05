export default async function Delay({ children, duration }: { children: React.ReactNode; duration: number }) {
    await new Promise(resolve => setTimeout(resolve, duration));
    return <>{children}</>;
}