import { Card, CardContent } from "@/components/ui/card";
import { ImageEditor } from "@/components/ImageEditor";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with theme toggle and navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                Anime Sigil Eyes
              </a>
            </Link>
            <nav className="hidden md:block">
              <Link href="/about">
                <a className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  About
                </a>
              </Link>
            </nav>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Card className="bg-card">
          <CardContent className="p-6">
            <ImageEditor />
          </CardContent>
        </Card>

        {/* Mobile navigation */}
        <div className="md:hidden mt-6 flex justify-center">
          <Link href="/about">
            <a className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              About
            </a>
          </Link>
        </div>

        {/* Acknowledgments */}
        <div className="mt-12 text-muted-foreground">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Acknowledgments</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This application utilizes several powerful technologies and ML models:
            </p>
            <ul>
              <li>
                <strong>Face Detection:</strong> Powered by MediaPipe Face Mesh,
                providing precise facial landmark detection for accurate sigil placement
              </li>
              <li>
                <strong>Image Processing:</strong> Built with HTML5 Canvas API for
                real-time image manipulation and overlay effects
              </li>
              <li>
                <strong>UI Framework:</strong> React with shadcn/ui components for a
                modern, accessible interface
              </li>
            </ul>
            <p className="mt-4">
              Special thanks to:
            </p>
            <ul>
              <li>Replit Agent - For the development and implementation of the application</li>
              <li>Anthropic's Claude - For assistance in planning and problem-solving</li>
              <li>Google MediaPipe Team - For their excellent face detection model</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}