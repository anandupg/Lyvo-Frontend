import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Zap, 
  Target, 
  Heart, 
  TrendingUp
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

const About = () => {


  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in building strong, supportive communities where everyone feels at home."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your safety and privacy are our top priorities with verified listings and secure transactions."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging cutting-edge technology to make co-living seamless and enjoyable."
    },
    {
      icon: Target,
      title: "Transparency",
      description: "Clear pricing, honest reviews, and open communication at every step."
    }
  ];



  return (
    <div className="min-h-screen bg-white pt-16">


      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="text-red-600">Mission</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                To create a world where finding the perfect co-living space is effortless, where communities thrive, 
                and where technology enhances human connections rather than replacing them.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" delay={0.08}>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Why Co-Living Matters</h3>
                <p className="text-gray-600 leading-relaxed">
                  In today's fast-paced world, traditional housing models often leave people feeling isolated. 
                  Co-living offers a solution that combines affordability, community, and flexibility.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We believe everyone deserves a place they can call home, surrounded by like-minded individuals 
                  who share their values and aspirations.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Growing Trend</h4>
                    <p className="text-sm text-gray-500">Co-living is the future of urban living</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1}>
              <div className="relative">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Smart Matching</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Community Building</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Secure Transactions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>



      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.15}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="text-red-600">Values</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
                              <ScrollReveal key={index} direction="up" delay={0.18 + index * 0.01}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default About;