"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, User } from "lucide-react";
import { generateRecommendations, getUrgencyIcon } from "@/lib/recommendation-engine";

interface PriorityClientsWidgetProps {
  clients: any[];
}

export default function PriorityClientsWidget({ clients }: PriorityClientsWidgetProps) {
  const router = useRouter();

  // Generate recommendations for all clients and find those with urgent/medium priority actions
  const priorityClients = clients
    .map(client => ({
      client,
      recommendations: generateRecommendations(client)
    }))
    .filter(({ recommendations }) => recommendations.length > 0)
    .map(({ client, recommendations }) => ({
      client,
      recommendations,
      highestUrgency: recommendations[0].urgency, // Already sorted by urgency in engine
      urgentCount: recommendations.filter(r => r.urgency === "URGENT").length,
      totalCount: recommendations.length
    }))
    .sort((a, b) => {
      // Sort by urgency: URGENT > MEDIUM > LOW
      const urgencyOrder = { URGENT: 0, MEDIUM: 1, LOW: 2 };
      return urgencyOrder[a.highestUrgency as keyof typeof urgencyOrder] - 
             urgencyOrder[b.highestUrgency as keyof typeof urgencyOrder];
    })
    .slice(0, 5); // Show top 5

  if (priorityClients.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            Priority Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700">All clients are in good standing. No urgent actions required.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-orange-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Priority Clients Requiring Attention
          </CardTitle>
          <Badge variant="destructive" className="text-base">
            {priorityClients.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {priorityClients.map(({ client, recommendations, highestUrgency, urgentCount, totalCount }) => (
            <div
              key={client.client_id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{client.full_name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {client.client_id}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span>{getUrgencyIcon(highestUrgency)}</span>
                    <span className="text-gray-600">
                      {urgentCount > 0 && (
                        <span className="font-semibold text-red-600">
                          {urgentCount} urgent
                        </span>
                      )}
                      {urgentCount > 0 && totalCount > urgentCount && " + "}
                      {totalCount > urgentCount && (
                        <span>
                          {totalCount - urgentCount} other action{totalCount - urgentCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {recommendations[0].title}
                  </p>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/rm/${client.client_id}`)}
                className="gap-2"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        {clients.length > priorityClients.length && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Showing top {priorityClients.length} of {clients.filter(c => generateRecommendations(c).length > 0).length} clients requiring attention
          </p>
        )}
      </CardContent>
    </Card>
  );
}

