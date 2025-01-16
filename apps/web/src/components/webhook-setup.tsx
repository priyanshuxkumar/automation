"use client";

import { Card, CardContent } from "./ui/card";
import { ChevronRight, X } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea"
import { Fragment, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { SelectedTriggerProps } from "@/app/(workflow)/create/workflow/page";

export function WebhookSetup({isOpen , setIsOpen , selectedTrigger} : {isOpen : boolean , setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, selectedTrigger: SelectedTriggerProps}) {
    const steps = ['setup', 'configure', 'test'];
    const [currentStep, setCurrentStep] = useState<string>(steps[0])
    
    const nextStep = () => {
      setCurrentStep((prev) => {
        const currentIndex = steps.indexOf(prev);
        const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
        return steps[nextIndex];
      });
    };
  
    return isOpen ? (
      <Card className="absolute right-4 top-[13%] min-h-[70%] max-w-3xl w-1/4 mx-auto border-2 border-indigo-600 rounded-xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Image
                src={selectedTrigger.iconUrl}
                alt={selectedTrigger.name}
                width={20}
                height={20}
                className=""
              />
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">1. Select the event</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
  
          <div className="flex items-center gap-2 mb-8 text-sm">
            {['setup', 'configure', 'test'].map((step, index) => (
              <Fragment key={step}>
                <div className="flex items-center">
                  <span
                    className={`${
                      currentStep === step
                        ? 'font-medium text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-400'
                    } ${index === 0 ? 'pb-1' : ''}`}
                  >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                </div>
                {index < 2 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
              </Fragment>
            ))}
          </div>
  
          {currentStep == 'setup' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-1">
                App
                <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <Card className="inline-flex items-center gap-2 px-4 py-2 border-2 border-orange-500">
                  <Image
                    src={selectedTrigger.iconUrl}
                    alt="Webhooks Logo"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium">{selectedTrigger.name}</span>
                </Card>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-lg font-medium flex items-center gap-1">
                Trigger event
                <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className = "w-fit text-xs " value="catch-hook-instant">Catch Hook Instant <br/>  Wait for a new POST, PUT, or GET to a Zapier URL.</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>) : (currentStep === 'configure' ? (<div>
            <p>Pick off a Child key</p>
            <Textarea placeholder="Enter text"/>
          </div>) : (<div>
            <p>Your webhook URL: </p>
            <div className="border rounded-md px-2">
              <span className="text-xs">https:://localhost:8080/api/hooks</span>
            </div>
          </div>) )}
  
          {/* Bottom Message */}
          <Button className="mt-40 w-full" onClick={nextStep}>
            {currentStep == 'test' ? 'Test' : 'Continue' }
          </Button>
        </CardContent>
      </Card>
      ) : (
      <></>
    )
  }