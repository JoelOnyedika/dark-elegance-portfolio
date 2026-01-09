const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Developer. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with passion and purpose.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
