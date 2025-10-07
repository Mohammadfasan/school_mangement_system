import { Mail, Phone, MapPin, Send, User } from 'lucide-react';
import { Github, Linkedin, Facebook } from 'lucide-react';

const Contact = () => {
  const cardBaseClasses = "p-4 rounded-xl shadow-lg transition-all duration-300";

  // Component for individual contact detail cards
  const ContactCard = ({ icon: Icon, title, content }) => (
    <div className={`flex items-center space-x-4 bg-emerald-700 text-white ${cardBaseClasses} hover:bg-emerald-600`}>
      <div className="p-3 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-light uppercase opacity-80">{title}</p>
        <p className="font-semibold text-lg">{content}</p>
      </div>
    </div>
  );

  // Component for social media links
  const SocialLink = ({ icon: Icon, href }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="p-3 bg-white rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors duration-200"
    >
      <Icon size={24} />
    </a>
  );

  // Placeholder function for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission logic here (e.g., API call)
    console.log("Form submitted. This is a placeholder action.");
    // Use a modal or in-page message instead of alert()
  };

  return (
    // Main Section Container (Dark Emerald Background)
    <section className="min-h-screen bg-emerald-900 p-4 md:p-12 font-sans">
      
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 md:mb-16 tracking-tight">
        Let's Connect
      </h2>
      
      {/* Main 2-Column Grid Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* === LEFT COLUMN: Get in Touch (Information) === */}
        <div className="space-y-8 p-6 lg:p-0">
          
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-white">Get in Touch</h3>
            <p className="text-emerald-200 leading-relaxed text-base">
              Interested in collaborating on environmental technology projects or 
              discussing sustainability solutions? I'm always open to new opportunities 
              and conversations about creating positive environmental impact.
            </p>
          </div>

          {/* Contact Detail Cards */}
          <div className="space-y-5">
            <ContactCard 
              icon={MapPin} 
              title="Location" 
              content="94/2, Thelambugalla"
            />
            <ContactCard 
              icon={Phone} 
              title="Telephone" 
              content="077 045 6553"
            />
            <ContactCard 
              icon={Mail} 
              title="Email" 
              content="mohammedfasan@gmail.com"
            />
          </div>
          
          {/* Social Media Links */}
          <div className="flex space-x-4 pt-4">
            <SocialLink icon={Github} href="https://github.com" />
            <SocialLink icon={Linkedin} href="https://linkedin.com" />
            <SocialLink icon={Facebook} href="https://facebook.com" />
          </div>

        </div>

        {/* === RIGHT COLUMN: Send a Message (Form) === */}
        {/* Form container with lighter background and rounded corners, matching the screenshot */}
        <div className={`bg-emerald-600 ${cardBaseClasses} p-8 shadow-2xl`}>
          <h3 className="text-3xl font-bold text-white mb-8">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-white font-medium block">Name</label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  id="name"
                  placeholder="Your Full Name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white font-medium block">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  id="email"
                  placeholder="Your Email Address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            {/* Message Textarea */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-white font-medium block">Message</label>
              <textarea 
                id="message"
                placeholder="Write your message here..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none resize-none"
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit"
              className="flex items-center justify-center space-x-2 w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 px-6 rounded-lg font-bold transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Send size={18} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
      
    </section>
  );
};

export default Contact;