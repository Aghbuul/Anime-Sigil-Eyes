import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="simple">Simple Explanation</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardContent className="prose dark:prose-invert max-w-none p-6">
                <h2 className="text-2xl font-bold">Welcome to Anime Sigil Eyes</h2>
                <p>
                  Transform your images with mystical sigils overlaid precisely on the eyes, 
                  creating stunning anime-inspired effects—all directly in your browser for 
                  complete privacy and security.
                </p>
                
                <h3>Creating Custom Sigils</h3>
                <p>
                  Whilst we provide a selection of pre-made sigils, you can easily create your own:
                </p>
                <ol>
                  <li>Find an image of a sigil you fancy (preferably on a solid background)</li>
                  <li>Visit <a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">remove.bg</a> to remove the background</li>
                  <li>Save the transparent PNG</li>
                  <li>Upload it to our application as a custom sigil</li>
                </ol>

                <p>
                  Your custom sigils remain private to your session and aren't stored 
                  permanently—ensuring your creative work stays yours.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simple">
            <Card>
              <CardContent className="prose dark:prose-invert max-w-none p-6">
                <h2>How It Works - Simple Version</h2>
                
                <h3>Image Upload</h3>
                <p>
                  Simply drag a photo onto the website or click to choose one from your computer. 
                  The app then processes your image right in your browser.
                </p>

                <h3>Eye Detection</h3>
                <p>
                  Using clever AI technology, the app automatically finds where the eyes are in 
                  your photo with remarkable accuracy.
                </p>

                <h3>Sigil Placement</h3>
                <p>
                  The app places your chosen sigils exactly over the eyes. You can make them 
                  bigger or smaller, adjust their position, and even rotate them to get the 
                  perfect look.
                </p>

                <h3>Customisation</h3>
                <p>
                  Choose which eyes get the sigil effect, control how visible they are, and 
                  pick from different sigil designs or upload your own.
                </p>

                <h3>Saving Your Work</h3>
                <p>
                  When you're happy with how it looks, simply click download to save your 
                  creation to your computer.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardContent className="prose dark:prose-invert max-w-none p-6">
                <h2>Technical Implementation Details</h2>

                <h3>Face Detection Pipeline</h3>
                <p>
                  We utilise Google's MediaPipe Face Mesh, a sophisticated machine learning 
                  model that detects 468 facial landmarks with remarkable precision. For our 
                  specific use case, we focus on landmarks 468 and 473, which correspond to 
                  the centre points of the left and right eyes respectively.
                </p>

                <h3>Image Processing Architecture</h3>
                <p>
                  The application leverages the HTML5 Canvas API for high-performance image 
                  manipulation. This enables:
                </p>
                <ul>
                  <li>Real-time rendering of the base image</li>
                  <li>Dynamic sigil overlay with transform operations</li>
                  <li>Precise coordinate mapping between face detection and render space</li>
                  <li>Efficient opacity and size adjustments</li>
                </ul>

                <h3>Coordinate System and Transform Pipeline</h3>
                <p>
                  The application maintains three coordinate spaces:
                </p>
                <ul>
                  <li>Normalised MediaPipe coordinates (0-1 range)</li>
                  <li>Source image pixel coordinates</li>
                  <li>Display/canvas coordinates with scaling</li>
                </ul>
                <p>
                  These are transformed and mapped dynamically as the image is processed, 
                  ensuring precise sigil placement regardless of image dimensions or display scaling.
                </p>

                <h3>Interactive Controls Implementation</h3>
                <p>
                  The draggable interface utilises a custom implementation combining React's 
                  synthetic events with the Canvas API. This provides:
                </p>
                <ul>
                  <li>Pixel-perfect drag operations</li>
                  <li>Keyboard-based fine-tuning with configurable step sizes</li>
                  <li>Independent rotation controls for each sigil</li>
                  <li>Real-time preview updates</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Acknowledgements Section */}
        <div className="text-muted-foreground">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Acknowledgements</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This project stands on the shoulders of giants. We're grateful to the following 
              technologies and teams that made this possible:
            </p>
            <ul>
              <li>
                <strong>MediaPipe Face Mesh</strong> (Apache 2.0 License) - Google's remarkable 
                ML model providing the core face detection capabilities
              </li>
              <li>
                <strong>remove.bg</strong> - For their excellent background removal service 
                that helps users create custom sigils
              </li>
              <li>
                <strong>shadcn/ui</strong> (MIT License) - Beautiful, accessible React 
                components that form our user interface
              </li>
              <li>
                <strong>React</strong> (MIT License) - The foundation of our modern, 
                responsive application
              </li>
            </ul>
            
            <p>Special thanks to:</p>
            <ul>
              <li>
                The Replit Agent - For bringing this application to life through thoughtful 
                development and implementation
              </li>
              <li>
                Anthropic's Claude - For invaluable assistance in planning and 
                problem-solving throughout the development process
              </li>
              <li>
                Google's MediaPipe Team - For their groundbreaking work in making advanced 
                computer vision accessible to web applications
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
