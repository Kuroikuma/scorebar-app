'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ISponsor } from '@/app/types/sponsor';
import { useSponsorStore } from '@/app/store/useSponsor';
import { useAuth } from '@/app/context/AuthContext';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

const SingleSponsor = () => {
  const { currentSponsor, getSponsorById } = useSponsorStore();

  const paramas = useParams();
  const id = paramas?.id as string;

  useEffect(() => {
    if (!id) return;
    getSponsorById(id);
  }, [id]);

  return (
    <>
      <div className="h-full w-full">
        <div className="container mx-auto px-4 py-4 font-['Roboto_Condensed']">
          <div className="flex flex-col justify-between sm:items-center mb-6 sm:flex-row items-start">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{currentSponsor?.name}</h1>
              <Card className="mt-4">
                <CardContent className="flex justify-center items-center pt-6">
                  <p className="text-xs">{currentSponsor?.ad}</p>
                </CardContent>
              </Card>
            </div>
            
          </div>

          <Card className="mt-4">
              <CardContent className="flex justify-center items-center pt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <strong>Website:</strong>{' '}
                    <a
                      href={currentSponsor?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {currentSponsor?.link}
                    </a>
                  </div>
                  <div>
                    <strong>Propietario:</strong> {currentSponsor?.owner}
                  </div>
                  <div>
                    <strong>Email:</strong> {currentSponsor?.email}
                  </div>
                  <div>
                    <strong>Teléfono:</strong> {currentSponsor?.phone}
                  </div>
                  <div>
                    <strong>Dirección:</strong> {currentSponsor?.address}
                  </div>
                  <div>
                    <strong>Fecha de pago:</strong> Los {currentSponsor?.paymentDate} de cada mes
                  </div>
                  <div>
                    <strong>Cuota de patrocinio:</strong> C$ {currentSponsor?.sponsorshipFee.$numberDecimal}
                  </div>
                </div>
              </CardContent>
            </Card>
          <div className="flex flex-col overflow-y-auto h-[75vh]"></div>
        </div>
      </div>
    </>
  );
};

export default SingleSponsor;
