'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { BACKEND_URL } from "@/config";
import axios from "axios";
import Image from "next/image"
import { useCallback, useEffect, useState } from "react";

interface AvailableTandAProps {
  id : string
  name : string
  iconUrl : string
}

export default function AvailableTriggersActionsDialog({open,setOpen}: {open: boolean;setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [isFetching , setIsFetching] = useState<boolean>(false)
  const [availableTandA , setAvailableTandA] = useState<AvailableTandAProps[]>([]);

  const fetchAvailableTriggers = useCallback(async() => {
    setIsFetching(true)
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/trigger/triggers`)
      if(response.status === 200){
        setAvailableTandA(response.data);
        setIsFetching(false)
      }
    } catch (error) {
      console.error(error)
    }finally{
      setIsFetching(false)
    }
  },[])

  const fetchAvailableActions = useCallback(async() => {
    setIsFetching(true)
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/action/actions`)
      if(response.status === 200){
        setAvailableTandA((prev) => [...prev, ...response.data]);
        setIsFetching(false)
      }
    } catch (error) {
      console.error(error)
    }finally{
      setIsFetching(false)
    }
  },[])

  useEffect(() => {
    fetchAvailableTriggers()
    fetchAvailableActions()
  },[fetchAvailableActions, fetchAvailableTriggers])

 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
      <DialogContent className="max-w-5xl w-[30vw] min-h-[50%]">
        <div className="w-full space-y-8">
          {/* Main Content */}
          <div className="">
            {/* Your Top Apps */}
            <div className="space-y-6">
              <h2 className="text-xl text-gray-600">Select a service</h2>
              <div className="space-y-4">
                {isFetching ? 'Loading' : availableTandA?.map((items) => (
                  <Button 
                    variant={'outline'}
                    key={items.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg w-full"
                  >
                    <Image
                      src={items.iconUrl}
                      alt={items.name}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="text-gray-900">{items.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}