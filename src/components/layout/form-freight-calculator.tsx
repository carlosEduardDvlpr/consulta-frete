'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Package, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import ShippingOptions from './shipping-options';

const formSchema = z.object({
  originZip: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido'),
  destinationZip: z
    .string()
    .min(8, 'CEP deve ter 8 dígitos')
    .max(9, 'CEP inválido'),
  weight: z.coerce.number().positive('Peso deve ser maior que zero'),
  height: z.coerce.number().positive('Altura deve ser maior que zero'),
  width: z.coerce.number().positive('Largura deve ser maior que zero'),
  length: z.coerce.number().positive('Comprimento deve ser maior que zero'),
});

export function FreightCalculator() {
  const [result, setResult] = useState<
    {
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
    }[]
  >();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originZip: '',
      destinationZip: '',
      weight: undefined,
      height: undefined,
      width: undefined,
      length: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const body = {
      from: {
        postal_code: values.originZip,
      },
      to: {
        postal_code: values.destinationZip,
      },
      package: {
        height: values.height,
        width: values.width,
        length: values.length,
        weight: values.weight,
      },
    };
    const response = await fetch('/api/melhorenvio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (json) setResult(json);
    // console.log(result, 'estou aqui')
  }

  const formatCep = (cep: string) => {
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
      cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }
    return cep;
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Calculadora de Frete</CardTitle>
          </div>
          <CardDescription>
            Preencha os dados abaixo para calcular o valor do frete
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="originZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP de Origem</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => {
                            field.onChange(formatCep(e.target.value));
                          }}
                          maxLength={9}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP de Destino</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => {
                            field.onChange(formatCep(e.target.value));
                          }}
                          maxLength={9}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    Dimensões da Encomenda
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Largura (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comprimento (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Calcular Frete
              </Button>
            </CardFooter>
          </form>
        </Form>{' '}
      </Card>
      <div className="py-4">
         {result && <ShippingOptions shippingOptions={result} />}
      </div>
     
    </>
  );
}
