// src/product/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; // Importe Document do Mongoose

// Define o tipo ProductDocument como a interface Product combinada com Document do Mongoose.
// Isso adiciona as propriedades do documento MongoDB (como _id) ao seu tipo Product.
export type ProductDocument = Product & Document;

// O decorador @Schema() define esta classe como um schema Mongoose.
@Schema()
export class Product {
  // Propriedades do produto, mapeadas para o MongoDB.
  // Cada decorador @Prop() define uma propriedade no schema.

  @Prop({ required: true })
  name: string;

  @Prop({ type: String }) // O tipo é String. 'type: () => String' também funciona, mas é mais verboso.
  description?: string | null; // O '?' indica que a propriedade é opcional, '| null' permite que seja explicitamente nula.

  @Prop({ type: String })
  category?: string | null;

  @Prop({ type: String })
  image?: string | null;

  @Prop({ required: true })
  price: number;

  @Prop({ type: String })
  material?: string | null;

  @Prop({ type: String })
  department?: string | null;

  // *** AQUI ESTÁ A ÚNICA MUDANÇA ESSENCIAL: REMOÇÃO DE 'unique: true' ***
  // Agora, supplierProductId é apenas requerido, mas não precisa ser único na coleção.
  // Isso permite que um produto '1' do fornecedor 'brasileiro' e um produto '1' do fornecedor 'europeu'
  // existam independentemente no banco de dados, diferenciados pelo campo 'supplier' e pelo '_id' do MongoDB.
  @Prop({ required: true })
  supplierProductId: string;

  @Prop({ required: true })
  supplier: string; // Ex: 'brazilian' ou 'european'

  @Prop({ type: Boolean, default: false }) // Define um valor padrão para hasDiscount
  hasDiscount?: boolean | null;

  @Prop({ type: Number, default: 0 }) // Define um valor padrão para discountValue
  discountValue?: number | null;

  @Prop({ type: [String] }) // Define que gallery é um array de Strings
  gallery?: string[] | null;

  @Prop({ type: String })
  adjective?: string | null;

  @Prop({ type: String })
  detailsMaterial?: string | null;
}

// Cria o schema Mongoose a partir da classe Product.
export const ProductSchema = SchemaFactory.createForClass(Product);