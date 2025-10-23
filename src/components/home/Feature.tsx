import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Feature = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-h2 mb-8">Discover our featured courses</h1>
        <Tabs defaultValue="math" className="flex flex-col items-center gap-6">
          <TabsList className="rounded-xl p-5 h-[60px] flex gap-7 mb-12">
            <TabsTrigger value="math" className="rounded-md text-h6">
              Math
            </TabsTrigger>
            <TabsTrigger value="data" className="rounded-md text-h6">
              Data Analysis
            </TabsTrigger>
            <TabsTrigger value="science" className="rounded-md text-h6">
              Science
            </TabsTrigger>
          </TabsList>
          <TabsContent value="math">
            <div className="grid md:grid-cols-2 items-center">
              <div>
                <h4 className="text-h4 font-bold mb-6">Math Courses</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/connect.svg"
                      alt="connect"
                      width={30}
                      height={30}
                      className="text-white"
                    />
                    <span className="text-medium">Solving Equations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/plus.svg"
                      alt="plus"
                      width={30}
                      height={30}
                      className="text-white"
                    />
                    <span className="text-medium">Visual Algebra</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/info.svg"
                      alt="info"
                      width={30}
                      height={30}
                      className="text-white"
                    />
                    <span className="text-medium">Probability</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/plot.svg"
                      alt="plot"
                      width={30}
                      height={30}
                      className="text-white"
                    />
                    <span className="text-medium">Real World Algebra</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/gear.svg"
                      alt="gear"
                      width={30}
                      height={30}
                      className="text-white"
                    />
                    <span className="text-medium">Functions</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-gray-600 text-lg">+</span>
                    <span className="text-small text-muted-foreground">
                      13 additional courses
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-[600px]">
                <Image
                  src="/assets/math.png"
                  alt="Math courses illustration"
                  width={450}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="data">Change your password here.</TabsContent>
          <TabsContent value="science">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
