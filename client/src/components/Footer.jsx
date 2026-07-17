export default function Footer() {
  return (
    <footer className="bg-[#040919] text-white/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://kuana.org/assets/img/KUANA.png"
              alt="KUANA Logo"
              className="h-8 w-auto object-contain opacity-80"
            />
          </div>
          <div className="text-center text-xs">
            &copy; {new Date().getFullYear()} KUANA &bull; kuana.org &bull; Non-Profit Organization
          </div>
          <div className="text-xs flex items-center gap-4">
            <a href="/privacy" className="hover:text-[#ffc31d] transition-colors">
              Privacy Policy
            </a>
            <a href="mailto:info@kuana.org" className="hover:text-[#ffc31d] transition-colors">
              info@kuana.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
