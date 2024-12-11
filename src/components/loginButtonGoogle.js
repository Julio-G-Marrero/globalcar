const LoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:4000/auth/google';
    };

    return <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>;
};

export default LoginButton;
