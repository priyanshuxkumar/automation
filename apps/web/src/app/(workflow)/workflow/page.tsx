"use client";

import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TopNav } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import WorkflowTable from "@/components/workflow-table";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface WorkflowsProps {
  id: string;
  name: string;
  user: {
    firstname: string;
    lastname: string;
  };
  icons: {
    triggerIcon: string;
    actionIcons: string[];
  };
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [workflows, setWorkflows] = useState<WorkflowsProps[]>([]);

  const fetchWorkflow = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/workflow/`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setWorkflows(response.data);
      } else {
        console.warn("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  
  if (loading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Workflows</h1>
          <div className="flex mb-6 justify-between gap-3">
            <div className="relative w-full">
              <Input placeholder="Search by name or webhook" className="pl-8" />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={() => router.push(`/create/workflow`)}>Create <Plus strokeWidth={3}/></Button>
          </div>
          <WorkflowTable data={workflows} />
        </main>
      </div>
    </div>
  );
}
