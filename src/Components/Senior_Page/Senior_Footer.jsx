import React from 'react';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";


function Senior_Footer() {
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden ">
      {/* Water fluid effect */}
      <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="absolute w-full h-full"
        >
          <path
            d="M0.00,92.27 C216.83,192.92 304.30,8.39 500.00,109.03 L500.00,0.00 L0.00,0.00 Z"
            className="fill-slate-800"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,100 C250,200 350,0 500,100 L500,00 L0,00 Z;
                M0,100 C150,200 350,0 500,100 L500,00 L0,00 Z;
                M0,100 C250,200 150,0 500,100 L500,00 L0,00 Z;
                M0,100 C250,200 350,0 500,100 L500,00 L0,00 Z
              "
            />
          </path>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-emerald-400">CreditKlick</h3>
            <p className="text-sm text-gray-400">
              Empowering financial decisions through innovative solutions and expert insights.
            </p>
            <div className="flex space-x-4">
              <FaFacebook className="text-blue-500 hover:text-blue-400 cursor-pointer" />
              <FaTwitter className="text-sky-400 hover:text-sky-300 cursor-pointer" />
              <FaInstagram className="text-pink-500 hover:text-pink-400 cursor-pointer" />
              <FaLinkedin className="text-blue-400 hover:text-blue-300 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Services', 'Careers', 'Blog'].map((item) => (
                <li key={item} className="hover:text-emerald-400 cursor-pointer text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
              <MdLocationOn className="text-emerald-400 w-10 h-10" />
                <span className="text-sm">Plot No. 112, Phase, 1, Udyog Vihar Phase 1, Udyog Vihar, Sector 18, Gurugram, Haryana 122016</span>
              </div>
              <div className="flex items-center space-x-2">
                <MdPhone className="text-emerald-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MdEmail className="text-emerald-400" />
                <span className="text-sm">info@creditklick.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <form className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button 
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              © {new Date().getFullYear()} CreditKlick. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span className="hover:text-white cursor-pointer">Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Senior_Footer;