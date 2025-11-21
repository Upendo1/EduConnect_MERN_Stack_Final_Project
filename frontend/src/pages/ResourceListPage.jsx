import React from "react";
import { Link } from "react-router-dom";
 import illustration from "./illustration.png";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="w-full py-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">EduConnect</h1>

          <div className="space-x-6 hidden sm:block">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Resources</Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 py-16">
          
          {/* TEXT SIDE */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Discover, Share, and Learn with  
              <span className="text-indigo-600"> EduConnect</span>
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              A simple and powerful platform where teachers upload resources and students easily access them.
            </p>

            <div className="mt-6 flex gap-4">
              <Link
                to="/resources"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Browse Resources
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              >
                Teacher Login
              </Link>
            </div>
          </div>

          {/* IMAGE / ILLUSTRATION */}
          <div className="flex justify-center">
          
           <img
          src={illustration}
          alt="Learning illustration"
          className="w-4/5 max-w-md"
        />
          </div>
        </div>
      </header>

      {/* FEATURE SECTION */}
      <section className="bg-white py-14 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800">
            What You Can Do
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              title="Upload Learning Materials"
              description="Teachers can upload documents, videos, and files easily."
              icon="📤"
            />
            <FeatureCard
              title="Access From Anywhere"
              description="Students can download or view resources in seconds."
              icon="🌍"
            />
            <FeatureCard
              title="Organized Dashboard"
              description="Teachers get analytics, upload stats, and resource management."
              icon="📊"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-600 border-t bg-gray-50">
        © {new Date().getFullYear()} EduConnect. All Rights Reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="p-6 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}