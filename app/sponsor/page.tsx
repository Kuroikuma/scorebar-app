'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Sponsors } from '../sponsor/components/Sponsors';
import { AddSponsorForm } from '../sponsor/components/Add';
import { EditSponsorForm } from '../sponsor/components/Edit';
import { SponsorDetailModal } from '../sponsor/components/Details';
import { ISponsor } from '../types/sponsor';
import { useSponsorStore } from '../store/useSponsor';
import { IOrganization } from '../types/organization';

const Sponsor = () => {
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<ISponsor | null>(null);
  const [viewingSponsor, setViewingSponsor] = useState<ISponsor | null>(null);
  const { sponsors, getSponsorsByOrganizationId, createSponsor, updateSponsor, deleteSponsor, restoreSponsor } =
    useSponsorStore();

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const organizationId = (user.organizationId as IOrganization)._id as string;
    getSponsorsByOrganizationId(organizationId);
  }, [user]);

  const handleAddSponsor = async (newSponsor: ISponsor) => {
    await createSponsor(newSponsor);
    setShowAddSponsor(false);
  };

  const handleEditSponsor = async (editedSponsor: ISponsor) => {
    let id = editedSponsor._id;

    await updateSponsor(id, editedSponsor);
    setEditingSponsor(null);
  };

  return (
    <>
      <div className="h-full w-full">
        <div className="container mx-auto px-4 py-4 font-['Roboto_Condensed']">
          <div className="flex flex-col justify-between sm:items-center mb-6 sm:flex-row items-start">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Mis Patrocinadores</h1>
              <h2 className="text-2xl">Aquí puedes ver a las personas o empresas que te patrocinan.</h2>
            </div>
            <Button onClick={() => setShowAddSponsor(true)} className="mt-4">
              Añadir patrocinador
            </Button>
          </div>
          <div className="flex flex-col overflow-y-auto h-[75vh]">
            <Sponsors
              sponsors={sponsors}
              onViewDetails={(sponsor) => setViewingSponsor(sponsor)}
              onEdit={(sponsor) => setEditingSponsor(sponsor)}
            />
          </div>
        </div>
      </div>
      <AddSponsorForm
        isOpen={showAddSponsor}
        onClose={() => setShowAddSponsor(false)}
        onAddSponsor={handleAddSponsor}
      />
      {editingSponsor && (
        <EditSponsorForm
          sponsor={editingSponsor}
          isOpen={!!editingSponsor}
          onClose={() => setEditingSponsor(null)}
          onEditSponsor={handleEditSponsor}
        />
      )}
      {viewingSponsor && (
        <SponsorDetailModal
          sponsor={viewingSponsor}
          isOpen={!!viewingSponsor}
          onClose={() => setViewingSponsor(null)}
        />
      )}
    </>
  );
};

export default Sponsor;
