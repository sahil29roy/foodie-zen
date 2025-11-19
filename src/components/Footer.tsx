import { Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center space-x-2">
            <Instagram className="h-5 w-5 text-primary" />
            <a
              href="https://instagram.com/sahil__.exe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              @sahil__.exe
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground max-w-2xl">
            <p>
              Having issues with taste, orders, or payments? We'd love to hear from you!
            </p>
            <p className="mt-2">
              Please leave your contact details or reach out to us via Instagram, and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
