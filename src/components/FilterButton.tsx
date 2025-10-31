import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const FilterButton = () => {
  const [salaryRange, setSalaryRange] = useState([50, 200]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Full-time"]);

  const toggleJobType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleReset = () => {
    setSalaryRange([50, 200]);
    setRemoteOnly(false);
    setSelectedTypes(["Full-time"]);
  };

  return (
    <Sheet>
      {/* Floating Filter Button */}
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-20 right-5 sm:bottom-24 sm:right-8 z-50 rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg bg-primary text-primary-foreground hover:scale-105 transition-all pulse-glow"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-6 w-6 sm:h-7 sm:w-7" />
        </Button>
      </SheetTrigger>

      {/* Responsive Filter Panel */}
      <SheetContent
        side="bottom"
        className="h-[90vh] sm:h-auto sm:max-w-md mx-auto rounded-t-3xl sm:rounded-2xl border-t-2 border-border bg-background/80 backdrop-blur-xl overflow-y-auto pb-8"
      >
        <SheetHeader className="pt-4 text-center sm:text-left">
          <SheetTitle className="text-lg sm:text-xl font-semibold">Filter Jobs</SheetTitle>
          <SheetDescription className="text-sm sm:text-base">
            Refine your job search preferences below
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6 px-3 sm:px-0">
          {/* Job Type */}
          <div>
            <Label className="text-base mb-3 block">Job Type</Label>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedTypes.includes(type) ? "default" : "outline"}
                  className={`cursor-pointer transition-transform duration-200 hover:scale-105 ${
                    selectedTypes.includes(type)
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => toggleJobType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <Label className="text-base mb-3 block">
              Salary Range: ${salaryRange[0]}k - ${salaryRange[1]}k
            </Label>
            <Slider
              min={20}
              max={300}
              step={10}
              value={salaryRange}
              onValueChange={setSalaryRange}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Adjust to match your expected compensation range.
            </p>
          </div>

          {/* Remote Only */}
          <div className="flex items-center justify-between glass p-4 sm:p-5 rounded-xl">
            <div>
              <Label htmlFor="remote" className="text-base font-medium">
                Remote Only
              </Label>
              <p className="text-sm text-muted-foreground">
                Show only remote opportunities
              </p>
            </div>
            <Switch id="remote" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
          </div>

          {/* Apply Filters */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 py-2 sm:py-3 text-sm sm:text-base"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className="flex-1 py-2 sm:py-3 text-sm sm:text-base"
              onClick={() => console.log({ salaryRange, remoteOnly, selectedTypes })}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterButton;
