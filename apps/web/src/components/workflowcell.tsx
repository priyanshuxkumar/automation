import React from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";

export const WorkflowCell = ({onClick , index , name , iconUrl , type} : {onClick:any ,index:number , name : string , iconUrl : string , type: string}) => {
  return (
    <div className="cursor-pointer" onClick={() => onClick(index)}>
      <div className="w-1/2 mx-auto border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-lg px-6 py-2">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-semibold text-xl">{index + 1}. {!name && <span className="font-medium text-base">Select the event to run your workflow</span>}</p>
            {iconUrl && 
                <Image
                    src={iconUrl}
                    alt={name}
                    width={20}
                    height={20}
                />
            }
        </div>
        <Badge variant={"outline"} className="text-base font-medium uppercase">{name ? name : type}</Badge>
      </div>
    </div>
  );
};
