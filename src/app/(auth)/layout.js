export default function AuthLayout({ children }) {
    return (
        <div className="auth-layout min-h-screen bg-gray-50">
            {/* Auth specific navigation or wrapper could go here */}
            <main>{children}</main>
        </div>
    );
}
