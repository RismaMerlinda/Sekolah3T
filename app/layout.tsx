<<<<<<< HEAD
import ToastProvider from "@/components/providers/ToastProvider";
=======
>>>>>>> 77e6c2b176af517e26347389d6172186670b99c9
import "./globals.css";

export const metadata = {
    title: "SAHABAT3T",
    description: "Platform Pendidikan Daerah 3T",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
<<<<<<< HEAD
            <body>
                <ToastProvider />
                {children}
            </body>
=======
            <body>{children}</body>
>>>>>>> 77e6c2b176af517e26347389d6172186670b99c9
        </html>
    );
}
