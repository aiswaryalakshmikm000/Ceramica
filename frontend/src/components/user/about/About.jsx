"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ChevronDown, Star } from "lucide-react"
import video1 from '../../../assets/ThumbanilForVideo/video1.jpg'
import aboutpage from "../../../assets/ThumbanilForVideo/aboutpage.jpg";
import blueclay from "../../../assets/ThumbanilForVideo/blueclay.jpg";
import redclay from "../../../assets/ThumbanilForVideo/redclay.jpg";


const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("story")
  const storyRef = useRef(null)
  const materialsRef = useRef(null)
  const processRef = useRef(null)
  const valuesRef = useRef(null)

  const isStoryInView = useInView(storyRef, { once: true, amount: 0.3 })
  const isMaterialsInView = useInView(materialsRef, { once: true, amount: 0.3 })
  const isProcessInView = useInView(processRef, { once: true, amount: 0.3 })
  const isValuesInView = useInView(valuesRef, { once: true, amount: 0.3 })

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parallaxElements = document.querySelectorAll(".parallax");
  
      // Check if the device is mobile (screen width <= 640px)
      const isMobile = window.innerWidth <= 640;
  
      if (isMobile) {
        // Disable parallax on mobile
        parallaxElements.forEach((element) => {
          element.style.transform = "translateY(0px)";
        });
        return;
      }
  
      parallaxElements.forEach((element) => {
        const speed = 0.1;
        // Limit the translateY to prevent the image from moving too far
        const maxTranslate = 50; // Maximum pixels to move
        const translateY = Math.min(scrollPosition * speed, maxTranslate);
        element.style.transform = `translateY(${translateY}px)`;
      });
    };
  
    window.addEventListener("scroll", handleScroll);
    // Recalculate on resize to handle orientation changes
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="pt-20 bg-gradient-to-b from-orange-50 to-orange-100 min-h-screen">
      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-orange-800/20 mix-blend-multiply"></div>
          <img
            src={video1}
            alt="Ceramic workshop"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif text-white mb-6"
          >
            The Art of Ceramics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
          >
            With every touch, I mold raw clay into exquisite forms, infusing them with my imagination and passion.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              onClick={() => scrollToSection(storyRef)}
              className="text-white flex flex-col items-center justify-center mx-auto mt-12 animate-bounce"
            >
              <span className="mb-2">Discover Our Story</span>
              <ChevronDown size={24} />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Navigation Tabs - Fixed responsive issues */}
      <div className="sticky top-16 z-30 bg-orange-800/90 text-white py-4 shadow-md overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-start md:justify-center overflow-x-auto pb-1 no-scrollbar">
            <div className="flex space-x-2 md:space-x-8 min-w-max ">
              <button
                onClick={() => {
                  setActiveTab("story")
                  scrollToSection(storyRef)
                }}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full transition-all ${
                  activeTab === "story" ? "bg-white text-orange-800 font-medium" : "hover:bg-white/10"
                }`}
              >
                Our Story
              </button>
              <button
                onClick={() => {
                  setActiveTab("materials")
                  scrollToSection(materialsRef)
                }}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full transition-all ${
                  activeTab === "materials" ? "bg-white text-orange-800 font-medium" : "hover:bg-white/10"
                }`}
              >
                Materials
              </button>
              <button
                onClick={() => {
                  setActiveTab("process")
                  scrollToSection(processRef)
                }}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full transition-all ${
                  activeTab === "process" ? "bg-white text-orange-800 font-medium" : "hover:bg-white/10"
                }`}
              >
                Our Process
              </button>
              <button
                onClick={() => {
                  setActiveTab("values")
                  scrollToSection(valuesRef)
                }}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full transition-all ${
                  activeTab === "values" ? "bg-white text-orange-800 font-medium" : "hover:bg-white/10"
                }`}
              >
                Our Values
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section ref={storyRef} className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isStoryInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-orange-800 mb-8 text-center">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                  The wheel spins beneath my hands, yielding to my artistic vision. I carve, sculpt, and shape, crafting
                  vessels that hold stories within their delicate curves.
                </p>
                <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                  Founded in 2015, Ceramica began as a small studio in a converted barn. What started as a passionate
                  hobby quickly evolved into a thriving business dedicated to creating handcrafted ceramic pieces that
                  bring beauty and functionality to everyday life.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Each piece in our collection is handmade with care, ensuring that no two items are exactly alike. This
                  uniqueness is what makes our ceramics special – they carry the mark of the human hand and spirit.
                </p>
              </div>
              <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-xl">
                <motion.img
                  src={aboutpage}
                  alt="Ceramic artist at work"
                  className="w-full h-full object-cover parallax"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Materials Section */}
      <section ref={materialsRef} className="py-16 md:py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate={isMaterialsInView ? "visible" : "hidden"} variants={fadeInVariants}>
            <h2 className="text-3xl md:text-4xl font-serif text-orange-800 mb-8 text-center">
              Only High-Quality Materials
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
              <motion.div
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105"
                whileHover={{ y: -10 }}
              >
                <div className="h-48 sm:h-64 overflow-hidden">
                  <img
                    src={redclay}
                    alt="Red Clay"
                    className="w-full h-full object-cover parallax"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-serif text-orange-800 mb-3">Red Clay</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    A medium-texture Etruria Marl based red terracotta body famously used to produce the Tower Poppies.
                    Perfect for creating rustic, earthy pieces with character and warmth.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-orange-800 font-medium text-sm sm:text-base">Best for:</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs sm:text-sm">Pots</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs sm:text-sm">Planters</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs sm:text-sm">Decor</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105"
                whileHover={{ y: -10 }}
              >
                <div className="h-48 sm:h-64 overflow-hidden">
                  <img
                    src={blueclay}
                    alt="Blue Clay"
                    className="w-full h-full object-cover parallax"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-serif text-orange-800 mb-3">Blue Clay</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    A smooth, coloured earthenware ideal for modelling, jewellery making and wheel throwing. Creates
                    elegant pieces with a distinctive cool tone and refined finish.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-orange-800 font-medium text-sm sm:text-base">Best for:</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs sm:text-sm">Mugs</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs sm:text-sm">Bowls</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs sm:text-sm">Plates</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isProcessInView ? "visible" : "hidden"}
            variants={staggerContainerVariants}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-orange-800 mb-8 md:mb-12 text-center">Our Process</h2>

            <div className="space-y-12 md:space-y-16">
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-orange-800/90 text-white flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold">
                    01
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-serif text-orange-800 mb-2 md:mb-3">
                    Clay Selection & Preparation
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    We carefully select the finest clay materials, considering the specific requirements of each piece.
                    The clay is then wedged and prepared to remove air bubbles and achieve the perfect consistency for
                    throwing or hand-building.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-orange-800/90 text-white flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold">
                    02
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-serif text-orange-800 mb-2 md:mb-3">Forming & Shaping</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Each piece is either thrown on the wheel or hand-built using traditional techniques. This stage
                    requires precision, patience, and artistic vision to create forms that are both beautiful and
                    functional.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-orange-800/90 text-white flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold">
                    03
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-serif text-orange-800 mb-2 md:mb-3">
                    Drying & Bisque Firing
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    After forming, pieces are left to dry slowly and evenly to prevent cracking. Once bone dry, they
                    undergo their first firing (bisque firing) at around 1000°C, transforming the clay into a porous,
                    semi-vitrified state.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-orange-800/90 text-white flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold">
                    04
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-serif text-orange-800 mb-2 md:mb-3">
                    Glazing & Final Firing
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    The bisque-fired pieces are glazed using our custom-developed glazes in various colors. After
                    glazing, they undergo a final firing at temperatures between 1200-1300°C, which vitrifies the clay
                    and melts the glaze, creating a durable, waterproof surface.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-16 md:py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate={isValuesInView ? "visible" : "hidden"} variants={fadeInVariants}>
            <h2 className="text-3xl md:text-4xl font-serif text-orange-800 mb-8 md:mb-12 text-center">Our Values</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              <motion.div
                className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-800/90 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Star className="text-white" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-orange-800 mb-3 md:mb-4">Craftsmanship</h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  We believe in the value of handmade objects and the importance of preserving traditional ceramic
                  techniques while embracing innovation.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-800/90 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Star className="text-white" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-orange-800 mb-3 md:mb-4">Sustainability</h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  We are committed to environmentally responsible practices, from sourcing local materials to minimizing
                  waste and using energy-efficient firing techniques.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center sm:col-span-2 md:col-span-1"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-800/90 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Star className="text-white" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-orange-800 mb-3 md:mb-4">Community</h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  We value the connections we build with our customers and the broader ceramic community, and we strive
                  to create pieces that bring people together.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-orange-800/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4 md:mb-6">Experience Our Craftsmanship</h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6 md:mb-8">
              Browse our collection of handcrafted ceramic pieces and bring the beauty of artisanal craftsmanship into
              your home.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-orange-800 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => (window.location.href = "/shop")}
            >
              Shop Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
