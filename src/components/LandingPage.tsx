import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [animatedText, setAnimatedText] = useState('wealth');
  const [displayText, setDisplayText] = useState('wealth');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const texts = ['wealth', 'freedom', 'confidence'];
  const period = 1000;
  const [delta, setDelta] = useState(80);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [displayText, isDeleting]);

  const tick = () => {
    let i = loopNum % texts.length;
    let fullText = texts[i];
    let updatedText = isDeleting 
      ? fullText.substring(0, displayText.length - 1) 
      : fullText.substring(0, displayText.length + 1);

    setDisplayText(updatedText);
    setAnimatedText(fullText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[rgb(88,0,159)]">
      {/* Navigation */}
      <header className="relative z-10 w-full py-5 px-6 md:px-12 flex items-center">
        <Link to="/landing" className="text-3xl font-bold text-white mr-12">FiBi.</Link>
        
        <nav className="hidden md:flex items-center space-x-8 flex-1">
          <Link to="/landing" className="text-white hover:text-white font-medium">Home</Link>
          <Link to="/landing/about" className="text-white hover:text-white font-medium">What is FiBi?</Link>
          <Link to="/landing/learn" className="text-white hover:text-white font-medium">Learn</Link>
          <Link to="/landing/share" className="text-white hover:text-white font-medium">Share FiBi</Link>
          <Link to="/landing/pricing" className="text-white hover:text-white font-medium">Pricing</Link>
        </nav>

        <div className="flex items-center space-x-4 ml-auto">
          <Link to="/login" className="text-white hover:text-white font-medium">Log in</Link>
          <Link 
            to="/signup" 
            className="bg-[rgb(147,51,234)] hover:bg-purple-800 text-white hover:text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative z-10 flex-1 flex flex-col items-center justify-center py-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl w-full text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
              Build <span className="relative inline-block min-w-[160px]">
                <span className="relative">
                  {displayText}
                  <span className="inline-block h-full w-1 bg-white animate-blink ml-1 align-middle">&#8203;</span>
                </span>
              </span> with <br />
              <span className="relative">
                Finance
                <span className="absolute inset-x-0 bottom-2 h-1 bg-white opacity-50"></span>
              </span>
              <span className="ml-2 relative">
                Builder
                <span className="absolute inset-x-0 bottom-2 h-1 bg-white opacity-50"></span>
              </span>
            </h1>
            <p className="text-xl text-purple-100 mb-10 mx-auto max-w-2xl">
              Create a friendly, flexible plan and spend it well with FiBi.
            </p>
            <Link 
              to="/signup" 
              className="inline-block bg-[rgb(147,51,234)] hover:bg-purple-800 text-white hover:text-white px-10 py-4 rounded-md font-medium text-lg transition-colors"
            >
              Start Your Free Trial
            </Link>
            <p className="text-purple-200 mt-6">It's easy! No credit card required.</p>
          </div>
        </section>
      </main>

      {/* Wave Divider */}
      <div className="relative z-10">
        <div className="bg-[rgb(88,0,159)] relative overflow-hidden">          
          {/* Wave SVG */}
          <svg className="w-full relative z-10" style={{ display: 'block' }} preserveAspectRatio="none" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0L40,16C80,32,160,64,240,69.3C320,75,400,53,480,42.7C560,32,640,32,720,42.7C800,53,880,75,960,80C1040,85,1120,75,1200,58.7C1280,43,1360,21,1400,10.7L1440,0L1440,120L1400,120C1360,120,1280,120,1200,120C1120,120,1040,120,960,120C880,120,800,120,720,120C640,120,560,120,480,120C400,120,320,120,240,120C160,120,80,120,40,120L0,120Z" fill="rgb(147,51,234)" />
            <path d="M0,42L40,48C80,53,160,64,240,64C320,64,400,53,480,48C560,43,640,43,720,53.3C800,64,880,85,960,85.3C1040,85,1120,64,1200,53.3C1280,43,1360,43,1400,42.7L1440,43L1440,120L1400,120C1360,120,1280,120,1200,120C1120,120,1040,120,960,120C880,120,800,120,720,120C640,120,560,120,480,120C400,120,320,120,240,120C160,120,80,120,40,120L0,120Z" fill="rgba(147,51,234,0.8)" />
            <path d="M0,85L40,90.7C80,96,160,107,240,101.3C320,96,400,75,480,74.7C560,75,640,96,720,96C800,96,880,75,960,74.7C1040,75,1120,96,1200,96C1280,96,1360,75,1400,64L1440,53L1440,120L1400,120C1360,120,1280,120,1200,120C1120,120,1040,120,960,120C880,120,800,120,720,120C640,120,560,120,480,120C400,120,320,120,240,120C160,120,80,120,40,120L0,120Z" fill="rgba(147,51,234,0.6)" />
          </svg>
        </div>
      </div>

      {/* Why FiBi Works Section */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why FiBi Works</h2>
            <p className="text-xl text-gray-600">92% of FiBi users feel less money stress since starting. You're next.</p>
          </div>

          <div className="grid grid-cols-1 max-w-3xl mx-auto gap-12 items-center">
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Learn our secret sauce</h3>
                  <p className="text-gray-700">Our method has only one ingredient: Give every dollar a job. We'll teach you how.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fund your wildest dreams...and your water bill</h3>
                  <p className="text-gray-700">Use the app to define priorities and guide spending decisions toward the life you want.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Live spendfully</h3>
                  <p className="text-gray-700">Improve relationships, sleep better at night, and achieve your goals through intentional spending.</p>
                </div>
              </div>

              <div className="mt-8">
                <Link 
                  to="/signup" 
                  className="inline-block bg-[rgb(147,51,234)] hover:bg-purple-800 text-white hover:text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Start Your Free 34 Day Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-6 md:px-12 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and social media */}
            <div className="col-span-1">
              <Link to="/landing" className="text-3xl font-bold text-primary">FiBi.</Link>
              
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-500 hover:text-gray-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center max-w-md">
                  <input 
                    type="email" 
                    placeholder="Get our newsletter" 
                    className="px-4 py-2 border border-gray-300 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button className="bg-primary text-white hover:text-white px-4 py-2 rounded-r-md hover:bg-purple-800 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product column */}
            <div className="col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Why FiBi</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">How it works</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">FiBi Tutorial</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Customer Case Studies</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Integrations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Security</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">System Status</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Product Updates</a></li>
              </ul>
            </div>
            
            {/* Company column */}
            <div className="col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-600">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Contact Sales</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Partners</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Media resources</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Accessibility</a></li>
              </ul>
            </div>
            
            {/* Learn column */}
            <div className="col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">Learn</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Budgeting Guide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Savings Tips</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Investing Basics</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Debt Management</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Financial Freedom</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-600">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom footer content */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} FiBi Finance, Inc. All rights reserved</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-500">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-500">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 