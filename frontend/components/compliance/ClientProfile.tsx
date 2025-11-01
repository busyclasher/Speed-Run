"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Briefcase, Calendar, FileText } from "lucide-react";

interface ClientData {
  client_id: string;
  full_name: string;
  date_of_birth: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    country: string;
    postal_code: string;
  };
  occupation: string;
  employer: string;
  account_type: string;
  pep_status: boolean;
  relationship_manager: string;
  documents: Array<{
    type: string;
    status: string;
    uploaded_date: string;
  }>;
}

interface ClientProfileProps {
  client: ClientData;
}

export function ClientProfile({ client }: ClientProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Client Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">Basic Information</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Client ID:</span>
              <span className="text-sm font-medium">{client.client_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Full Name:</span>
              <span className="text-sm font-medium">{client.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date of Birth:</span>
              <span className="text-sm font-medium">
                {new Date(client.date_of_birth).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nationality:</span>
              <span className="text-sm font-medium">{client.nationality}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address
          </div>
          <div className="text-sm">
            <div>{client.address.street}</div>
            <div>
              {client.address.city}, {client.address.postal_code}
            </div>
            <div>{client.address.country}</div>
          </div>
        </div>

        {/* Employment */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Employment
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Occupation:</span>
              <span className="text-sm font-medium">{client.occupation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Employer:</span>
              <span className="text-sm font-medium">{client.employer}</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Account Details
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Account Type:</span>
              <Badge variant="outline">{client.account_type}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">PEP Status:</span>
              <Badge variant={client.pep_status ? "destructive" : "secondary"}>
                {client.pep_status ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">RM:</span>
              <span className="text-sm font-medium">{client.relationship_manager}</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submitted Documents ({client.documents.length})
          </div>
          <div className="space-y-2">
            {client.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{doc.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      doc.status === "approved"
                        ? "default"
                        : doc.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {doc.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(doc.uploaded_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

