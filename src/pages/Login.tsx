
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api';
import { useAuth } from '../AuthProvider';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await apiClient.login(username, password);
            login(data);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-bg-primary">
            <div className="card w-full max-w-sm p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 text-sm text-text-secondary">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm text-text-secondary">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                            required
                        />
                    </div>
                    <button type="submit" className="button w-full mt-2">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};
