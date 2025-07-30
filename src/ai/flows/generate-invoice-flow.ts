
'use server';
/**
 * @fileOverview Un flujo de Genkit para generar una factura en formato HTML para un pedido.
 * 
 * - generateInvoice - Genera el contenido HTML para un recibo de pedido.
 * - GenerateInvoiceInput - El tipo de entrada para la función generateInvoice.
 * - GenerateInvoiceOutput - El tipo de retorno para la función generateInvoice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Esquema de Zod para los datos de entrada del flujo
const GenerateInvoiceInputSchema = z.object({
  orderId: z.number().describe('El ID del pedido.'),
  customerName: z.string().describe('El nombre del cliente.'),
  orderDate: z.string().describe('La fecha en que se realizó el pedido.'),
  items: z.array(z.object({
    quantity: z.number(),
    nombre: z.string(),
    precio: z.number(),
  })).describe('La lista de productos en el pedido.'),
  total: z.number().describe('El monto total del pedido.'),
  barName: z.string().describe('El nombre del establecimiento/bar.'),
  logoUrl: z.string().optional().describe('La URL del logo del establecimiento.'),
});

export type GenerateInvoiceInput = z.infer<typeof GenerateInvoiceInputSchema>;

const GenerateInvoiceOutputSchema = z.object({
  htmlContent: z.string().describe('El contenido del recibo en formato HTML, diseñado para ser visualmente atractivo y fácil de leer, como un tiquete de compra.'),
});

export type GenerateInvoiceOutput = z.infer<typeof GenerateInvoiceOutputSchema>;


const prompt = ai.definePrompt({
    name: 'generateInvoicePrompt',
    input: { schema: GenerateInvoiceInputSchema },
    output: { schema: GenerateInvoiceOutputSchema },
    prompt: `
        Eres un asistente encargado de generar recibos de compra visualmente atractivos en formato HTML.
        El diseño debe ser limpio, profesional y similar a un tiquete de compra físico.

        **Instrucciones para el HTML:**
        - El contenedor principal debe tener un ancho máximo de 350px, estar centrado y tener un fondo blanco.
        - Usa una fuente monoespaciada o sans-serif simple para facilitar la lectura.
        - Incluye el logo de la empresa (si se proporciona) en la parte superior, centrado y con un tamaño máximo de 80px.
        - Muestra el nombre del establecimiento ({{{barName}}}) de forma prominente.
        - Incluye los detalles del pedido: "Pedido #{{{orderId}}}", "Fecha: {{{orderDate}}}", "Cliente: {{{customerName}}}".
        - Presenta los productos en un formato de lista o tabla simple, mostrando cantidad, nombre y subtotal.
        - Usa una línea separadora (como '--------------------------------') antes y después de la lista de productos y antes del total.
        - Muestra el monto TOTAL claramente al final.
        - Incluye un pie de página con un mensaje de agradecimiento.
        - Utiliza estilos CSS en línea para garantizar la compatibilidad.
    `,
});

const generateInvoiceFlow = ai.defineFlow(
  {
    name: 'generateInvoiceFlow',
    inputSchema: GenerateInvoiceInputSchema,
    outputSchema: GenerateInvoiceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("No se pudo generar el recibo.");
    }
    return output;
  }
);

// Función exportada que el frontend llamará
export async function generateInvoice(input: GenerateInvoiceInput): Promise<GenerateInvoiceOutput> {
    return await generateInvoiceFlow(input);
}
