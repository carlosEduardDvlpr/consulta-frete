'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, Package, AlertTriangle, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ShippingOption = {
  id: number;
  name: string;
  price?: string;
  custom_price?: string;
  discount?: string;
  currency?: string;
  delivery_time?: number;
  delivery_range?: {
    min: number;
    max: number;
  };
  custom_delivery_time?: number;
  custom_delivery_range?: {
    min: number;
    max: number;
  };
  packages?: Array<{
    price?: string;
    discount?: string;
    format: string;
    weight: string;
    insurance_value: string;
    dimensions: {
      height: number;
      width: number;
      length: number;
    };
  }>;
  additional_services?: {
    receipt: boolean;
    own_hand: boolean;
    collect: boolean;
  };
  additional?: {
    unit: {
      price: number;
      delivery: number;
    };
  };
  company: {
    id: number;
    name: string;
    picture: string;
  };
  error?: string;
};

export default function ShippingOptions({
  shippingOptions,
}: {
  shippingOptions: ShippingOption[];
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'delivery'>('price');

  // Separar opções disponíveis e indisponíveis
  const availableOptions = shippingOptions.filter((option) => !option.error);
  const unavailableOptions = shippingOptions.filter((option) => option.error);

  const sortedOptions = [...availableOptions].sort((a, b) => {
    if (sortBy === 'price') {
      return (
        Number.parseFloat(a.price || '0') - Number.parseFloat(b.price || '0')
      );
    } else {
      return (a.delivery_time || 0) - (b.delivery_time || 0);
    }
  });

  const handleSelectOption = (id: number) => {
    setSelectedOption(id === selectedOption ? null : id);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 sm:flex items-center justify-between">
        <h2 className="text-2xl font-bold">Opções de Frete</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <Tabs
            value={sortBy}
            onValueChange={(value) => setSortBy(value as 'price' | 'delivery')}
          >
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="price">Preço</TabsTrigger>
              <TabsTrigger value="delivery">Prazo</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-4">
        {sortedOptions.map((option) => (
          <Card
            key={option.id}
            className={cn(
              'border-2 transition-all',
              selectedOption === option.id
                ? 'border-primary'
                : 'hover:border-muted-foreground/20',
            )}
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={option.company.picture || '/placeholder.svg'}
                      alt={option.company.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{option.company.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {option.name}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {option.delivery_range ? (
                        <span>
                          {option.delivery_range.min ===
                          option.delivery_range.max
                            ? `${option.delivery_range.min} dia(s)`
                            : `${option.delivery_range.min}-${option.delivery_range.max} dias`}
                        </span>
                      ) : (
                        <span>{option.delivery_time} dia(s)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
                  {option.packages && option.packages[0] && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>
                        {option.packages[0].dimensions.height} ×{' '}
                        {option.packages[0].dimensions.width} ×{' '}
                        {option.packages[0].dimensions.length} cm
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col items-start md:items-end ml-auto">
                    {Number.parseFloat(option.discount || '0') > 0 && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <span>
                          Desconto de {option.currency} {option.discount}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">
                        {option.currency} {option.price}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectOption(option.id)}
                    variant={
                      selectedOption === option.id ? 'default' : 'outline'
                    }
                    className="w-full md:w-auto"
                  >
                    {selectedOption === option.id
                      ? 'Selecionado'
                      : 'Selecionar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {unavailableOptions.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Opções indisponíveis
              </h3>
            </div>

            <div className="space-y-2">
              {unavailableOptions.map((option) => (
                <Card key={option.id} className="bg-muted/30">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted/50">
                          <Image
                            src={option.company.picture || '/placeholder.svg'}
                            alt={option.company.name}
                            fill
                            className="object-contain p-1 opacity-70"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-muted-foreground">
                              {option.company.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs text-muted-foreground"
                            >
                              {option.name}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-help">
                              <Info className="h-4 w-4" />
                              <span className="hidden md:inline">
                                Indisponível
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{option.error}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
