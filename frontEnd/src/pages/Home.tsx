import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Heart, Users, Lightbulb, Award, ChevronDown } from 'lucide-react';
import './home.css';

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const cards = document.querySelectorAll('.article-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
  
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
  
        const rotateX = (y - rect.height / 2) / 20;
        const rotateY = (rect.width / 2 - x) / 20;
        (card as HTMLElement).style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
  
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = 'rotateX(0) rotateY(0)';
      });
    });
  }, []);

  const articles = [
    {
      id: 1,
      title: "Transforming Lives Through Giving",
      excerpt: "Meet Sarah, whose life changed dramatically after receiving support through ConnectAid. Her story exemplifies how a simple act of kindness can create ripples of positive change.",
      category: "Success Stories",
      readTime: "5 min read",
      image: "",
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      link: "/articles/donation-impact"
    },
    {
      id: 2,
      title: "Building Bridges of Hope",
      excerpt: "Discover how our community platform has connected thousands of donors with those in need, creating lasting bonds that transcend mere transactions.",
      category: "Community",
      readTime: "4 min read",
      image: "",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      link: "/articles/community-building"
    },
    {
      id: 3,
      title: "Technology for Good",
      excerpt: "Learn about our innovative blockchain-based donation tracking system that ensures complete transparency and trust in every transaction.",
      category: "Innovation",
      readTime: "6 min read",
      image: "",
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      link: "/articles/innovative-solutions"
    },
    {
      id: 4,
      title: "Impact Through Unity",
      excerpt: "See how small contributions from thousands of donors helped rebuild an entire community after a natural disaster.",
      category: "Impact",
      readTime: "3 min read",
      image: "",
      icon: <Award className="w-6 h-6 text-purple-500" />,
      link: "/articles/collective-effort"
    }
  ];

  return (
    <div className="min-h-screen custom-scrollbar" ref={containerRef}>
      {/* Hero Section - Adjusted to complement Navbar */}
      <motion.div 
        className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{ opacity }}
      >
        <div className="particles" />
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-8 hero-title"
            >
              Welcome to <span className="text-gradient">ConnectAid</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12"
            >
              Bridging the gap between compassion and action. Our platform connects generous hearts with those in need, creating a community where help finds its way.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/signup"
                className="hero-button inline-flex items-center gap-3 px-10 py-5 text-white rounded-full text-xl font-semibold transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Today
                <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/80" />
          </motion.div>
        </div>
      </motion.div>

      {/* Articles Grid - Updated styling */}
      <div className="articles-section py-24">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 section-title"
          >
            Featured Stories
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="article-card"
              >
                <div className="content p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {article.icon}
                    <span className="text-sm font-medium text-gray-600">{article.category}</span>
                    <span className="text-sm text-gray-400">• {article.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>
                  <Link
                    to={article.link}
                    className="article-link inline-flex items-center gap-2 font-medium"
                  >
                    Read More
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action - Updated to match new theme */}
      <motion.div 
        className="cta-section text-white py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8 cta-title"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ready to Make a Difference?
          </motion.h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90">Join our community today and be part of something bigger.</p>
          <Link
            to="/signup"
            className="cta-button inline-flex items-center gap-3 px-10 py-5 rounded-full text-xl font-semibold transform hover:-translate-y-1 transition-all duration-300"
          >
            Join ConnectAid
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;