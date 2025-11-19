import { Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/sahil__.exe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>@sahil__.exe</span>
            </a>
            
            <a
              href="https://twitter.com/sahil29roy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@sahil29roy</span>
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground max-w-2xl">
            <p>
              Having issues with taste, orders, or payments? We'd love to hear from you!
            </p>
            <p className="mt-2">
              Contact us via social media or report an issue directly, and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
