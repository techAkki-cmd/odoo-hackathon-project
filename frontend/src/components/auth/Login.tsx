import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login submitted:', formData);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-xl border border-purple-100 overflow-hidden max-w-md mx-auto">
            <div className="px-6 py-5 border-b border-purple-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Sign in</h1>
                <p className="text-sm text-gray-600">Welcome back to RentalHub</p>
              </div>
            </div>
            <div className="px-6 py-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-purple-400 pl-10 py-2 ${errors.email ? 'border-red-300 focus:ring-red-300' : 'border-gray-300'}`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-purple-400 pl-10 pr-10 py-2 ${errors.password ? 'border-red-300 focus:ring-red-300' : 'border-gray-300'}`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-400"
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="text-purple-600 hover:underline">Forgot password?</Link>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 transition"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <div className="flex items-center gap-3 mt-6">
                  <div className="h-px bg-gray-200 w-full" />
                  <span className="text-xs text-gray-500">or</span>
                  <div className="h-px bg-gray-200 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <SocialButton label="Google" svgPath="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <SocialButton label="GitHub" svgPath="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                  Don’t have an account?{' '}
                  <Link to="/register" className="text-purple-600 hover:underline">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-xl border border-purple-100 bg-white shadow-xl max-w-md mx-auto">
              <div className="absolute -top-20 -left-12 w-72 h-72 rounded-full bg-purple-50" />
              <div className="absolute -bottom-24 -right-10 w-96 h-96 rounded-full bg-blue-50" />
              <div className="relative p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Rent smarter, live lighter</h2>
                <p className="text-gray-600 max-w-md">
                  Access quality products when you need them. No clutter, no commitment — just simple rentals.
                </p>
                <ul className="mt-8 space-y-3 text-gray-700">
                  <ListDot text="Trusted local providers" />
                  <ListDot text="Transparent pricing" />
                  <ListDot text="Fast booking flow" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ListDot({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
      {text}
    </li>
  );
}

function SocialButton({ label, svgPath }: { label: string; svgPath: string }) {
  return (
    <button className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 hover:bg-gray-50 transition">
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="currentColor" d={svgPath} />
      </svg>
      <span>{label}</span>
    </button>
  );
}

export default Login;
