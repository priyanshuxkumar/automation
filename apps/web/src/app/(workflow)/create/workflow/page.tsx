'use client'

import { useState } from 'react'
import { Plus, Home, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'
import AvailableTriggersActionsDialog from '@/components/triggers-actions'

interface WorkflowStep {
  id: string
  type: 'trigger' | 'action'
  title: string
}

export default function WorkflowBuilder() {
  const router = useRouter();
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: '1',
      type: 'trigger',
      title: 'Select the event that starts your Zap'
    },
    {
      id: '2',
      type: 'action',
      title: 'Select the event for your Zap to run'
    }
  ])

  const addNewAction = () => {
    const newStep: WorkflowStep = {
      id: `${steps.length + 1}`,
      type: 'action',
      title: 'Select the event for your Zap to run'
    }
    setSteps([...steps, newStep])
  }

  const [open, setOpen] = useState<boolean>(false)
  const openAvailableTriggerActionDialog = () => setOpen((prev) => !prev);

  return (
    <>
    <div className="min-h-screen flex dark:bg-gray-950">
      {/* Sidebar */}
      <div className="w-16 bg-gray-100 dark:bg-gray-900 border-r flex flex-col items-center py-4 gap-6">
        <Button onClick={() => router.push('/home')} variant="ghost" size="icon" className="rounded-lg">
          <Home className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Zap className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Workflows</span>
          </div>
          <div className="flex items-center gap-4">
            <Button>Publish</Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto p-8 space-y-8">
          {/* Workflow Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} onClick={openAvailableTriggerActionDialog} className='cursor-pointer'>
                <div className="w-1/2 mx-auto border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{step.type === 'trigger' ? 'Trigger' : 'Action'}</Badge>
                  </div>
                  <p className="text-base font-medium">{`${index + 1}. ${step.title}`}</p>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="h-8 w-px bg-violet-200 dark:bg-violet-800 mx-auto relative cursor-pointer">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="absolute -top-4 -left-4 rounded-full w-8 h-8"
                      onClick={addNewAction}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Final Add Step Button */}
            <div className="h-8 w-px bg-violet-200 dark:bg-violet-800 mx-auto relative">
              <Button 
                size="icon" 
                variant="outline" 
                className="absolute -top-4 -left-4 rounded-full w-8 h-8"
                onClick={addNewAction}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AvailableTriggersActionsDialog open={open} setOpen={setOpen}/>
    </>
  )
}

