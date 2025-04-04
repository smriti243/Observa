import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cloud, BarChart2, Lock, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import LoadingAnimation from "../components/loadingAnimation";
import "../output.css";
import "../index.css";
import awsLogo from "../assets/download.png";
import azureLogo from "../assets/azure.png";
import gcpLogo from "../assets/gcp.png";
import DigLogo from "../assets/DigO.png";

const cloudProviders = [
  { name: "AWS", logo: awsLogo, description: "Amazon Web Services" },
  { name: "Azure", logo: azureLogo, description: "Microsoft Azure" },
  { name: "GCP", logo: gcpLogo, description: "Google Cloud Platform" },
  { name: "DigitalOcean", logo: DigLogo, description: "DigitalOcean Cloud" },
];

const features = [
  {
    icon: BarChart2,
    title: "Advanced Analytics",
    description: "Gain deep insights with our powerful analytics engine",
  },
  {
    icon: Cloud,
    title: "Multi-Cloud Support",
    description: "Seamlessly integrate with major cloud providers",
  },
  {
    icon: Lock,
    title: "Enterprise-Grade Security",
    description: "Keep your data safe with our robust security measures",
  },
  {
    icon: Zap,
    title: "Real-Time Monitoring",
    description: "Stay updated with real-time performance metrics",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-y-auto overflow-x-hidden custom-scrollbar">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Welcome to Observa
        </h1>
        <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Advanced cloud monitoring and analytics for modern enterprises. Gain
          valuable insights across multiple cloud platforms.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/dashboard" className="flex items-center">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Choose Your Cloud Provider
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cloudProviders.map((provider) => (
            <div
              key={provider.name}
              className="bg-gray-800 rounded-xl p-6 text-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <img
                src={provider.logo}
                alt={provider.name}
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
              <p className="text-gray-400">{provider.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Why Choose Observa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <feature.icon className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Optimize Your Cloud Infrastructure?
        </h2>
        <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Join thousands of companies that trust Observa for their cloud
          monitoring needs.
        </p>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/dashboard" className="flex items-center">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <footer className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-400">
            <p>&copy; 2025 Observa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
