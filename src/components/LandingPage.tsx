import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[rgb(88,0,159)]">
      {/* Texture overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-purple-600/30"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-10 w-full py-4 px-6 md:px-12 flex items-center justify-between">
        <Link to="/landing" className="text-3xl font-bold text-white">FiBi.</Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/landing" className="text-white hover:text-purple-200 font-medium">Home</Link>
          <Link to="/landing/about" className="text-white hover:text-purple-200 font-medium">What is FiBi?</Link>
          <Link to="/landing/learn" className="text-white hover:text-purple-200 font-medium">Learn</Link>
          <Link to="/landing/share" className="text-white hover:text-purple-200 font-medium">Share FiBi</Link>
          <Link to="/landing/pricing" className="text-white hover:text-purple-200 font-medium">Pricing</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-white hover:text-purple-200 font-medium">Log In</Link>
          <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
            Start Your Free Trial
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative z-10 flex-1 flex flex-col md:flex-row items-center py-16 px-6 md:px-12 lg:px-20">
          <div className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Build wealth with <br />
              <span className="relative">
                Finance
                <span className="absolute inset-x-0 bottom-2 h-1 bg-white opacity-50"></span>
              </span>
              <span className="ml-2 relative">
                Builder
                <span className="absolute inset-x-0 bottom-2 h-1 bg-white opacity-50"></span>
              </span>
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Create a friendly, flexible plan and spend it well with FiBi.
            </p>
            <Link 
              to="/signup" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
            >
              Start Your Free Trial
            </Link>
            <p className="text-purple-200 mt-4">It's easy! No credit card required.</p>
          </div>

          <div className="md:w-1/2 relative">
            {/* Phone Mockup - matching the reference image */}
            <div className="relative flex justify-center">
              <div className="w-64 md:w-80 bg-black rounded-3xl p-3 border-4 border-black shadow-2xl relative z-20">
                <div className="rounded-2xl overflow-hidden bg-white h-full">
                  {/* App Display */}
                  <div className="bg-gray-50 p-4">
                    <div className="text-center text-sm font-medium mb-1">This Month</div>
                    <div className="text-2xl font-bold text-green-600 mb-1 text-center">$1,000</div>
                    <div className="text-xs text-gray-600 mb-2 text-center">Ready to Assign</div>
                    <button className="w-full bg-green-600 text-white py-1 rounded-md text-sm">
                      Assign Money
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Monthly</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Mortgage</span>
                          <div>
                            <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full" style={{ width: '90%' }}></div>
                            </div>
                            <div className="text-xs font-medium text-right">$1,200</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Electric</span>
                          <div>
                            <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
                            </div>
                            <div className="text-xs font-medium text-right">$450</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Phone</span>
                          <div>
                            <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full" style={{ width: '40%' }}></div>
                            </div>
                            <div className="text-xs font-medium text-right">$70</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Goals</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Vacation</span>
                          <div>
                            <div className="w-24 h-2 bg-yellow-100 rounded-full overflow-hidden">
                              <div className="bg-yellow-500 h-full" style={{ width: '75%' }}></div>
                            </div>
                            <div className="text-xs font-medium text-right">$1,850</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">New Laptop</span>
                          <div>
                            <div className="w-24 h-2 bg-yellow-100 rounded-full overflow-hidden">
                              <div className="bg-yellow-500 h-full" style={{ width: '40%' }}></div>
                            </div>
                            <div className="text-xs font-medium text-right">$625</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Navigation Dots */}
                  <div className="flex justify-center space-x-2 p-4">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Decorative money illustrations */}
              <div className="absolute top-1/4 -left-4 w-12 h-8 bg-green-400 rounded-sm transform -rotate-12 z-10">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">$</div>
              </div>
              <div className="absolute bottom-1/3 -right-4 w-10 h-7 bg-green-400 rounded-sm transform rotate-30 z-10">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">$</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Wave Divider */}
      <div className="relative z-10">
        <div className="bg-[rgb(88,0,159)] relative overflow-hidden">
          {/* Same texture overlay as in hero section */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '24px 24px'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-purple-600/30"></div>
          </div>
          
          {/* Wave SVG on top of texture */}
          <svg className="w-full relative z-10" style={{ display: 'block' }} preserveAspectRatio="none" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0L40,16C80,32,160,64,240,69.3C320,75,400,53,480,42.7C560,32,640,32,720,42.7C800,53,880,75,960,80C1040,85,1120,75,1200,58.7C1280,43,1360,21,1400,10.7L1440,0L1440,120L1400,120C1360,120,1280,120,1200,120C1120,120,1040,120,960,120C880,120,800,120,720,120C640,120,560,120,480,120C400,120,320,120,240,120C160,120,80,120,40,120L0,120Z" fill="#4ade80" />
            <path d="M0,42L40,48C80,53,160,64,240,64C320,64,400,53,480,48C560,43,640,43,720,53.3C800,64,880,85,960,85.3C1040,85,1120,64,1200,53.3C1280,43,1360,43,1400,42.7L1440,43L1440,120L1400,120C1360,120,1280,120,1200,120C1120,120,1040,120,960,120C880,120,800,120,720,120C640,120,560,120,480,120C400,120,320,120,240,120C160,120,80,120,40,120L0,120Z" fill="#22c55e" />
            <path d="M0,85L40,90.7C80,96,160,107,240,101.3C320,96,400,75,480,74.7C560,75,640,96,720,96C800,96,880,75,960,74.7C1040,75,1120,96,1200,96C1280,96,1360,75,1400,64L1440,53L1440,120L1400,120C1360,120,1280,120,1200,120C1120,120,1040,120,960,120C880,120,800,120,720,120C640,120,560,120,480,120C400,120,320,120,240,120C160,120,80,120,40,120L0,120Z" fill="#16a34a" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
                  className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Start Your Free 34 Day Trial
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 flex justify-center md:justify-end">
                {/* Desktop App Screenshot */}
                <div className="shadow-2xl rounded-xl overflow-hidden border-8 border-white max-w-sm">
                  <div className="bg-[#191970] text-white p-3 flex items-center space-x-2 text-xs">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center">Budget</div>
                  </div>
                  <div className="bg-white p-3">
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="text-center text-sm font-medium mb-1">This Month</div>
                      <div className="text-2xl font-bold text-green-600 mb-1">$1,000</div>
                      <div className="text-xs text-gray-600 mb-2">Ready to Assign</div>
                      <button className="w-full bg-green-600 text-white py-1 rounded-md text-sm">
                        Assign Money
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Monthly</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Mortgage</span>
                            <div>
                              <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full" style={{ width: '90%' }}></div>
                              </div>
                              <div className="text-xs font-medium text-right">$1,200</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Electric</span>
                            <div>
                              <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
                              </div>
                              <div className="text-xs font-medium text-right">$450</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Phone</span>
                            <div>
                              <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full" style={{ width: '40%' }}></div>
                              </div>
                              <div className="text-xs font-medium text-right">$70</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Goals</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Vacation</span>
                            <div>
                              <div className="w-24 h-2 bg-yellow-100 rounded-full overflow-hidden">
                                <div className="bg-yellow-500 h-full" style={{ width: '75%' }}></div>
                              </div>
                              <div className="text-xs font-medium text-right">$1,850</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">New Laptop</span>
                            <div>
                              <div className="w-24 h-2 bg-yellow-100 rounded-full overflow-hidden">
                                <div className="bg-yellow-500 h-full" style={{ width: '40%' }}></div>
                              </div>
                              <div className="text-xs font-medium text-right">$625</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile App Screenshot - smaller and positioned to overlap */}
                <div className="absolute -bottom-10 -right-4 shadow-2xl rounded-xl overflow-hidden border-8 border-white w-48 bg-white">
                  <div className="bg-gray-100 py-1 px-2 flex items-center justify-between text-xs">
                    <div className="font-medium">Filter Transactions</div>
                    <div className="text-gray-500">×</div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="space-y-1">
                      <div className="bg-gray-100 h-4 w-full rounded"></div>
                      <div className="bg-gray-100 h-4 w-3/4 rounded"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-medium">Date</div>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        This Month
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-100 h-3 w-full rounded"></div>
                      <div className="bg-gray-100 h-3 w-full rounded"></div>
                      <div className="bg-gray-100 h-3 w-2/3 rounded"></div>
                    </div>
                    <div className="bg-green-500 text-white text-xs py-1 rounded text-center">
                      Apply Filters
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-400 rounded-full"></div>
                </div>
                <div className="absolute -top-10 left-1/4 w-8 h-8 bg-blue-200 rounded-full"></div>
                <div className="absolute bottom-1/4 -left-4 w-10 h-10 bg-purple-200 rounded-full"></div>
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
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
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
                  <button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-purple-800 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product column */}
            <div className="col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Why FiBi</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">How it works</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">FiBi Tutorial</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Customer Case Studies</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Integrations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Security</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">System Status</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Product Updates</a></li>
              </ul>
            </div>
            
            {/* Company column */}
            <div className="col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Contact Sales</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Partners</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Media resources</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Accessibility</a></li>
              </ul>
            </div>
            
            {/* Learn column */}
            <div className="col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">Learn</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Budgeting Guide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Savings Tips</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Investing Basics</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Debt Management</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Financial Freedom</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom footer content */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} FiBi Finance, Inc. All rights reserved</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 