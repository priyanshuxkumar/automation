'use client'

import { useEffect, useState } from 'react'
import { Plus, Home, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BACKEND_URL } from '@/config'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { WorkflowCell } from '@/components/workflowcell'
import { WebhookSetup } from '@/components/webhook-setup'
import { EmailSetup } from '@/components/email-setup'


export interface AvailableTandAProps {
  id : string
  name : string
  iconUrl : string
}

export interface SelectedTriggerProps {
  triggerTypeId : string
  name : string
  iconUrl : string
  metadata? : JSON
}

export interface SelectedActionsProps {
  name : string
  iconUrl : string
  actionTypeId : string
  index: number
  metadata? : JSON
}

export default function Workflow() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false) // Available Trigger & Action Modal
  const [isOpen , setIsOpen] = useState<boolean>(false) //Setup Trigger & Actions Modal
  const [selectedModalIndex , setSelectedModalIndex] = useState<number | null>(null)
  const openAvailableTriggerActionDialog = (index : number) => {
    setSelectedModalIndex(index)
    setOpenModal((prev) => !prev)
  }
  const [selectedTrigger, setSelectedTrigger] = useState<SelectedTriggerProps | null>(null);
  const [selectedActions , setSelectedActions] = useState<SelectedActionsProps[]>([]);
  return (
    <>
    <div className="min-h-screen flex dark:bg-gray-950">
      {/* Sidebar */}
      <div className="w-16 bg-gray-100 dark:bg-gray-900 border-r flex flex-col items-center py-4 gap-6">
        <Button onClick={() => router.push('/home')} variant="ghost" size="icon" className="rounded-lg">
          <Home className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1">
        <header className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Zap className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Workflows</span>
          </div>
          <div className="flex items-center gap-4">
            <Button>Publish</Button>
          </div>
        </header>

        <div className="max-w-3xl mx-auto p-8 space-y-8">
          <div className="space-y-8">
            {/** Trigger */}
            <WorkflowCell onClick={openAvailableTriggerActionDialog} index={0} name ={selectedTrigger?.name as string} iconUrl={selectedTrigger?.iconUrl as string} type='trigger'/>

            {/** Actions */}
            {selectedActions && selectedActions?.map((item ) => (
              <WorkflowCell
                key={item?.index}
                onClick={openAvailableTriggerActionDialog}
                index={item.index}
                name={item.name as string}
                iconUrl={item.iconUrl as string}
                type="actions"
              />
            ))}
            <div className="w-px bg-violet-200 dark:bg-violet-800 mx-auto relative">
              <Button 
                size="icon" 
                variant="outline" 
                className="absolute -top-4 -left-4 rounded-full w-8 h-8"
                onClick={() => { 
                  setSelectedActions((x : any) => [
                    ...x, 
                    {
                      index: x.length + 1, 
                      actionTypeId: "", 
                      name: "", 
                      iconUrl: "", 
                      metadata: {} 
                    }
                  ]);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
      <AvailableTriggersActionsModal 
        open = {openModal} // Available Trigger & Action Modal
        setOpen = {setOpenModal} // Available Trigger & Action Modal
        isOpen = {isOpen} //Setup Trigger & Actions Modal
        setIsOpen ={setIsOpen} //Setup Trigger & Actions Modal
        selectedModalIndex={selectedModalIndex as number}
        setSelectedTrigger={setSelectedTrigger} 
        setSelectedActions={setSelectedActions}
      />
      if (selectedTrigger && selectedTrigger.name == Webhook) {
        <WebhookSetup isOpen={isOpen} setIsOpen={setIsOpen} selectedTrigger={selectedTrigger as SelectedTriggerProps}/>
      } else if(selectedAction && selectedAction == Email){
        <EmailSetup/>
      } 
    </>
  )
}

/** Fetch Avaiable Trigger and Actions */
function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = useState<AvailableTandAProps[]>([]);
  const [availableTriggers, setAvailableTriggers] = useState<AvailableTandAProps[]>([]);

  useEffect(() => {
      axios.get(`${BACKEND_URL}/api/v1/trigger/triggers`)
          .then(x => setAvailableTriggers(x.data))

      axios.get(`${BACKEND_URL}/api/v1/action/actions`)
          .then(x => setAvailableActions(x.data))
  }, [])

  return {
      availableActions,
      availableTriggers
  }
}



/** Modal for show available Triggers and Actions  */
function AvailableTriggersActionsModal({
  open,
  setOpen,
  isOpen,
  setIsOpen,
  selectedModalIndex,
  setSelectedTrigger,
  setSelectedActions,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModalIndex: number;
  setSelectedTrigger: SelectedTriggerProps;
  setSelectedActions: SelectedActionsProps;
}) {
  const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();
  const handleSelected = (selectedId: string) => {
    setIsOpen(!isOpen); // Open setup Webhook
    setOpen(!open); // Close Available Triggers and Actions component
    if (selectedModalIndex === 0) {
      // Trigger
      const selectedTrigger = availableTriggers.find(
        (item) => item.id === selectedId
      );
      console.log(selectedTrigger);
      if (selectedTrigger) {
        setSelectedTrigger({
          triggerTypeId: selectedTrigger.id,
          name: selectedTrigger.name,
          iconUrl: selectedTrigger.iconUrl,
          metadata: {},
        });
      }
    } else {
      // Actions
      const selectedAction = availableActions.find(
        (item) => item.id === selectedId
      );
      if (selectedAction) {
        setSelectedActions((prev: any[]) => {
          const existingActionIndex = prev.findIndex(
            (action) => action.index === selectedModalIndex
          );

          if (existingActionIndex > -1) {
            return prev.map((action, i) =>
              i === existingActionIndex
                ? {
                    ...action,
                    actionTypeId: selectedAction.id,
                    name: selectedAction.name,
                    iconUrl: selectedAction.iconUrl,
                  }
                : action
            );
          }
          return [
            ...prev,
            {
              actionTypeId: selectedAction.id,
              index: prev.length + 1,
              name: selectedAction.name,
              iconUrl: selectedAction.iconUrl,
              metadata: {},
            },
          ];
        });
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <DialogContent className="max-w-5xl w-[30vw] min-h-[50%]">
          <div className="w-full space-y-8">
            <div className="">
              <div className="space-y-6">
                <h2 className="text-xl text-gray-600">Select a service</h2>

                <div className="space-y-4">
                  {(selectedModalIndex === 0
                    ? availableTriggers
                    : availableActions
                  )?.map((item) => (
                    <Button
                      onClick={() => handleSelected(item.id)} // Getting selected service
                      variant="outline"
                      key={item?.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg w-full"
                    >
                      <Image
                        src={item?.iconUrl}
                        alt={item?.name}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <span className="text-gray-900">{item?.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

