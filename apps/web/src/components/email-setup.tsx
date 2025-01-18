'use client'

import { Mail, ChevronRight, X } from 'lucide-react'
import { useState } from "react"
import Image from 'next/image'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectedActionsProps } from '@/app/(workflow)/create/workflow/page'


const steps = ["Setup", "Configure", "Test"]

export default function EmailSetup({
  isOpen,
  setIsOpen,
  selectedModalIndex,
  selectedAction,
  currentActive,
  setSelectedActions,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModalIndex: number;
  selectedAction: SelectedActionsProps;
  currentActive: any;
  setSelectedActions: any;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [actionEvent, setActionEvent] = useState("Send Outbound Email");

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
    fromname: "",
  });
console.log("Sel" , selectedAction)
  const handleEmailDataChange = (e: any) => {
    const { name, value } = e.target;
    setEmailData((prevData) => ({ ...prevData, [name]: value }));

    // Update the specific action's metadata in the parent state
    setSelectedActions((prev: any[]) =>
      prev.map((action) =>
        action.index === selectedModalIndex
          ? { ...action, metadata: { ...action.metadata, [name]: value } }
          : action
      )
    );
  };
  // console.log("email dayta",emailData)

  // const handleEmailDataChange = (e: any) => {
  //   const { name, value } = e.target;
  //   setEmailData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // function setSelectionActionMetadata() {
  //   const updatedActions = selectedAction.map((action) => {
  //     if (action.index === currentActive.index) {
  //       return {
  //         ...action,
  //         metadata: emailData,
  //       };
  //     }
  //     return action;
  //   });
  //   setSelectedActions(updatedActions);
  // };

  // console.log("H" ,currentActive, emailData);
  return (
    <Card className="absolute right-4 top-[13%] min-h-[70%] max-w-3xl w-1/4 mx-auto border-2 border-indigo-600 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md">
              {selectedAction.iconUrl && (
                <Image
                  src={selectedAction?.iconUrl}
                  alt="email-icon"
                  width={24}
                  height={24}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {selectedAction?.index + 1}. {selectedAction?.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center rounded-full w-4 h-4 text-xs
                    ${
                      index + 1 < currentStep
                        ? "bg-purple-600 text-white"
                        : index + 1 === currentStep
                          ? "border-2 border-purple-600 text-purple-600"
                          : "border-2 border-gray-300 text-gray-300"
                    }`}
                >
                  {index + 1 < currentStep ? "✓" : step[0]}
                </div>
                <span
                  className={`ml-2 text-xs ${
                    index + 1 === currentStep
                      ? "text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <ChevronRight className="mx-4 text-gray-300" />
                )}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>App</Label>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <span>Email by Workflow</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Action event</Label>
                <Select value={actionEvent} onValueChange={setActionEvent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Send Outbound Email">
                      Send Outbound Email
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="to" className="flex items-center gap-1">
                  To
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    onChange={handleEmailDataChange}
                    id="to"
                    placeholder="Enter text or insert data..."
                    name="to"
                    value={emailData.to}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center gap-1">
                  Subject
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    onChange={handleEmailDataChange}
                    id="subject"
                    placeholder="Enter text or insert data..."
                    name="subject"
                    value={emailData.subject}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body" className="flex items-center gap-1">
                  Body (HTML or Plain)
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Textarea
                    onChange={handleEmailDataChange}
                    name="body"
                    id="body"
                    placeholder="Enter text or insert data..."
                    className="min-h-[100px]"
                    value={emailData.body}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromname">From Name</Label>
                <div className="flex gap-2">
                  <Input
                    onChange={handleEmailDataChange}
                    name="fromname"
                    id="fromname"
                    placeholder="Enter text or insert data..."
                    value={emailData.fromname}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Button
              className="w-full"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
            >
              Completed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

