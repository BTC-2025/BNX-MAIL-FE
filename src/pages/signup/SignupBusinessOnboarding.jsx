import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../../context/SignupContext';
import { businessAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SignupBusinessOnboarding = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useSignup();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleNext = (e) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (!formData.businessType || !formData.industry || !formData.companySize) {
                setError('Please fill out the required fields.');
                return;
            }
            setStep(2);
        } else {
            if (!formData.acceptTerms) {
                setError('You must accept the terms and conditions to proceed.');
                return;
            }
            submitOnboarding();
        }
    };

    const submitOnboarding = async () => {
        setLoading(true);
        try {
            const payload = {
                businessType: formData.businessType,
                industry: formData.industry,
                companySize: formData.companySize,
                businessWebsite: formData.businessWebsite,
                businessAddress: formData.businessAddress,
                timeZone: formData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: formData.language || 'en',
                companyLogo: formData.companyLogo,
                profilePhoto: formData.profilePhoto,
                acceptTerms: formData.acceptTerms
            };

            await businessAPI.onboard(payload);
            toast.success('Business onboarding complete!');
            
            // Force a full reload to the inbox so that user data is refreshed
            window.location.href = '/all-mail';
        } catch (err) {
            setError(err.response?.data?.message || 'Onboarding failed');
            setLoading(false);
        }
    };

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateFormData({ [field]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold">Welcome to BNX Mail for Business</h2>
                    <p className="text-gray-400 mt-2">Let's get your organization set up.</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 h-2 rounded-full mb-8">
                    <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: step === 1 ? '50%' : '100%' }}
                    />
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleNext}>
                    {step === 1 ? (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-xl font-semibold mb-4 text-indigo-300">Step 1: Business Profile</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Business Type *</label>
                                    <select
                                        value={formData.businessType}
                                        onChange={e => updateFormData({ businessType: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none"
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="LLC">LLC</option>
                                        <option value="Corporation">Corporation</option>
                                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                                        <option value="Non-Profit">Non-Profit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Industry *</label>
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={e => updateFormData({ industry: e.target.value })}
                                        placeholder="e.g. Technology, Retail"
                                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Company Size *</label>
                                    <select
                                        value={formData.companySize}
                                        onChange={e => updateFormData({ companySize: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none"
                                        required
                                    >
                                        <option value="">Select size</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201+">201+ employees</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Website URL</label>
                                    <input
                                        type="url"
                                        value={formData.businessWebsite}
                                        onChange={e => updateFormData({ businessWebsite: e.target.value })}
                                        placeholder="https://"
                                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Business Address</label>
                                    <textarea
                                        value={formData.businessAddress}
                                        onChange={e => updateFormData({ businessAddress: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none"
                                        rows="2"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-xl font-semibold mb-4 text-indigo-300">Step 2: Branding & Preferences</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Profile Picture (Owner)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => handleFileUpload(e, 'profilePhoto')}
                                        className="w-full p-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-900 file:text-indigo-300 hover:file:bg-indigo-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Company Logo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => handleFileUpload(e, 'companyLogo')}
                                        className="w-full p-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-900 file:text-indigo-300 hover:file:bg-indigo-800"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Time Zone</label>
                                    <select
                                        value={formData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                                        onChange={e => updateFormData({ timeZone: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">America/New_York (EST)</option>
                                        <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                                        <option value="Europe/London">Europe/London (GMT)</option>
                                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Language</label>
                                    <select
                                        value={formData.language || 'en'}
                                        onChange={e => updateFormData({ language: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.acceptTerms}
                                        onChange={e => updateFormData({ acceptTerms: e.target.checked })}
                                        className="w-5 h-5 text-indigo-500 rounded bg-gray-700 border-gray-600 focus:ring-indigo-500" 
                                    />
                                    <span className="text-sm text-gray-300">
                                        I accept the <a href="/terms" className="text-indigo-400 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</a>.
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <div className={step === 1 ? "ml-auto" : ""}>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
                            >
                                {step === 1 ? 'Next' : (loading ? 'Finishing setup...' : 'Complete Onboarding')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupBusinessOnboarding;
