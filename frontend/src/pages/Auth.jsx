import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl overflow-hidden dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Welcome to Lexiq.ai
            </CardTitle>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              {activeTab === 'signin' 
                ? 'Sign in to access your account' 
                : 'Create an account to get started'}
            </p>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-0">
                <div className="space-y-4">
                  <SignIn 
                     afterSignIn={() => {
                        navigate("/ai/dashboard");
                     }}
                    appearance={{
                      elements: {
                        rootBox: 'w-full',
                        card: 'shadow-none w-full p-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700',
                        socialButtonsBlockButtonText: 'text-gray-700 dark:text-gray-200',
                        dividerLine: 'bg-gray-200 dark:bg-gray-600',
                        dividerText: 'text-gray-500 dark:text-gray-400',
                        formFieldLabel: 'text-gray-700 dark:text-gray-300',
                        formFieldInput: 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500',
                        footerActionText: 'text-gray-600 dark:text-gray-400',
                        footerActionLink: 'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300',
                        formButtonPrimary: 'bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600'
                      }
                    }}
                    
                  />
                </div>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <div className="space-y-4">
                  <SignUp 
                  
                    afterSignUp={() => navigate('/ai/dashboard')}
                    appearance={{
                      elements: {
                        rootBox: 'w-full',
                        card: 'shadow-none w-full p-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700',
                        socialButtonsBlockButtonText: 'text-gray-700 dark:text-gray-200',
                        dividerLine: 'bg-gray-200 dark:bg-gray-600',
                        dividerText: 'text-gray-500 dark:text-gray-400',
                        formFieldLabel: 'text-gray-700 dark:text-gray-300',
                        formFieldInput: 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500',
                        footerActionText: 'text-gray-600 dark:text-gray-400',
                        footerActionLink: 'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300',
                        formButtonPrimary: 'bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600'
                      }
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {activeTab === 'signin' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <button
              onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {activeTab === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>

      {/* <SignedIn>
        <div className="fixed top-4 right-4">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: 'h-10 w-10',
                avatarBox: 'h-full w-full',
              }
            }}
          />
        </div>
      </SignedIn> */}
    </div>
  );
};

export default Auth;