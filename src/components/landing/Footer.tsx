export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-4 max-sm:text-center">
          <div className="text-[0.78rem] text-text-3 font-mono">
            &copy; 2026 Irie Wireless. Telecom Orchestration Platform.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[0.78rem] text-text-3 hover:text-text-2 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[0.78rem] text-text-3 hover:text-text-2 transition-colors">
              Terms
            </a>
            <a href="#" className="text-[0.78rem] text-text-3 hover:text-text-2 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
