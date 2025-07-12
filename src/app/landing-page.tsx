'use client';



interface LandingPageProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const features = [
  {
    title: 'AI-Powered Summaries',
    description: 'Get concise summaries of your group chats using advanced AI.'
  },
  {
    title: 'Stay Organized',
    description: 'Keep track of important conversations without reading every message.'
  },
  {
    title: 'Save Time',
    description: 'Quickly catch up on what you\'ve missed in your busy group chats.'
  }
];

const BrandedBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
    {/* Large speech bubble */}
    <svg className="absolute left-[-120px] top-[-60px] animate-float-slow" width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="120" rx="180" ry="90" fill="#00a884" fillOpacity="0.10" />
      <ellipse cx="320" cy="200" rx="60" ry="30" fill="#53bdeb" fillOpacity="0.10" />
      <rect x="120" y="200" width="80" height="40" rx="20" fill="#00a884" fillOpacity="0.13" />
    </svg>
    {/* Dots cluster */}
    <svg className="absolute right-10 top-24 animate-float-medium" width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="30" r="8" fill="#00a884" fillOpacity="0.18" />
      <circle cx="60" cy="20" r="6" fill="#53bdeb" fillOpacity="0.15" />
      <circle cx="100" cy="40" r="10" fill="#00a884" fillOpacity="0.10" />
    </svg>
    {/* Small speech bubble */}
    <svg className="absolute right-[-80px] bottom-[-40px] animate-float-slow" width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="60" rx="100" ry="50" fill="#53bdeb" fillOpacity="0.10" />
      <rect x="60" y="80" width="40" height="20" rx="10" fill="#00a884" fillOpacity="0.13" />
    </svg>
    <style>{`
      @keyframes float-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-18px); }
      }
      @keyframes float-medium {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
      .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
    `}</style>
  </div>
);

const LandingPage = ({ onLoginClick, onSignupClick }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20 relative overflow-x-hidden">
      <BrandedBackground />
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <section className="text-center mb-8 w-full">
            <h1 className="!text-4xl !md:text-6xl font-extrabold tracking-tight mb-6 text-primary drop-shadow-sm">
              Summarize Your WhatsApp Chats
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-8">
              Get AI-powered summaries of your WhatsApp group chats and stay updated with what matters most.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-2">
              <button className="btn btn-primary px-8 py-3 text-lg font-semibold" type="button" onClick={onSignupClick}>
                Get Started
              </button>
              <button className="btn btn-secondary px-8 py-3 text-lg font-semibold" type="button" onClick={onLoginClick}>
                Sign In
              </button>
            </div>
          </section>
          <section className="flex flex-col gap-8 items-center w-full">
            <div className="w-full">
              <h3 className="font-bold text-xl md:text-2xl mb-2 text-primary">AI-Powered Summaries</h3>
              <p className="text-base md:text-lg text-muted-foreground mb-2">Get concise summaries of your group chats with a single click.</p>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl md:text-2xl mb-2 text-primary">Stay Organized</h3>
              <p className="text-base md:text-lg text-muted-foreground mb-2">Keep track of important conversations without reading every message.</p>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl md:text-2xl mb-2 text-primary">Save Time</h3>
              <p className="text-base md:text-lg text-muted-foreground mb-2">Quickly catch up on what you've missed in your busy group chats.</p>
            </div>
          </section>
        </div>
      </div>
      <div className="version-badge absolute bottom-4 right-4 bg-muted/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-muted-foreground border border-border">
        v0.1.0
      </div>
    </div>
  );
};

export default LandingPage;
