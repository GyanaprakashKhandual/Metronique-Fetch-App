'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  TestTube2, Menu, X, Users, Share2, Lock, 
  Download, Upload, MessageSquare, Zap, Cloud, Globe, ChevronRight,
  BarChart3, Palette, Workflow, Smartphone, Layers, Grid3x3, 
  FileText, Settings, Eye, Pen, Github, Send, Clock, 
  Briefcase, TrendingUp, Gauge, ArrowRight, CheckCircle,
  AlertCircle, Bug, Play, Link2, Brain, Calendar, Database, Sparkles,
  Zap as Lightning, BookOpen, Cog, Repeat2, GitBranch, RotateCcw, Lightbulb,
  Code2, Terminal, FileCode, Shield, Activity, Target, Cpu, Server,
  MonitorCheck, Box, Blocks, Binary, Braces, CheckCheck, FileJson, 
  Webhook, Network, Container, GitCommit
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* SVG Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated SVG Shapes */}
      <motion.div 
        className="fixed top-20 right-10 pointer-events-none"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path
            d="M100,20 L180,100 L100,180 L20,100 Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
            opacity="0.1"
          />
        </svg>
      </motion.div>

      {/* Navbar */}
      <motion.nav 
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-black/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TestTube2 className="w-6 h-6" />
              <span className="text-xl font-bold">Fetch</span>
              <span className="text-gray-400">|</span>
              <Briefcase className="w-5 h-5" />
              <span className="text-lg font-semibold">Metronique</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="hover:text-gray-600 transition">Features</a>
              <a href="#capabilities" className="hover:text-gray-600 transition">Capabilities</a>
              <a href="#integrations" className="hover:text-gray-600 transition">Integrations</a>
              <a href="#help" className="hover:text-gray-600 transition">Help</a>
              <button className="px-4 py-2 hover:bg-gray-100 rounded-lg transition" onClick={() => router.push('/auth')}>
                Sign In
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                Subscribe
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-t border-black/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block hover:text-gray-600">Features</a>
              <a href="#capabilities" className="block hover:text-gray-600">Capabilities</a>
              <a href="#integrations" className="block hover:text-gray-600">Integrations</a>
              <a href="#help" className="block hover:text-gray-600">Help</a>
              <button className="w-full px-4 py-2 border border-black rounded-lg">Sign In</button>
              <button className="w-full px-4 py-2 bg-black text-white rounded-lg">Subscribe</button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-20 px-4"
        style={{ opacity, scale }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              Connect. Test. Deploy.
              <br />
              <span className="bg-linear-to-r from-black to-gray-600 bg-clip-text text-transparent">
                AI-Powered Testing.
              </span>
            </h1>
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Revolutionary automated API testing platform powered by Anthropic and OpenAI. Simply connect your GitHub repository, 
            and watch as AI generates enterprise-grade test scripts using REST Assured, Cucumber, and TestNG with real database integration.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="px-8 py-4 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center">
              Start Testing Now <ChevronRight className="ml-2" />
            </button>
            <button className="px-8 py-4 border-2 border-black rounded-lg text-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center">
              <Eye className="mr-2 w-5 h-5" /> View Demo
            </button>
          </motion.div>

          {/* Animated SVG Illustration */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <svg className="w-full max-w-4xl mx-auto" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
              {/* Testing Dashboard Container */}
              <motion.rect
                x="50" y="50" width="700" height="300" rx="10"
                fill="white" stroke="black" strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
              
              {/* Test Results */}
              <motion.circle
                cx="100" cy="100" r="15"
                fill="#10b981" opacity="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              />
              
              <motion.line
                x1="130" y1="100" x2="350" y2="100"
                stroke="#10b981" strokeWidth="3" opacity="0.6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              />
              
              <motion.circle
                cx="100" cy="150" r="15"
                fill="#10b981" opacity="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              />
              
              <motion.line
                x1="130" y1="150" x2="400" y2="150"
                stroke="#10b981" strokeWidth="3" opacity="0.6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              />

              <motion.circle
                cx="100" cy="200" r="15"
                fill="#ef4444" opacity="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              />

              <motion.line
                x1="130" y1="200" x2="320" y2="200"
                stroke="#ef4444" strokeWidth="3" opacity="0.6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
              />

              <motion.circle
                cx="100" cy="250" r="15"
                fill="#10b981" opacity="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 2.2 }}
              />

              <motion.line
                x1="130" y1="250" x2="380" y2="250"
                stroke="#10b981" strokeWidth="3" opacity="0.6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 2.4 }}
              />

              {/* Progress Indicator */}
              <motion.rect
                x="600" y="100" width="150" height="150" rx="10"
                fill="#3b82f6" opacity="0.1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 2.6 }}
              />
            </svg>
          </motion.div>
        </div>
      </motion.section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-4">Intelligent API Testing</h2>
            <p className="text-xl text-gray-600 text-center mb-16">AI-powered features that revolutionize your testing workflow</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Github, title: "GitHub Integration", desc: "Connect your repository and AI automatically reads every line of code to understand your API structure" },
              { icon: Brain, title: "AI-Powered Analysis", desc: "Anthropic and OpenAI analyze your routes, models, and controllers to generate intelligent test cases" },
              { icon: FileCode, title: "Auto Script Generation", desc: "Generates enterprise-grade test scripts using REST Assured, Cucumber, and TestNG automatically" },
              { icon: Database, title: "Real Database Testing", desc: "Connect your actual database for genuine API testing with real data integration" },
              { icon: Terminal, title: "Built-in Code Editor", desc: "Professional code editor to modify test scripts, frequencies, and load parameters in real-time" },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption and security protocols to protect your code and credentials" },
              { icon: Users, title: "Team Collaboration", desc: "Invite team members, assign roles, and collaborate on testing workflows seamlessly" },
              { icon: Activity, title: "Real-Time Monitoring", desc: "Watch tests execute in real-time with detailed logs and performance metrics" },
              { icon: CheckCheck, title: "Multi-Framework Support", desc: "Supports Node.js, Express, MongoDB, MySQL, PostgreSQL, C#, and more backends" },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Detailed reports with pass/fail rates, performance metrics, and bottleneck identification" },
              { icon: Zap, title: "Load Testing", desc: "Configure test frequencies, concurrent users, and stress test your APIs with AI optimization" },
              { icon: Webhook, title: "CI/CD Integration", desc: "Seamlessly integrate with your deployment pipeline for automated testing on every commit" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-xl border border-black/10 hover:border-black/30 transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <feature.icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-4">Revolutionary Capabilities</h2>
            <p className="text-xl text-gray-600 text-center mb-16">Features that redefine automated API testing</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Intelligent Code Reading",
                desc: "AI comprehensively analyzes your GitHub repository, understanding routes, models, controllers, and database schemas to create contextual test cases",
                icon: Brain
              },
              {
                title: "Enterprise-Grade Test Scripts",
                desc: "Automatically generates professional-level automation scripts following multinational company standards with REST Assured, Cucumber, and TestNG",
                icon: Code2
              },
              {
                title: "Live Database Integration",
                desc: "Unlike other tools that just generate scripts, we actually test APIs against your real database with proper authentication and validation",
                icon: Database
              },
              {
                title: "Interactive Script Editor",
                desc: "Full-featured code editor lets you modify test scripts, adjust parameters, change assertions, and rerun tests instantly",
                icon: Terminal
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-xl border border-black/10"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <feature.icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testing Workflow */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 text-center mb-16">From connection to comprehensive testing in minutes</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: "01", 
                title: "Connect Repository", 
                desc: "Link your GitHub backend repository securely",
                icon: Github
              },
              { 
                step: "02", 
                title: "AI Analysis", 
                desc: "AI reads all files and understands your API structure",
                icon: Brain
              },
              { 
                step: "03", 
                title: "Generate Scripts", 
                desc: "Auto-generates enterprise-level test automation scripts",
                icon: FileCode
              },
              { 
                step: "04", 
                title: "Execute Tests", 
                desc: "Run tests against real database and get detailed reports",
                icon: Play
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-xl border border-black/10 text-center relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <step.icon className="w-16 h-16 mx-auto mt-4 mb-4" />
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Technologies */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-4">Universal Backend Support</h2>
            <p className="text-xl text-gray-600 text-center mb-16">Works with any backend technology stack</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              "Node.js",
              "Express.js",
              "MongoDB",
              "MySQL",
              "PostgreSQL",
              "Mongoose",
              "JavaScript",
              "TypeScript",
              "C#",
              ".NET Core",
              "Java Spring",
              "Python Django"
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-lg border border-black/10 text-center cursor-pointer hover:border-black/30 transition"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Server className="w-12 h-12 mx-auto mb-3" />
                <p className="font-semibold">{tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-4">Powerful Integrations</h2>
            <p className="text-xl text-gray-600 text-center mb-16">Connect with your development ecosystem</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "GitHub", color: "bg-gray-50", accent: "from-gray-400 to-gray-600", icon: Github },
              { title: "Anthropic Claude", color: "bg-orange-50", accent: "from-orange-400 to-orange-600", icon: Brain },
              { title: "OpenAI", color: "bg-green-50", accent: "from-green-400 to-green-600", icon: Sparkles },
              { title: "Slack", color: "bg-purple-50", accent: "from-purple-400 to-purple-600", icon: Send },
              { title: "Jira", color: "bg-blue-50", accent: "from-blue-400 to-blue-600", icon: Target },
              { title: "Jenkins", color: "bg-red-50", accent: "from-red-400 to-red-600", icon: Container },
              { title: "Docker", color: "bg-indigo-50", accent: "from-indigo-400 to-indigo-600", icon: Box },
              { title: "Kubernetes", color: "bg-pink-50", accent: "from-pink-400 to-pink-600", icon: Network }
            ].map((integration, idx) => (
              <motion.div
                key={idx}
                className={`${integration.color} p-8 rounded-xl cursor-pointer transition group`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`bg-linear-to-br ${integration.accent} h-24 rounded-lg mb-4 group-hover:shadow-lg transition flex items-center justify-center`}>
                  <integration.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold">{integration.title}</h3>
                <p className="text-gray-600 text-sm mt-2">Seamlessly integrated</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics & Reports */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-4">Comprehensive Analytics</h2>
            <p className="text-xl text-gray-600 text-center mb-16">Detailed insights into your API testing performance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Real-Time Dashboard",
                desc: "Monitor test execution in real-time with live logs, status updates, and performance metrics as tests run",
                icon: MonitorCheck
              },
              {
                title: "Detailed Test Reports",
                desc: "Comprehensive reports showing pass/fail rates, execution times, error logs, and API response analysis",
                icon: BarChart3
              },
              {
                title: "Performance Metrics",
                desc: "Track API response times, throughput, error rates, and identify performance bottlenecks automatically",
                icon: Gauge
              },
              {
                title: "Export & Share",
                desc: "Export test results in multiple formats (PDF, CSV, JSON) and share with your team or stakeholders",
                icon: Download
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-xl border border-black/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <feature.icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testing Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-center mb-4">Advanced Testing Features</h2>
            <p className="text-xl text-gray-600 text-center mb-16">Everything you need for professional API testing</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Automated Test Generation",
              "Custom Test Scenarios",
              "Load & Stress Testing",
              "Security Testing",
              "Regression Testing",
              "Integration Testing",
              "API Documentation",
              "Test Scheduling",
              "Version Control",
              "Rollback Support",
              "Multi-Environment Testing",
              "Continuous Testing"
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-lg border border-black/10 text-center cursor-pointer hover:border-black/30 transition"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-semibold text-lg">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6">Ready to revolutionize your API testing?</h2>
          <p className="text-xl text-gray-600 mb-8">Join teams using Fetch by Metronique to deliver bulletproof APIs with confidence</p>
          <button className="px-10 py-5 bg-black text-white rounded-lg text-xl font-semibold hover:bg-gray-800 transition inline-flex items-center">
            Start Free Trial <ArrowRight className="ml-2" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">API Testing</a></li>
                <li><a href="#" className="hover:text-white transition">Load Testing</a></li>
                <li><a href="#" className="hover:text-white transition">Security Testing</a></li>
                <li><a href="#" className="hover:text-white transition">Reports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">System Status</a></li>
                <li><a href="#" className="hover:text-white transition">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Forums</a></li>
                <li><a href="#" className="hover:text-white transition">Slack Channel</a></li>
                <li><a href="#" className="hover:text-white transition">Events</a></li>
                <li><a href="#" className="hover:text-white transition">Partners</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            {[
              { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z", name: "Instagram" },
              { icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", name: "Facebook" },
              { icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z", name: "Twitter" },
              { icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", name: "YouTube" },
              { icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", name: "LinkedIn" },
              { icon: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12", name: "GitHub" }
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href="#"
                className="hover:opacity-70 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </motion.a>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TestTube2 className="w-5 h-5" />
              <span>© 2024 Fetch by Metronique. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}