
'use server';
/**
 * @fileOverview Un flujo de Genkit para generar una factura en formato HTML para un pedido.
 * 
 * - generateInvoice - Genera el contenido HTML y de texto plano para un correo de factura.
 * - GenerateInvoiceInput - El tipo de entrada para la función generateInvoice.
 * - GenerateInvoiceOutput - El tipo de retorno para la función generateInvoice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { htmlToText } from 'html-to-text';

// Esquema de Zod para los datos de entrada del flujo
const GenerateInvoiceInputSchema = z.object({
  orderId: z.number().describe('El ID del pedido.'),
  customerName: z.string().describe('El nombre del cliente.'),
  customerEmail: z.string().describe('El correo electrónico del cliente.'),
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

export const GenerateInvoiceOutputSchema = z.object({
  subject: z.string().describe('El asunto para el correo electrónico de la factura.'),
  htmlBody: z.string().describe('El contenido del correo en formato HTML.'),
  textBody: z.string().describe('El contenido del correo en formato de texto plano.'),
});

export type GenerateInvoiceOutput = z.infer<typeof GenerateInvoiceOutputSchema>;


const prompt = ai.definePrompt({
    name: 'generateInvoicePrompt',
    input: { schema: GenerateInvoiceInputSchema },
    output: { schema: GenerateInvoiceOutputSchema },
    prompt: `
        Eres un asistente encargado de generar facturas profesionales en formato de correo electrónico para un establecimiento llamado {{{barName}}}.

        Tu tarea es crear el asunto y el cuerpo HTML de un correo electrónico de factura basado en los detalles del pedido proporcionados.
        
        **Instrucciones para el HTML:**
        - El diseño debe ser limpio, profesional y fácil de leer.
        - Usa un contenedor principal con un ancho máximo de 600px y centrado.
        - Incluye el logo de la empresa (si se proporciona la URL) en la parte superior, centrado.
        - El título principal debe ser "Recibo de tu Compra".
        - Muestra claramente el ID del pedido y la fecha.
        - Dirígete al cliente por su nombre (Ej: "Hola, {{{customerName}}},").
        - Presenta los productos en una tabla con las columnas: "Producto", "Cantidad", "Precio Unitario" y "Subtotal".
        - Muestra el monto total claramente al final de la tabla.
        - Incluye un pie de página con un mensaje de agradecimiento y el nombre del establecimiento.
        - Utiliza estilos CSS en línea para garantizar la compatibilidad con todos los clientes de correo electrónico. Los colores primarios deben ser tonos de gris oscuro o negro para el texto (#333) y un color de acento sutil si es necesario. El fondo debe ser blanco o un gris muy claro (#f4f4f4).

        **Datos del Pedido:**
        - ID Pedido: {{{orderId}}}
        - Cliente: {{{customerName}}}
        - Fecha: {{{orderDate}}}
        - Total: {{{total}}}
        - Items:
        {{#each items}}
        - {{quantity}}x {{nombre}} @ {{precio}}
        {{/each}}
        
        **Datos del Establecimiento:**
        - Nombre: {{{barName}}}
        {{#if logoUrl}}- Logo: {{{logoUrl}}}{{/if}}
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
        throw new Error("No se pudo generar la factura.");
    }
    
    // Convertir el HTML a texto plano para el cuerpo alternativo del correo
    const textBody = htmlToText(output.htmlBody, {
        wordwrap: 130
    });
    
    return { ...output, textBody };
  }
);

// Función exportada que el frontend llamará
export async function generateInvoice(input: GenerateInvoiceInput): Promise<GenerateInvoiceOutput> {
    return await generateInvoiceFlow(input);
}
