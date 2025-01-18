'use client'

import { useEffect, useState } from 'react'
import { Plus, Home, Zap, Loader } from 'lucide-react'
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
import EmailSetup from '@/components/email-setup'



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

const isValidAction = (action: SelectedActionsProps): boolean => {
  return !!action && !!action.actionTypeId && !!action.name;
};

export default function Workflow() {
  const router = useRouter();
  const [triggerActionModal, setTriggerActionModal] = useState<boolean>(false) // Available Trigger & Action Modal
  const [isOpen , setIsOpen] = useState<boolean>(false) //Setup Trigger & Actions Modal
  const [selectedModalIndex , setSelectedModalIndex] = useState<number | null>(null) 
  const [selectedTrigger, setSelectedTrigger] = useState<SelectedTriggerProps | null>(null);
  const [selectedActions , setSelectedActions] = useState<SelectedActionsProps[]>([]);

  const [currentActive , setCurrentActive] = useState<{ 
    index: number | null;
    type: string;
    name : string;
    }>({
    index: null,
    type: '',
    name : ''
  }); //Track which action or trigger is currently active
 
  const handleTriggerActionModal = (index: number) => {
    setSelectedModalIndex(index);
    if (index == 0 && selectedTrigger) {
      setCurrentActive({
        index: index,
        type: 'trigger',
        name: selectedTrigger.name,
      });
      return;
    }else if (index > 0 && selectedActions.find(
        (action) => action.index === index && isValidAction(action))) {
      const selectedAction = selectedActions.find((action) => action.index === index);
  
      if (selectedAction) {
        setCurrentActive({
          index: selectedAction.index,
          type: 'action',
          name: selectedAction.name,
        });
      }
      return;
    }
  
    // Open the modal if no valid trigger or action exists
    setTriggerActionModal((prev) => !prev);
  };
 
  const renderSetupComponent = (selectedComponent: any) => {
    if (selectedComponent.type === "trigger" && selectedComponent.name === "Webhook") {
      return (
        <WebhookSetup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedTrigger={selectedTrigger as SelectedTriggerProps}
          setSelectedTrigger={setSelectedTrigger}
        />
      );
    }else if (selectedComponent.type === "action" && selectedComponent.name === "Email") {
      return (
        <EmailSetup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedModalIndex={selectedModalIndex as number}
          selectedAction={selectedActions.find((item) => item.index == selectedModalIndex)}
          currentActive={currentActive}
          setSelectedActions={setSelectedActions}
        />
      );
    }
  };
  
  const [isPublishing , setIsPublishing] = useState(false);
  const publishWorkflow = async () => {
    setIsPublishing(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/workflow/create`, {
          name : '',
          triggerTypeId: selectedTrigger?.triggerTypeId,
          triggerMetadata: selectedTrigger?.metadata,
          actions : 
            selectedActions.map(x => ({
              actionTypeId: x.actionTypeId,
              actionMetadata: x.metadata
            }))
          
      }, {
        withCredentials: true
      })
      if(response.status === 200){
        setIsPublishing(false)
        console.log("Workflow created successfully!");
      }
    } catch (error) {
      console.error(error);
    }finally{
      setIsPublishing(false)
    }
  }


  return (
    <>
    {isPublishing &&
      <div className="w-full flex justify-center items-center h-screen absolute backdrop-blur-md bg-white/30 z-50">
        <div className="animate-spin">
          <Loader size={50} />
        </div>
      </div>}

      <div className="min-h-screen flex dark:bg-gray-950">
        {/* Sidebar */}
        <div className="w-16 bg-gray-100 dark:bg-gray-900 border-r flex flex-col items-center py-4 gap-6">
          <Button
            onClick={() => router.push("/home")}
            variant="ghost"
            size="icon"
            className="rounded-lg"
          >
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
              <Button onClick={publishWorkflow}>Publish</Button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto p-8 space-y-8">
            <div className="space-y-8">
              {/** Trigger */}
              <WorkflowCell
                onClick={handleTriggerActionModal}
                index={0}
                name={selectedTrigger?.name as string}
                iconUrl={selectedTrigger?.iconUrl as string}
                type="trigger"
              />

              {/** Actions */}
              {selectedActions &&
                selectedActions?.map((item) => (
                  <WorkflowCell
                    key={item?.index}
                    onClick={handleTriggerActionModal}
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
                    setSelectedActions((x: any) => [
                      ...x,
                      {
                        index: x.length + 1,
                        actionTypeId: "",
                        name: "",
                        iconUrl: "",
                        metadata: {},
                      },
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
        setCurrentActive={setCurrentActive}

        triggerActionModal={triggerActionModal} // Available Trigger & Action Modal
        setTriggerActionModal={setTriggerActionModal} // Available Trigger & Action Modal

        isOpen={isOpen} //Setup Trigger & Actions Modal
        setIsOpen={setIsOpen} //Setup Trigger & Actions Modal
        selectedModalIndex={selectedModalIndex as number}
        setSelectedTrigger={setSelectedTrigger}
        setSelectedActions={setSelectedActions}
      />

      {renderSetupComponent(currentActive)}
    </>
  );
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
  setCurrentActive,
 
  triggerActionModal,
  setTriggerActionModal,
  
  isOpen,
  setIsOpen,

  selectedModalIndex,

  setSelectedTrigger,
  setSelectedActions,
}: {
  setCurrentActive:any;

  triggerActionModal: boolean;
  setTriggerActionModal: React.Dispatch<React.SetStateAction<boolean>>;

  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModalIndex: number;
  setSelectedTrigger: SelectedTriggerProps;
  setSelectedActions: SelectedActionsProps;
}) {
  const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();

  const handleSelected = (selectedId: string) => {
    setIsOpen(!isOpen); // Open setup Webhook
    setTriggerActionModal(!open); // Close Available Triggers and Actions component
    
    if (selectedModalIndex === 0) { // Trigger
      const selectedTrigger = availableTriggers.find((item) => item.id === selectedId);
      setCurrentActive({
        index: 0,
        type : 'trigger',
        name: selectedTrigger?.name
      });


      if (selectedTrigger) {
        //@ts-ignore
        setSelectedTrigger({
          triggerTypeId: selectedTrigger.id,
          name: selectedTrigger.name,
          iconUrl: selectedTrigger.iconUrl,
          metadata: {},
        });
      }
    } else { // Actions
      const selectedAction = availableActions.find((item) => item.id === selectedId);
      setCurrentActive({
        index: selectedModalIndex,
        type : 'action',
        name: selectedAction?.name
      });
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
      <Dialog open={triggerActionModal} onOpenChange={setTriggerActionModal}>
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